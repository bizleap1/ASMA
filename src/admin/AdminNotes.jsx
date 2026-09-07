import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';

const AdminNotes = () => {
  const [notes, setNotes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    file_type: 'pdf',
    file_url: '',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [notesRes, coursesRes] = await Promise.all([
        supabase.from('notes').select(`*, courses(title)`).order('display_order', { ascending: true }),
        supabase.from('courses').select('id, title').eq('is_active', true)
      ]);

      if (notesRes.error) throw notesRes.error;
      if (coursesRes.error) throw coursesRes.error;

      setNotes(notesRes.data || []);
      setCourses(coursesRes.data || []);
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
    setEditingNote(null);
    setFormData({
      title: '', description: '', course_id: '', file_type: 'pdf', file_url: '', display_order: 0, is_active: true
    });
    setUploadingFile(false);
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title || '',
      description: note.description || '',
      course_id: note.course_id || '',
      file_type: note.file_type || 'pdf',
      file_url: note.file_url || '',
      display_order: note.display_order || 0,
      is_active: note.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Ensure course_id is either uuid or null
      const payload = { ...formData, course_id: formData.course_id || null };
      
      if (editingNote) {
        const { error } = await supabase.from('notes').update(payload).eq('id', editingNote.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('notes').insert([payload]);
        if (error) throw error;
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Error saving note: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploadingFile(true);

      const { error: uploadError } = await supabase.storage
        .from('course-notes')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('course-notes')
        .getPublicUrl(filePath);

      if (data && data.publicUrl) {
         setFormData(prev => ({ ...prev, file_url: data.publicUrl }));
      }
    } catch (error) {
      alert('Error uploading file: ' + error.message + '\n\nPlease ensure a public bucket named "course-notes" is created in Supabase Storage.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to completely delete this note? Be careful if it is linked publicly.")) return;
    try {
      const { error } = await supabase.from('notes').delete().eq('id', noteId);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert("Error deleting note: " + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <Helmet>
        <title>Manage Notes - Admin</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notes & PDFs</h1>
          <p className="text-sm text-text-secondary mt-1">Manage downloadable resources and study materials.</p>
        </div>
        <button onClick={openAddModal} className="bg-[#166534] hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-900/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Note
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{error}</div>}

      {loading && notes.length === 0 ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin"></div></div>
      ) : notes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <h3 className="text-lg font-bold text-text-primary">No notes found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <div key={note.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col ${!note.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded text-xs font-bold uppercase">{note.file_type}</div>
                {!note.is_active && <span className="text-xs text-red-500 font-bold uppercase">Inactive</span>}
              </div>
              <h3 className="font-bold text-lg mb-2">{note.title}</h3>
              <p className="text-sm text-text-secondary mb-4 flex-1 line-clamp-3">{note.description}</p>
              
              {note.courses && (
                <div className="text-xs text-text-secondary font-medium mb-4 p-2 bg-gray-50 rounded">
                  Course: {note.courses.title}
                </div>
              )}
              
              <div className="flex gap-2 mt-auto">
                <a href={note.file_url} target="_blank" rel="noreferrer" className="flex-1 bg-gray-50 hover:bg-gray-100 py-2 rounded-xl text-center text-sm font-bold text-blue-600 transition-colors">View</a>
                <button onClick={() => openEditModal(note)} className="flex-1 bg-gray-50 hover:bg-gray-100 py-2 rounded-xl text-sm font-bold transition-colors">Edit</button>
                <button onClick={() => handleDelete(note.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-sm font-bold transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold">{editingNote ? 'Edit Note' : 'Add Note'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534]" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534]"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Type</label>
                  <select name="file_type" value={formData.file_type} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534]">
                    <option value="pdf">PDF</option>
                    <option value="note">Text Note</option>
                    <option value="link">External Link</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Link Course (Optional)</label>
                  <select name="course_id" value={formData.course_id} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534]">
                    <option value="">None</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Note / PDF File</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl relative group hover:border-[#166534] transition-colors bg-white">
                  <div className="space-y-1 text-center">
                    {uploadingFile ? (
                      <div className="py-4">
                        <div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Uploading...</p>
                      </div>
                    ) : formData.file_url ? (
                      <div className="relative group/preview inline-block p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3">
                          <svg className="w-8 h-8 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          <div className="text-left max-w-[200px] truncate font-medium text-sm text-text-primary">File Attached Successfully!</div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setFormData(p => ({...p, file_url: ''}))} 
                          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#166534] transition-colors" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="pdf-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#166534] hover:text-green-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#166534]">
                            <span>Upload a file</span>
                            <input id="pdf-upload" name="pdf-upload" type="file" className="sr-only" onChange={handleFileUpload} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, TXT up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <input type="text" name="file_url" value={formData.file_url} onChange={handleInputChange} placeholder="Or paste external file link here directly" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534] text-sm" />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="w-5 h-5 text-[#166534] rounded" />
                <label htmlFor="is_active" className="font-medium text-sm">Active</label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#166534] hover:bg-green-800 text-white font-bold rounded-xl shadow-lg">{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotes;
