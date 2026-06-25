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
  const [activeVideo, setActiveVideo] = React.useState(null);
  const [activeNote, setActiveNote] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  if (!user) {
    return (
      <AnimatedSection className="py-20 min-h-[50vh] flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">You are not logged in.</h2>
          <Link to="/login" className="px-6 py-3 bg-accent-primary text-text-primary rounded-full font-bold">Go to Login</Link>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection className="py-20 min-h-[60vh] bg-bg-secondary/10 relative">
      {/* Premium Note Modal */}
      {activeNote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-md transition-all duration-300">
          <div className="bg-bg-primary rounded-[2rem] w-full max-w-4xl max-h-[90vh] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/50 relative flex flex-col animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-5 md:px-8 py-4 md:py-6 bg-gradient-to-r from-bg-secondary to-bg-primary border-b border-gray-100/50 shrink-0 relative z-10 gap-4 md:gap-0">
              <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center text-accent-primary shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <div className="flex-grow">
                  <div className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-accent-primary mb-1">Masterclass Notes</div>
                  <h3 className="font-bold text-lg md:text-2xl text-text-primary leading-tight line-clamp-1 md:line-clamp-none">{activeNote.title}</h3>
                </div>
              </div>
              <button onClick={() => setActiveNote(null)} className="absolute top-4 right-4 md:static w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 hover:scale-105 hover:rotate-90 text-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 shrink-0">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-5 md:p-12 overflow-y-auto bg-bg-primary relative">
               {/* Decorative background element */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
               <div className="relative z-10 text-lg">
                 {activeNote.content}
               </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100/50 bg-bg-secondary/30 shrink-0 flex justify-between items-center relative z-10">
              <span className="text-sm font-medium text-text-secondary italic">End of notes. Keep learning!</span>
              <button onClick={() => setActiveNote(null)} className="px-8 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold rounded-xl shadow-lg shadow-accent-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                Done Reading
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between p-4 bg-text-primary text-white shrink-0">
              <h3 className="font-bold text-lg">Free Mini-Course Lesson</h3>
              <button onClick={() => setActiveVideo(null)} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center relative">
               <iframe className="w-full h-full" src={activeVideo} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-xl mb-2 text-text-primary">Lesson in Progress...</h4>
              <p className="text-text-secondary">Watch this high-quality lesson to get started on your journey. Make sure to take notes!</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Premium Hero Welcome Area */}
          <div className="relative rounded-[2.5rem] overflow-hidden mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-text-primary">
            <div className="absolute inset-0 bg-gradient-to-br from-text-primary via-accent-secondary to-accent-primary opacity-90"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-primary/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
            
            <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-white">
              <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center font-display font-bold text-5xl shadow-[0_0_30px_rgba(255,255,255,0.2)] shrink-0">
                {(user.email || user.phone || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="text-center md:text-left flex-grow">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs uppercase font-bold tracking-widest mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span> Active Student
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2 text-white drop-shadow-sm">Welcome Back, Trader!</h2>
                <p className="text-white/80 text-lg font-medium">{user.email || user.phone}</p>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden lg:flex gap-4 shrink-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center min-w-[130px] shadow-lg">
                  <div className="text-4xl font-bold mb-1 font-display">6</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/70 font-bold">Free Resources</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center min-w-[130px] shadow-lg">
                  <div className="text-4xl font-bold mb-1 font-display">3</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/70 font-bold">Free Courses</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Vault Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
            <div>
              <div className="text-sm font-bold tracking-widest uppercase text-accent-primary mb-2">Free Access</div>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-text-primary">Your Learning Vault</h3>
            </div>
            <p className="text-text-secondary font-medium md:max-w-xs text-sm">Everything you need to master the financial markets, organized in one place.</p>
          </div>
          
          {/* Notes Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {FREE_NOTES.map(note => (
              <div key={note.id} className="p-8 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group flex flex-col relative overflow-hidden">
                {/* Decorative background gradient */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-primary/10 rounded-full blur-3xl group-hover:bg-accent-primary/20 transition-colors"></div>
                
                <div className="w-14 h-14 bg-gradient-to-br from-bg-secondary to-bg-primary rounded-2xl shadow-sm border border-gray-100/50 flex items-center justify-center mb-6 text-accent-primary group-hover:scale-110 transition-transform relative z-10">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                
                <div className="relative z-10 flex-grow">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-[10px] font-bold tracking-widest uppercase mb-4 shadow-sm border border-accent-primary/10">Free Resource</div>
                  <h3 className="text-xl font-display font-bold text-text-primary mb-3 leading-tight group-hover:text-accent-primary transition-colors">{note.title}</h3>
                  <p className="text-sm text-text-secondary mb-8 leading-relaxed">{note.summary}</p>
                </div>

                {note.actionUrl ? (
                  <a href={note.actionUrl} download className="w-full py-3.5 rounded-xl bg-bg-secondary/50 text-text-primary font-bold text-sm flex justify-center items-center gap-2 hover:bg-accent-primary hover:text-white transition-colors relative z-10 border border-gray-100/50">
                    Download High-Quality PDF <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </a>
                ) : (
                  <button onClick={() => setActiveNote(note)} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold text-sm flex justify-center items-center gap-2 shadow-[0_8px_20px_-6px_rgba(212,176,106,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(212,176,106,0.5)] transition-all relative z-10 hover:-translate-y-0.5">
                    Read Masterclass Now <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Free Courses Section */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100/50 p-8 md:p-12 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-display text-text-primary">Free Mini-Courses</h3>
              <span className="text-xs font-bold text-accent-primary uppercase tracking-widest bg-accent-primary/10 px-3 py-1 rounded-full">Explore</span>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {/* Free Course 1 */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all group">
                <div className="h-32 bg-gray-100 relative overflow-hidden">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop" alt="Stock Market Basics" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-[#166534] text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">Free</div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-text-primary text-sm mb-1.5 leading-tight">Stock Market Basics</h4>
                  <p className="text-xs text-text-secondary mb-5 line-clamp-2">Learn the fundamental concepts of stock trading and how markets operate.</p>
                  <button onClick={() => setActiveVideo("https://www.youtube.com/embed/GcZW24SkbHM?autoplay=1")} className="w-full py-2.5 bg-bg-secondary/50 text-text-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-accent-primary hover:text-white transition-colors">Start Learning</button>
                </div>
              </div>
              
              {/* Free Course 2 */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all group">
                <div className="h-32 bg-gray-100 relative overflow-hidden">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop" alt="Introduction to Candlesticks" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-[#166534] text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">Free</div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-text-primary text-sm mb-1.5 leading-tight">Intro to Candlesticks</h4>
                  <p className="text-xs text-text-secondary mb-5 line-clamp-2">Master the art of reading price action through candlestick patterns.</p>
                  <button onClick={() => setActiveVideo("https://www.youtube.com/embed/AYG2g3O7jKc?autoplay=1")} className="w-full py-2.5 bg-bg-secondary/50 text-text-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-accent-primary hover:text-white transition-colors">Start Learning</button>
                </div>
              </div>

              {/* Free Course 3 */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all group">
                <div className="h-32 bg-gray-100 relative overflow-hidden">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=600&auto=format&fit=crop" alt="Risk Management 101" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-[#166534] text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">Free</div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-text-primary text-sm mb-1.5 leading-tight">Risk Management 101</h4>
                  <p className="text-xs text-text-secondary mb-5 line-clamp-2">Protect your capital with essential risk management strategies for beginners.</p>
                  <button onClick={() => setActiveVideo("https://www.youtube.com/embed/BFwzNvxPsHo?autoplay=1")} className="w-full py-2.5 bg-bg-secondary/50 text-text-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-accent-primary hover:text-white transition-colors">Start Learning</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default DashboardSection;