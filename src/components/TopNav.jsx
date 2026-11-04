import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import NotificationScroller from './NotificationScroller';

const TopNav = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const getInitialLang = () => {
    if (typeof document === 'undefined') return 'en';
    return document.cookie.split(';').some(c => c.trim().startsWith('googtrans=') && c.includes('/hi')) ? 'hi' : 'en';
  };
  const [lang, setLang] = useState(getInitialLang);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  // Smart Sticky Scroll Logic (Hide on scroll down, show on scroll up, transparent at home top)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    lastScrollYRef.current = window.scrollY;
    const initialAtTop = window.scrollY <= 40;
    setIsAtTop(initialAtTop);
    setIsVisible(true);

    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const deltaY = currentScrollY - lastScrollYRef.current;
          const atTop = currentScrollY <= 40;

          setIsAtTop((prev) => (prev !== atTop ? atTop : prev));

          if (atTop) {
            setIsVisible((prev) => (!prev ? true : prev));
          } else {
            // Stable direction threshold to prevent flapping and jitter
            if (deltaY > 18 && currentScrollY > 100) {
              setIsVisible((prev) => (prev ? false : prev));
            } else if (deltaY < -14) {
              setIsVisible((prev) => (!prev ? true : prev));
            }
          }

          lastScrollYRef.current = currentScrollY;
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync active nav section on route change and reset menu states
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
    setIsVisible(true);
    setIsAtTop(typeof window !== 'undefined' ? window.scrollY <= 30 : true);

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
  }, [location.pathname]);

  // Lock body scroll and handle floating buttons when mobile menu is open
  useEffect(() => {
    const whatsappBtn = document.getElementById('whatsapp-floating-btn');
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (whatsappBtn) {
        whatsappBtn.style.opacity = '0';
        whatsappBtn.style.visibility = 'hidden';
        whatsappBtn.style.pointerEvents = 'none';
      }
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      if (whatsappBtn) {
        whatsappBtn.style.opacity = '1';
        whatsappBtn.style.visibility = 'visible';
        whatsappBtn.style.pointerEvents = 'auto';
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      if (whatsappBtn) {
        whatsappBtn.style.opacity = '1';
        whatsappBtn.style.visibility = 'visible';
        whatsappBtn.style.pointerEvents = 'auto';
      }
    };
  }, [mobileMenuOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setProfileOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Supabase auth subscription
  useEffect(() => {
    const checkAdmin = async (sessionUser) => {
      if (!sessionUser) {
        setIsAdmin(false);
        return;
      }
      if (sessionUser.email === 'admin@asmaonline.in') {
        setIsAdmin(true);
        return;
      }
      const { data } = await supabase.from('admins').select('email').eq('email', sessionUser.email).single();
      setIsAdmin(!!data);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      const isDemo = localStorage.getItem('demoStudent') === 'true';
      setUser(session?.user ?? (isDemo ? { email: 'student@advaitacademy.com' } : null));
      checkAdmin(session?.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const isDemo = localStorage.getItem('demoStudent') === 'true';
      setUser(session?.user ?? (isDemo ? { email: 'student@advaitacademy.com' } : null));
      checkAdmin(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('demoStudent');
    await supabase.auth.signOut();
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);

    if (newLang === 'hi') {
      document.cookie = "googtrans=/en/hi; path=/;";
      document.cookie = "googtrans=/en/hi; domain=" + window.location.hostname + "; path=/;";

      const selectField = document.querySelector('.goog-te-combo');
      if (selectField) {
        selectField.value = 'hi';
        selectField.dispatchEvent(new Event('change'));
        setTimeout(() => setMobileMenuOpen(false), 200);
      } else {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          const combo = document.querySelector('.goog-te-combo');
          if (combo) {
            combo.value = 'hi';
            combo.dispatchEvent(new Event('change'));
            clearInterval(interval);
          } else if (attempts > 10) {
            clearInterval(interval);
          }
        }, 100);
      }
    } else {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + window.location.hostname + "; path=/;";
      document.cookie = "googtrans=/en/en; path=/;";
      document.cookie = "googtrans=/en/en; domain=" + window.location.hostname + "; path=/;";

      let reverted = false;

      try {
        const iframe = document.getElementById(':1.container') || document.querySelector('.goog-te-banner-frame');
        if (iframe) {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          const restoreBtn = doc?.getElementById(':1.restore') || doc?.querySelector('.goog-te-button button');
          if (restoreBtn) {
            restoreBtn.click();
            reverted = true;
          }
        }
      } catch {}

      const selectField = document.querySelector('.goog-te-combo');
      if (selectField) {
        selectField.selectedIndex = 0;
        selectField.value = '';
        selectField.dispatchEvent(new Event('change'));
        reverted = true;
      }

      setTimeout(() => setMobileMenuOpen(false), 200);

      if (!reverted) {
        window.location.reload();
      }
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'analysis', label: 'Analysis', path: '/analysis' },
    { id: 'services', label: 'Services', path: '/services' },
    { id: 'courses', label: 'Courses', path: '/courses' },
    { id: 'gallery', label: 'Gallery', path: '/gallery' },
    { id: 'blog', label: 'Blog', path: '/blog' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (_targetPath) => {
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      const prevBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;

      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        document.documentElement.style.scrollBehavior = prevBehavior;
      });
    }
  };

  const isHomePage = location.pathname === '/' || location.pathname === '';
  const isAboutPage = location.pathname === '/about';
  const isAnalysisPage = location.pathname === '/analysis' || location.pathname === '/analysis/';
  const isServicesPage = location.pathname === '/services' || location.pathname === '/services/';
  const isServiceDetailPage = location.pathname.startsWith('/service/');
  const isCoursesPage = location.pathname === '/courses' || location.pathname === '/courses/';
  const isGalleryPage = location.pathname === '/gallery' || location.pathname === '/gallery/';
  const isBlogPage = location.pathname === '/blog' || location.pathname === '/blog/';
  const isBlogDetailPage = location.pathname.startsWith('/blog/');
  const isContactPage = location.pathname === '/contact' || location.pathname === '/contact/';
  const isTransparentAtTop = isHomePage || isAboutPage || isAnalysisPage || isServicesPage || isServiceDetailPage || isCoursesPage || isGalleryPage || isBlogPage || isBlogDetailPage || isContactPage;
  const isNavSolid = !isAtTop || !isTransparentAtTop;
  const isDarkContent = isNavSolid || isAboutPage || isAnalysisPage || isServicesPage || isServiceDetailPage || isCoursesPage || isGalleryPage || isBlogPage || isBlogDetailPage || isContactPage || mobileMenuOpen;
  const isHeaderSolid = isNavSolid || mobileMenuOpen;

  // Always keep navbar visible when mobile menu is open, or at top, or scrolling up
  const shouldShow = isVisible || mobileMenuOpen || isAtTop;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[60] flex flex-col transition-transform duration-300 ease-out will-change-transform ${
        shouldShow ? 'translate-y-0' : '-translate-y-full'
      } ${
        isHeaderSolid
          ? 'bg-[#FAF9F5] shadow-[0_2px_12px_rgba(11,33,23,0.06)] border-b border-[#0B2117]/10'
          : 'bg-transparent border-transparent shadow-none'
      }`}
    >
      {/* Announcement Bar: Visible ONLY at the top */}
      <div
        className={`transition-[max-height,opacity] duration-200 ease-out overflow-hidden ${
          isAtTop && !mobileMenuOpen ? 'max-h-9 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <NotificationScroller />
      </div>

      {/* Main Nav Container */}
      <nav
        className={`w-full px-4 md:px-8 lg:px-12 flex items-center transition-[padding,min-height] duration-200 ease-out ${
          !isAtTop ? 'py-1 lg:py-1.5 min-h-[68px] lg:min-h-[82px]' : 'py-1.5 md:py-2 lg:py-2.5'
        }`}
      >
        <div className="container mx-auto flex justify-between items-center gap-3 lg:gap-6 px-1 md:px-0 w-full">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-none">
            <Link to="/" onClick={() => handleNavClick('/')} className="cursor-pointer touch-manipulation flex items-center">
              <img
                src={isDarkContent ? "/logo-dark.png" : "/logo.png"}
                alt="Advait Stock Market Academy Logo"
                className={`flex-none w-auto object-contain transition-[height] duration-200 ease-out origin-left scale-100 will-change-transform ${
                  !isAtTop ? 'h-[52px] sm:h-[58px] lg:h-[74px] xl:h-[78px]' : 'h-[64px] sm:h-[76px] md:h-[88px] lg:h-[98px] xl:h-[108px]'
                }`}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                style={{ display: 'none' }}
                className="flex-none w-10 h-10 md:w-12 md:h-12 bg-accent-primary rounded-full items-center justify-center text-bg-primary font-bold text-lg md:text-xl font-display shadow-lg"
              >
                A
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-7 font-sans font-medium text-[15px] tracking-normal">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`transition-colors relative py-1 ${
                  activeSection === link.id
                    ? 'text-[#D4AF37] font-semibold'
                    : `${isDarkContent ? 'text-[#0B2117]' : 'text-white/95'} hover:text-[#D4AF37]`
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Action Buttons & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`notranslate hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] font-sans font-medium text-xs transition-colors border cursor-pointer ${
                isDarkContent
                  ? 'bg-[#F2F5F3] hover:bg-gray-200 text-[#0B2117] border-[#0B2117]/15'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/25 backdrop-blur-sm'
              }`}
              title="Toggle Language (English / Hindi)"
              translate="no"
            >
              <svg className="w-3.5 h-3.5 notranslate" translate="no" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="notranslate" translate="no">
                {lang === 'en' ? 'Hindi' : 'English'}
              </span>
            </button>

            {/* Secondary Action: Login or Profile */}
            {user ? (
              <div className="relative group hidden sm:block" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center gap-1.5 p-1 pr-2 sm:pr-2.5 rounded-[4px] border transition-all shadow-sm hover:shadow cursor-pointer ${
                    isDarkContent
                      ? 'bg-white hover:bg-gray-50 border-gray-200'
                      : 'bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm'
                  }`}
                  title={user.email || user.phone}
                >
                  <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-[11px] sm:text-xs shadow-inner shrink-0">
                    {(user.email || user.phone || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className={`hidden xl:inline text-xs font-semibold max-w-[65px] 2xl:max-w-[85px] truncate ${isDarkContent ? 'text-text-primary' : 'text-white'}`}>
                    {user.email ? user.email.split('@')[0] : user.phone}
                  </span>
                  <svg className={`w-3 h-3 transition-transform duration-300 shrink-0 ${isDarkContent ? 'text-text-secondary' : 'text-white/80'} ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Desktop Dropdown Menu */}
                <div className={`absolute right-0 mt-3 w-56 bg-white rounded-[4px] shadow-2xl border border-text-primary/5 overflow-hidden transition-all duration-200 origin-top-right ${profileOpen ? 'scale-100 opacity-100 visible translate-y-0' : 'scale-95 opacity-0 invisible -translate-y-2'}`}>
                  <div className="px-4 py-4 bg-bg-secondary/30 border-b border-text-primary/5">
                    <div className="text-xs font-bold text-text-primary truncate">{user.email || user.phone}</div>
                    <div className={`text-[10px] ${isAdmin ? 'text-blue-600' : 'text-accent-primary'} uppercase tracking-widest font-black mt-1 flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-blue-600' : 'bg-accent-primary'} animate-pulse`} />
                      {isAdmin ? 'ADMINISTRATOR' : 'ACTIVE STUDENT'}
                    </div>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    <Link to={isAdmin ? "/admin/courses" : "/dashboard"} onClick={() => setProfileOpen(false)} className="px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 rounded-[4px] transition-colors flex items-center gap-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                    </Link>
                    <button onClick={() => { handleLogout(); setProfileOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-[4px] transition-colors flex items-center gap-3 cursor-pointer">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => handleNavClick('/login')}
                className={`hidden lg:inline-flex items-center px-4 py-2 rounded-[4px] font-sans font-semibold text-[13px] sm:text-[14px] transition-all duration-200 whitespace-nowrap border ${
                  isDarkContent
                    ? 'text-[#0B2117] border-[#0B2117]/25 hover:border-[#0B2117] hover:bg-[#0B2117]/5'
                    : 'text-white border-white/35 hover:border-white hover:bg-white/10'
                }`}
              >
                Login
              </Link>
            )}

            {/* Primary Action: Inquire Now */}
            <a
              href="tel:09156953895"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 md:px-5 py-2 md:py-2.5 bg-[#D4AF37] hover:bg-[#c29d2b] text-[#0B2117] rounded-[4px] font-sans font-semibold text-[13px] sm:text-[14px] shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap"
            >
              <span>Inquire Now</span>
            </a>

            {/* Hamburger Icon for Mobile & Tablet */}
            <button
              className={`lg:hidden p-2 focus:outline-none touch-manipulation transition-colors cursor-pointer ${
                isDarkContent ? 'text-[#0B2117]' : 'text-white'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Dropdown Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-[#FAF9F5] shadow-2xl transition-all duration-[250ms] ease-out overflow-y-auto ${
            mobileMenuOpen ? 'max-h-[calc(100vh-60px)] border-b border-gray-200 opacity-100 visible' : 'max-h-0 border-transparent opacity-0 invisible pointer-events-none'
          }`}
        >
          <div className="flex flex-col gap-2 px-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`py-3 text-base font-sans font-semibold transition-colors border-b border-gray-100 flex items-center justify-between ${
                  activeSection === link.id ? 'text-[#D4AF37]' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>{link.label}</span>
                {activeSection === link.id && (
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                )}
              </Link>
            ))}

            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="notranslate flex items-center justify-center gap-2 mt-3 w-full py-3 bg-[#F2F5F3] hover:bg-gray-200 text-text-primary rounded-[4px] font-sans font-semibold tracking-wide text-xs transition-colors border border-gray-200 text-center cursor-pointer"
              translate="no"
            >
              <svg className="w-4 h-4 notranslate" translate="no" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="notranslate" translate="no">
                Switch to {lang === 'en' ? 'Hindi' : 'English'}
              </span>
            </button>

            {/* Mobile Auth / Profile */}
            {user ? (
              <div className="mt-2 w-full bg-white rounded-[4px] border border-gray-200 overflow-hidden shadow-sm flex-shrink-0">
                <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 bg-gray-50">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-sm shadow-inner">
                    {(user.email || user.phone || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold text-text-primary truncate">{user.email || user.phone}</div>
                    <div className={`text-[10px] ${isAdmin ? 'text-blue-600' : 'text-accent-primary'} uppercase tracking-widest font-black mt-0.5`}>{isAdmin ? 'ADMINISTRATOR' : 'ACTIVE STUDENT'}</div>
                  </div>
                </div>
                <div className="flex flex-col p-1">
                  <Link to={isAdmin ? "/admin/courses" : "/dashboard"} onClick={() => handleNavClick(isAdmin ? "/admin/courses" : "/dashboard")} className="px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-accent-primary hover:bg-gray-50 rounded-[4px] transition-colors flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-[4px] transition-colors flex items-center gap-3 text-left cursor-pointer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => handleNavClick('/login')}
                className="mt-2 w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-[#0B2117] border border-gray-200 rounded-[4px] font-sans font-semibold tracking-wide text-xs transition-colors text-center inline-block flex-shrink-0"
              >
                Login
              </Link>
            )}

            {/* Mobile Primary Action: Inquire Now */}
            <a
              href="tel:09156953895"
              className="mt-1 mb-4 w-full py-3.5 bg-[#D4AF37] hover:bg-[#c29d2b] text-[#0B2117] rounded-[4px] font-sans font-semibold tracking-wider text-xs shadow-md transition-all text-center inline-block flex-shrink-0"
            >
              Inquire Now
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default TopNav;