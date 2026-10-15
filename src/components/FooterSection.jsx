import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import PhoneNumber from './PhoneNumber';

const FooterSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const easeOut = [0.16, 1, 0.3, 1];
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <motion.footer
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.45, ease: easeOut }}
      className="bg-[#06261A] text-white pt-9 sm:pt-10 md:pt-12 pb-16 sm:pb-6 relative overflow-hidden border-t border-white/10"
    >
      <div className="container mx-auto px-5 sm:px-6 md:px-8 lg:px-12 relative z-10">

        {/* ============================================================
            DESKTOP VIEW: Approved 4-Column Layout (Exactly Unchanged)
           ============================================================ */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-7 md:gap-8 lg:gap-10 mb-6 sm:mb-8">

          {/* Column 1: Brand Info & Social (4 Cols) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Advait Stock Market Academy Logo"
                className="h-[84px] sm:h-[92px] xl:h-[100px] w-auto object-contain shrink-0"
              />
              <div>
                <div 
                  className="font-semibold text-lg sm:text-[19px] tracking-tight text-white leading-tight"
                  style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                >
                  Advait Stock Market Academy
                </div>
                <div 
                  className="text-xs font-medium text-[#D4AF37] tracking-[0.14em] uppercase mt-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Empowering Traders Since 2006
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://www.facebook.com/asmaintraday"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center text-white/75 hover:text-white hover:bg-white/15 hover:border-white/20 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a
                href="https://www.instagram.com/asma_stockmarket/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center text-white/75 hover:text-white hover:bg-white/15 hover:border-white/20 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a
                href="https://www.youtube.com/@advaitsharemarketacademy-x5p"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center text-white/75 hover:text-white hover:bg-white/15 hover:border-white/20 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a
                href="mailto:advaitsharemarketacademy@gmail.com"
                aria-label="Email"
                className="w-8 h-8 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center text-white/75 hover:text-white hover:bg-white/15 hover:border-white/20 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-2.5 text-left">
            <h4
              className="text-[12px] font-semibold text-[#D4AF37] uppercase tracking-[0.14em]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
            >
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-[13px] text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
              <li><Link to="/about" className="hover:text-white transition-colors duration-200 block py-0.5">About ASMA</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors duration-200 block py-0.5">Course Syllabus</Link></li>
              <li><Link to="/analysis" className="hover:text-white transition-colors duration-200 block py-0.5">Market Analysis</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors duration-200 block py-0.5">Financial Services</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors duration-200 block py-0.5">Campus Gallery</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors duration-200 block py-0.5">Trading Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors duration-200 block py-0.5">Contact Desk</Link></li>
            </ul>
          </div>

          {/* Column 3: Courses & Services (3 Cols) */}
          <div className="lg:col-span-3 space-y-2.5 text-left">
            <h4
              className="text-[12px] font-semibold text-[#D4AF37] uppercase tracking-[0.14em]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
            >
              Programs &amp; Services
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-[13px] text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
              <li><Link to="/courses" className="hover:text-white transition-colors duration-200 block py-0.5">Advanced Foundation Batch</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors duration-200 block py-0.5">Professional Master Program</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors duration-200 block py-0.5">Technical Analysis Training</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors duration-200 block py-0.5">Stock Investment Guidance</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors duration-200 block py-0.5">Mutual Fund Planning</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors duration-200 block py-0.5">15 Financial Services</Link></li>
            </ul>
          </div>

          {/* Column 4: Admissions & Campus (3 Cols) */}
          <div className="lg:col-span-3 space-y-2.5 text-left">
            <h4
              className="text-[12px] font-semibold text-[#D4AF37] uppercase tracking-[0.14em]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
            >
              Admissions &amp; Campus
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="space-y-0.5">
                  <a href="tel:09156953895" className="hover:text-white transition-colors duration-200 font-medium block">
                    <PhoneNumber number="09156953895" />
                  </a>
                  <a href="tel:09552855333" className="hover:text-white transition-colors duration-200 text-white/60 block text-[11.5px]">
                    09552855333
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:advaitsharemarketacademy@gmail.com" className="hover:text-white transition-colors duration-200 whitespace-nowrap text-[11.5px] sm:text-xs">
                  advaitsharemarketacademy@gmail.com
                </a>
              </li>

              <li className="flex items-start gap-2.5 pt-1 border-t border-white/10">
                <svg className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="leading-relaxed text-white/65 text-[11.5px] sm:text-xs">
                  Plot 28, Oshian SuperCity 3, Besa - Pipla Road, Nagpur 440034
                </div>
              </li>

              <li className="text-[11px] text-white/55">
                Mon – Sun: 08:00 AM – 10:00 PM • Open 7 Days
              </li>
            </ul>
          </div>

        </div>

        {/* ============================================================
            MOBILE VIEW: Compact Accordion Layout (< 1024px)
           ============================================================ */}
        <div className="block lg:hidden mb-6">

          {/* Brand Info & Social (Compact Horizontal Row) */}
          <div className="mb-4 text-left">
            <div className="flex items-center gap-3.5 mb-3">
              <img
                src="/logo.png"
                alt="Advait Stock Market Academy Logo"
                className="h-[76px] sm:h-[84px] w-auto object-contain shrink-0"
              />
              <div>
                <div
                  className="font-semibold text-base sm:text-[17px] tracking-tight text-white leading-tight"
                  style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                >
                  Advait Stock Market Academy
                </div>
                <div
                  className="text-[11px] font-medium text-[#D4AF37] tracking-[0.14em] uppercase mt-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Empowering Traders Since 2006
                </div>
              </div>
            </div>

            {/* Social Links Row */}
            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/asmaintraday"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center text-white/75 hover:text-white hover:bg-white/15 hover:border-white/20 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a
                href="https://www.instagram.com/asma_stockmarket/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center text-white/75 hover:text-white hover:bg-white/15 hover:border-white/20 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a
                href="https://www.youtube.com/@advaitsharemarketacademy-x5p"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center text-white/75 hover:text-white hover:bg-white/15 hover:border-white/20 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a
                href="mailto:advaitsharemarketacademy@gmail.com"
                aria-label="Email"
                className="w-8 h-8 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center text-white/75 hover:text-white hover:bg-white/15 hover:border-white/20 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>
          </div>

          {/* Accordion List with Thin Dividers */}
          <div className="border-t border-white/10 divide-y divide-white/10">

            {/* Accordion 1: QUICK LINKS */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('quickLinks')}
                className="w-full py-3 flex items-center justify-between text-left text-[12px] font-semibold text-[#D4AF37] uppercase tracking-[0.14em]"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                aria-expanded={openSection === 'quickLinks'}
              >
                <span>Quick Links</span>
                <span className="relative w-3.5 h-3.5 flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <span className="absolute w-3 h-[1.5px] bg-[#D4AF37] rounded-full" />
                  <span
                    className={`absolute w-[1.5px] h-3 bg-[#D4AF37] rounded-full transition-transform duration-200 ease-out ${openSection === 'quickLinks' ? 'scale-y-0' : 'scale-y-100'
                      }`}
                  />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openSection === 'quickLinks' && (
                  <motion.div
                    key="quickLinksContent"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                    className="overflow-hidden"
                  >
                    <ul className="pb-3 pt-0.5 space-y-2 text-xs text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <li><Link to="/about" className="hover:text-white transition-colors duration-200 block py-0.5">About ASMA</Link></li>
                      <li><Link to="/courses" className="hover:text-white transition-colors duration-200 block py-0.5">Course Syllabus</Link></li>
                      <li><Link to="/analysis" className="hover:text-white transition-colors duration-200 block py-0.5">Market Analysis</Link></li>
                      <li><Link to="/services" className="hover:text-white transition-colors duration-200 block py-0.5">Financial Services</Link></li>
                      <li><Link to="/gallery" className="hover:text-white transition-colors duration-200 block py-0.5">Campus Gallery</Link></li>
                      <li><Link to="/blog" className="hover:text-white transition-colors duration-200 block py-0.5">Trading Blog</Link></li>
                      <li><Link to="/contact" className="hover:text-white transition-colors duration-200 block py-0.5">Contact Desk</Link></li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: PROGRAMS & SERVICES */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('programs')}
                className="w-full py-3 flex items-center justify-between text-left text-[12px] font-semibold text-[#D4AF37] uppercase tracking-[0.14em]"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                aria-expanded={openSection === 'programs'}
              >
                <span>Programs &amp; Services</span>
                <span className="relative w-3.5 h-3.5 flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <span className="absolute w-3 h-[1.5px] bg-[#D4AF37] rounded-full" />
                  <span
                    className={`absolute w-[1.5px] h-3 bg-[#D4AF37] rounded-full transition-transform duration-200 ease-out ${openSection === 'programs' ? 'scale-y-0' : 'scale-y-100'
                      }`}
                  />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openSection === 'programs' && (
                  <motion.div
                    key="programsContent"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                    className="overflow-hidden"
                  >
                    <ul className="pb-3 pt-0.5 space-y-2 text-xs text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <li><Link to="/courses" className="hover:text-white transition-colors duration-200 block py-0.5">Advanced Foundation Batch</Link></li>
                      <li><Link to="/courses" className="hover:text-white transition-colors duration-200 block py-0.5">Professional Master Program</Link></li>
                      <li><Link to="/courses" className="hover:text-white transition-colors duration-200 block py-0.5">Technical Analysis Training</Link></li>
                      <li><Link to="/services" className="hover:text-white transition-colors duration-200 block py-0.5">Stock Investment Guidance</Link></li>
                      <li><Link to="/services" className="hover:text-white transition-colors duration-200 block py-0.5">Mutual Fund Planning</Link></li>
                      <li><Link to="/services" className="hover:text-white transition-colors duration-200 block py-0.5">15 Financial Services</Link></li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: ADMISSIONS & CAMPUS */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('admissions')}
                className="w-full py-3 flex items-center justify-between text-left text-[12px] font-semibold text-[#D4AF37] uppercase tracking-[0.14em]"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                aria-expanded={openSection === 'admissions'}
              >
                <span>Admissions &amp; Campus</span>
                <span className="relative w-3.5 h-3.5 flex items-center justify-center shrink-0 text-[#D4AF37]">
                  <span className="absolute w-3 h-[1.5px] bg-[#D4AF37] rounded-full" />
                  <span
                    className={`absolute w-[1.5px] h-3 bg-[#D4AF37] rounded-full transition-transform duration-200 ease-out ${openSection === 'admissions' ? 'scale-y-0' : 'scale-y-100'
                      }`}
                  />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openSection === 'admissions' && (
                  <motion.div
                    key="admissionsContent"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                    className="overflow-hidden"
                  >
                    <ul className="pb-3 pt-0.5 space-y-2.5 text-xs text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <li className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div className="space-y-0.5">
                          <a href="tel:09156953895" className="hover:text-white transition-colors duration-200 font-medium block">
                            <PhoneNumber number="09156953895" />
                          </a>
                          <a href="tel:09552855333" className="hover:text-white transition-colors duration-200 text-white/60 block text-[11px]">
                            09552855333
                          </a>
                        </div>
                      </li>

                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href="mailto:advaitsharemarketacademy@gmail.com" className="hover:text-white transition-colors duration-200 whitespace-nowrap text-[11.5px]">
                          advaitsharemarketacademy@gmail.com
                        </a>
                      </li>

                      <li className="flex items-start gap-2.5 pt-1 border-t border-white/10">
                        <svg className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="leading-relaxed text-white/65 text-[11.5px]">
                          Plot 28, Oshian SuperCity 3, Besa - Pipla Road, Nagpur 440034
                        </div>
                      </li>

                      <li className="text-[11px] text-white/55">
                        Mon – Sun: 08:00 AM – 10:00 PM • Open 7 Days
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

        {/* ============================================================
            BOTTOM LEGAL BAR & DEVELOPER ATTRIBUTION
           ============================================================ */}
        <div className="border-t border-white/10 pt-4 sm:pt-4.5 flex flex-col sm:flex-row justify-between items-center gap-2.5 text-xs text-white/50 text-center sm:text-left" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="leading-relaxed">&copy; {new Date().getFullYear()} Advait Stock Market Academy (ASMA). All rights reserved.</div>
          <div className="flex items-center justify-center gap-4 sm:gap-5 pt-0.5 sm:pt-0">
            <Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <span className="text-white/20">•</span>
            <Link to="/terms" className="hover:text-white transition-colors duration-200">Terms &amp; Conditions</Link>
          </div>
        </div>

        {/* Developer Credit */}
        <div
          className="mt-2.5 text-center sm:text-left text-[11px] sm:text-xs font-medium tracking-[0.08em] text-white/40"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          DEVELOPED AND MANAGED BY{' '}
          <a
            href="https://bizleap.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D4AF37] hover:text-white transition-colors duration-200 font-medium inline-block"
          >
            BIZLEAP
          </a>
        </div>

      </div>
    </motion.footer>
  );
};

export default FooterSection;