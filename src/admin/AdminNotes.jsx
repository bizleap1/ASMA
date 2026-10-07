import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';
import { AdminDropdown, AdminStudentSelect } from './AdminDropdown';
import { toast, showConfirm } from '../utils/notification';

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

  const [enrollments, setEnrollments] = useState([]);
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [personalFormData, setPersonalFormData] = useState({ enrollment_ids: [], text: '', file_url: '' });
  const [isSendingPersonal, setIsSendingPersonal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [notesRes, coursesRes, enrollmentsRes] = await Promise.all([
        supabase.from('notes').select(`*, courses(title)`).order('display_order', { ascending: true }),
        supabase.from('courses').select('id, title').eq('is_active', true),
        supabase.from('enrollments').select('id, student_name, email, course_name').order('student_name', { ascending: true })
      ]);

      if (notesRes.error) throw notesRes.error;
      if (coursesRes.error) throw coursesRes.error;
      if (enrollmentsRes.error) throw enrollmentsRes.error;

      setNotes(notesRes.data || []);
      setCourses(coursesRes.data || []);
      setEnrollments(enrollmentsRes.data || []);
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
      toast.success(editingNote ? "Note updated successfully!" : "Note created successfully!");
    } catch (err) {
      toast.error("Error saving note: " + err.message);
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
         toast.success("File uploaded successfully!");
      }
    } catch (error) {
      toast.error('Error uploading file: ' + error.message + '\n\nPlease ensure a public bucket named "course-notes" is created in Supabase Storage.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDelete = async (noteId) => {
    const confirmed = await showConfirm({
      title: "Delete Note",
      message: "Are you sure you want to completely delete this note? Be careful if it is linked publicly.",
      confirmText: "Delete Note",
      isDestructive: true
    });
    if (!confirmed) return;

    try {
      const { error } = await supabase.from('notes').delete().eq('id', noteId);
      if (error) throw error;
      fetchData();
      toast.success("Note deleted successfully.");
    } catch (err) {
      toast.error("Error deleting note: " + err.message);
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    const selectedIds = personalFormData.enrollment_ids || [];
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student or choose 'Select All'.");
      return;
    }
    if (!personalFormData.text.trim() && !personalFormData.file_url) {
      toast.warning("Please enter a message or attach a file.");
      return;
    }
    
    setIsSendingPersonal(true);
    try {
      // Fetch target enrollments
      const { data: targetEnrollments, error: fetchErr } = await supabase
        .from('enrollments')
        .select('id, notes')
        .in('id', selectedIds);
        
      if (fetchErr) throw fetchErr;

      const newNote = {
        id: Date.now().toString(),
        text: personalFormData.text.trim(),
        pdfUrl: personalFormData.file_url,
        date: new Date().toISOString()
      };

      // Batch update each selected student's notes history
      await Promise.all((targetEnrollments || []).map(enr => {
        let history = [];
        try {
          const parsed = JSON.parse(enr.notes);
          if (Array.isArray(parsed)) history = parsed;
          else if (parsed && typeof parsed === 'object') history = [parsed];
          else if (typeof parsed === 'string' && parsed.trim() !== '') history = [{ text: parsed, date: new Date().toISOString() }];
        } catch (e) {
          if (enr.notes && enr.notes.trim() !== '') {
            history = [{ text: enr.notes, date: new Date().toISOString() }];
          }
        }

        const updatedHistory = [...history, newNote];
        return supabase
          .from('enrollments')
          .update({ notes: JSON.stringify(updatedHistory) })
          .eq('id', enr.id);
      }));

      setIsPersonalModalOpen(false);
      setPersonalFormData({ enrollment_ids: [], text: '', file_url: '' });
      toast.success(
        selectedIds.length === 1
          ? "Note sent successfully to the student's personal dashboard!"
          : `Note sent successfully to all ${selectedIds.length} students!`
      );
    } catch (err) {
      toast.error("Error sending personal note: " + err.message);
    } finally {
      setIsSendingPersonal(false);
    }
  };

  const handlePersonalFileUpload = async (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploadingFile(true);

      const { error: uploadError } = await supabase.storage
        .from('course-notes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('course-notes')
        .getPublicUrl(filePath);

      if (data && data.publicUrl) {
         setPersonalFormData(prev => ({ ...prev, file_url: data.publicUrl }));
         toast.success("File uploaded successfully!");
      }
    } catch (error) {
      toast.error('Error uploading file: ' + error.message);
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <Helmet>
        <title>Manage Notes - Admin</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Notes & PDFs</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">Manage downloadable resources and study materials.</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          <button onClick={() => setIsPersonalModalOpen(true)} className="flex-1 sm:flex-none bg-white border border-[#166534] text-[#166534] hover:bg-green-50 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            Send Personal Note
          </button>
          <button onClick={openAddModal} className="flex-1 sm:flex-none bg-[#166534] hover:bg-green-800 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-green-900/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Note
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{error}</div>}

      {loading && notes.length === 0 ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin"></div></div>
      ) : notes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center shadow-sm">
          <h3 className="text-lg font-bold text-text-primary">No notes found</h3>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4">
          {notes.map(note => (
            <div key={note.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-6 hover:shadow-md transition-shadow w-full max-w-full min-w-0 overflow-hidden ${!note.is_active ? 'opacity-60' : ''}`}>
              
              {/* Note Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <div className="bg-orange-50 text-orange-600 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-max">{note.file_type}</div>
                  {!note.is_active && <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest border border-red-200 bg-red-50 px-2 py-0.5 rounded">Inactive</span>}
                  {!note.course_id && <span className="text-[10px] text-[#166534] font-bold uppercase tracking-widest border border-green-200 bg-green-50 px-2 py-0.5 rounded">General Note</span>}
                </div>
                
                <h3 className="font-bold text-base sm:text-lg text-text-primary mb-1 truncate">{note.title}</h3>
                <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed">{note.description}</p>
                
                {note.courses && (
                  <div className="mt-2 text-xs text-text-secondary font-medium inline-block p-1 px-2.5 bg-gray-50 border border-gray-100 rounded-lg max-w-full truncate">
                    Course: <span className="font-bold">{note.courses.title}</span>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-2 w-full lg:w-auto shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                <a href={note.file_url} target="_blank" rel="noreferrer" className="flex-1 lg:flex-none px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl text-center text-xs sm:text-sm font-bold text-blue-600 transition-colors flex items-center justify-center">View</a>
                <button onClick={() => openEditModal(note)} className="flex-1 lg:flex-none px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl text-xs sm:text-sm font-bold transition-colors text-gray-700 cursor-pointer text-center">Edit</button>
                <button onClick={() => handleDelete(note.id)} className="flex-1 lg:flex-none px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center">Delete</button>
              </div>

            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-white sm:bg-black/50 sm:backdrop-blur-sm flex flex-col sm:items-center sm:justify-center sm:p-4 animate-fade-in">
          <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <form onSubmit={handleSubmit} className="flex flex-col h-full sm:h-auto sm:max-h-[90vh]">
              {/* Sticky Top Header */}
              <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 -ml-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg sm:hidden cursor-pointer"
                    aria-label="Back"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">{editingNote ? 'Edit Note' : 'Add Note'}</h2>
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
              
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Fundamental Analysis Guide"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534] text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Brief description of the note or study material..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534] text-sm"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Type</label>
                    <AdminDropdown
                      value={formData.file_type}
                      onChange={(val) => setFormData((prev) => ({ ...prev, file_type: val }))}
                      options={[
                        { value: 'pdf', label: 'PDF Document' },
                        { value: 'note', label: 'Text Note' },
                        { value: 'link', label: 'External Link' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Link Course (Optional)</label>
                    <AdminDropdown
                      value={formData.course_id}
                      onChange={(val) => setFormData((prev) => ({ ...prev, course_id: val }))}
                      options={[
                        { value: '', label: 'General Note (Available to All Students)' },
                        ...courses.map((c) => ({ value: c.id, label: c.title })),
                      ]}
                      placeholder="General Note (All Students)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Note / PDF File</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl relative group hover:border-[#166534] transition-colors bg-white">
                    <div className="space-y-1 text-center w-full">
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
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition-transform hover:scale-110 cursor-pointer"
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
                  <label htmlFor="is_active" className="font-medium text-sm text-gray-700 cursor-pointer">Active (Visible to students)</label>
                </div>
              </div>

              {/* Sticky Bottom Action Bar */}
              <div className="p-4 sm:p-5 border-t border-gray-100 bg-white flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] sm:shadow-none">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 sm:flex-none px-5 py-3 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 sm:flex-none px-6 py-3 sm:py-2.5 bg-[#166534] hover:bg-green-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-green-900/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPersonalModalOpen && (
        <div className="fixed inset-0 z-[100] bg-white sm:bg-black/50 sm:backdrop-blur-sm flex flex-col sm:items-center sm:justify-center sm:p-4 animate-fade-in">
          <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <form onSubmit={handlePersonalSubmit} className="flex flex-col h-full sm:h-auto sm:max-h-[90vh]">
              {/* Sticky Top Header */}
              <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsPersonalModalOpen(false)}
                    className="p-1.5 -ml-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg sm:hidden cursor-pointer"
                    aria-label="Back"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Send Personal Note</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPersonalModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500 cursor-pointer hidden sm:block"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">Select Student(s)</label>
                    <span className="text-[11px] text-[#166534] font-semibold">Multi-select / All available</span>
                  </div>
                  <AdminStudentSelect
                    value={personalFormData.enrollment_ids}
                    onChange={(ids) => setPersonalFormData((prev) => ({ ...prev, enrollment_ids: ids }))}
                    enrollments={enrollments}
                    required={true}
                    multiple={true}
                    placeholder="-- Choose Student(s) or Select All --"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Message</label>
                  <textarea 
                    value={personalFormData.text} 
                    onChange={(e) => setPersonalFormData(p => ({...p, text: e.target.value}))} 
                    rows="3" 
                    placeholder="Type a personal message to this student..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534] text-sm"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Attach PDF File</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl relative group hover:border-[#166534] transition-colors bg-white">
                    <div className="space-y-1 text-center w-full">
                      {uploadingFile ? (
                        <div className="py-4">
                          <div className="w-8 h-8 border-4 border-[#166534] border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-500">Uploading...</p>
                        </div>
                      ) : personalFormData.file_url ? (
                        <div className="relative group/preview inline-flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 w-full">
                          <svg className="w-8 h-8 text-[#166534] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          <div className="text-left flex-1 min-w-0">
                            <div className="truncate font-medium text-sm text-text-primary">PDF Attached Successfully!</div>
                            <a href={personalFormData.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Preview</a>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setPersonalFormData(p => ({...p, file_url: ''}))} 
                            className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg p-2 transition-colors shrink-0 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#166534] transition-colors" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#166534] hover:text-green-800 focus-within:outline-none">
                              <span>Upload PDF</span>
                              <input type="file" accept=".pdf" className="sr-only" onChange={handlePersonalFileUpload} />
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Action Bar */}
              <div className="p-4 sm:p-5 border-t border-gray-100 bg-white flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] sm:shadow-none">
                <button
                  type="button"
                  onClick={() => setIsPersonalModalOpen(false)}
                  className="flex-1 sm:flex-none px-5 py-3 sm:py-2.5 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl text-xs sm:text-sm text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingPersonal || uploadingFile}
                  className={`flex-1 sm:flex-none px-6 py-3 sm:py-2.5 bg-[#166534] hover:bg-green-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-green-900/20 transition-all cursor-pointer ${(isSendingPersonal || uploadingFile) ? 'opacity-50' : ''}`}
                >
                  {isSendingPersonal ? 'Sending...' : (
                    personalFormData.enrollment_ids.length === 0
                      ? 'Send Note'
                      : personalFormData.enrollment_ids.length === enrollments.length
                      ? `Broadcast to All (${enrollments.length})`
                      : personalFormData.enrollment_ids.length === 1
                      ? 'Send to Student'
                      : `Send to ${personalFormData.enrollment_ids.length} Students`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotes;
