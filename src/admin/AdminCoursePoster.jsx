import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';
import { toast, showConfirm } from '../utils/notification';

const STORAGE_KEY = 'asma_course_posters';

export const defaultAcademyPosters = [
  {
    id: 'poster-batch-20-nov',
    tab_label: 'Batch 20 Nov',
    title: 'New Stock Market Batch Starting 20th November',
    description: 'Join our comprehensive stock market training batch starting 20th November. Master practical market learning, price action, options strategies, live market exposure, and disciplined risk management with guidance by experienced mentors.',
    image_url: '/poster_batch_20_nov.webp',
    cta_text: 'Enroll for 20 Nov Batch',
    cta_link: 'https://wa.me/919156953895?text=Hi%20Advait%20Academy!%20I%20want%20to%20inquire%20about%20the%2020%20Nov%20batch.',
    badge: 'Admissions Open Now',
    tag: 'NEW BATCH ANNOUNCEMENT',
    status: 'published',
    is_active: true,
    display_order: 0,
    created_at: new Date(Date.now() - 30000).toISOString()
  },
  {
    id: 'poster-demo-17-nov',
    tab_label: 'Demo 17 Nov',
    title: 'Free Demo Class – 17th November (11 A.M. Onwards)',
    description: 'Attend our complimentary live demo session on 17th November from 11 A.M. onwards. Experience live market dynamics, practical market analysis, and chart interpretation before enrolling.',
    image_url: '/poster_demo_17_nov.webp',
    cta_text: 'Book Free Demo (17 Nov)',
    cta_link: 'https://wa.me/919156953895?text=Hi%20Advait%20Academy!%20I%20want%20to%20book%20the%20free%20demo%20on%2017%20Nov.',
    badge: 'Admissions Open Now',
    tag: 'FREE DEMO CLASS',
    status: 'published',
    is_active: true,
    display_order: 1,
    created_at: new Date(Date.now() - 20000).toISOString()
  },
  {
    id: 'poster-demo-18-nov',
    tab_label: 'Demo 18 Nov',
    title: 'ASMA Presents Demo Class – 18th November (11 A.M. Onwards)',
    description: 'Discover how professional mentors analyze price movements in real time. Join the 18th November demo session to understand our structured curriculum and live floor trading methodology.',
    image_url: '/poster_demo_18_nov.webp',
    cta_text: 'Book Free Demo (18 Nov)',
    cta_link: 'https://wa.me/919156953895?text=Hi%20Advait%20Academy!%20I%20want%20to%20book%20the%20free%20demo%20on%2018%20Nov.',
    badge: 'Admissions Open Now',
    tag: 'FREE DEMO CLASS',
    status: 'published',
    is_active: true,
    display_order: 2,
    created_at: new Date(Date.now() - 10000).toISOString()
  }
];

