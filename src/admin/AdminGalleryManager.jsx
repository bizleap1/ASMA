import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';
import { toast, showConfirm } from '../utils/notification';
import { defaultGalleryItems, defaultHomeGalleryItems } from '../galleryData';

const STORAGE_KEY = 'asma_gallery_items';

const AdminGalleryManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'photo', 'video', 'homepage', 'gallery', 'draft'
  const [searchQuery, setSearchQuery] = useState('');
  const [orderContext, setOrderContext] = useState('gallery'); // 'homepage' or 'gallery'
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState('homepage'); // 'homepage' or 'gallery'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' or 'mobile'
  
  // Editing state
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState('photo'); // 'photo' or 'video'

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    alt_text: '',
    media_type: 'photo',
    url: '',
    thumbnail_url: '',
    show_on_homepage: false,
    show_on_gallery: true,
    orientation: 'landscape',
    status: 'published'
  });

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('gallery_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('gallery_items table not accessible, using local storage/default fallback:', error.message);
        setUsingFallback(true);
        const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (stored) {
          try {
            setItems(JSON.parse(stored));
          } catch (_) {
            setItems(defaultGalleryItems);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGalleryItems));
          }
        } else {
          setItems(defaultGalleryItems);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGalleryItems));
        }
      } else {
        setUsingFallback(false);
        if (!data || data.length === 0) {
          // If database is empty, initialize with default ASMA authentic items
          setItems(defaultGalleryItems);
        } else {
          setItems(data);
        }
      }
    } catch (err) {
      console.warn('Error fetching gallery items:', err);
      setUsingFallback(true);
      const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      setItems(stored ? JSON.parse(stored) : defaultGalleryItems);
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalFallback = (updatedList) => {
    setItems(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (_) {}
  };

  // Toggle Visibility: Homepage
  const handleToggleHomepage = async (item) => {
    const nextVal = !item.show_on_homepage;
    try {
      if (!usingFallback) {
        const { error } = await supabase
          .from('gallery_items')
          .update({ show_on_homepage: nextVal, updated_at: new Date().toISOString() })
          .eq('id', item.id);
        if (error) throw error;
      }
      const updated = items.map((i) => (i.id === item.id ? { ...i, show_on_homepage: nextVal } : i));
      saveToLocalFallback(updated);
      toast.success(nextVal ? `Added to Homepage display!` : `Removed from Homepage display.`);
    } catch (err) {
      toast.error('Error updating homepage visibility: ' + err.message);
    }
  };

  // Toggle Visibility: Gallery Page
  const handleToggleGallery = async (item) => {
    const nextVal = !item.show_on_gallery;
    try {
      if (!usingFallback) {
        const { error } = await supabase
          .from('gallery_items')
          .update({ show_on_gallery: nextVal, updated_at: new Date().toISOString() })
          .eq('id', item.id);
        if (error) throw error;
      }
      const updated = items.map((i) => (i.id === item.id ? { ...i, show_on_gallery: nextVal } : i));
      saveToLocalFallback(updated);
      toast.success(nextVal ? `Added to Gallery Page!` : `Removed from Gallery Page.`);
    } catch (err) {
      toast.error('Error updating gallery page visibility: ' + err.message);
    }
  };

  // Toggle Status: Published / Draft
  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      if (!usingFallback) {
        const { error } = await supabase
          .from('gallery_items')
          .update({ status: nextStatus, updated_at: new Date().toISOString() })
          .eq('id', item.id);
        if (error) throw error;
      }
      const updated = items.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i));
      saveToLocalFallback(updated);
      toast.success(nextStatus === 'published' ? `"${item.title || 'Item'}" published!` : `"${item.title || 'Item'}" set to draft.`);
    } catch (err) {
      toast.error('Error updating status: ' + err.message);
    }
  };

  // Reorder Item (Move Up / Down)
  const handleMoveOrder = async (index, direction, context) => {
    const orderField = context === 'homepage' ? 'homepage_order' : 'gallery_order';
    
    // Sort items according to active context
    const contextList = [...items]
      .filter((i) => (context === 'homepage' ? i.show_on_homepage : i.show_on_gallery))
      .sort((a, b) => (a[orderField] ?? 0) - (b[orderField] ?? 0));

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= contextList.length) return;

    const currentItem = contextList[index];
    const targetItem = contextList[targetIndex];

    const currentOrder = targetIndex;
    const targetOrder = index;

    const updated = items.map((i) => {
      if (i.id === currentItem.id) return { ...i, [orderField]: currentOrder };
      if (i.id === targetItem.id) return { ...i, [orderField]: targetOrder };
      return i;
    });

    saveToLocalFallback(updated);

    try {
      if (!usingFallback) {
        await Promise.all([
          supabase.from('gallery_items').update({ [orderField]: currentOrder }).eq('id', currentItem.id),
          supabase.from('gallery_items').update({ [orderField]: targetOrder }).eq('id', targetItem.id)
        ]);
      }
      toast.success(`Display order updated for ${context === 'homepage' ? 'Homepage' : 'Gallery Page'}.`);
    } catch (err) {
      console.error('Error reordering items:', err);
    }
  };

  // Delete Media
  const handleDelete = async (item) => {
    const confirmed = await showConfirm(
      `Are you sure you want to delete "${item.title || 'this media item'}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      if (!usingFallback) {
        const { error } = await supabase.from('gallery_items').delete().eq('id', item.id);
        if (error) throw error;
      }
      const updated = items.filter((i) => i.id !== item.id);
      saveToLocalFallback(updated);
      toast.success('Media item deleted.');
    } catch (err) {
      toast.error('Error deleting item: ' + err.message);
    }
  };

  // File Upload Handler (Supabase Storage: course-images / gallery/)
  const handleFileUpload = async (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];

      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPG, PNG, or WEBP).');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be smaller than 5MB.');
        return;
      }

      setUploading(true);
      const fileExt = file.name.split('.').pop() || 'webp';
      const cleanFileName = `photo_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `gallery/${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.warn('Storage upload error, using FileReader fallback:', uploadError.message);
        toast.error(`Cloud upload note: ${uploadError.message}. Using preview.`);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, url: reader.result }));
          setUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      const { data } = supabase.storage.from('course-images').getPublicUrl(filePath);
      if (data?.publicUrl) {
        const cacheBustUrl = `${data.publicUrl}?t=${Date.now()}`;
        setFormData((prev) => ({
          ...prev,
          url: cacheBustUrl,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
        }));
        toast.success('Photo uploaded to Supabase Cloud Storage!');
      }
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Open Add Modal
  const openAddModal = (type = 'photo') => {
    setActiveMediaTab(type);
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      alt_text: '',
      media_type: type,
      url: '',
      thumbnail_url: '',
      show_on_homepage: false,
      show_on_gallery: true,
      orientation: 'landscape',
      status: 'published'
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setActiveMediaTab(item.media_type || (item.url.toLowerCase().endsWith('.mp4') ? 'video' : 'photo'));
    setFormData({
      title: item.title || '',
      description: item.description || item.desc || '',
      alt_text: item.alt_text || '',
      media_type: item.media_type || (item.url.toLowerCase().endsWith('.mp4') ? 'video' : 'photo'),
      url: item.url || '',
      thumbnail_url: item.thumbnail_url || '',
      show_on_homepage: item.show_on_homepage ?? false,
      show_on_gallery: item.show_on_gallery ?? true,
      orientation: item.orientation || 'landscape',
      status: item.status || 'published'
    });
    setIsEditModalOpen(true);
  };

  // Save Media (Add or Edit)
  const handleSaveMedia = async (e) => {
    if (e) e.preventDefault();
    if (!formData.url) {
      toast.error('Please upload an image or provide a valid media URL.');
      return;
    }

    const payload = {
      title: formData.title.trim() || 'ASMA Activity',
      description: formData.description.trim(),
      alt_text: formData.alt_text.trim() || formData.title.trim() || 'Advait Stock Market Academy Nagpur',
      media_type: formData.media_type,
      url: formData.url,
      thumbnail_url: formData.thumbnail_url || '',
      show_on_homepage: formData.show_on_homepage,
      show_on_gallery: formData.show_on_gallery,
      orientation: formData.orientation || 'landscape',
      status: formData.status || 'published',
      updated_at: new Date().toISOString()
    };

    try {
      setLoading(true);

      if (!usingFallback) {
        if (editingItem) {
          const { error } = await supabase
            .from('gallery_items')
            .update(payload)
            .eq('id', editingItem.id);
          if (error) throw error;
        } else {
          const newOrder = items.length;
          const { error } = await supabase
            .from('gallery_items')
            .insert([{
              ...payload,
              homepage_order: formData.show_on_homepage ? items.filter(i => i.show_on_homepage).length : newOrder,
              gallery_order: newOrder,
              created_at: new Date().toISOString()
            }]);
          if (error) throw error;
        }
      }

      // Update local memory
      let updated;
      if (editingItem) {
        updated = items.map((i) => (i.id === editingItem.id ? { ...i, ...payload } : i));
      } else {
        updated = [
          {
            ...payload,
            id: 'gallery_' + Date.now(),
            homepage_order: items.filter(i => i.show_on_homepage).length,
            gallery_order: items.length,
            created_at: new Date().toISOString()
          },
          ...items
        ];
      }
      saveToLocalFallback(updated);

      toast.success(editingItem ? 'Media details updated!' : 'New media added to library!');
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      fetchGalleryItems();
    } catch (err) {
      console.warn('Supabase save error, persisting locally:', err);
      toast.error('Error saving: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Media List for Admin Library
  const filteredItems = items.filter((item) => {
    const isVideo = item.media_type === 'video' || item.url?.toLowerCase().endsWith('.mp4');
    
    // Type Filter
    if (filterType === 'photo' && isVideo) return false;
    if (filterType === 'video' && !isVideo) return false;
    if (filterType === 'homepage' && !item.show_on_homepage) return false;
    if (filterType === 'gallery' && !item.show_on_gallery) return false;
    if (filterType === 'draft' && item.status !== 'draft') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q) || item.desc?.toLowerCase().includes(q);
      const matchAlt = item.alt_text?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAlt) return false;
    }

    return true;
  });

  // Calculate quick stats
  const photoCount = items.filter((i) => i.media_type !== 'video' && !i.url?.toLowerCase().endsWith('.mp4')).length;
  const videoCount = items.filter((i) => i.media_type === 'video' || i.url?.toLowerCase().endsWith('.mp4')).length;
  const homeCount = items.filter((i) => i.show_on_homepage && i.status === 'published').length;
  const galleryCount = items.filter((i) => i.show_on_gallery && i.status === 'published').length;
  const draftCount = items.filter((i) => i.status === 'draft').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 w-full min-w-0">
      <Helmet>
        <title>Gallery Manager | ASMA Admin</title>
      </Helmet>

      {/* Fallback Banner */}
      {usingFallback && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Using Local Fallback for Gallery</span>
            </div>
            <p className="text-amber-700">
              To persist media changes to Supabase cloud database, run <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono">create_gallery_tables.sql</code> in your Supabase SQL Editor.
            </p>
          </div>
          <button
            onClick={fetchGalleryItems}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-xs transition-colors shrink-0 cursor-pointer"
          >
            Retry Supabase
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs w-full min-w-0">
        <div className="flex-1 min-w-0 pr-0 md:pr-4">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary flex flex-wrap items-center gap-2.5">
            <span>Gallery Manager</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 whitespace-nowrap">
              {items.length} Total Media Items
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
            Manage photos and videos across Homepage and Main Gallery Page. Control where each item appears independently without changing code or redeploying.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="whitespace-nowrap">Live Preview</span>
          </button>

          <button
            onClick={() => openAddModal('video')}
            className="px-4 py-2.5 rounded-xl border border-[#166534]/30 bg-emerald-50/50 hover:bg-emerald-50 text-[#166534] font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="whitespace-nowrap">+ Add Video</span>
          </button>

          <button
            onClick={() => openAddModal('photo')}
            className="bg-[#166534] hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-green-900/20 transition-all hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="whitespace-nowrap">+ Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Visibility Status Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Homepage Display</div>
            <div className="text-xl font-bold text-[#166534] mt-0.5">{homeCount} Photos Active</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Top 7 appear in Homepage grid</div>
          </div>
          <button
            onClick={() => { setFilterType('homepage'); setOrderContext('homepage'); }}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
          >
            Manage Order
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Gallery Page Display</div>
            <div className="text-xl font-bold text-text-primary mt-0.5">{galleryCount} Items Active</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Visible on /gallery masonry</div>
          </div>
          <button
            onClick={() => { setFilterType('gallery'); setOrderContext('gallery'); }}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 cursor-pointer"
          >
            Manage Order
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Media Breakdown</div>
            <div className="text-base font-bold text-text-primary mt-0.5">{photoCount} Photos • {videoCount} Videos</div>
            <div className="text-[11px] text-amber-700 mt-0.5">{draftCount} Drafts (Hidden from all)</div>
          </div>
          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 text-xs font-semibold rounded bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Live Page</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All (${items.length})` },
            { id: 'photo', label: `Photos (${photoCount})` },
            { id: 'video', label: `Videos (${videoCount})` },
            { id: 'homepage', label: `Homepage Selected (${homeCount})` },
            { id: 'gallery', label: `Gallery Page Selected (${galleryCount})` },
            { id: 'draft', label: `Drafts (${draftCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterType(tab.id);
                if (tab.id === 'homepage') setOrderContext('homepage');
                if (tab.id === 'gallery') setOrderContext('gallery');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'bg-gray-50 hover:bg-gray-100 text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by title..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534]"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Order Context Helper Note */}
      {filterType === 'homepage' && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 flex items-center justify-between">
          <div>
            <strong>Homepage Order Mode Active:</strong> Use the ▲ / ▼ arrows on each card to change which photos appear in the 7-slot Homepage grid.
          </div>
          <span className="font-semibold text-emerald-800 shrink-0 ml-2">Slots 1 to 7</span>
        </div>
      )}

      {filterType === 'gallery' && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-gray-800 flex items-center justify-between">
          <div>
            <strong>Main Gallery Page Mode Active:</strong> Use the ▲ / ▼ arrows on each card to reorder items on the /gallery masonry grid.
          </div>
          <span className="font-semibold text-gray-700 shrink-0 ml-2">Masonry Order</span>
        </div>
      )}

      {/* Media Grid / Library */}
      {loading ? (
        <div className="py-20 flex justify-center bg-white rounded-2xl border border-gray-100">
          <div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 p-6">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-semibold text-text-primary">No media matches this filter.</p>
          <p className="text-xs text-text-secondary mt-1">Try switching tabs or click "+ Upload Photo" above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredItems.map((item, index) => {
            const isVideo = item.media_type === 'video' || item.url?.toLowerCase().endsWith('.mp4');

            return (
              <div
                key={item.id || index}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
              >
                {/* Media Thumbnail Container */}
                <div className="relative aspect-video sm:aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
                  {isVideo ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-neutral-900">
                      <video
                        src={item.url}
                        preload="metadata"
                        className="w-full h-full object-cover opacity-80"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                        <span className="w-10 h-10 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center shadow-lg">
                          ▶
                        </span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.alt_text || item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                  )}

                  {/* Orientation & Type Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                      {isVideo ? 'Video' : 'Photo'}
                    </span>
                    {item.orientation && (
                      <span className="px-2 py-0.5 rounded bg-white/80 backdrop-blur-xs text-gray-800 text-[10px] font-semibold capitalize">
                        {item.orientation}
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => handleToggleStatus(item)}
                      title="Click to toggle publish status"
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider cursor-pointer shadow-xs transition-colors ${
                        item.status === 'published'
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-gray-400 text-white hover:bg-gray-500'
                      }`}
                    >
                      {item.status === 'published' ? 'Live' : 'Draft'}
                    </button>
                  </div>
                </div>

                {/* Media Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-text-primary line-clamp-1">
                      {item.title || 'Untitled Media'}
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5 line-clamp-2 leading-relaxed">
                      {item.description || item.desc || 'No description provided.'}
                    </p>
                  </div>

                  {/* INDEPENDENT VISIBILITY CONTROLS (CRITICAL) */}
                  <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Visibility Selection
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {/* Checkbox 1: Homepage */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary hover:text-[#166534]">
                        <input
                          type="checkbox"
                          checked={item.show_on_homepage || false}
                          onChange={() => handleToggleHomepage(item)}
                          className="w-4 h-4 rounded text-[#166534] focus:ring-[#166534] cursor-pointer"
                        />
                        <span>Show on Homepage</span>
                        {item.show_on_homepage && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold ml-auto">
                            Slot #{item.homepage_order + 1}
                          </span>
                        )}
                      </label>

                      {/* Checkbox 2: Gallery Page */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary hover:text-[#166534]">
                        <input
                          type="checkbox"
                          checked={item.show_on_gallery !== false}
                          onChange={() => handleToggleGallery(item)}
                          className="w-4 h-4 rounded text-[#166534] focus:ring-[#166534] cursor-pointer"
                        />
                        <span>Show on Gallery Page</span>
                        {item.show_on_gallery !== false && (
                          <span className="text-[10px] text-gray-700 bg-gray-100 px-1.5 py-0.2 rounded font-bold ml-auto">
                            #{item.gallery_order + 1}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Action Bar & Order Arrows */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveOrder(index, 'up', orderContext)}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMoveOrder(index, 'down', orderContext)}
                        disabled={index === filteredItems.length - 1}
                        title="Move Down"
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Edit & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                        title="Edit Details & Replace"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete Media"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* ADD / UPLOAD MEDIA MODAL */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-text-primary">
                Add Media to Gallery Library
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50 px-4 sm:px-6 pt-3">
              <button
                type="button"
                onClick={() => { setActiveMediaTab('photo'); setFormData(prev => ({ ...prev, media_type: 'photo' })); }}
                className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  activeMediaTab === 'photo'
                    ? 'border-[#166534] text-[#166534]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                📷 Upload Photo (JPG, PNG, WebP)
              </button>
              <button
                type="button"
                onClick={() => { setActiveMediaTab('video'); setFormData(prev => ({ ...prev, media_type: 'video' })); }}
                className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  activeMediaTab === 'video'
                    ? 'border-[#166534] text-[#166534]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                🎬 Add Video Link / MP4
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveMedia} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {activeMediaTab === 'photo' ? (
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                    Photo File (Max 5MB) <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-gray-300 border-dashed rounded-xl p-4 sm:p-6 text-center hover:border-[#166534] transition-colors bg-gray-50/50">
                    {uploading ? (
                      <div className="py-6 space-y-2">
                        <div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-gray-600 font-semibold">Uploading to Supabase Storage...</p>
                      </div>
                    ) : formData.url ? (
                      <div className="space-y-3">
                        <img
                          src={formData.url}
                          alt="Preview"
                          className="h-36 w-auto object-contain mx-auto rounded-lg shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, url: '' }))}
                          className="text-xs text-red-600 hover:underline font-semibold"
                        >
                          Change Photo
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block space-y-2">
                        <svg className="w-10 h-10 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-bold text-[#166534] hover:underline block">Click to select photo</span>
                        <span className="text-[11px] text-gray-400 block">Supports WebP, JPG, PNG (Maintains aspect ratio)</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                      Video URL (MP4 / Web Video) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.url}
                      onChange={(e) => setFormData(p => ({ ...p, url: e.target.value }))}
                      placeholder="/videos/ANUJ9211.MP4 or external https://...mp4 link"
                      required
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                      Custom Video Poster / Thumbnail URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData(p => ({ ...p, thumbnail_url: e.target.value }))}
                      placeholder="Optional image thumbnail path"
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#166534]"
                    />
                  </div>
                </div>
              )}

              {/* Title & Caption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                    Title / Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Live Trading Session"
                    required
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                    Orientation
                  </label>
                  <select
                    value={formData.orientation}
                    onChange={(e) => setFormData(p => ({ ...p, orientation: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534]"
                  >
                    <option value="landscape">Landscape (Standard Horizontal)</option>
                    <option value="portrait">Portrait (Vertical Studio/Mobile)</option>
                    <option value="square">Square</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                  Description / Caption (Optional)
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Brief caption describing what students are doing..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                  SEO Alt Text (Accessibility)
                </label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData(p => ({ ...p, alt_text: e.target.value }))}
                  placeholder="Descriptive text for search engines and screen readers"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#166534]"
                />
              </div>

              {/* INDEPENDENT VISIBILITY CHECKBOXES */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-3">
                <label className="block text-xs font-bold text-[#166534] uppercase tracking-wider">
                  Target Display Locations (Independent Controls)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-emerald-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.show_on_homepage}
                      onChange={(e) => setFormData(p => ({ ...p, show_on_homepage: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#166534]"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-800">Show on Homepage</div>
                      <div className="text-[11px] text-gray-500">Feature in Homepage 7-slot grid</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-emerald-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.show_on_gallery}
                      onChange={(e) => setFormData(p => ({ ...p, show_on_gallery: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#166534]"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-800">Show on Gallery Page</div>
                      <div className="text-[11px] text-gray-500">Include in /gallery masonry</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl bg-[#166534] hover:bg-green-800 text-white text-xs font-bold cursor-pointer shadow-md shadow-green-900/20 disabled:opacity-50"
                >
                  Save to Media Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EDIT MEDIA MODAL */}
      {/* ============================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-text-primary">
                Edit Media Details & Visibility
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Media Preview & Replace */}
              <div className="flex items-center gap-4 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className="w-20 h-16 rounded-lg bg-black overflow-hidden flex items-center justify-center shrink-0">
                  {formData.media_type === 'video' ? (
                    <video src={formData.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={formData.url} alt="Current" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-800 truncate">{formData.title || 'Selected Media'}</div>
                  <div className="text-[11px] text-gray-500 truncate">{formData.url}</div>
                  <label className="text-xs text-[#166534] font-bold hover:underline cursor-pointer mt-1 inline-block">
                    Replace Media File
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Title & Orientation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                    Title / Subject
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                    required
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                    Orientation
                  </label>
                  <select
                    value={formData.orientation}
                    onChange={(e) => setFormData(p => ({ ...p, orientation: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534]"
                  >
                    <option value="landscape">Landscape</option>
                    <option value="portrait">Portrait</option>
                    <option value="square">Square</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                  Description / Caption
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
                  SEO Alt Text
                </label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData(p => ({ ...p, alt_text: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#166534]"
                />
              </div>

              {/* INDEPENDENT VISIBILITY CHECKBOXES */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-3">
                <label className="block text-xs font-bold text-[#166534] uppercase tracking-wider">
                  Target Display Locations
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-emerald-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.show_on_homepage}
                      onChange={(e) => setFormData(p => ({ ...p, show_on_homepage: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#166534]"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-800">Show on Homepage</div>
                      <div className="text-[11px] text-gray-500">Feature in Homepage 7-slot grid</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-emerald-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.show_on_gallery}
                      onChange={(e) => setFormData(p => ({ ...p, show_on_gallery: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#166534]"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-800">Show on Gallery Page</div>
                      <div className="text-[11px] text-gray-500">Include in /gallery masonry</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#166534] hover:bg-green-800 text-white text-xs font-bold cursor-pointer shadow-md shadow-green-900/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* LIVE INTERACTIVE PREVIEW MODAL */}
      {/* ============================================================== */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in duration-200">
            {/* Topbar */}
            <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                  <button
                    onClick={() => setPreviewTab('homepage')}
                    className={`px-3 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                      previewTab === 'homepage' ? 'bg-[#166534] text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Homepage Grid Preview
                  </button>
                  <button
                    onClick={() => setPreviewTab('gallery')}
                    className={`px-3 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                      previewTab === 'gallery' ? 'bg-[#166534] text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Gallery Page Masonry Preview
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                      previewDevice === 'desktop' ? 'bg-gray-800 text-white' : 'text-gray-600'
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                      previewDevice === 'mobile' ? 'bg-gray-800 text-white' : 'text-gray-600'
                    }`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#FAF9F6] flex justify-center">
              <div className={`w-full transition-all ${previewDevice === 'mobile' ? 'max-w-[420px]' : 'max-w-4xl'}`}>
                {previewTab === 'homepage' ? (
                  <div className="space-y-6 text-center">
                    <div>
                      <div className="text-xs font-semibold tracking-wider uppercase text-[#063925]">
                        LIFE AT ASMA
                      </div>
                      <h2 className="text-2xl font-bold text-[#1A3326] mt-1">
                        Inside the <span className="text-[#D4AF37]">ASMA Experience.</span>
                      </h2>
                    </div>

                    {/* Approved 7-Slot Homepage Layout Preview */}
                    {(() => {
                      const homeItems = items.filter(i => i.show_on_homepage && i.status === 'published');
                      const display7 = homeItems.length >= 7 ? homeItems.slice(0, 7) : defaultHomeGalleryItems;

                      return (
                        <div className="flex flex-col gap-4">
                          <div className={previewDevice === 'mobile' ? 'flex flex-col gap-3' : 'grid grid-cols-12 gap-3 h-[420px]'}>
                            {/* Left Column (3 items) */}
                            <div className={previewDevice === 'mobile' ? 'flex gap-2' : 'col-span-4 flex gap-2 h-full'}>
                              <div className="w-1/2 flex flex-col gap-2">
                                <img src={display7[0].url} alt={display7[0].title} className="w-full flex-1 object-cover rounded shadow-xs" />
                                <img src={display7[1].url} alt={display7[1].title} className="w-full flex-1 object-cover rounded shadow-xs" />
                              </div>
                              <div className="w-1/2 flex flex-col justify-center py-4">
                                <img src={display7[2].url} alt={display7[2].title} className="w-full h-full object-cover rounded shadow-xs" />
                              </div>
                            </div>

                            {/* Center Main Slot */}
                            <div className={previewDevice === 'mobile' ? 'h-48' : 'col-span-4 h-full flex flex-col justify-center'}>
                              <img src={display7[3].url} alt={display7[3].title} className="w-full h-full object-cover rounded shadow-md border border-[#063925]/10" />
                            </div>

                            {/* Right Column (3 items) */}
                            <div className={previewDevice === 'mobile' ? 'flex gap-2' : 'col-span-4 flex gap-2 h-full'}>
                              <div className="w-1/2 flex flex-col justify-center py-4">
                                <img src={display7[4].url} alt={display7[4].title} className="w-full h-full object-cover rounded shadow-xs" />
                              </div>
                              <div className="w-1/2 flex flex-col gap-2">
                                <img src={display7[5].url} alt={display7[5].title} className="w-full flex-1 object-cover rounded shadow-xs" />
                                <img src={display7[6].url} alt={display7[6].title} className="w-full flex-1 object-cover rounded shadow-xs" />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center gap-3 pt-2">
                            <span className="px-5 py-2.5 bg-[#063925] text-white text-xs font-semibold uppercase tracking-wider rounded-[4px]">
                              MORE PHOTOS
                            </span>
                            <span className="px-5 py-2.5 bg-white border border-[#063925]/30 text-[#063925] text-xs font-semibold uppercase tracking-wider rounded-[4px]">
                              MORE VIDEOS
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Masonry Preview */}
                    <div className={previewDevice === 'mobile' ? 'columns-2 gap-2.5' : 'columns-3 gap-3.5'}>
                      {items
                        .filter(i => i.show_on_gallery && i.status === 'published')
                        .slice(0, 12)
                        .map((item, idx) => {
                          const isVid = item.media_type === 'video' || item.url?.toLowerCase().endsWith('.mp4');
                          return (
                            <div key={idx} className="relative rounded overflow-hidden shadow-xs mb-3 bg-gray-100 break-inside-avoid">
                              {isVid ? (
                                <video src={item.url} className="w-full h-auto object-cover block" muted playsInline />
                              ) : (
                                <img src={item.url} alt={item.title} className="w-full h-auto object-cover block" />
                              )}
                              <div className="p-2 bg-white text-left">
                                <div className="text-[11px] font-bold text-gray-800 truncate">{item.title}</div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 border-t border-gray-100 flex justify-end bg-white">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryManager;

