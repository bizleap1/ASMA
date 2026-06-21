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

const ContactSection = ({ isContactPage = false }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fname = formData.get('fname') || '';
    const lname = formData.get('lname') || '';
    const email = formData.get('email') || '';
    const message = formData.get('message') || '';

    const text = `Hi Advait Academy!%0A%0A*Name:* ${fname} ${lname}%0A*Email:* ${email}%0A*Message:* ${message}`;
    window.open(`https://wa.me/919156953895?text=${text}`, '_blank');
  };

  return (
    <AnimatedSection id="contact-form" className="py-10 md:py-16 bg-bg-primary relative overflow-hidden">
      {/* Premium Light Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-secondary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      {/* Subtle Decorative Grid Line */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Informational Section (Contact Page Only) */}
      {isContactPage && (
        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 max-w-7xl mb-16 md:mb-20">
          <div className="bg-gradient-to-br from-[#166534]/5 to-transparent border border-[#166534]/15 rounded-[32px] p-8 md:p-12 shadow-2xl text-left relative overflow-hidden group">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#166534]/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Column: Heading & Info */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#166534]/10 text-[#166534] font-bold tracking-widest uppercase text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#166534] animate-pulse"></span>
                  Get In Touch
                </div>

                <h2 className="text-3xl md:text-5xl font-display font-black leading-[1.15] text-text-primary tracking-tight">
                  We're Here to Support Your <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#166534] to-emerald-700">Financial Journey</span>
                </h2>

                <div className="h-1.5 w-24 bg-gradient-to-r from-[#166534] to-accent-secondary rounded-full"></div>

                <p className="text-text-secondary text-sm md:text-base font-light leading-relaxed text-justify">
                  Whether you're looking to enroll in our premium stock market courses, need guidance on personalized trading strategies, or want to inquire about our services, the Advait Academy team is ready to help. Visit our state-of-the-art campus, drop us a message, or give us a call!
                </p>
              </div>

              {/* Right Column: 3 Contact Services */}
              <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-text-primary/10 lg:pl-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Inquiry Card */}
                  <div className="p-5 bg-white rounded-2xl border border-[#166534]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
                    <div className="w-9 h-9 rounded-xl bg-[#166534]/10 flex items-center justify-center text-[#166534] mb-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h4 className="font-bold text-text-primary text-base mb-1.5">General Inquiries</h4>
                    <p className="text-xs text-text-secondary leading-relaxed font-light flex-grow">Questions about our curriculum, batch timings, or fee structure? Reach out anytime.</p>
                  </div>

                  {/* Mentorship Card */}
                  <div className="p-5 bg-white rounded-2xl border border-[#166534]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
                    <div className="w-9 h-9 rounded-xl bg-[#166534]/10 flex items-center justify-center text-[#166534] mb-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </div>
                    <h4 className="font-bold text-text-primary text-base mb-1.5">Mentorship</h4>
                    <p className="text-xs text-text-secondary leading-relaxed font-light flex-grow">Book a personalized counseling session with our expert research analysts.</p>
                  </div>

                  {/* Visit Card */}
                  <div className="p-5 bg-white rounded-2xl border border-[#166534]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
                    <div className="w-9 h-9 rounded-xl bg-[#166534]/10 flex items-center justify-center text-[#166534] mb-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h4 className="font-bold text-text-primary text-base mb-1.5">Visit Us</h4>
                    <p className="text-xs text-text-secondary leading-relaxed font-light flex-grow">Drop by our branches in Nagpur during operating hours for a campus tour.</p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 md:px-8 lg:px-12 grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10 max-w-7xl">
        <div className="space-y-8 md:space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/5 text-accent-secondary font-bold tracking-widest uppercase text-xs mb-4 md:mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse"></span>
              Connect With Us
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight mb-4 tracking-tight">
              Let's Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Journey</span>
            </h2>
            <p className="text-text-secondary font-light text-lg md:text-xl leading-relaxed max-w-lg">
              Connect with Advait Stock Market Academy today. From expert market training to trusted insurance solutions, we are your dedicated financial partner in Nagpur.
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-black/5">
            <a href="https://maps.google.com/?q=Advait+Share+Market+Academy,+Plot+28,+Oshian+SuperCity+3,+Besa-Pipla+Rd,+Nagpur" target="_blank" rel="noopener noreferrer" className="block group flex items-start gap-6 p-6 rounded-[24px] bg-white border border-black/5 hover:border-accent-secondary/30 transition-all duration-500 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(235,110,40,0.08)]">
              <div className="w-14 h-14 bg-accent-secondary/10 rounded-2xl flex items-center justify-center text-accent-secondary shrink-0 group-hover:scale-110 group-hover:bg-accent-secondary group-hover:text-white transition-all duration-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <div className="font-bold text-text-primary text-xl mb-2 group-hover:text-accent-secondary transition-colors">Head Office</div>
                <div className="text-text-secondary font-light text-sm md:text-base leading-relaxed max-w-sm">Plot 28, Oshian SuperCity 3, Opposite to Atharva Nagari 6, Besa - Pipla Road, Nagpur, Maharashtra 440034</div>
              </div>
            </a>


            <a href="tel:+919156953895" className="block group flex items-start gap-6 p-6 rounded-[24px] bg-white border border-black/5 hover:border-accent-primary/30 transition-all duration-500 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(17,82,52,0.08)]">
              <div className="w-14 h-14 bg-accent-primary/10 rounded-2xl flex items-center justify-center text-accent-primary shrink-0 group-hover:scale-110 group-hover:bg-accent-primary group-hover:text-white transition-all duration-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div>
                <div className="font-bold text-text-primary text-xl mb-2 group-hover:text-accent-primary transition-colors">Direct Support</div>
                <div className="text-text-secondary font-light text-lg">+91 9156953895</div>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white border border-black/5 p-8 md:p-12 rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.07)] relative overflow-hidden group">
          <h3 className="text-3xl font-display text-text-primary mb-8 font-bold relative z-10">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">First Name</label>
                <input name="fname" type="text" required className="w-full bg-bg-secondary/30 border border-black/5 rounded-xl px-5 py-4 text-text-primary outline-none focus:border-accent-secondary focus:bg-white transition-all placeholder:text-text-secondary/50" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Last Name</label>
                <input name="lname" type="text" required className="w-full bg-bg-secondary/30 border border-black/5 rounded-xl px-5 py-4 text-text-primary outline-none focus:border-accent-secondary focus:bg-white transition-all placeholder:text-text-secondary/50" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Email Address</label>
              <input name="email" type="email" required className="w-full bg-bg-secondary/30 border border-black/5 rounded-xl px-5 py-4 text-text-primary outline-none focus:border-accent-secondary focus:bg-white transition-all placeholder:text-text-secondary/50" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Message</label>
              <textarea name="message" required rows="4" className="w-full bg-bg-secondary/30 border border-black/5 rounded-xl px-5 py-4 text-text-primary outline-none focus:border-accent-secondary focus:bg-white transition-all resize-none placeholder:text-text-secondary/50" placeholder="How can we help you achieve your goals?"></textarea>
            </div>
            <button type="submit" className="w-full mt-4 py-5 bg-gradient-to-r from-accent-primary to-[#166b44] text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:shadow-[0_10px_30px_rgba(17,82,52,0.3)] hover:-translate-y-1 transition-all duration-300">
              Send via WhatsApp
            </button>
          </form>
        </div>
      </div>

      {/* Full Width Map Section */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 mt-16 md:mt-24 relative z-10 max-w-7xl">
        <div className="w-full h-80 md:h-[450px] rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] bg-white border border-black/5 p-2 md:p-3">
          <iframe 
            src="https://maps.google.com/maps?q=Advait+Share+Market+Academy,+Plot+28,+Oshian+SuperCity+3,+Besa-Pipla+Rd,+Nagpur&t=m&z=15&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '24px' }} 
            allowFullScreen="" 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Advait Stock Market Academy Location"
          ></iframe>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ContactSection;