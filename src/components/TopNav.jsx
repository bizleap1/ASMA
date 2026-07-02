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
import Home from '../pages/Home';

const TopNav = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [lang, setLang] = React.useState('en');
  const [user, setUser] = React.useState(null);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close profile dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setProfileOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  React.useEffect(() => {
    if (document.cookie.includes('googtrans=/en/hi')) {
      setLang('hi');
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    if (newLang === 'hi') {
      document.cookie = "googtrans=/en/hi; path=/;";
    } else {
      document.cookie = "googtrans=/en/en; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
    try {
      const selectField = document.querySelector('.goog-te-combo');
      if (selectField) {
        selectField.value = newLang;
        selectField.dispatchEvent(new Event('change'));
        // Wait a small amount and then close menu on mobile to show translation
        setTimeout(() => setMobileMenuOpen(false), 300);
      } else {
        window.location.reload();
      }
    } catch(e) {
      window.location.reload();
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (location.pathname === '/') {
        setActiveSection('home');
        return;
      }

      if (location.pathname.startsWith('/blog')) {
        setActiveSection('blog');
        return;
      }

      const pathId = location.pathname.substring(1);
      const pageIds = ['analysis', 'about', 'services', 'courses', 'gallery', 'contact'];
      if (pageIds.includes(pathId)) {
        setActiveSection(pathId);
      } else {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { id: 'home', label: 'Home', path: '/#home' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'analysis', label: 'Analysis', path: '/analysis' },
    { id: 'services', label: 'Services', path: '/services' },
    { id: 'courses', label: 'Courses', path: '/courses' },
    { id: 'gallery', label: 'Gallery', path: '/gallery' },
    { id: 'blog', label: 'Blog', path: '/blog' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  const isHomePage = location.pathname === '/' || location.pathname === '';
  const isNavSolid = scrolled || !isHomePage;

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 flex flex-col ${isNavSolid ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100' : 'bg-transparent border-transparent'}`}>
      <div className={`bg-text-primary text-bg-primary text-center px-4 md:text-sm font-bold tracking-widest uppercase transition-all duration-500 overflow-hidden ${isNavSolid ? 'max-h-0 opacity-0 py-0 text-[0px]' : 'max-h-16 opacity-100 py-2 text-xs'}`}>
        India's Biggest & Most Experienced Stock Market Academy of Central India
      </div>
      <nav className="w-full py-1 md:py-2 px-4 md:px-8 lg:px-12 transition-all duration-500">
        <div className="container mx-auto flex justify-between items-center gap-2 lg:gap-4 px-2 md:px-0">
          <div className="flex items-center gap-2 flex-none">
            <Link to="/" className="cursor-pointer touch-manipulation">
              <img src={isNavSolid ? "/logo-dark.png" : "/logo.png"} alt="Advait Stock Market Academy Logo" className={`flex-none h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain transition-all duration-500 ease-in-out origin-left scale-100 will-change-transform`} onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }} />
              <div style={{ display: 'none' }} className="flex-none w-10 h-10 md:w-12 md:h-12 bg-accent-primary rounded-full items-center justify-center text-bg-primary font-bold text-lg md:text-xl font-display shadow-lg">A</div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 lg:gap-8 font-medium tracking-wide text-sm">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.path}
                className={`transition-colors relative py-1 ${activeSection === link.id ? 'text-accent-primary font-bold' : `${isNavSolid ? 'text-[#0b4d26] font-semibold' : 'text-white/95'} hover:text-accent-primary`
                  }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-primary rounded-full animate-pulse"></span>
                )}
              </a>
            ))}
          </div>

          {/* Action Buttons & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-1.5 px-3 md:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-text-primary rounded-full font-bold text-xs transition-colors border border-gray-200"
              title="Toggle Language (English / Hindi)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
              {lang === 'en' ? 'Hindi' : 'English'}
            </button>

            {user ? (
              <div className="relative group hidden md:block" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 md:gap-2 p-1 pr-2 md:pr-3 bg-white hover:bg-gray-50 rounded-full border border-gray-200 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-inner">
                    {(user.email || user.phone || 'U').charAt(0).toUpperCase()}
                  </div>
                  <svg className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {/* Desktop Dropdown Menu */}
                <div className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-text-primary/5 overflow-hidden transition-all duration-300 origin-top-right ${profileOpen ? 'scale-100 opacity-100 visible translate-y-0' : 'scale-95 opacity-0 invisible -translate-y-2'}`}>
                  <div className="px-4 py-4 bg-bg-secondary/30 border-b border-text-primary/5">
                    <div className="text-xs font-bold text-text-primary truncate">{user.email || user.phone}</div>
                    <div className="text-[10px] text-accent-primary uppercase tracking-widest font-black mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"></span>
                      Active Student
                    </div>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 rounded-xl transition-colors flex items-center gap-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      Dashboard
                    </Link>
                    <button onClick={() => { handleLogout(); setProfileOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden md:inline-flex px-4 py-2 md:px-6 md:py-3 bg-accent-primary text-text-primary rounded-full font-bold tracking-widest text-[10px] md:text-xs hover:bg-white transition-all shadow-lg shadow-accent-primary/20 whitespace-nowrap border border-accent-primary hover:border-text-primary/10 hover:shadow-xl hover:-translate-y-0.5">
                Login
              </Link>
            )}

            <a href="tel:09156953895" className="hidden lg:block px-6 py-3 bg-text-primary text-bg-primary rounded-full font-bold tracking-widest text-xs hover:bg-accent-primary transition-all shadow-lg shadow-text-primary/10 whitespace-nowrap">
              Inquire Now
            </a>

            {/* Hamburger Icon for Mobile */}
            <button
              className={`md:hidden p-2 md:p-3 focus:outline-none touch-manipulation transition-colors ${isNavSolid || mobileMenuOpen ? 'text-text-primary' : 'text-white'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl shadow-xl transition-all duration-300 overflow-y-auto ${mobileMenuOpen ? 'max-h-[calc(100vh-80px)] border-b border-text-primary/10' : 'max-h-0 border-transparent'}`}>
          <div className="flex flex-col gap-4 px-6 py-6">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-medium transition-colors border-b border-text-primary/5 pb-2 ${activeSection === link.id ? 'text-accent-primary font-bold' : 'text-text-secondary'
                  }`}
              >
                {link.label}
              </a>
            ))}

            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center gap-2 mt-2 w-full py-4 bg-gray-100 hover:bg-gray-200 text-text-primary rounded-xl font-bold tracking-widest text-sm transition-colors border border-gray-200 text-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
              Switch to {lang === 'en' ? 'Hindi' : 'English'}
            </button>

            {user ? (
              <div className="mt-2 w-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex-shrink-0">
                <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100 bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    {(user.email || user.phone || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold text-text-primary truncate">{user.email || user.phone}</div>
                    <div className="text-[10px] text-accent-primary uppercase tracking-widest font-black mt-0.5">Active Student</div>
                  </div>
                </div>
                <div className="flex flex-col p-1">
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-accent-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Dashboard
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-3 text-left">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mt-2 w-full py-4 bg-accent-primary text-text-primary rounded-xl font-bold tracking-widest text-sm hover:bg-white transition-all text-center inline-block border border-accent-primary shadow-lg shadow-accent-primary/20 flex-shrink-0">
                Login
              </Link>
            )}

            <a href="tel:09156953895" className="mt-2 mb-8 w-full py-4 bg-text-primary text-white rounded-xl font-bold tracking-widest text-sm hover:bg-accent-primary transition-colors text-center inline-block flex-shrink-0">
              Inquire Now
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default TopNav;