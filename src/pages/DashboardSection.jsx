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

const DashboardSection = () => {
  const [user, setUser] = React.useState(null);
  const [enrollments, setEnrollments] = React.useState([]);
  const [notes, setNotes] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeNote, setActiveNote] = React.useState(null);

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

          // Fetch Notes for approved courses
          const approvedCourseIds = (enrollmentData || [])
            .filter(e => e.status === 'approved' && e.course_id)
            .map(e => e.course_id);

          if (approvedCourseIds.length > 0) {
            const { data: notesData, error: notesError } = await supabase
              .from('notes')
              .select('*')
              .eq('is_active', true)
              .in('course_id', approvedCourseIds)
              .order('display_order', { ascending: true });
            
            if (notesError) throw notesError;
            setNotes(notesData || []);
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
            <div className="grid md:grid-cols-2 gap-6">
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
                      <h4 className="text-xl font-bold text-text-primary">{enrollment.course_name}</h4>
                    </div>
                  </div>
                  
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
        <div>
          <h3 className="text-2xl font-display font-bold text-text-primary mb-6">Course Materials & Notes</h3>
          
          {notes.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
              <p className="text-text-secondary">No notes or materials available yet for your approved courses.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {notes.map(note => (
                <div key={note.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#166534] mb-4 group-hover:scale-110 transition-transform">
                    {note.file_type === 'pdf' ? (
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    ) : (
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    )}
                  </div>
                  <h4 className="font-bold text-text-primary mb-2 line-clamp-1">{note.title}</h4>
                  <p className="text-xs text-text-secondary mb-4 line-clamp-2">{note.description || 'No description provided.'}</p>
                  
                  {note.file_type === 'link' ? (
                    <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#166534] uppercase tracking-widest hover:underline">Open Link →</a>
                  ) : note.file_type === 'pdf' ? (
                    <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#166534] uppercase tracking-widest hover:underline">Download PDF →</a>
                  ) : (
                    <button onClick={() => setActiveNote(note)} className="text-xs font-bold text-[#166534] uppercase tracking-widest hover:underline">Read Note →</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AnimatedSection>
  );
};

export default DashboardSection;