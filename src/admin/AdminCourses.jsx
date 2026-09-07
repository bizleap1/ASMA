import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    mode: '',
    image: '',
    type_label: '',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({
      title: '', slug: '', description: '', category: '', price: '',
      duration: '', mode: '', image: '', type_label: '', display_order: 0, is_active: true
    });
    setUploadingImage(false);
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      slug: course.slug || '',
      description: course.description || '',
      category: course.category || '',
      price: course.price || '',
      duration: course.duration || '',
      mode: course.mode || '',
      image: course.image || '',
      type_label: course.type_label || '',
      display_order: course.display_order || 0,
      is_active: course.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(formData)
          .eq('id', editingCourse.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([formData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      alert("Error saving course: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploadingImage(true);

      const { error: uploadError } = await supabase.storage
        .from('course-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('course-images')
        .getPublicUrl(filePath);

      if (data && data.publicUrl) {
         setFormData(prev => ({ ...prev, image: data.publicUrl }));
      }
    } catch (error) {
      alert('Error uploading image: ' + error.message + '\n\nPlease ensure a public bucket named "course-images" is created in Supabase Storage.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSoftDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to deactivate this course? This ensures enrollment history is preserved.")) return;
    
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_active: false })
        .eq('id', courseId);
      
      if (error) throw error;
      fetchCourses();
    } catch (err) {
      alert("Error deactivating course: " + err.message);
    }
  };

  const handleHardDelete = async () => {
    if (!courseToDelete) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseToDelete.id);
      
      if (error) throw error;
      setCourseToDelete(null);
      fetchCourses();
    } catch (err) {
      alert("Error deleting course: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <Helmet>
        <title>Manage Courses - Admin</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Courses Management</h1>
          <p className="text-sm text-text-secondary mt-1">Add, edit, or deactivate academy courses.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#166534] hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-900/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Course
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {loading && courses.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1">No courses found</h3>
          <p className="text-text-secondary text-sm">Get started by creating your first course.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${!course.is_active ? 'opacity-60 grayscale-[0.5]' : ''}`}>
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                {course.image ? (
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                {!course.is_active && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Inactive
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-[#0B2117]/80 backdrop-blur-sm text-[#D4AF37] text-xs font-bold px-2 py-1 rounded">
                  {course.category}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-text-primary mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-1">{course.description}</p>
                
                <div className="flex items-center justify-between text-sm font-medium mb-4 pb-4 border-b border-gray-50">
                  <span className="text-[#166534] bg-[#166534]/10 px-2 py-1 rounded">₹ {course.price}</span>
                  <span className="text-text-secondary flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {course.duration}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => openEditModal(course)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-text-primary py-2 rounded-xl text-sm font-bold transition-colors">
                    Edit
                  </button>
                  {course.is_active && (
                    <button onClick={() => handleSoftDelete(course.id)} className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-2 rounded-xl text-sm font-bold transition-colors">
                      Deactivate
                    </button>
                  )}
                  <button onClick={() => setCourseToDelete(course)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-sm font-bold transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <h2 className="text-xl font-bold text-text-primary">{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Slug</label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534]"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Duration</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g. 2 Months" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Course Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl relative group hover:border-[#166534] transition-colors bg-white">
                  <div className="space-y-1 text-center">
                    {uploadingImage ? (
                      <div className="py-4">
                        <div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Uploading...</p>
                      </div>
                    ) : formData.image ? (
                      <div className="relative group/preview inline-block">
                        <img src={formData.image} alt="Preview" className="h-32 w-auto object-cover rounded-lg mx-auto shadow-md" />
                        <button 
                          type="button" 
                          onClick={() => setFormData(p => ({...p, image: ''}))} 
                          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#166534] transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#166534] hover:text-green-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#166534]">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="Or paste image URL here directly" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534] text-sm" />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="w-5 h-5 text-[#166534] rounded focus:ring-[#166534]" />
                <label htmlFor="is_active" className="font-medium text-sm text-text-primary cursor-pointer">Active Course</label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-text-primary rounded-xl font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#166534] hover:bg-green-800 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all hover:-translate-y-0.5">
                  {loading ? 'Saving...' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 text-center shadow-2xl animate-scale-up">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Delete Course?</h2>
            <p className="text-text-secondary text-sm mb-6">
              Are you sure you want to completely delete <strong>"{courseToDelete.title}"</strong>? This action is irreversible and will remove all associated data.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setCourseToDelete(null)} 
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-text-primary rounded-xl font-bold transition-colors w-full"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleHardDelete} 
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-900/20 transition-all hover:-translate-y-0.5 w-full flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Yes, Delete It'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