const AdminCoursePoster = () => {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPosterIndex, setPreviewPosterIndex] = useState(0);
  const [editingPoster, setEditingPoster] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' or 'mobile'
  const [usingFallback, setUsingFallback] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    tab_label: '',
    title: '',
    description: '',
    image_url: '',
    cta_text: 'Enroll Now',
    cta_link: '',
    badge: 'Admissions Open Now',
    tag: 'NEW BATCH ANNOUNCEMENT',
    status: 'published', // 'published' | 'draft'
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    try {
      setLoading(true);
      let { data, error } = await supabase
        .from('course_posters')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error && error.message && error.message.includes('schema cache')) {
        const retryRes = await supabase
          .from('course_posters')
          .select('*')
          .order('created_at', { ascending: false });
        data = retryRes.data;
        error = retryRes.error;
      }

      if (error) {
        // Table not created or network drop -> use local storage fallback
        console.warn('course_posters table not accessible, using local storage fallback:', error.message);
        setUsingFallback(true);
        const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
        if (stored) {
          try {
            setPosters(JSON.parse(stored));
          } catch (_) {
            setPosters(defaultAcademyPosters);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAcademyPosters));
          }
        } else {
          setPosters(defaultAcademyPosters);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAcademyPosters));
        }
      } else {
        setUsingFallback(false);
        if (!data || data.length === 0) {
          setPosters(defaultAcademyPosters);
        } else {
          setPosters(data);
        }
      }
    } catch (err) {
      console.warn('Error fetching posters:', err);
      setUsingFallback(true);
      const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      setPosters(stored ? JSON.parse(stored) : defaultAcademyPosters);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddModal = () => {
    setEditingPoster(null);
    const nextOrder = posters.length;
    setFormData({
      tab_label: `Batch Announcement ${nextOrder + 1}`,
      title: 'New Stock Market Batch Starting Soon',
      description: 'Join our comprehensive stock market training batch. Master practical market learning, price action, options strategies, live market exposure, and disciplined risk management.',
      image_url: '',
      cta_text: 'Enroll Now',
      cta_link: 'https://wa.me/919156953895?text=Hi%20Advait%20Academy!%20I%20want%20to%20inquire%20about%20the%20course.',
      badge: 'Admissions Open Now',
      tag: 'NEW BATCH ANNOUNCEMENT',
      status: 'published',
      is_active: true,
      display_order: nextOrder
    });
    setUploadingImage(false);
    setIsModalOpen(true);
  };

  const openEditModal = (poster) => {
    setEditingPoster(poster);
    setFormData({
      tab_label: poster.tab_label || poster.badge || 'Poster',
      title: poster.title || '',
      description: poster.description || '',
      image_url: poster.image_url || '',
      cta_text: poster.cta_text || 'Enroll Now',
      cta_link: poster.cta_link || '',
      badge: poster.badge || 'Admissions Open Now',
      tag: poster.tag || 'NEW BATCH ANNOUNCEMENT',
      status: poster.status || 'published',
      is_active: poster.is_active !== false,
      display_order: typeof poster.display_order === 'number' ? poster.display_order : 0
    });
    setUploadingImage(false);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPG, PNG, or WEBP).');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Poster image must be smaller than 5MB.');
        return;
      }

      setUploadingImage(true);

      const fileExt = file.name.split('.').pop() || 'webp';
      const cleanFileName = `poster_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `posters/${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.warn('Storage upload error, using FileReader fallback:', uploadError.message);
        toast.error(`Cloud Storage upload notice: ${uploadError.message}. Using preview fallback.`);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, image_url: reader.result }));
          setUploadingImage(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      const { data } = supabase.storage
        .from('course-images')
        .getPublicUrl(filePath);

      if (data && data.publicUrl) {
        const cacheBusterUrl = `${data.publicUrl}?t=${Date.now()}`;
        setFormData((prev) => ({ ...prev, image_url: cacheBusterUrl }));
        toast.success('Poster uploaded to Supabase Cloud Storage successfully!');
      }
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const saveToLocalFallback = (payload, existingId) => {
    let updatedList = [...posters];
    if (existingId) {
      updatedList = updatedList.map((p) =>
        p.id === existingId ? { ...p, ...payload } : p
      );
    } else {
      updatedList.push({
        ...payload,
        id: 'poster_' + Date.now(),
        created_at: new Date().toISOString()
      });
    }
    setPosters(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (_) {}
  };

  const handleSave = async (e, forceStatus) => {
    if (e) e.preventDefault();
    if (!formData.image_url) {
      toast.error('Please upload or provide a poster image.');
      return;
    }

    const payload = {
      tab_label: formData.tab_label.trim() || formData.badge || 'Poster',
      title: formData.title || '',
      description: formData.description || '',
      image_url: formData.image_url,
      cta_text: formData.cta_text || 'Enroll Now',
      cta_link: formData.cta_link || '',
      badge: formData.badge || 'Admissions Open Now',
      tag: formData.tag || 'NEW BATCH ANNOUNCEMENT',
      status: forceStatus || formData.status || 'published',
      is_active: formData.is_active !== false,
      display_order: typeof formData.display_order === 'number' ? formData.display_order : posters.length,
      updated_at: new Date().toISOString()
    };

    try {
      setLoading(true);

      // MULTIPLE POSTERS: Adding/updating a poster NEVER deletes or drafts other posters!
      if (!usingFallback) {
        if (editingPoster) {
          let { error } = await supabase
            .from('course_posters')
            .update(payload)
            .eq('id', editingPoster.id);

          // Graceful fallback if tab_label or display_order columns not yet in user's Supabase table
          if (error && error.message && (error.message.includes('schema cache') || error.message.includes('column'))) {
            const { tab_label, display_order, ...safePayload } = payload;
            const retryRes = await supabase
              .from('course_posters')
              .update(safePayload)
              .eq('id', editingPoster.id);
            error = retryRes.error;
          }

          if (error) {
            console.warn('Supabase save error, persisting to local cache:', error);
            saveToLocalFallback(payload, editingPoster.id);
            toast.success('Poster updated & saved locally!');
            setIsModalOpen(false);
            return;
          }
        } else {
          let { error } = await supabase
            .from('course_posters')
            .insert([{ ...payload, created_at: new Date().toISOString() }]);

          // Graceful fallback if tab_label or display_order columns not yet in user's Supabase table
          if (error && error.message && (error.message.includes('schema cache') || error.message.includes('column'))) {
            const { tab_label, display_order, ...safePayload } = payload;
            const retryRes = await supabase
              .from('course_posters')
              .insert([{ ...safePayload, created_at: new Date().toISOString() }]);
            error = retryRes.error;
          }

          if (error) {
            console.warn('Supabase insert error, persisting to local cache:', error);
            saveToLocalFallback(payload, null);
            toast.success('Poster saved & added to website buttons locally!');
            setIsModalOpen(false);
            return;
          }
        }
      } else {
        saveToLocalFallback(payload, editingPoster?.id);
      }

      toast.success(
        editingPoster
          ? 'Poster updated successfully!'
          : payload.status === 'published'
          ? 'New poster published and added to website buttons!'
          : 'New poster saved as draft.'
      );
      setIsModalOpen(false);
      fetchPosters();
    } catch (err) {
      console.warn('Error saving poster, saving to local fallback:', err);
      saveToLocalFallback(payload, editingPoster?.id);
      toast.success('Poster saved locally!');
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (poster) => {
    const nextStatus = poster.status === 'published' ? 'draft' : 'published';
    try {
      setLoading(true);

      // INDEPENDENT STATUS: Does NOT touch other posters!
      if (!usingFallback) {
        const { error } = await supabase
          .from('course_posters')
          .update({ status: nextStatus, updated_at: new Date().toISOString() })
          .eq('id', poster.id);
        if (error) throw error;
      } else {
        const updatedList = posters.map((p) =>
          p.id === poster.id ? { ...p, status: nextStatus } : p
        );
        setPosters(updatedList);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      }

      toast.success(
        nextStatus === 'published'
          ? `"${poster.tab_label || poster.title}" is now LIVE on Courses page!`
          : `"${poster.tab_label || poster.title}" unpublished.`
      );
      fetchPosters();
    } catch (err) {
      toast.error('Error updating status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (posterId, posterTitle) => {
    const confirmed = await showConfirm(
      `Are you sure you want to delete "${posterTitle || 'this poster'}"? Other posters will remain intact.`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      if (!usingFallback) {
        const { error } = await supabase
          .from('course_posters')
          .delete()
          .eq('id', posterId);
        if (error) throw error;
      } else {
        const updatedList = posters.filter((p) => p.id !== posterId);
        setPosters(updatedList);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      }
      toast.success('Poster deleted successfully.');
      fetchPosters();
    } catch (err) {
      toast.error('Error deleting poster: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reorder posters (Move Up / Down)
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= posters.length) return;

    const currentPoster = posters[index];
    const targetPoster = posters[targetIndex];

    const currentOrder = targetIndex;
    const targetOrder = index;

    const newPosters = [...posters];
    newPosters[index] = { ...targetPoster, display_order: targetOrder };
    newPosters[targetIndex] = { ...currentPoster, display_order: currentOrder };

    setPosters(newPosters);

    try {
      if (!usingFallback) {
        await Promise.all([
          supabase.from('course_posters').update({ display_order: currentOrder }).eq('id', currentPoster.id),
          supabase.from('course_posters').update({ display_order: targetOrder }).eq('id', targetPoster.id)
        ]);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosters));
      }
      toast.success('Poster order updated.');
    } catch (err) {
      console.error('Error reordering posters:', err);
      fetchPosters();
    }
  };

  // Calculate live posters for summary and preview (visibility strictly controlled via Publish/Unpublish)
  const activeLivePosters = posters.filter((p) => p.status === 'published' && p.is_active !== false);

  const getPosterScheduleStatus = (poster) => {
    if (poster.status === 'draft') return { label: 'Draft (Hidden)', color: 'bg-gray-100 text-gray-700' };
    if (!poster.is_active) return { label: 'Inactive', color: 'bg-red-50 text-red-700' };
    return {
      label: 'Live on Website',
      color: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full min-w-0">
      <Helmet>
        <title>Multiple Course Posters Management | ASMA Admin</title>
      </Helmet>

      {/* Database Setup Notification if using fallback */}
      {usingFallback && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Using Local Fallback for Posters</span>
            </div>
            <p className="text-amber-700">
              To persist multiple posters directly to Supabase cloud database, please run the SQL script <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono">create_course_posters_table.sql</code> in your Supabase SQL Editor.
            </p>
          </div>
          <button
            onClick={fetchPosters}
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
            <span>Course Posters</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 whitespace-nowrap">
              Multiple Posters Active
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
            Manage multiple promotional posters simultaneously. Each published poster gets its own button on the public Courses page.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          <button
            onClick={() => {
              setPreviewPosterIndex(0);
              setIsPreviewOpen(true);
            }}
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs sm:text-sm transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
          >
            <svg className="w-4 h-4 shrink-0 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="whitespace-nowrap select-none">Live Page Preview</span>
          </button>
          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-none justify-center bg-[#166534] hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-green-900/20 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="whitespace-nowrap select-none">Add New Poster</span>
          </button>
        </div>
      </div>

      {/* Live Status Bar showing active buttons */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${activeLivePosters.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
            <h2 className="font-bold text-base sm:text-lg text-text-primary">
              Active Buttons on Public Courses Page ({activeLivePosters.length})
            </h2>
          </div>
          <a
            href="/courses"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] hover:underline"
          >
            <span>Open Public Courses Page</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {activeLivePosters.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-text-secondary">
              Visitors see these selector buttons in this exact order to switch between posters:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {activeLivePosters.map((poster, idx) => (
                <div
                  key={poster.id || idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#0B2117]/15 text-xs font-semibold text-[#063925]"
                >
                  <span className="w-4 h-4 rounded-full bg-[#063925] text-white flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span>{poster.tab_label || poster.badge || poster.title}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-gray-500">
            No posters currently published. The promotional section on the Courses page is cleanly hidden.
          </div>
        )}
      </div>

      {/* All Posters Table with Reorder & Multi-Manage */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-text-primary">
              All Saved Posters ({posters.length})
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Add multiple posters, reorder them using the arrows, or toggle publish/unpublish independently.
            </p>
          </div>
        </div>

        {loading && posters.length === 0 ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posters.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-text-secondary">
            <p className="text-sm">No posters uploaded yet.</p>
            <button
              onClick={openAddModal}
              className="mt-3 px-4 py-2 bg-[#166534] text-white rounded-lg font-bold text-xs"
            >
              + Add First Poster
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-text-secondary font-bold uppercase tracking-wider text-[11px] border-b border-gray-100">
                <tr>
                  <th className="py-3 px-3 sm:px-4 text-center w-16">Order</th>
                  <th className="py-3 px-4">Poster</th>
                  <th className="py-3 px-4">Button Tab Label</th>
                  <th className="py-3 px-4">Title & Details</th>
                  <th className="py-3 px-4">CTA Action</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {posters.map((poster, index) => {
                  const schedule = getPosterScheduleStatus(poster);

                  return (
                    <tr
                      key={poster.id || index}
                      className={`hover:bg-gray-50/70 transition-colors ${
                        poster.status === 'published' ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      {/* Reorder Buttons */}
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <span className="font-mono text-[11px] font-bold text-gray-500">
                            {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(index, 'down')}
                            disabled={index === posters.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            ▼
                          </button>
                        </div>
                      </td>

                      {/* Poster Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 shadow-2xs">
                          <img
                            src={poster.image_url}
                            alt={poster.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </td>

                      {/* Tab / Button Label */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-[4px] bg-[#063925] text-white font-['Inter'] font-semibold text-xs shadow-2xs">
                          {poster.tab_label || poster.badge || 'Poster'}
                        </span>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-text-primary text-sm line-clamp-1">
                          {poster.title || 'Promotional Poster'}
                        </div>
                        <div className="text-xs text-text-secondary line-clamp-2 mt-0.5">
                          {poster.description || 'No description'}
                        </div>
                        {poster.badge && (
                          <div className="mt-1 text-[11px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                            {poster.badge}
                          </div>
                        )}
                      </td>

                      {/* CTA Action */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-text-primary text-xs">
                          {poster.cta_text || 'Enroll Now'}
                        </div>
                        {poster.cta_link && (
                          <div className="text-[11px] text-emerald-700 truncate max-w-[140px]">
                            {poster.cta_link}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${schedule.color}`}>
                          {schedule.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTogglePublish(poster)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              poster.status === 'published'
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                : 'bg-[#166534] text-white hover:bg-green-800 shadow-xs'
                            }`}
                          >
                            {poster.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>

                          <button
                            onClick={() => openEditModal(poster)}
                            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Poster Details"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDelete(poster.id, poster.tab_label || poster.title)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Poster"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 -ml-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg sm:hidden cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h2 className="text-lg sm:text-xl font-bold text-text-primary">
                  {editingPoster ? 'Edit / Replace Poster' : 'Add New Promotional Poster'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 cursor-pointer hidden sm:block"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={(e) => handleSave(e)} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* 1. Button / Tab Label (Crucial for multi-poster switching) */}
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                  Button Tab Label (Required for Switcher Buttons) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tab_label"
                  value={formData.tab_label}
                  onChange={handleInputChange}
                  placeholder="e.g. Batch 20 Nov, Demo 17 Nov, Free Workshop"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534] font-medium"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  This text will appear on the button that visitors click to view this specific poster.
                </p>
              </div>

              {/* 2. Poster Image Upload */}
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                  Poster Image (JPG, PNG, or WEBP) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-gray-300 border-dashed rounded-xl p-4 sm:p-6 text-center hover:border-[#166534] transition-colors bg-gray-50/50">
                  {uploadingImage ? (
                    <div className="py-6 space-y-3">
                      <div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-gray-600 font-semibold">Uploading poster image to storage...</p>
                    </div>
                  ) : formData.image_url ? (
                    <div className="space-y-3">
                      <div className="relative inline-block rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white">
                        <img
                          src={formData.image_url}
                          alt="Poster Preview"
                          className="h-48 sm:h-60 w-auto object-contain mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, image_url: '' }))}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-transform hover:scale-110 cursor-pointer"
                          title="Remove image"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span>Choose Another File to Replace</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 py-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#166534] mx-auto flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <label className="cursor-pointer font-bold text-xs sm:text-sm text-[#166534] hover:underline">
                          <span>Click to browse</span> or drag and drop poster image
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[11px] text-gray-500 mt-1">
                          High-resolution vertical or square banner (WEBP, PNG, JPG up to 5MB).
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Publish / Draft Status */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                  Visibility Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, status: 'published' }))}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      formData.status === 'published'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={() => {}}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-bold text-xs text-text-primary">Publish on Website</div>
                      <div className="text-[11px] text-text-secondary">
                        Visible as an active button on the Courses page.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, status: 'draft' }))}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      formData.status === 'draft'
                        ? 'border-gray-600 bg-gray-100 ring-2 ring-gray-400/20'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={() => {}}
                      className="mt-0.5 text-gray-600 focus:ring-gray-500"
                    />
                    <div>
                      <div className="font-bold text-xs text-text-primary">Save as Draft</div>
                      <div className="text-[11px] text-text-secondary">
                        Hidden from public website until published.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 4. CTA Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                    CTA Button Text (Optional)
                  </label>
                  <input
                    type="text"
                    name="cta_text"
                    value={formData.cta_text}
                    onChange={handleInputChange}
                    placeholder="e.g. Enroll Now, Book Free Demo"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                    CTA Target Link (Optional)
                  </label>
                  <input
                    type="text"
                    name="cta_link"
                    value={formData.cta_link}
                    onChange={handleInputChange}
                    placeholder="https://wa.me/... or leave blank for admission modal"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534]"
                  />
                </div>
              </div>

              {/* 5. Optional Poster Headline & Descriptions */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                      Poster Headline (Optional)
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. New Stock Market Batch Starting Soon"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                      Badge Text (Optional)
                    </label>
                    <input
                      type="text"
                      name="badge"
                      value={formData.badge}
                      onChange={handleInputChange}
                      placeholder="e.g. Admissions Open Now"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                    Description / Highlights (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Short summary or highlights..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#166534]"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={(e) => handleSave(e, 'draft')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  Save as Draft
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-green-800 text-white font-bold text-xs transition-colors shadow-md shadow-green-900/20 cursor-pointer"
                >
                  {editingPoster ? 'Save Changes' : 'Add & Publish Poster'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Interactive Page Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in duration-200">
            {/* Preview Topbar */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-text-primary">Preview Public Courses Page Buttons</span>
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                      previewDevice === 'desktop' ? 'bg-[#063925] text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Desktop View
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                      previewDevice === 'mobile' ? 'bg-[#063925] text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Mobile View
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

            {/* Preview Canvas */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#FAF9F6] flex justify-center">
              <div
                className={`transition-all duration-300 w-full ${
                  previewDevice === 'mobile' ? 'max-w-[400px]' : 'max-w-4xl'
                }`}
              >
                {activeLivePosters.length > 0 ? (() => {
                  const currentPreviewPoster = activeLivePosters[previewPosterIndex] || activeLivePosters[0];
                  return (
                    <div className="space-y-6">
                      {/* Header & Dynamic Tabs */}
                      <div className={`flex justify-between gap-4 ${previewDevice === 'mobile' ? 'flex-col items-start' : 'flex-col md:flex-row md:items-end'}`}>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-4 h-[1.5px] bg-[#D4AF37]" />
                            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#063925]">
                              ACADEMY ANNOUNCEMENTS
                            </span>
                          </div>
                          <h2 className="text-2xl font-semibold text-[#1A3326] tracking-tight">
                            What's Trending <span className="text-[#D4AF37]">Now.</span>
                          </h2>
                        </div>

                        {/* Interactive Selector Tabs in Preview */}
                        {activeLivePosters.length > 1 && (
                          <div className={`flex items-center gap-1.5 p-1 bg-white rounded-[4px] border border-[#0B2117]/10 ${
                            previewDevice === 'mobile'
                              ? 'w-full overflow-x-auto flex-nowrap pb-1 no-scrollbar'
                              : 'flex-nowrap overflow-x-auto max-w-full no-scrollbar self-start md:self-auto'
                          }`}>
                            {activeLivePosters.map((poster, idx) => (
                              <button
                                key={poster.id || idx}
                                onClick={() => setPreviewPosterIndex(idx)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                                  previewPosterIndex === idx
                                    ? 'bg-[#063925] text-white shadow-xs'
                                    : 'text-[#4A6356] hover:text-[#1A3326]'
                                }`}
                              >
                                {poster.tab_label || poster.badge || `Poster ${idx + 1}`}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Poster Feature Card */}
                      <div className="bg-white rounded-[6px] border border-[#0B2117]/10 p-5 sm:p-8 shadow-[0_4px_24px_rgba(11,33,23,0.05)] transition-opacity duration-300">
                        <div className={
                          previewDevice === 'mobile'
                            ? 'flex flex-col gap-6 text-left'
                            : 'grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left'
                        }>
                          {/* Info */}
                          <div className={previewDevice === 'mobile' ? 'w-full space-y-4' : 'md:col-span-7 space-y-4'}>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-1 rounded-[3px] bg-[#063925]/10 text-[#063925] font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap shrink-0">
                                {currentPreviewPoster.tag || 'NEW BATCH ANNOUNCEMENT'}
                              </span>
                              <span className="px-2.5 py-1 rounded-[3px] bg-[#D4AF37]/15 text-[#8C6D1F] font-semibold text-xs whitespace-nowrap shrink-0">
                                {currentPreviewPoster.badge || 'Admissions Open Now'}
                              </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-semibold text-[#1A3326] tracking-tight leading-snug">
                              {currentPreviewPoster.title || 'Promotional Poster Headline'}
                            </h3>

                            <p className="text-sm text-[#4A6356] leading-relaxed">
                              {currentPreviewPoster.description || 'Promotional description and highlights will appear here.'}
                            </p>

                            <div className="pt-2 flex flex-wrap items-center gap-3">
                              <span className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#063925] text-white text-xs font-semibold uppercase tracking-wider rounded-[4px] whitespace-nowrap shrink-0">
                                {currentPreviewPoster.cta_text || 'Enroll Now'}
                              </span>
                              <span className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-[#0B2117]/15 text-[#063925] text-xs font-semibold uppercase tracking-wider rounded-[4px] whitespace-nowrap shrink-0">
                                Call +91 91569 53895
                              </span>
                            </div>
                          </div>

                          {/* Image */}
                          <div className={previewDevice === 'mobile' ? 'w-full flex justify-center' : 'md:col-span-5 flex justify-center'}>
                            <div className="relative w-full max-w-[300px] rounded-[6px] overflow-hidden border border-[#0B2117]/10 shadow-md bg-[#0B2117]">
                              <img
                                src={currentPreviewPoster.image_url}
                                alt={currentPreviewPoster.title}
                                className="w-full h-auto object-contain block"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="py-12 text-center text-gray-500 text-sm">
                    No posters currently published. Publish at least one poster to preview.
                  </div>
                )}
              </div>
            </div>

            {/* Preview Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-white">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
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

export default AdminCoursePoster;
