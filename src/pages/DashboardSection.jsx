import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { blogPosts } from '../blogData';
import shubhangiImg from '../assets/shubhangi.png';
import krishnaImg from '../assets/krishna.png';
import vrushaliImg from '../assets/vrushali.png';
import { serviceData, courseDetails, baseCourses, additionalCourses, FREE_NOTES } from '../data';
import AnimatedSection from '../components/AnimatedSection';
import { toast } from '../utils/notification';

const DashboardSection = () => {
  const [user, setUser] = React.useState(null);
  const [enrollments, setEnrollments] = React.useState([]);
  const [notes, setNotes] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeNote, setActiveNote] = React.useState(null);
  const [hasApprovedEnrollment, setHasApprovedEnrollment] = React.useState(false);
  const [accessRequests, setAccessRequests] = React.useState([]);
  const [requestingItemId, setRequestingItemId] = React.useState(null);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isDemo = localStorage.getItem('demoStudent') === 'true';
        const currentUser = session?.user ?? (isDemo ? { email: 'student@advaitacademy.com', id: 'demo-student-id' } : null);
        setUser(currentUser);

        if (currentUser) {
          if (currentUser.id === 'demo-student-id') {
            // Provide dummy enrollment for the demo student
            setEnrollments([{
              id: 'demo-enr-1',
              course_name: 'Demo Full Access',
              status: 'approved',
              student_id: 'ADV-STU-DEMO'
            }]);
            
            // Fetch all active notes from the database so admin additions are visible
            const { data: notesData, error: notesError } = await supabase
              .from('notes')
              .select('*')
              .eq('is_active', true)
              .order('created_at', { ascending: false });
            
            if (!notesError) {
              setNotes(notesData || []);
            }
            return;
          }

          // Fetch Enrollments
          const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('*, courses(*)')
            .eq('auth_user_id', currentUser.id)
            .order('created_at', { ascending: false });
          
          if (enrollmentError) throw enrollmentError;
          setEnrollments(enrollmentData || []);

          // Fetch Notes for approved courses and general notes
          const approvedCourseIds = (enrollmentData || [])
            .filter(e => e.status === 'approved' && e.course_id)
            .map(e => e.course_id);
            
          const isApproved = (enrollmentData || []).some(e => e.status === 'approved');
          setHasApprovedEnrollment(isApproved);

          if (isApproved) {
            const { data: notesData, error: notesError } = await supabase
              .from('notes')
              .select('*')
              .eq('is_active', true)
              .order('display_order', { ascending: true });
              
            if (notesError) throw notesError;
            
            // Filter notes client-side: either general (no course_id) or matching an approved course
            const filteredNotes = (notesData || []).filter(note => {
              return !note.course_id || approvedCourseIds.includes(note.course_id);
            });
            
            setNotes(filteredNotes);
          }

          // Fetch student's access requests
          try {
            const { data: reqData } = await supabase
              .from('access_requests')
              .select('*')
              .eq('auth_user_id', currentUser.id);
            setAccessRequests(reqData || []);
          } catch (reqErr) {
            console.warn("Could not fetch access_requests:", reqErr);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRequestAccess = async (note) => {
    if (!user) return;
    setRequestingItemId(note.id);
    try {
      const primaryEnrollment = enrollments[0];
      const { data, error } = await supabase.from('access_requests').insert({
        auth_user_id: user.id,
        student_name: primaryEnrollment?.student_name || user.email.split('@')[0],
        student_email: user.email,
        student_id: primaryEnrollment?.student_id || null,
        item_id: String(note.id),
        item_title: note.title,
        item_type: 'note',
        status: 'pending'
      }).select().single();

      if (error) {
        if (error.code === '42P01') {
          throw new Error("Table 'access_requests' not created yet. Please execute the SQL setup in Supabase SQL editor.");
        }
        throw error;
      }

      setAccessRequests(prev => [...prev.filter(r => r.item_id !== String(note.id)), data]);
      toast.success(`Access requested for "${note.title}". Admin will review and grant access soon!`);
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setRequestingItemId(null);
    }
  };

  if (isLoading) {
    return (
      <AnimatedSection className="py-20 min-h-[50vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#166534] border-t-transparent rounded-full animate-spin"></div>
      </AnimatedSection>
    );
  }

  if (!user) {
    return (
      <AnimatedSection className="py-20 min-h-[50vh] flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">You are not logged in.</h2>
          <Link to="/login" className="px-6 py-3 bg-[#166534] text-white rounded-xl font-bold tracking-widest uppercase text-sm">Go to Login</Link>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection className="py-12 md:py-20 min-h-[60vh] bg-bg-secondary/10 relative">
      
      {/* Premium Note Modal */}
      {activeNote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-md transition-all duration-300">
          <div className="bg-bg-primary rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl relative flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-xl text-text-primary">{activeNote.title}</h3>
              <button onClick={() => setActiveNote(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 md:p-10 overflow-y-auto bg-white flex-grow">
               <p className="text-lg text-text-secondary whitespace-pre-wrap">{activeNote.description}</p>
               {activeNote.file_url && activeNote.file_type === 'pdf' && (
                 <iframe src={activeNote.file_url} className="w-full h-[600px] mt-6 border rounded-xl" title={activeNote.title}></iframe>
               )}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        
        {/* Profile Header */}
        <div className="bg-[#0B2117] rounded-3xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-display font-bold text-4xl shrink-0">
            {(user.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Active Student
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-1">Welcome Back!</h2>
            <p className="text-white/70">{user.email}</p>
          </div>
        </div>

        {/* My Enrollments Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-display font-bold text-text-primary mb-6">My Enrollments</h3>
          
          {enrollments.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h4 className="text-lg font-bold text-text-primary mb-2">No active enrollments</h4>
              <p className="text-text-secondary mb-6">You haven't enrolled in any courses yet.</p>
              <Link to="/courses" className="px-8 py-3 bg-[#166534] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#0f4523] transition-colors">Explore Courses</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-3 ${
                        enrollment.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        enrollment.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {enrollment.status}
                      </span>
                      <h4 className="text-xl font-bold text-text-primary">{enrollment.course_name || 'General Registration'}</h4>
                    </div>
                  </div>
                  
                  {(() => {
                    if (!enrollment.notes) return null;
                    let history = [];
                    try {
                      const parsed = JSON.parse(enrollment.notes);
                      if (Array.isArray(parsed)) {
                        history = parsed;
                      } else if (parsed && typeof parsed === 'object') {
                        history = [parsed];
                      } else if (typeof parsed === 'string' && parsed.trim() !== '') {
                        history = [{ text: parsed }];
                      }
                    } catch(e) {
                      if (typeof enrollment.notes === 'string' && enrollment.notes.trim() !== '') {
                        history = [{ text: enrollment.notes }];
                      }
                    }

                    if (history.length === 0) return null;

                    return (
                      <div className="space-y-3 mb-6">
                        {history.map((note, idx) => (
                          <div key={note.id || idx} className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-3 group hover:shadow-md transition-all">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#166534]/80 rounded-l-xl"></div>
                            
                            <div className="flex items-center gap-3 pl-2 flex-1 min-w-0">
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="w-6 h-6 rounded-full bg-[#166534]/10 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden sm:block">Note</span>
                              </div>
                              
                              {note.text && (
                                <p className="text-[13px] text-gray-700 truncate font-medium flex-1 min-w-0" title={note.text}>
                                  {note.text}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 shrink-0 pl-8 md:pl-0">
                              <span className="text-[10px] font-semibold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100">
                                {note.date ? new Date(note.date).toLocaleDateString() : new Date(enrollment.created_at).toLocaleDateString()}
                              </span>
                              
                              {note.pdfUrl && (
                                <a 
                                  href={note.pdfUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-[#166534]/50 hover:bg-[#166534]/5 text-gray-700 hover:text-[#166534] text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm"
                                >
                                  <svg className="w-3.5 h-3.5 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                  Open PDF
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {enrollment.status === 'pending' && (
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                      <span className="text-sm font-medium text-text-secondary">Waiting for Admin Approval</span>
                    </div>
                  )}
                  
                  {enrollment.status === 'approved' && enrollment.student_id && (
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs text-text-secondary uppercase tracking-widest font-bold">Student ID</span>
                      <span className="text-sm font-mono font-bold text-[#166534] bg-[#166534]/10 px-3 py-1 rounded-md">{enrollment.student_id}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Course Materials & Notes */}
        {hasApprovedEnrollment && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-2xl font-display font-bold text-text-primary">Course Materials & Notes</h3>
                <p className="text-xs text-text-secondary mt-0.5">Click "Request Access" to request admin approval before opening.</p>
              </div>
            </div>
            
            {notes.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
                <p className="text-text-secondary">No notes or materials available yet for your approved courses.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {notes.map(note => {
                  const req = accessRequests.find(r => r.item_id === String(note.id));
                  const accessStatus = req ? req.status : 'none';
                  const isApproved = accessStatus === 'approved';
                  const isPending = accessStatus === 'pending';
                  const isRequesting = requestingItemId === note.id;

                  return (
                    <div key={note.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
                      {/* Top Header */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform ${isApproved ? 'bg-green-50 text-[#166534]' : 'bg-gray-50 text-gray-400'}`}>
                            {note.file_type === 'pdf' ? (
                               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            ) : (
                               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            )}
                          </div>
                          
                          {/* Access Status Badge */}
                          {isApproved ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">
                              🔓 Unlocked
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 uppercase tracking-wider animate-pulse">
                              ⏳ Requested
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wider">
                              🔒 Locked
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-text-primary mb-1 line-clamp-1">{note.title}</h4>
                        <p className="text-xs text-text-secondary mb-4 line-clamp-2">{note.description || 'Request access to view/download material.'}</p>
                      </div>

                      {/* Action Button */}
                      <div className="pt-3 border-t border-gray-50 mt-2">
                        {isApproved ? (
                          note.file_type === 'link' ? (
                            <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#166534] hover:bg-[#0f4523] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm">
                              Open Link →
                            </a>
                          ) : note.file_type === 'pdf' ? (
                            <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#166534] hover:bg-[#0f4523] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                              Download PDF
                            </a>
                          ) : (
                            <button onClick={() => setActiveNote(note)} className="w-full py-2.5 px-4 bg-[#166534] hover:bg-[#0f4523] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm">
                              Read Note →
                            </button>
                          )
                        ) : isPending ? (
                          <button disabled className="w-full py-2.5 px-4 bg-yellow-50 text-yellow-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-yellow-200 cursor-not-allowed">
                            Waiting for Approval ⏳
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRequestAccess(note)}
                            disabled={isRequesting}
                            className="w-full py-2.5 px-4 bg-gray-900 hover:bg-[#166534] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {isRequesting ? 'Requesting...' : 'Request Access 🔒'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </AnimatedSection>
  );
};

export default DashboardSection;