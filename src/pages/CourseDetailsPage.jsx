import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { blogPosts } from '../blogData';
import shubhangiImg from '../assets/shubhangi.png';
import krishnaImg from '../assets/krishna.png';
import vrushaliImg from '../assets/vrushali.png';
import { serviceData, courseDetails, baseCourses, additionalCourses, coursePackages, FREE_NOTES } from '../data';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const decodedId = decodeURIComponent(courseId || "");
  const course = coursePackages.find(p => p.id === decodedId) || [...baseCourses, ...additionalCourses].find(c => c.title === decodedId);

  const handleCourseSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const msg = formData.get('message');
    const text = `Hi Advait Academy! I want to enroll in ${course?.title || 'a course'}.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${msg}`;
    window.open(`https://wa.me/919156953895?text=${encodeURIComponent(text)}`, '_blank');
    setIsModalOpen(false);
  };

  if (!course) {
    return (
      <div className="py-20 text-center text-text-primary">
        <h2 className="text-2xl font-bold mb-4">Course not found.</h2>
        <Link to="/courses" className="text-accent-primary hover:underline">Return to Courses</Link>
      </div>
    );
  }

  const details = courseDetails[course.title] || {
    duration: "Flexible",
    mode: "Online Live / Classroom",
    curriculum: course.coursesIncluded ? course.coursesIncluded.map(c => `Complete module on ${c}`) : ["Course overview and basics", "Practical sessions", "Q&A support"],
    benefits: ["Professional Mentorship", "Quality course materials", "Dedicated Support"]
  };

  return (
    <div className="bg-bg-primary min-h-screen pb-20">
      {/* Premium Hero Section */}
      <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{ backgroundImage: `url(${course.image})` }}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-bg-primary"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(22,101,52,0.15)_0%,transparent_70%)]"></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl mt-20">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold tracking-[0.2em] uppercase text-xs mb-6 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Premium Academy Course
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
            {course.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            {course.desc || "Master the markets with our comprehensive curriculum designed by industry veterans."}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-20 -mt-24 md:-mt-32">

        {/* Floating Info Bar */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white p-6 md:p-10 mb-12 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#166534]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full md:w-auto relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#166534]/10 flex items-center justify-center text-[#166534]">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mb-1">Duration</p>
                <p className="text-xl font-display font-black text-text-primary">{details.duration}</p>
              </div>
            </div>

            <div className="w-full md:w-px h-px md:h-16 bg-gray-200"></div>

            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#166534]/10 flex items-center justify-center text-[#166534]">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mb-1">Learning Mode</p>
                <p className="text-xl font-display font-black text-text-primary">{details.mode}</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto relative z-10">
            <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#166534] text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-[0_10px_30px_rgba(22,101,52,0.3)] hover:bg-[#0f4523] hover:shadow-[0_15px_40px_rgba(22,101,52,0.4)] transition-all hover:-translate-y-1">
              Enroll Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Column - Curriculum */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-[#166534] text-white flex items-center justify-center shadow-lg shadow-[#166534]/30">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary">Comprehensive Curriculum</h2>
              </div>

              <div className="space-y-4">
                {details.curriculum.map((item, idx) => (
                  <div key={idx} className="group flex items-center gap-6 p-5 rounded-2xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-[#166534]/20 hover:shadow-lg hover:shadow-[#166534]/5 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-white text-gray-400 font-display font-black flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534] transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <p className="text-text-primary font-medium text-base md:text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Benefits & Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-8 relative">
            <div className="sticky top-24 space-y-8">

              {/* Academy Benefits Card */}
              <div className="bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                <h3 className="text-xl font-display font-black text-white mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  Exclusive Benefits
                </h3>

                <ul className="space-y-5 relative z-10">
                  {details.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-[#166534]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-gray-300 font-medium leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Live Trading Banner */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <h4 className="text-lg font-bold text-text-primary mb-2">Live Trading Access</h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Gain exclusive access to our live trading sessions where you can apply concepts and trade alongside expert mentors in real-time.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Enroll Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl p-8 md:p-10 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="mb-8">
              <h3 className="text-2xl font-display font-black text-text-primary mb-2">Request Information</h3>
              <p className="text-sm text-text-secondary">Please fill out the form below to inquire about <strong className="text-[#166534]">{course.title}</strong>. Our team will get back to you shortly.</p>
            </div>
            <form className="space-y-5" onSubmit={handleCourseSubmit}>
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2">Full Name</label>
                <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/20 outline-none transition-all" placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2">Email Address</label>
                  <input required name="email" type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/20 outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2">Phone Number</label>
                  <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/20 outline-none transition-all" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2">Message (Optional)</label>
                <textarea name="message" rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/20 outline-none transition-all resize-none" placeholder="Any specific questions?"></textarea>
              </div>
              <button type="submit" className="w-full py-4 bg-[#166534] text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#0f4523] shadow-lg shadow-[#166534]/30 transition-all hover:-translate-y-1 mt-4">
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;