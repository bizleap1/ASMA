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
import PhoneNumber from './PhoneNumber';

const FooterSection = () => (
  <footer className="bg-text-primary text-bg-primary pt-16 pb-8 relative overflow-hidden border-t border-white/10">
    {/* Premium Background Ambience */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-secondary/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

    <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 mb-12">

      {/* Brand & Socials Column */}
      <div className="lg:col-span-4 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-28 h-28 md:w-36 md:h-36 shrink-0">
            <img src="/logo.png" alt="Advait Stock Market Academy Logo" className="h-full w-full object-contain drop-shadow-lg" onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }} />
            <div style={{ display: 'none' }} className="w-16 h-16 bg-accent-primary rounded-full items-center justify-center text-white font-bold font-display text-2xl">A</div>
          </div>
          <div className="font-display font-bold text-2xl md:text-3xl tracking-wide text-bg-primary">Advait Stock Market Academy</div>
        </div>
        <p className="font-light text-bg-secondary/70 max-w-sm leading-relaxed text-sm md:text-base">Empowering your financial future with expert share market training and comprehensive insurance solutions.</p>

        {/* Social Icons */}
        <div className="flex items-center gap-4 pt-2">
          <a href="https://www.facebook.com/asmaintraday" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-bg-primary/70 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300 hover:-translate-y-1 shadow-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
          </a>
          <a href="https://www.instagram.com/advait_sharemarket_academy/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-bg-primary/70 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent transition-all duration-300 hover:-translate-y-1 shadow-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
          </a>
          <a href="mailto:advaitsharemarketacademy@gmail.com" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-bg-primary/70 hover:bg-[#EA4335] hover:text-white hover:border-[#EA4335] transition-all duration-300 hover:-translate-y-1 shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div className="lg:col-span-2 space-y-6">
        <h4 className="font-display text-lg font-bold text-accent-primary flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-primary"></span>
          Quick Links
        </h4>
        <ul className="space-y-4 font-light text-sm text-bg-secondary/80">
          <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
          <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
          <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
          <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
        </ul>
      </div>

      {/* Contact Info */}
      <div className="lg:col-span-3 space-y-6">
        <h4 className="font-display text-lg font-bold text-accent-primary flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-secondary"></span>
          Contact
        </h4>
        <ul className="space-y-4 font-light text-sm text-bg-secondary/80">
          <li className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent-primary/20 group-hover:text-accent-primary transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <a href="tel:08062757056" className="hover:text-white transition-colors">08062757056</a>
          </li>
          <li className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent-primary/20 group-hover:text-accent-primary transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <a href="tel:09156953895" className="hover:text-white transition-colors"><PhoneNumber number="09156953895" /></a>
          </li>
          <li className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent-primary/20 group-hover:text-accent-primary transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <a href="tel:09552855333" className="hover:text-white transition-colors">09552855333</a>
          </li>
          <li className="flex items-center gap-3 group mt-2 pt-2 border-t border-white/10">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#EA4335]/20 group-hover:text-[#EA4335] transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <a href="mailto:advaitsharemarketacademy@gmail.com" className="hover:text-white transition-colors">advaitsharemarketacademy@gmail.com</a>
          </li>
        </ul>
      </div>

      {/* Timings */}
      <div className="lg:col-span-3 space-y-6">
        <h4 className="font-display text-lg font-bold text-accent-primary flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Timings
        </h4>
        <ul className="space-y-4 font-light text-sm text-bg-secondary/80">
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-4 h-4 text-bg-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="pt-1.5">
              <div className="text-bg-primary font-medium mb-0.5">Mon - Sun</div>
              <div>08:00 AM - 10:00 PM</div>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="text-emerald-400 font-medium">All Days Open</span>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="container mx-auto px-6 md:px-12 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
      <div className="text-sm font-light text-bg-secondary/50">&copy; {new Date().getFullYear()} Advait Stock Market Academy. All rights reserved.</div>
      <div className="flex gap-6 text-sm font-light text-bg-secondary/50">
        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
      </div>
    </div>
  </footer>
);

export default FooterSection;