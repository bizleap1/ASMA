import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { AdminDropdown } from './AdminDropdown';
import { toast, showConfirm } from '../utils/notification';

const AdminStudentPreview = () => {
  const { enrollmentId } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [studentEnrollments, setStudentEnrollments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingNote, setIsSendingNote] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  // Edit State
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [notesHistory, setNotesHistory] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // 1. Fetch the specific enrollment to get auth_user_id
        const { data: currentEnrollment, error: fetchErr } = await supabase
          .from('enrollments')
          .select('*')
          .eq('id', enrollmentId)
          .single();
        
        if (fetchErr) throw fetchErr;
        setEnrollment(currentEnrollment);
        setSelectedCourseId(currentEnrollment.course_id || '');
        
        let history = [];
        try {
          const parsed = JSON.parse(currentEnrollment.notes);
          if (Array.isArray(parsed)) {
            history = parsed;
          } else if (parsed && typeof parsed === 'object') {
            history = [parsed];
          } else if (typeof parsed === 'string' && parsed.trim() !== '') {
            history = [{ text: parsed, date: new Date().toISOString() }];
          }
        } catch (e) {
          if (currentEnrollment.notes && currentEnrollment.notes.trim() !== '') {
            history = [{ text: currentEnrollment.notes, date: new Date().toISOString() }];
          }
        }
        
        setNotesHistory(history);
        setAdminNote('');
        setPdfUrl('');

        // Fetch all courses for dropdown
        const { data: coursesData } = await supabase.from('courses').select('id, title, is_active').order('title');
        setCourses(coursesData || []);

        if (currentEnrollment.auth_user_id) {
          // 2. Fetch all enrollments for this student
          const { data: allEnrollments, error: allErr } = await supabase
            .from('enrollments')
            .select('*, courses(*)')
            .eq('auth_user_id', currentEnrollment.auth_user_id)
            .order('created_at', { ascending: false });
          
          if (allErr) throw allErr;
          setStudentEnrollments(allEnrollments || []);

          // 3. Fetch Notes for approved courses
          const approvedCourseIds = (allEnrollments || [])
            .filter(e => e.status === 'approved' && e.course_id)
            .map(e => e.course_id);

          const isApproved = (allEnrollments || []).some(e => e.status === 'approved');

          if (isApproved) {
            const { data: notesData, error: notesError } = await supabase
              .from('notes')
              .select('*')
              .eq('is_active', true)
              .order('display_order', { ascending: true });
            
            if (notesError) throw notesError;
            
            const filteredNotes = (notesData || []).filter(note => {
              return !note.course_id || approvedCourseIds.includes(note.course_id);
            });
            setNotes(filteredNotes);
          }
        }
      } catch (error) {
        console.error("Error fetching student preview data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentData();
  }, [enrollmentId]);

  const handleFileUpload = async (e) => {
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
         setPdfUrl(data.publicUrl);
         toast.success('PDF uploaded successfully!');
      }
    } catch (error) {
      toast.error('Error uploading file: ' + error.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleUpdateCourse = async () => {
    setIsSaving(true);
    try {
      const selectedCourse = courses.find(c => c.id === selectedCourseId);
      const courseName = selectedCourse ? selectedCourse.title : enrollment.course_name;

      const { error } = await supabase
        .from('enrollments')
        .update({
          course_id: selectedCourseId || null,
          course_name: courseName
        })
        .eq('id', enrollmentId);

      if (error) throw error;
      
      setEnrollment({ ...enrollment, course_id: selectedCourseId || null, course_name: courseName });
      toast.success('Course updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error saving course: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendNote = async () => {
    if (!adminNote.trim() && !pdfUrl) {
      toast.warning("Please enter a message or attach a PDF before sending.");
      return;
    }

    setIsSendingNote(true);
    try {
      const newNote = {
        id: Date.now().toString(),
        text: adminNote.trim(),
        pdfUrl: pdfUrl,
        date: new Date().toISOString()
      };

      const updatedHistory = [...notesHistory, newNote];
      const notePayload = JSON.stringify(updatedHistory);

      const { error } = await supabase
        .from('enrollments')
        .update({ notes: notePayload })
        .eq('id', enrollmentId);

      if (error) throw error;
      
      setNotesHistory(updatedHistory);
      setEnrollment({ ...enrollment, notes: notePayload });
      setAdminNote('');
      setPdfUrl('');
      toast.success('Note sent to student successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error sending note: ' + err.message);
    } finally {
      setIsSendingNote(false);
    }
  };

  const handleDeleteNote = async (indexToDelete) => {
    const confirmed = await showConfirm({
      title: "Delete Note",
      message: "Are you sure you want to delete this note from the student's history?",
      confirmText: "Delete Note",
      isDestructive: true
    });
    if (!confirmed) return;
    
    setIsSendingNote(true);
    try {
      const updatedHistory = [...notesHistory];
      updatedHistory.splice(indexToDelete, 1);
      
      const notePayload = JSON.stringify(updatedHistory);

      const { error } = await supabase
        .from('enrollments')
        .update({ notes: notePayload })
        .eq('id', enrollmentId);

      if (error) throw error;
      
      setNotesHistory(updatedHistory);
      setEnrollment({ ...enrollment, notes: notePayload });
      toast.success('Note removed from history.');
    } catch (err) {
      console.error(err);
      toast.error('Error deleting note: ' + err.message);
    } finally {
      setIsSendingNote(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-[#166534] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Enrollment not found</h3>
        <Link to="/admin/enrollments" className="text-[#166534] hover:underline">Back to Enrollments</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Dashboard Preview</h2>
          <p className="text-gray-500 text-sm">Viewing as {enrollment.student_name} ({enrollment.email})</p>
        </div>
        <Link to="/admin/enrollments" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          Back to Enrollments
        </Link>
      </div>

      {/* Manage Course Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Course Assignment</h3>
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Assign Course Category</label>
            <AdminDropdown
              value={selectedCourseId}
              onChange={(val) => setSelectedCourseId(val)}
              options={[
                { value: '', label: 'General Registration (No specific course)' },
                ...courses.map((course) => ({
                  value: course.id,
                  label: `${course.title}${!course.is_active ? ' (Inactive)' : ''}`,
                })),
              ]}
              placeholder="General Registration (No specific course)"
            />
          </div>
          <button 
            onClick={handleUpdateCourse}
            disabled={isSaving}
            className={`px-8 py-3.5 bg-gray-800 text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isSaving ? 'Updating...' : 'Update Course'}
          </button>
        </div>
      </div>

      {/* Messaging & PDFs Section */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-[#166534] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#166534]/5 rounded-full blur-[30px] pointer-events-none"></div>
        <h3 className="text-lg font-bold text-[#166534] mb-6">Communicate with Student</h3>
        
        {/* Send New Note Form */}
        <div className="grid lg:grid-cols-2 gap-8 relative z-10">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Write a Message</label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="e.g. Here are your requested materials..."
              rows={4}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-all resize-none text-gray-800"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Attach PDF</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl relative group hover:border-[#166534] transition-colors bg-gray-50 h-[120px] flex-col items-center">
              {uploadingFile ? (
                <div className="py-2 text-center">
                  <div className="w-6 h-6 border-4 border-[#166534] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : pdfUrl ? (
                <div className="relative group/preview inline-block p-3 bg-white rounded-xl border border-[#166534]/30 shadow-sm w-full text-center">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <svg className="w-6 h-6 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <div className="truncate w-full font-medium text-xs text-[#166534]">PDF Attached</div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setPdfUrl('')} 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <svg className="mx-auto h-8 w-8 text-gray-400 group-hover:text-[#166534] transition-colors mb-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div className="flex text-xs text-gray-600 justify-center">
                    <label htmlFor="pdf-upload" className="relative cursor-pointer bg-transparent rounded-md font-bold text-[#166534] hover:text-green-800 focus-within:outline-none">
                      <span>Upload a PDF</span>
                      <input id="pdf-upload" name="pdf-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileUpload} />
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleSendNote}
            disabled={isSendingNote}
            className={`px-8 py-3 bg-[#166534] text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#0f4523] transition-colors shadow-lg shadow-[#166534]/20 ${isSendingNote ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isSendingNote ? 'Sending...' : 'Send Note to Student'}
          </button>
        </div>

        {/* History of Sent Notes */}
        {notesHistory.length > 0 && (
          <div className="mt-8 pt-8 border-t border-[#166534]/20 relative z-10">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Sent History</h4>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {[...notesHistory].map((note, index) => ({ ...note, originalIndex: index })).reverse().map((note) => (
                <div key={note.id || note.originalIndex} className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 flex flex-col gap-2 relative group">
                  <div className="flex justify-between items-start">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      {note.date ? new Date(note.date).toLocaleString() : 'Past Note'}
                    </div>
                    <button 
                      onClick={() => handleDeleteNote(note.originalIndex)}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Note"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  {note.text && <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.text}</p>}
                  {note.pdfUrl && (
                    <a href={note.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline mt-1 w-max">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      Attached PDF
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8 border-b pb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Student Enrollments</h3>
          {studentEnrollments.length === 0 ? (
            <p className="text-gray-500 text-sm">No enrollments found for this student.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {studentEnrollments.map(e => (
                <div key={e.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">{e.course_name}</h4>
                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                      e.status === 'approved' ? 'bg-green-100 text-green-700' :
                      e.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {e.status}
                    </span>
                  </div>
                  {e.student_id && (
                    <p className="text-xs text-gray-500">Student ID: <span className="font-mono text-[#166534] font-bold">{e.student_id}</span></p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Accessible Notes</h3>
          {notes.length === 0 ? (
            <p className="text-gray-500 text-sm">No notes accessible to this student yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {notes.map(note => (
                <div key={note.id} className="p-4 border rounded-lg bg-gray-50 flex flex-col">
                  <h4 className="font-bold text-gray-900 mb-1">{note.title}</h4>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{note.description}</p>
                  <div className="mt-auto">
                    <span className="text-xs font-bold text-[#166534] uppercase">{note.file_type} Resource</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStudentPreview;
