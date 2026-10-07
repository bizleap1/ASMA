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

const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const service = serviceData.find(s => s.id === serviceId);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleServiceSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const text = `Hi Advait Academy! I am interested in ${service?.title || 'your services'}.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`;
    window.open(`https://wa.me/919156953895?text=${encodeURIComponent(text)}`, '_blank');
    setIsFormOpen(false);
  };

  if (!service) {
    return <div className="text-center py-20 text-2xl font-bold">Service not found.</div>;
  }

  return (
    <div className="bg-bg-primary min-h-screen pb-20">
      {/* Premium Hero Section */}
      <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{ backgroundImage: `url(${service.image})` }}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-bg-primary"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(22,101,52,0.15)_0%,transparent_70%)]"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-20">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[#4ade80] font-bold tracking-widest uppercase text-xs mb-8 shadow-2xl shadow-[#166534]/20 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]"></span>
            </span>
            {service.category} Service
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 drop-shadow-2xl tracking-tight leading-tight">
            {service.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl leading-relaxed">
            {service.desc}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 -mt-24 md:-mt-32 relative z-20">
        {/* Floating Info Bar */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white p-6 md:p-10 mb-12 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#166534]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full md:w-auto relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#166534]/10 flex items-center justify-center text-[#166534]">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mb-1">Service Type</p>
                <p className="text-xl font-display font-black text-text-primary">Premium Advisory</p>
              </div>
            </div>

            <div className="w-full md:w-px h-px md:h-16 bg-gray-200"></div>

            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#166534]/10 flex items-center justify-center text-[#166534]">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mb-1">Consultation</p>
                <p className="text-xl font-display font-black text-text-primary">1-on-1 Expert</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto relative z-10">
            <button onClick={() => setIsFormOpen(true)} className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#166534] text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-[0_10px_30px_rgba(22,101,52,0.3)] hover:bg-[#0f4523] hover:shadow-[0_15px_40px_rgba(22,101,52,0.4)] transition-all hover:-translate-y-1">
              Get Started
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Column - Overview & Benefits */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-[#166534] text-white flex items-center justify-center shadow-lg shadow-[#166534]/30">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary">Service Overview</h2>
              </div>

              <div className="prose prose-lg text-text-secondary leading-relaxed font-light mb-10">
                <p>{service.fullDesc}</p>
              </div>

              <div className="flex items-center gap-4 mb-8 mt-12">
                <div className="w-12 h-12 rounded-full bg-[#166534] text-white flex items-center justify-center shadow-lg shadow-[#166534]/30">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary">Key Benefits</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {service.benefits.map((item, idx) => (
                  <div key={idx} className="group p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-[#166534]/10 hover:border-[#166534]/30 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#166534] mb-4 group-hover:scale-110 transition-transform">
                      <span className="font-display font-black text-lg">{idx + 1}</span>
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-[#166534] transition-colors">{item}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-8 relative">
            <div className="sticky top-24 space-y-8">

              {/* Ready to start Card */}
              <div className="bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="w-20 h-20 mx-auto rounded-full bg-[#166534]/20 flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-2xl font-display font-black text-white mb-4 relative z-10">
                  Ready to Transform Your Portfolio?
                </h3>
                <p className="text-gray-400 mb-8 font-light relative z-10">
                  Our experts are ready to guide you step-by-step. Let's discuss your financial goals today.
                </p>
                <button onClick={() => setIsFormOpen(true)} className="w-full py-4 bg-[#166534] text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#4ade80] hover:text-[#064e3b] transition-all shadow-lg shadow-[#166534]/30 hover:-translate-y-1 relative z-10">
                  Book Consultation
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Inquiry Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFormOpen(false)}></div>
          <div className="relative bg-white rounded-3xl p-8 md:p-10 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setIsFormOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="mb-8">
              <h3 className="text-2xl font-display font-black text-text-primary mb-2">Request Service Info</h3>
              <p className="text-sm text-text-secondary">Leave your details below to inquire about <strong className="text-[#166534]">{service.title}</strong>.</p>
            </div>
            <form className="space-y-5" onSubmit={handleServiceSubmit}>
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

export default ServiceDetailsPage;