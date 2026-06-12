import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Link, useParams } from 'react-router-dom';
import shubhangiImg from './assets/shubhangi.png';
import krishnaImg from './assets/krishna.png';
import vrushaliImg from './assets/vrushali.png';
import aiFounderImg from './assets/ai_founder_advait_centered.png';
import { blogPosts } from './blogData';
import { supabase } from './supabaseClient';

const PhoneNumber = ({ number }) => {
  const [lang, setLang] = React.useState('en');
  React.useEffect(() => {
    if (document.cookie.includes('googtrans=/en/hi')) {
      setLang('hi');
    }
  }, []);

  if (lang === 'en') return <>{number}</>;

  const hindiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  const hindiNumber = number.toString().split('').map(char => {
    if (/[0-9]/.test(char)) return hindiDigits[parseInt(char)];
    return char;
  }).join('');
  return <span className="translate-no" translate="no">{hindiNumber}</span>;
};

const TopNav = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [lang, setLang] = React.useState('en');
  const [user, setUser] = React.useState(null);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const location = useLocation();

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
    { id: 'analysis', label: 'Analysis', path: '/analysis' },
    { id: 'about', label: 'About', path: '/about' },
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
      <div className={`bg-text-primary text-bg-primary text-center px-4 md:text-[11px] font-bold tracking-widest uppercase transition-all duration-500 overflow-hidden ${isNavSolid ? 'max-h-0 opacity-0 py-0 text-[0px]' : 'max-h-16 opacity-100 py-1.5 text-[9px]'}`}>
        India's Biggest & Most Experienced Stock Market Academy of Central India
      </div>
      <nav className="w-full py-3 md:py-4 px-6 md:px-16 lg:px-24 transition-all duration-500">
        <div className="container mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <img src={isNavSolid ? "/logo-dark.png" : "/logo.png"} alt="Advait Stock Market Academy Logo" className={`w-auto h-16 md:h-24 object-contain drop-shadow-md transition-transform duration-500 ease-in-out origin-left ${isNavSolid ? 'scale-80' : 'scale-100'}`} onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }} />
            <div style={{ display: 'none' }} className="w-10 h-10 md:w-12 md:h-12 bg-accent-primary rounded-full items-center justify-center text-bg-primary font-bold text-lg md:text-xl font-display shadow-lg">A</div>
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
              className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-text-primary rounded-full font-bold text-xs transition-colors border border-gray-200"
              title="Toggle Language (English / Hindi)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
              {lang === 'en' ? 'HI' : 'EN'}
            </button>

            {user ? (
              <div className="relative group" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 md:gap-2 p-1 pr-2 md:pr-3 bg-white hover:bg-gray-50 rounded-full border border-gray-200 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-inner">
                    {(user.email || user.phone || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-xs font-bold text-text-primary max-w-[80px] md:max-w-[100px] truncate">
                    {user.email ? user.email.split('@')[0] : user.phone}
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
              <Link to="/login" className="px-4 py-2 md:px-6 md:py-3 bg-accent-primary text-text-primary rounded-full font-bold tracking-widest text-[10px] md:text-xs hover:bg-white transition-all shadow-lg shadow-accent-primary/20 whitespace-nowrap border border-accent-primary hover:border-text-primary/10 hover:shadow-xl hover:-translate-y-0.5">
                Login
              </Link>
            )}

            <a href="tel:09156953895" className="hidden lg:block px-6 py-3 bg-text-primary text-bg-primary rounded-full font-bold tracking-widest text-xs hover:bg-accent-primary transition-all shadow-lg shadow-text-primary/10 whitespace-nowrap">
              Inquire Now
            </a>

            {/* Hamburger Icon for Mobile */}
            <button
              className="md:hidden text-text-primary p-2 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
              Call Now
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

const HeroAsymmetric = () => (
  <section id="home" className="min-h-[100svh] relative overflow-hidden flex items-center pt-32 md:pt-40 pb-12 md:pb-24 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1920")' }}>
    {/* Dark/Blur Overlay for Background Image */}
    <div className="absolute inset-0 bg-bg-primary/90 md:bg-bg-primary/80 backdrop-blur-[2px] z-0"></div>

    {/* Animated Background Elements */}
    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }}></div>
    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-secondary/10 rounded-full blur-[150px] mix-blend-multiply animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>

    <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center pt-8 md:pt-12">

      {/* Left Content Area */}
      <div className="space-y-8 md:space-y-10 relative z-20">

        {/* Floating Interactive Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 border border-accent-primary/30 rounded-full text-accent-primary text-xs font-bold tracking-widest uppercase bg-white/40 backdrop-blur-md shadow-lg shadow-accent-primary/10 hover:shadow-accent-primary/30 hover:-translate-y-1 transition-all cursor-default group">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-primary group-hover:bg-accent-secondary transition-colors"></span>
          </span>
          Learn, Explore & Be Wealthy...
        </div>

        {/* Premium Gradient Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold leading-[1.1] drop-shadow-sm tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-text-primary via-text-primary to-text-secondary">
          Advait Stock <br /> Market Academy
        </h1>

        {/* Modern Accent Line */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-1.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"></div>
          <div className="w-4 h-1.5 bg-accent-secondary rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-accent-secondary/50 rounded-full"></div>
        </div>

        {/* Description */}
        <p className="text-xl text-text-secondary max-w-lg font-light leading-relaxed border-l-4 border-accent-primary/20 pl-6 py-2">
          Empowering your financial future with expert stock market training and comprehensive insurance solutions for a secure and confident tomorrow.
        </p>

        {/* Interactive Button Group */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-4">
          <a href="#contact-form" className="relative group px-8 sm:px-10 py-4 sm:py-5 bg-text-primary text-bg-primary font-bold uppercase tracking-widest text-sm rounded-2xl overflow-hidden shadow-2xl hover:shadow-text-primary/40 transition-all hover:-translate-y-1 w-full sm:w-auto text-center">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center gap-3">
              Contact Us
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </a>

          <a href="#courses" className="text-text-primary font-bold text-sm tracking-widest uppercase hover:text-accent-primary transition-colors flex items-center justify-center gap-2 group w-full sm:w-auto mt-2 sm:mt-0">
            Explore Courses
            <div className="w-8 h-px bg-text-primary group-hover:w-12 group-hover:bg-accent-primary transition-all"></div>
          </a>
        </div>
      </div>

      {/* Right Image Area with Floating Glassmorphism Cards */}
      <div className="relative h-[400px] sm:h-[450px] md:h-[650px] flex items-center justify-center perspective-1000 mt-8 md:mt-0 w-full mb-10 md:mb-0">
        <div className="relative w-full h-full flex items-center justify-center transform-style-3d group scale-[0.85] sm:scale-100">

          {/* Back Glowing Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-accent-primary to-accent-secondary rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 z-0 animate-pulse" style={{ animationDuration: '4s' }}></div>

          {/* Main Image */}
          <div className="relative z-10 p-2 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md rounded-full shadow-[0_0_40px_rgba(0,0,0,0.1)] border border-white/50 group-hover:shadow-[0_0_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:scale-[1.02]">
            <img loading="lazy" src={aiFounderImg} alt="Advait Stock Market Academy Founder" className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] object-cover rounded-full border-4 border-bg-primary bg-bg-secondary object-center" />
          </div>

          {/* Floating Card 1: Experience Badge */}
          <div className="absolute top-0 sm:top-10 right-0 sm:right-4 md:-right-8 w-48 sm:w-64 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[20px] sm:rounded-3xl shadow-2xl p-4 sm:p-6 z-20 transform translate-y-4 group-hover:-translate-y-2 transition-transform duration-700 delay-100 hover:scale-105">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-accent-primary mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <div className="font-display text-xl sm:text-2xl font-bold text-text-primary">20<span className="font-black">+</span> Years</div>
            <div className="text-[10px] sm:text-xs text-text-secondary uppercase tracking-widest font-bold mt-1">Market Experience</div>
          </div>

          {/* Floating Card 2: Live Analysis */}
          <div className="absolute bottom-4 sm:bottom-10 left-0 sm:left-4 md:-left-8 w-56 sm:w-72 bg-bg-secondary/80 backdrop-blur-xl border border-text-primary/10 rounded-[20px] sm:rounded-3xl shadow-2xl p-4 sm:p-6 z-20 transform -translate-y-4 group-hover:translate-y-2 transition-transform duration-700 delay-200 hover:scale-105">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div>
                <div className="font-display text-base sm:text-xl font-bold text-text-primary">Live Analysis</div>
                <div className="text-[9px] sm:text-xs text-accent-primary font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent-primary animate-pulse"></span> Active Market
                </div>
              </div>
              <div className="text-text-primary font-bold font-sans text-sm sm:text-base">+24.5%</div>
            </div>

            {/* Mini Chart Mockup */}
            <div className="flex items-end gap-1 sm:gap-1.5 h-12 sm:h-16 mt-3 sm:mt-4">
              {[40, 55, 30, 70, 45, 90, 65, 100].map((height, i) => (
                <div key={i} className="w-full bg-gradient-to-t from-accent-primary to-accent-secondary rounded-t-sm transition-all duration-1000 hover:brightness-125" style={{ height: `${height}%`, transitionDelay: `${i * 100}ms` }}></div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
);


const PageHero = ({ title, subtitle, image, tag }) => (
  <section className="relative w-full pt-36 pb-16 md:pt-48 md:pb-20 flex items-center justify-center overflow-hidden border-b border-text-primary/10 shadow-sm">
    <div
      className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url('${image}')` }}
    ></div>

    {/* Strong dark overlay to guarantee white text visibility against complex charts */}
    <div className="absolute inset-0 bg-black/75"></div>

    <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto animate-fadeInUp">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white font-bold tracking-widest uppercase text-[10px] md:text-xs mb-4 border border-white/20 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        {tag || "Advait Stock Market Academy"}
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white tracking-widest mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,1)] uppercase">
        {title}
      </h1>
      <p className="text-white/90 text-sm md:text-base font-medium max-w-xl mx-auto drop-shadow-md">
        {subtitle}
      </p>
    </div>
  </section>
);


const MultiChartSection = () => {
  const [isVisible, setIsVisible] = React.useState(true);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only load once
        }
      },
      { rootMargin: '400px' } // Load when within 400px of scrolling into view
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="analysis" ref={sectionRef} className="py-10 md:py-16 relative overflow-hidden bg-bg-secondary/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-accent-primary/10 blur-[120px] rounded-full pointer-events-none mix-blend-multiply"></div>
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4 md:gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary font-bold tracking-widest uppercase text-xs mb-4">Real-Time Data</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-text-primary leading-tight font-bold">Advanced Multi-Chart <br className="hidden md:block" /> Analysis Hub</h2>
          </div>
          <p className="text-text-secondary font-light max-w-md">
            Monitor the pulse of the Indian markets with our professional 4-screen setup. Identify trends, track sectors, and make informed decisions instantly.
          </p>
        </div>

        {/* Emerald Glowing Border Wrapper */}
        <div className="relative mx-auto max-w-6xl rounded-[24px] p-1.5 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary shadow-[0_0_80px_rgba(17,82,52,0.2)] group transition-all duration-700 hover:shadow-[0_0_120px_rgba(17,82,52,0.4)]">

          {/* The 2x2 Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-[2px] bg-text-primary/10 rounded-[20px] overflow-hidden h-[600px] md:h-[800px] w-full">

            {/* Chart 1: SENSEX */}
            <div className="w-full h-full bg-white relative group/chart flex items-center justify-center border-b lg:border-b-0 lg:border-r border-text-primary/10">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg-secondary/5 z-0 animate-pulse">
                <div className="w-8 h-8 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
                <div className="text-text-secondary/50 font-bold tracking-widest text-[10px] uppercase">Loading Data...</div>
              </div>
              <div className="absolute top-4 left-4 z-20 font-bold font-sans text-sm text-text-primary pointer-events-none drop-shadow-sm bg-white/80 px-2 py-1 rounded backdrop-blur-sm">SENSEX</div>
              {isVisible && (
                <iframe
                  className="relative z-10 bg-white"
                  scrolling="no"
                  allowtransparency="true"
                  frameBorder="0"
                  src="https://s.tradingview.com/embed-widget/advanced-chart/?locale=en&theme=light&symbol=BSE%3ASENSEX&interval=D&timezone=Asia%2FKolkata&hide_top_toolbar=1&hide_legend=1&save_image=0&enable_publishing=0&backgroundColor=rgba(255,255,255,1)"
                  style={{ boxSizing: 'border-box', height: '100%', width: '100%' }}>
                </iframe>
              )}
              <a href="https://in.tradingview.com/chart/?symbol=BSE%3ASENSEX" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 z-20 bg-[#166534] text-white text-xs font-bold px-3 py-2 rounded shadow-lg hover:bg-[#0f4523] transition-all flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                View Live 1-Min Chart
              </a>
            </div>

            {/* Chart 2: NIFTY 50 (via NIFTYBEES ETF) */}
            <div className="w-full h-full bg-white relative group/chart flex items-center justify-center border-b lg:border-b-0 border-text-primary/10">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg-secondary/5 z-0 animate-pulse">
                <div className="w-8 h-8 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
                <div className="text-text-secondary/50 font-bold tracking-widest text-[10px] uppercase">Loading Data...</div>
              </div>
              <div className="absolute top-4 left-4 z-20 font-bold font-sans text-sm text-text-primary pointer-events-none drop-shadow-sm bg-white/80 px-2 py-1 rounded backdrop-blur-sm">NIFTY 50</div>
              {isVisible && (
                <iframe
                  className="relative z-10 bg-white"
                  scrolling="no"
                  allowtransparency="true"
                  frameBorder="0"
                  src="https://s.tradingview.com/embed-widget/advanced-chart/?locale=en&theme=light&symbol=BSE%3ANIFTYBEES&interval=D&timezone=Asia%2FKolkata&hide_top_toolbar=1&hide_legend=1&save_image=0&enable_publishing=0&backgroundColor=rgba(255,255,255,1)"
                  style={{ boxSizing: 'border-box', height: '100%', width: '100%' }}>
                </iframe>
              )}
              <a href="https://in.tradingview.com/chart/?symbol=NSE%3ANIFTY" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 z-20 bg-[#166534] text-white text-xs font-bold px-3 py-2 rounded shadow-lg hover:bg-[#0f4523] transition-all flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                View Live 1-Min Chart
              </a>
            </div>

            {/* Chart 3: BANK NIFTY (via BANKBEES ETF) */}
            <div className="w-full h-full bg-white relative group/chart flex items-center justify-center border-b lg:border-b-0 lg:border-r lg:border-t border-text-primary/10">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg-secondary/5 z-0 animate-pulse">
                <div className="w-8 h-8 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
                <div className="text-text-secondary/50 font-bold tracking-widest text-[10px] uppercase">Loading Data...</div>
              </div>
              <div className="absolute top-4 left-4 z-20 font-bold font-sans text-sm text-text-primary pointer-events-none drop-shadow-sm bg-white/80 px-2 py-1 rounded backdrop-blur-sm">BANK NIFTY</div>
              {isVisible && (
                <iframe
                  className="relative z-10 bg-white"
                  scrolling="no"
                  allowtransparency="true"
                  frameBorder="0"
                  src="https://s.tradingview.com/embed-widget/advanced-chart/?locale=en&theme=light&symbol=BSE%3ABANKBEES&interval=D&timezone=Asia%2FKolkata&hide_top_toolbar=1&hide_legend=1&save_image=0&enable_publishing=0&backgroundColor=rgba(255,255,255,1)"
                  style={{ boxSizing: 'border-box', height: '100%', width: '100%' }}>
                </iframe>
              )}
              <a href="https://in.tradingview.com/chart/?symbol=NSE%3ABANKNIFTY" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 z-20 bg-[#166534] text-white text-xs font-bold px-3 py-2 rounded shadow-lg hover:bg-[#0f4523] transition-all flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                View Live 1-Min Chart
              </a>
            </div>

            {/* Chart 4: NIFTY NXT 50 (via JUNIORBEES ETF) */}
            <div className="w-full h-full bg-white relative group/chart flex items-center justify-center lg:border-t border-text-primary/10">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg-secondary/5 z-0 animate-pulse">
                <div className="w-8 h-8 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
                <div className="text-text-secondary/50 font-bold tracking-widest text-[10px] uppercase">Loading Data...</div>
              </div>
              <div className="absolute top-4 left-4 z-20 font-bold font-sans text-sm text-text-primary pointer-events-none drop-shadow-sm bg-white/80 px-2 py-1 rounded backdrop-blur-sm">NIFTY NXT 50</div>
              {isVisible && (
                <iframe
                  className="relative z-10 bg-white"
                  scrolling="no"
                  allowtransparency="true"
                  frameBorder="0"
                  src="https://s.tradingview.com/embed-widget/advanced-chart/?locale=en&theme=light&symbol=BSE%3AJUNIORBEES&interval=D&timezone=Asia%2FKolkata&hide_top_toolbar=1&hide_legend=1&save_image=0&enable_publishing=0&backgroundColor=rgba(255,255,255,1)"
                  style={{ boxSizing: 'border-box', height: '100%', width: '100%' }}>
                </iframe>
              )}
              <a href="https://in.tradingview.com/chart/?symbol=NSE%3ANIFTYNXT50" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 z-20 bg-[#166534] text-white text-xs font-bold px-3 py-2 rounded shadow-lg hover:bg-[#0f4523] transition-all flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                View Live 1-Min Chart
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = ({ hideExploreButton = false }) => {
  const features = [
    {
      title: "Technical Analysis",
      subtitle: "Advanced Charts",
      icon: <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
    },
    {
      title: "Smart Money Concept",
      subtitle: "Institutional Trading",
      icon: <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      title: "Intraday & Swing",
      subtitle: "Live Execution",
      icon: <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
      title: "Risk Management",
      subtitle: "Capital Protection",
      icon: <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
  ];

  const checklist = [
    "Minimal fees with installment facility",
    "Free lifetime repeat classes",
    "Guaranteed lifetime support",
    "Trusted by thousands of satisfied students"
  ];

  return (
    <section id="about" className="py-8 md:py-12 relative bg-bg-secondary/10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-block px-5 py-2 rounded-full bg-white border border-accent-primary/20 text-accent-primary font-bold tracking-widest uppercase text-xs mb-6 shadow-sm">
            Live Market Trading Education
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight">
            Master the Market with <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Confidence</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

          {/* Box 1: The Image & Experience (Spans 1 col, 2 rows on large screens) */}
          <div className="lg:col-span-1 lg:row-span-2 relative rounded-[32px] overflow-hidden shadow-2xl group min-h-[400px] lg:min-h-full border border-white/50">
            <img loading="lazy"
              src="/founder.jpg"
              alt="Advait Academy Leadership"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/95 via-text-primary/40 to-transparent"></div>

            <div className="absolute bottom-8 left-8 right-8 transform group-hover:-translate-y-2 transition-transform duration-500">
              <div className="flex items-end gap-2 mb-2">
                <div className="text-7xl font-display font-bold text-[#FFD700] leading-none drop-shadow-[0_4px_15px_rgba(255,215,0,0.4)]">20<span className="text-6xl font-black text-[#FFD700] drop-shadow-[0_4px_10px_rgba(255,215,0,0.4)] ml-1">+</span></div>
              </div>
              <div className="text-white/90 text-xl font-display italic font-light tracking-wide">Years of Real Market Experience</div>
            </div>
          </div>

          {/* Box 2: The Core Message */}
          <div className="lg:col-span-2 rounded-[32px] bg-white border border-text-primary/5 p-8 md:p-12 shadow-lg flex flex-col justify-center relative overflow-hidden group hover:border-accent-primary/30 transition-colors duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-secondary/10 rounded-full blur-[80px] group-hover:bg-accent-primary/20 transition-colors duration-700"></div>
            <h3 className="text-2xl md:text-4xl font-display font-bold text-text-primary mb-6 relative z-10 leading-snug">
              Central India's Most Experienced Stock Market Academy
            </h3>
            <p className="text-text-secondary text-lg leading-relaxed relative z-10">
              Designed for <strong className="text-text-primary font-bold">beginners to professional traders</strong>, we teach strictly in live markets. Our disciplined, confidence-driven strategies ensure practical learning that translates to real-world success.
            </p>
          </div>

          {/* Box 3: The 4 Features (Grid inside Grid) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="relative bg-white rounded-[24px] p-4 md:p-5 border border-text-primary/5 shadow-sm hover:border-accent-primary/30 hover:shadow-[0_10px_20px_rgba(17,82,52,0.06)] transition-all duration-300 overflow-hidden group flex items-center gap-4 cursor-default">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-primary/5 rounded-full blur-[20px] group-hover:bg-accent-primary/15 group-hover:scale-125 transition-all duration-500 pointer-events-none -mr-8 -mt-8"></div>

                <div className="w-12 h-12 rounded-[14px] bg-bg-secondary border border-text-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-sm group-hover:border-accent-primary/20 transition-all duration-300 relative z-10">
                  {feature.icon}
                </div>

                <div className="relative z-10">
                  <div className="font-bold text-text-primary text-sm md:text-base mb-0.5 group-hover:text-accent-primary transition-colors duration-300">
                    {feature.title}
                  </div>
                  <div className="text-text-secondary text-[10px] uppercase tracking-wider font-semibold group-hover:text-accent-primary/80 transition-colors duration-300">
                    {feature.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Box 4: Checklist & CTA (Spans all columns) */}
          <div className="lg:col-span-3 rounded-[32px] bg-text-primary p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 shadow-2xl relative overflow-hidden mt-2">
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-accent-primary rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 w-full md:w-2/3 relative z-10">
              {checklist.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <div className="w-7 h-7 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0 border border-accent-primary/30">
                    <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-white/90 font-medium text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <div className="w-full md:w-1/3 flex flex-col justify-center items-center md:items-end relative z-10 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10 h-full">
              {!hideExploreButton ? (
                <Link to="/about" className="px-8 py-4 bg-accent-primary text-text-primary font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all w-full text-center shadow-lg shadow-accent-primary/20 hover:scale-105 active:scale-95">
                  Explore More
                </Link>
              ) : (
                <a href="tel:09156953895" className="px-8 py-4 bg-accent-primary text-text-primary font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all w-full text-center shadow-lg shadow-accent-primary/20 hover:scale-105 active:scale-95">
                  Call Now: <PhoneNumber number="09156953895" />
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const MissionVisionSection = () => (
  <section className="py-10 md:py-16 bg-bg-secondary/10 relative">
    <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">

      {/* 2x2 Checkerboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-[40px] overflow-hidden shadow-2xl border border-white/50">

        {/* Row 1: Mission (Text Left, Image Right) */}
        <div className="bg-white p-8 lg:p-12 flex flex-col justify-center relative group">
          <h3 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4 leading-tight tracking-tight">
            Our Mission
          </h3>
          <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-0">
            To empower individuals with practical, live-market trading education. We aim to break the myths of the stock market and provide structured, risk-managed strategies that create consistent, independent traders.
          </p>
        </div>

        <div className="h-full min-h-[300px] lg:min-h-[400px] relative bg-bg-secondary/20 overflow-hidden group">
          {/* Subtle color overlay to match theme */}
          <div className="absolute inset-0 bg-accent-primary/10 mix-blend-multiply z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
          <img loading="lazy"
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop"
            alt="Mission"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Row 2: Vision (Image Left, Text Right on Desktop) */}
        {/* We use order to switch them on mobile so images don't stack directly */}
        <div className="h-full min-h-[300px] lg:min-h-[400px] relative bg-bg-secondary/20 overflow-hidden group order-last md:order-none">
          {/* Subtle color overlay to match theme */}
          <div className="absolute inset-0 bg-accent-primary/10 mix-blend-multiply z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
          <img loading="lazy"
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop"
            alt="Vision"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="bg-white p-8 lg:p-12 flex flex-col justify-center relative group">
          <h3 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4 leading-tight tracking-tight">
            Our Vision
          </h3>
          <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-0">
            To be Central India's most trusted financial education platform, fostering a community of financially literate and disciplined investors who can confidently navigate and profit from global markets.
          </p>
        </div>

      </div>

    </div>
  </section>
);

const CoreValuesSection = () => {
  const values = [
    {
      title: "Integrity",
      desc: "We believe in transparent, honest education without false promises. We teach the absolute reality of the markets.",
      icon: <svg className="w-16 h-16 text-accent-primary mx-auto relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
    {
      title: "Practical Learning",
      desc: "Theory isn't enough. Our entire curriculum is based purely on live-market execution and real-world capital.",
      icon: <svg className="w-16 h-16 text-accent-primary mx-auto relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
    },
    {
      title: "Disciplined Approach",
      desc: "Success in trading stems from psychology. We instill strict risk management rules in all our students.",
      icon: <svg className="w-16 h-16 text-accent-primary mx-auto relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    },
    {
      title: "Financial Freedom",
      desc: "Our ultimate goal is to make you self-reliant, capable of navigating any market condition with confidence.",
      icon: <svg className="w-16 h-16 text-accent-primary mx-auto relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    }
  ];

  return (
    <section className="py-10 md:py-16 bg-white relative overflow-hidden">
      {/* Eye-catchy animated background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#115234_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>
      {/* Huge subtle glow behind the grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-accent-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">

        {/* Refined Heading */}
        <div className="text-center max-w-4xl mx-auto mb-20 relative">
          <div className="inline-block px-5 py-2 rounded-full bg-accent-primary/5 border border-accent-primary/10 text-accent-primary font-bold tracking-widest uppercase text-xs mb-8 shadow-sm">
            What Drives Us
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.1em] text-text-primary mb-6 font-display font-black">
            WE HAVE FAITH IN OUR <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">STUDENT FUTURE</span>
          </h2>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Our students are talented, hard-working and full of good ideas. We encourage and empower them to bring their ideas to life. Hands-on opportunities and live market execution are what we're all about.
          </p>
        </div>

        {/* Dynamic 4-Column Flat Grid with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 max-w-7xl mx-auto">
          {values.map((val, i) => (
            <div key={i} className="text-center flex flex-col items-center group relative p-6 rounded-3xl hover:bg-white hover:shadow-[0_20px_40px_rgba(17,82,52,0.08)] transition-all duration-500 cursor-default">

              {/* Icon Container with glowing background ring on hover */}
              <div className="mb-8 relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-accent-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
                {val.icon}
              </div>

              <h3 className="text-lg md:text-xl font-bold text-text-primary mb-4 tracking-wider group-hover:text-accent-primary transition-colors duration-300 relative">
                {val.title}
                {/* Underline effect that grows on hover */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent-secondary group-hover:w-12 transition-all duration-500"></div>
              </h3>

              <p className="text-text-secondary/80 text-sm leading-relaxed max-w-[250px] group-hover:text-text-secondary transition-colors duration-300 mt-2">
                {val.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};


const ServicesSection = () => {
  const services = [
    {
      title: "Share Market Training",
      desc: "In-depth courses on stock market investing, trading strategies, technical analysis and financial planning for beginners and advanced learners.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Stock Investment",
      desc: "Unlock your wealth potential with smart stock investments - guided strategies, expert insights and confident decisions for a secure financial future.",
      image: "https://images.pexels.com/photos/4386404/pexels-photo-4386404.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Mutual Fund Investment",
      desc: "Grow your wealth steadily with smart mutual fund investments - guided by experts for secure, diversified and goal-oriented financial success.",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <section id="services" className="py-10 md:py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4 md:gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-secondary/10 text-accent-primary font-bold tracking-widest uppercase text-xs mb-4 md:mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
              What We Do
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight">
              Our Premium <span className="text-accent-primary">Services</span>
            </h2>
          </div>
          <p className="text-text-secondary text-sm max-w-md font-light leading-relaxed mb-2 md:text-right">
            At Advait Stock Market Academy, we offer comprehensive services to help you grow financially and stay protected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-min md:auto-rows-[280px] mb-12 md:mb-16">
          <div className="md:col-span-2 md:row-span-2 relative rounded-[24px] md:rounded-[32px] overflow-hidden group cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-500 border border-text-primary/5 min-h-[350px] md:min-h-[400px]">
            <img loading="lazy" src={services[0].image} alt={services[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/95 via-text-primary/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between pointer-events-none">
              <Link to="/service/share-market-training" className="self-end pointer-events-auto overflow-hidden flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-accent-primary group-hover:border-accent-primary transition-all duration-500 shadow-xl h-14 w-14 group-hover:w-36 group-hover:px-4">
                <span className="text-white font-bold text-xs uppercase tracking-widest whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs group-hover:mr-2 transition-all duration-500">Read More</span>
                <svg className="w-6 h-6 text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <div>
                <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
                  Featured
                </div>
                <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 group-hover:text-accent-primary transition-colors duration-500">{services[0].title}</h3>
                <p className="text-white/80 font-light leading-relaxed text-base md:text-lg max-w-lg">{services[0].desc}</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-[32px] overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500 border border-text-primary/5">
            <img loading="lazy" src={services[1].image} alt={services[1].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/95 via-text-primary/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
              <Link to="/service/stock-investment" className="self-end pointer-events-auto overflow-hidden flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-accent-primary group-hover:border-accent-primary transition-all duration-500 shadow-xl h-10 w-10 group-hover:w-32 group-hover:px-4">
                <span className="text-white font-bold text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs group-hover:mr-2 transition-all duration-500">Read More</span>
                <svg className="w-5 h-5 text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 group-hover:text-accent-primary transition-colors duration-500">{services[1].title}</h3>
                <p className="text-white/80 font-light leading-relaxed text-sm line-clamp-3">{services[1].desc}</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-[32px] overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500 border border-text-primary/5">
            <img loading="lazy" src={services[2].image} alt={services[2].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/95 via-text-primary/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
              <Link to="/service/mutual-fund-investment" className="self-end pointer-events-auto overflow-hidden flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-accent-primary group-hover:border-accent-primary transition-all duration-500 shadow-xl h-10 w-10 group-hover:w-32 group-hover:px-4">
                <span className="text-white font-bold text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs group-hover:mr-2 transition-all duration-500">Read More</span>
                <svg className="w-5 h-5 text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 group-hover:text-accent-primary transition-colors duration-500">{services[2].title}</h3>
                <p className="text-white/80 font-light leading-relaxed text-sm line-clamp-3">{services[2].desc}</p>
              </div>
            </div>
          </div>

        </div>

        <div className="text-center">
          <a href="/services" className="inline-flex items-center gap-3 px-10 py-4 bg-text-primary text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-xl hover:bg-accent-primary transition-all hover:-translate-y-1 group">
            Explore All Services
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>

      </div>
    </section>
  );
};

const serviceData = [
  {
    id: "share-market-training",
    title: "Share Market Training",
    category: "Training",
    desc: "In-depth courses on stock market investing, trading strategies, technical analysis and financial planning for beginners and advanced learners.",
    image: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Our Share Market Training program is designed to equip you with the knowledge and skills needed to navigate the stock market confidently. Whether you are a beginner looking to understand the basics or an experienced trader seeking advanced strategies, this course covers everything from fundamental analysis to technical indicators and risk management.",
    benefits: ["Comprehensive Curriculum", "Live Market Sessions", "Expert Mentorship", "Practical Trading Strategies"]
  },
  {
    id: "stock-investment",
    title: "Stock Investment",
    category: "Investment",
    desc: "Unlock your wealth potential with smart stock investments - guided strategies, expert insights and confident decisions for a secure financial future.",
    image: "https://images.pexels.com/photos/4386404/pexels-photo-4386404.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Investing in stocks is one of the most effective ways to build long-term wealth. Our stock investment advisory service provides you with expert insights, carefully researched stock picks, and portfolio management strategies tailored to your financial goals and risk tolerance.",
    benefits: ["Personalized Portfolio Advice", "In-depth Market Research", "Regular Performance Reviews", "Risk Mitigation Strategies"]
  },
  {
    id: "mutual-fund-investment",
    title: "Mutual Fund Investment",
    category: "Investment",
    desc: "Grow your wealth steadily with smart mutual fund investments - guided by experts for secure, diversified and goal-oriented financial success.",
    image: "https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Mutual funds offer a hassle-free way to invest in a diversified portfolio managed by professionals. We help you choose the right mix of equity, debt, and hybrid funds based on your financial objectives, investment horizon, and risk appetite.",
    benefits: ["Diversified Investment", "Professional Fund Management", "Goal-Based Planning", "SIP and Lump Sum Options"]
  },
  {
    id: "fundamental-analysis",
    title: "Fundamental Analysis",
    category: "Analysis",
    desc: "We offer comprehensive courses on fundamental analysis, covering financial statement evaluation, business valuation, economic factors, and long-term investment strategies designed for both beginners and advanced learners.",
    image: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Fundamental analysis is the cornerstone of value investing. This course teaches you how to evaluate a company's intrinsic value by analyzing its financial statements, management quality, industry position, and macroeconomic factors. Learn to identify undervalued stocks for long-term growth.",
    benefits: ["Financial Statement Analysis", "Valuation Techniques", "Industry and Economic Analysis", "Identifying Value Stocks"]
  },
  {
    id: "psychological-training",
    title: "Psychological Training",
    category: "Training",
    desc: "Unlock your trading potential with strong market psychology—master emotional control, build discipline, and make confident, rational decisions for consistent success in the stock market",
    image: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Success in trading is 80% psychology and 20% strategy. Our psychological training program helps you overcome fear, greed, and emotional biases. Build the discipline and mental resilience required to execute trades confidently and consistently.",
    benefits: ["Emotional Control", "Developing Discipline", "Overcoming Biases", "Consistent Execution"]
  },
  {
    id: "technical-analysis",
    title: "Technical Analysis",
    category: "Analysis",
    desc: "Master chart patterns, technical indicators, and price action strategies to predict market movements and time your trades perfectly.",
    image: "https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Technical analysis empowers you to read the market's mind through price charts. Learn to identify trends, support and resistance levels, and use indicators like RSI and MACD. This course is essential for short-term traders and swing traders.",
    benefits: ["Chart Pattern Recognition", "Using Technical Indicators", "Price Action Trading", "Effective Entry & Exit Strategies"]
  },
  {
    id: "derivatives-trading",
    title: "Derivatives Trading",
    category: "Training",
    desc: "Master the art of Options and Futures trading with advanced strategies and risk management techniques for high-yield returns.",
    image: "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Take your trading to the next level with our comprehensive Derivatives Trading course. Learn how to leverage options and futures to hedge your portfolio, generate consistent income, and speculate on market movements with calculated risks.",
    benefits: ["Options Strategies", "Futures Hedging", "Risk Management", "High-Yield Techniques"]
  },
  {
    id: "portfolio-management",
    title: "Portfolio Management",
    category: "Investment",
    desc: "Expert portfolio management services to diversify your assets, minimize risks, and maximize long-term wealth creation.",
    image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Our Portfolio Management Services (PMS) cater to high-net-worth individuals and institutions. We create customized, diversified portfolios tailored to your specific financial goals, risk appetite, and investment horizon to ensure sustainable growth.",
    benefits: ["Customized Portfolios", "Active Monitoring", "Risk Minimization", "Wealth Maximization"]
  },
  {
    id: "quantitative-analysis",
    title: "Quantitative Analysis",
    category: "Analysis",
    desc: "Utilize mathematical and statistical modeling to evaluate market trends, asset valuation, and complex trading algorithms.",
    image: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Quantitative analysis relies on objective data rather than subjective judgment. Learn to build and test statistical models, analyze historical data, and develop algorithmic trading systems that can identify profitable opportunities automatically.",
    benefits: ["Statistical Modeling", "Algorithmic Trading", "Data-Driven Decisions", "Backtesting Strategies"]
  },
  {
    id: "health-insurance",
    title: "Health Insurance",
    category: "Insurance",
    desc: "Protect your health with plans from top insurers, offering medical coverage, hospitalization benefits and cashless treatment facilities nationwide.",
    image: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=800",
    fullDesc: "Medical emergencies can derail your financial planning. Our health insurance solutions offer comprehensive coverage against hospitalization expenses, critical illnesses, and pre/post-hospitalization care. We help you find policies with the best claim settlement ratios and extensive cashless hospital networks.",
    benefits: ["Cashless Treatment", "Comprehensive Coverage", "Critical Illness Protection", "Tax Benefits under Section 80D"]
  },
  {
    id: "term-insurance",
    title: "Term Insurance",
    category: "Insurance",
    desc: "Affordable term plans providing high life cover for a fixed period, ensuring your loved ones are financially protected in your absence.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
    fullDesc: "Secure your family's future with affordable term insurance plans. A term plan provides substantial financial protection to your dependents in case of your untimely demise, ensuring that their living standard and financial goals are not compromised.",
    benefits: ["High Life Cover at Low Premiums", "Financial Security for Dependents", "Optional Riders (Accidental/Critical)", "Tax Benefits under Section 80C"]
  },
  {
    id: "motor-insurance",
    title: "Motor Insurance",
    category: "Insurance",
    desc: "Get reliable motor insurance for bikes and cars, covering accidental damage, theft, third-party liability, and hassle-free claim processes.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800",
    fullDesc: "Protect your vehicle against accidents, theft, natural disasters, and third-party liabilities with our reliable motor insurance plans. We assist you in choosing policies that offer comprehensive coverage, cashless repairs, and hassle-free claim settlements.",
    benefits: ["Comprehensive and Third-Party Covers", "Cashless Garages Network", "No Claim Bonus (NCB) Protection", "Zero Depreciation Options"]
  },
  {
    id: "life-insurance",
    title: "Life Insurance",
    category: "Insurance",
    desc: "Lifelong protection and wealth-building investment benefits.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800",
    fullDesc: "Life insurance offers lifelong financial protection to your family along with wealth-building investment benefits. We offer a range of endowment and unit-linked plans customized for your long-term goals like children's education and retirement planning.",
    benefits: ["Lifelong Coverage", "Wealth Accumulation", "Guaranteed Returns Options", "Tax Benefits"]
  },
  {
    id: "travel-insurance",
    title: "Travel Insurance",
    category: "Insurance",
    desc: "Secure your trips against emergencies and baggage loss.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800",
    fullDesc: "Traveling abroad or domestically comes with uncertainties. Our travel insurance plans cover medical emergencies, trip cancellations, flight delays, and baggage loss, ensuring you have a worry-free journey anywhere in the world.",
    benefits: ["Emergency Medical Cover", "Trip Cancellation Protection", "Loss of Baggage/Passport", "24x7 Global Assistance"]
  },
  {
    id: "property-insurance",
    title: "Property Insurance",
    category: "Insurance",
    desc: "Safeguard properties against fire, theft, and natural disasters.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800",
    fullDesc: "Your home or commercial property is your biggest asset. Property insurance protects your building and its contents against damages caused by fire, theft, earthquakes, floods, and other unforeseen events, providing peace of mind.",
    benefits: ["Building and Content Cover", "Protection from Natural Calamities", "Burglary and Theft Protection", "Rent Loss Coverage"]
  }
];

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

const ServicesPageSection = () => {
  const [activeIdx, setActiveIdx] = React.useState(1);
  const [activeFilter, setActiveFilter] = React.useState('All');

  const allServices = serviceData.filter(s => s.category !== 'Insurance');
  const categories = ['All', ...new Set(allServices.map(s => s.category)), 'Insurance'];
  const filteredServices = activeFilter === 'All' ? allServices : allServices.filter(s => s.category === activeFilter);

  // Reset active index when filter changes if it's out of bounds
  React.useEffect(() => {
    if (activeIdx >= filteredServices.length) {
      setActiveIdx(0);
    }
  }, [activeFilter, activeIdx, filteredServices.length]);

  return (
    <section className="py-10 md:py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-secondary/10 text-accent-primary font-bold tracking-widest uppercase text-xs mb-4 md:mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
              What We Do
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight">
              Our Premium <span className="text-accent-primary">Services</span>
            </h2>
          </div>
          <div className="flex flex-col items-start lg:items-end max-w-sm lg:mt-12 text-left lg:text-right">
            <p className="text-text-primary text-base md:text-lg max-w-md font-medium leading-relaxed mb-2 md:text-right">
              At Advait Stock Market Academy, we offer comprehensive services to help you grow financially and stay protected.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-sm border whitespace-nowrap cursor-pointer ${activeFilter === category
                ? 'bg-text-primary text-white border-text-primary shadow-text-primary/20 hover:bg-accent-primary hover:border-accent-primary hover:shadow-accent-primary/20 hover:-translate-y-0.5'
                : 'bg-white text-text-secondary border-black/5 hover:border-accent-primary/50 hover:text-accent-primary hover:-translate-y-0.5'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredServices.map((service, idx) => (
              <div key={idx} className="relative rounded-[32px] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-text-primary/5 min-h-[350px] md:min-h-[420px]">
                <img loading="lazy" src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-accent-primary/20 backdrop-blur-md border border-accent-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                    <span className="text-accent-primary font-bold">{`0${idx + 1}`}</span>
                  </div>
                  
                  <div className="flex flex-col transform transition-all duration-500 translate-y-8 group-hover:translate-y-0">
                    <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-accent-primary transition-colors duration-500 leading-tight drop-shadow-lg">{service.title}</h3>
                    
                    <div className="overflow-hidden transition-all duration-500 max-h-0 opacity-0 group-hover:max-h-[150px] group-hover:opacity-100 group-hover:mt-2">
                      <p className="text-white/90 text-sm font-medium leading-relaxed drop-shadow-md mb-5">{service.desc}</p>
                      <Link to={`/service/${service.id}`} className="inline-flex items-center gap-2 px-6 py-2 bg-accent-primary text-text-primary text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white hover:-translate-y-1 transition-all shadow-[0_5px_15px_rgba(212,175,55,0.4)] w-fit">
                        Read More
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Insurance Orbit Section */}
        {(activeFilter === 'All' || activeFilter === 'Insurance') && (
          <div className={`${activeFilter === 'Insurance' ? 'mt-4 md:mt-8' : 'mt-12 md:mt-16'} mb-10 relative w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] to-[#F5F7F6] py-12 md:py-16 rounded-[40px] border border-text-primary/5 shadow-sm`}>
            {/* Mobile Layout (Vertical) */}
            <div className="lg:hidden px-6 flex flex-col gap-12">
              <div className="w-44 h-44 rounded-full bg-gradient-to-br from-[#1f8546] to-[#0f4523] mx-auto flex items-center justify-center shadow-[0_15px_40px_rgba(15,69,35,0.4)] relative border-[6px] border-white/20 backdrop-blur-sm">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)]"></div>
                <h2 className="text-3xl font-display font-black text-white drop-shadow-xl uppercase tracking-widest relative z-10">Insurance</h2>
              </div>

              <div className="flex flex-col gap-8 relative mt-6">
                <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-[#166534]/0 via-[#166534]/20 to-[#166534]/0"></div>
                {[
                  {
                    id: "health-insurance",
                    title: "Health Insurance",
                    desc: "Protect your health with plans from top insurers, offering medical coverage, hospitalization benefits and cashless treatment facilities nationwide.",
                    image: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=800",
                    num: "Part 01"
                  },
                  {
                    id: "term-insurance",
                    title: "Term Insurance",
                    desc: "Affordable term plans providing high life cover for a fixed period, ensuring your loved ones are financially protected in your absence.",
                    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
                    num: "Part 02"
                  },
                  {
                    id: "motor-insurance",
                    title: "Motor Insurance",
                    desc: "Get reliable motor insurance for bikes and cars, covering accidental damage, theft, third-party liability, and hassle-free claim processes.",
                    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800",
                    num: "Part 03"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col relative z-10 bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100/80">
                    <div className="flex gap-5 items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-white border-[3px] border-[#166534] p-1 shrink-0 shadow-md relative">
                        <img loading="lazy" src={item.image} alt={item.title} className="w-full h-full rounded-full object-cover" />
                      </div>
                      <div className="text-[#166534] font-bold tracking-[0.2em] uppercase text-xs bg-[#166534]/5 px-4 py-2 rounded-full border border-[#166534]/10">{item.num}</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-text-primary mb-3">{item.title}</h3>
                      <p className="text-text-secondary text-base leading-relaxed mb-4">{item.desc}</p>
                      <Link to={`/service/${item.id}`} className="inline-flex items-center gap-2 px-5 py-2 bg-[#166534] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-md w-fit">
                        Read More
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Layout (Curved Orbit) */}
            <div className="hidden lg:block relative w-full h-[850px] max-w-[1400px] mx-auto overflow-hidden">
              {/* Center Premium Green Circle */}
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
                <div className="w-[240px] h-[240px] rounded-full bg-gradient-to-br from-[#1f8546] to-[#0f4523] flex items-center justify-center shadow-2xl relative group cursor-pointer hover:scale-105 transition-all duration-700 border-[6px] border-white/20 backdrop-blur-md">
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
                  <h2 className="text-3xl font-display font-black text-white tracking-widest drop-shadow-xl uppercase relative z-10">Insurance</h2>
                </div>
              </div>

              {/* The Big Orbit Line - Dashed and softer */}
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border-[1.5px] border-dashed border-[#166534]/30 z-10 pointer-events-none"></div>

              {/* Item 1 */}
              <div className="absolute z-30 flex items-center group" style={{ left: 'calc(50% + 125px)', top: 'calc(50% - 216px)', transform: 'translate(-120px, -50%)' }}>
                <div className="w-[90px] text-right pr-4 shrink-0">
                  <span className="inline-block font-bold text-[#166534] text-[10px] tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all duration-500 group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534]">Part 01</span>
                </div>
                <div className="w-24 h-24 rounded-full bg-white border-[5px] border-white flex items-center justify-center shadow-lg relative z-10 shrink-0">
                  <img loading="lazy" src="https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Health" className="w-full h-full rounded-full object-cover shadow-inner" />
                  <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-[#166534]/30 group-hover:scale-110 transition-all duration-500 group-hover:border-[#166534]/60"></div>
                </div>
                <div className="ml-6 w-[280px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-md border border-white hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col items-start">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-[#166534] transition-colors duration-300">Health Insurance</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">Medical coverage and cashless treatment nationwide.</p>
                  <Link to="/service/health-insurance" className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#166534] text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-sm w-fit mt-auto">
                    Read More
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

              {/* Item 2 */}
              <div className="absolute z-30 flex items-center group" style={{ left: 'calc(50% + 250px)', top: '50%', transform: 'translate(-120px, -50%)' }}>
                <div className="w-[90px] text-right pr-4 shrink-0">
                  <span className="inline-block font-bold text-[#166534] text-[10px] tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all duration-500 group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534]">Part 02</span>
                </div>
                <div className="w-24 h-24 rounded-full bg-white border-[5px] border-white flex items-center justify-center shadow-lg relative z-10 shrink-0">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80" alt="Term" className="w-full h-full rounded-full object-cover shadow-inner" />
                  <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-[#166534]/30 group-hover:scale-110 transition-all duration-500 group-hover:border-[#166534]/60"></div>
                </div>
                <div className="ml-6 w-[280px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-md border border-white hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col items-start">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-[#166534] transition-colors duration-300">Term Insurance</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">High life cover for a fixed period ensuring financial protection.</p>
                  <Link to="/service/term-insurance" className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#166534] text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-sm w-fit mt-auto">
                    Read More
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

              {/* Item 3 */}
              <div className="absolute z-30 flex items-center group" style={{ left: 'calc(50% + 125px)', top: 'calc(50% + 216px)', transform: 'translate(-120px, -50%)' }}>
                <div className="w-[90px] text-right pr-4 shrink-0">
                  <span className="inline-block font-bold text-[#166534] text-[10px] tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all duration-500 group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534]">Part 03</span>
                </div>
                <div className="w-24 h-24 rounded-full bg-white border-[5px] border-white flex items-center justify-center shadow-lg relative z-10 shrink-0">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800" alt="Motor" className="w-full h-full rounded-full object-cover shadow-inner" />
                  <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-[#166534]/30 group-hover:scale-110 transition-all duration-500 group-hover:border-[#166534]/60"></div>
                </div>
                <div className="ml-6 w-[280px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-md border border-white hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col items-start">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-[#166534] transition-colors duration-300">Motor Insurance</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">Covering accidental damage and third-party liability.</p>
                  <Link to="/service/motor-insurance" className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#166534] text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-sm w-fit mt-auto">
                    Read More
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

              {/* Item 4 */}
              <div className="absolute z-30 flex flex-row-reverse items-center group" style={{ left: 'calc(50% - 125px)', top: 'calc(50% + 216px)', transform: 'translate(calc(-100% + 120px), -50%)' }}>
                <div className="w-[90px] text-left pl-4 shrink-0">
                  <span className="inline-block font-bold text-[#166534] text-[10px] tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all duration-500 group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534]">Part 04</span>
                </div>
                <div className="w-24 h-24 rounded-full bg-white border-[5px] border-white flex items-center justify-center shadow-lg relative z-10 shrink-0">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800" alt="Life" className="w-full h-full rounded-full object-cover shadow-inner" />
                  <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-[#166534]/30 group-hover:scale-110 transition-all duration-500 group-hover:border-[#166534]/60"></div>
                </div>
                <div className="mr-6 w-[280px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-md border border-white hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col items-start lg:items-end lg:text-right">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-[#166534] transition-colors duration-300">Life Insurance</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">Lifelong protection and wealth-building investment benefits.</p>
                  <Link to="/service/life-insurance" className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#166534] text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-sm w-fit mt-auto">
                    Read More
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

              {/* Item 5 */}
              <div className="absolute z-30 flex flex-row-reverse items-center group" style={{ left: 'calc(50% - 250px)', top: '50%', transform: 'translate(calc(-100% + 120px), -50%)' }}>
                <div className="w-[90px] text-left pl-4 shrink-0">
                  <span className="inline-block font-bold text-[#166534] text-[10px] tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all duration-500 group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534]">Part 05</span>
                </div>
                <div className="w-24 h-24 rounded-full bg-white border-[5px] border-white flex items-center justify-center shadow-lg relative z-10 shrink-0">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800" alt="Travel" className="w-full h-full rounded-full object-cover shadow-inner" />
                  <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-[#166534]/30 group-hover:scale-110 transition-all duration-500 group-hover:border-[#166534]/60"></div>
                </div>
                <div className="mr-6 w-[280px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-md border border-white hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col items-start lg:items-end lg:text-right">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-[#166534] transition-colors duration-300">Travel Insurance</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">Secure your trips against emergencies and baggage loss.</p>
                  <Link to="/service/travel-insurance" className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#166534] text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-sm w-fit mt-auto">
                    Read More
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

              {/* Item 6 */}
              <div className="absolute z-30 flex flex-row-reverse items-center group" style={{ left: 'calc(50% - 125px)', top: 'calc(50% - 216px)', transform: 'translate(calc(-100% + 120px), -50%)' }}>
                <div className="w-[90px] text-left pl-4 shrink-0">
                  <span className="inline-block font-bold text-[#166534] text-[10px] tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all duration-500 group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534]">Part 06</span>
                </div>
                <div className="w-24 h-24 rounded-full bg-white border-[5px] border-white flex items-center justify-center shadow-lg relative z-10 shrink-0">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800" alt="Property" className="w-full h-full rounded-full object-cover shadow-inner" />
                  <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-[#166534]/30 group-hover:scale-110 transition-all duration-500 group-hover:border-[#166534]/60"></div>
                </div>
                <div className="mr-6 w-[280px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-md border border-white hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col items-start lg:items-end lg:text-right">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-[#166534] transition-colors duration-300">Property Insurance</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">Safeguard properties against fire, theft, and natural disasters.</p>
                  <Link to="/service/property-insurance" className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#166534] text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-sm w-fit mt-auto">
                    Read More
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
};


const courseDetails = {
  "Equity Market": {
    duration: "2 Months",
    mode: "Online Live & Offline Classroom",
    curriculum: [
      "Introduction to Indian Stock Market & Exchanges",
      "Basics of Demat, Trading Accounts & Brokers",
      "Understanding Market Structure & Order Types",
      "Fundamental Analysis: Reading Balance Sheets & P/L",
      "Analyzing Key Ratios: P/E, EPS, RoE, Debt-to-Equity",
      "Identifying Multi-bagger Stocks & Value Investing",
      "Live Market Practice & Interactive Q&A Sessions"
    ],
    benefits: ["Lifetime Mentorship Support", "Live Market Trading Practice", "Premium Telegram Community Access", "Exclusive Strategy Checklists"]
  },
  "Currency Market": {
    duration: "1 Month",
    mode: "Online Live Sessions",
    curriculum: [
      "Forex Market Basics, Pip Calculations & Leverage",
      "Major, Minor & Exotic Currency Pairs (USDINR, EURINR, GBPINR)",
      "Impact of Global Macro Economics & Central Bank Policies",
      "Technical Analysis Specific to Currency Trends",
      "Risk Mitigation & Hedging Strategies in Forex",
      "Trading the News: NFP, CPI & Interest Rate Decisions"
    ],
    benefits: ["Daily Global Macro Updates", "Pre-Session Level Planning", "1-on-1 Strategy Doubt Solving", "Live News Trading Setup"]
  },
  "Dmat Account Operation": {
    duration: "1 Week",
    mode: "Self-Paced Video Course + 1 Live Session",
    curriculum: [
      "Navigating Demat & Trading Accounts Safely",
      "Introduction to Modern Terminal Software (Kite, Groww, Upstox)",
      "Placing Orders: Market, Limit, SL, SL-M, GTT",
      "Advanced Orders: Bracket, Cover & Basket Orders",
      "Setting up Custom Alerts, Watchlists & Scanners",
      "Calculating Brokerage, Taxes (STT, GST) & DP Charges"
    ],
    benefits: ["Step-by-step Screen Recordings", "Interactive Software Checklists", "Lifetime Access to Video Guide", "Broker Selection Help"]
  },
  "Technical Analysis": {
    duration: "1.5 Months",
    mode: "Online Live & Offline Classroom",
    curriculum: [
      "Dow Theory, Market Cycles & Advanced Market Structure",
      "Trend Continuation & Trend Reversal Strategies",
      "Mastering Candlestick Patterns & Price Action",
      "Volume Profile & Delivery Volume Analysis",
      "Fibonacci Retracements, Extensions & Harmonic Patterns",
      "Setting up Custom Scanners and Watchlist Rules",
      "Multi-Timeframe Analysis for Perfect Entries"
    ],
    benefits: ["Proprietary Scanning Templates", "Access to Live Trading Room", "Weekly Strategy Review Session", "Chart Review Mentorship"]
  },
  "Mutual Fund": {
    duration: "2 Weeks",
    mode: "Online Live Sessions",
    curriculum: [
      "Understanding Mutual Funds, AMCs, & NAV",
      "Types of Funds: Equity, Debt, Hybrid & Liquid",
      "SIP vs Lumpsum: Power of Compounding",
      "Analyzing Fund Performance: Alpha, Beta, Sharpe Ratio",
      "Understanding Expense Ratios, Exit Loads & Taxation",
      "How to Build a Passive Income Portfolio"
    ],
    benefits: ["Fund Selection Checklist", "Personalized Portfolio Planners", "Tax-Saving Investment Guides", "Retirement Corpus Calculator"]
  },
  "Portfolio Managment": {
    duration: "1 Month",
    mode: "Online Live Sessions",
    curriculum: [
      "Principles of Portfolio Management & Asset Allocation",
      "Diversification Strategies across Equities, Debt, Gold & Real Estate",
      "Risk Profiling & Assessing Investor Tolerance",
      "Dynamic vs Strategic Asset Allocation",
      "Portfolio Rebalancing Techniques & Timing",
      "Managing Institutional-Grade Wealth for Long-Term Growth"
    ],
    benefits: ["Personalized Portfolio Reviews", "Long-term Wealth Building Roadmap", "Risk Assessment Tools", "Quarterly Rebalancing Alerts"]
  },
  "Financial Planning": {
    duration: "3 Weeks",
    mode: "Online Live Sessions",
    curriculum: [
      "Setting SMART Financial Goals & Budgeting Basics",
      "Building Emergency Funds & Managing Debt Effectively",
      "Life & Health Insurance: Securing Your Family's Future",
      "Tax Planning Strategies & Saving Avenues (ELSS, NPS)",
      "Calculations for Financial Freedom & Early Retirement",
      "Estate Planning & Will Creation Basics"
    ],
    benefits: ["Personalized Financial Plan Draft", "Comprehensive Insurance Audits", "Retirement Excel Planners", "1-on-1 Consultation Session"]
  },
  "Trading Techniques": {
    duration: "1 Month",
    mode: "Online Live Sessions",
    curriculum: [
      "Mastering Scalping for Quick Intraday Profits",
      "Intraday Setups: Opening Range Breakout, VWAP Reversals",
      "Swing Trading Strategies holding for Days to Weeks",
      "Positional Trades & Deep Value Investing",
      "Adapting Techniques to Bull, Bear, and Sideways Markets",
      "Identifying High-Probability Breakout Stocks"
    ],
    benefits: ["Proven Trade Setups", "Technique Manuals & Cheat Sheets", "Daily Pre-Market Analysis", "Live Execution Practice"]
  },
  "Trading Strategies": {
    duration: "1 Month",
    mode: "Online Live Sessions",
    curriculum: [
      "Introduction to Algorithmic & Systematic Trading",
      "Backtesting and Forward-Testing Rule-Based Strategies",
      "Advanced Options Spreads: Iron Condor, Butterflies, Straddles",
      "Hedging Strategies to Protect Capital in Volatile Markets",
      "Mean Reversion and Bollinger Band Trading Systems",
      "Automating Alert Rules and Semi-Algo Execution"
    ],
    benefits: ["Vetted Code Snippets for Indicators", "Historical Strategy Backtest Reports", "Access to Strategy Coding Mentor", "Custom Trading Journal"]
  },
  "Risk Management": {
    duration: "2 Weeks",
    mode: "Online Live Sessions",
    curriculum: [
      "The Math of Trading: Probabilities, Expectancy, and Edge",
      "Position Sizing Formulas: Kelly Criterion, Fixed Fractional",
      "Setting Logical Stop-Losses and Trailing Stops",
      "Managing Drawdowns and Strict Daily Loss Limits",
      "Optimizing Risk-to-Reward Ratios for Consistency",
      "Capital Preservation and Compounding Account Balance Safely"
    ],
    benefits: ["Custom Position Sizing Calculators", "Trading Journal Excel Templates", "1-on-1 Account Audit Session", "Risk Profiling Questionnaire"]
  },
  "Advanced Psychological Training": {
    duration: "2 Weeks",
    mode: "Online Live Sessions",
    curriculum: [
      "Understanding Trading Psychology & Emotional Control",
      "Identifying Cognitive Biases: Loss Aversion, Confirmation Bias",
      "Overcoming FOMO (Fear Of Missing Out) and Revenge Trading",
      "Building the Discipline to Follow Trading Rules Strictly",
      "Handling Greed during Winning Streaks & Fear during Drawdowns",
      "Mental Rehearsal, Meditation & Visualization Techniques for Traders"
    ],
    benefits: ["Daily Mental Prep Checklist", "Stress Management Techniques", "Lifetime Mindset Audits", "Trading Routine Builder"]
  }
};

const baseCourses = [
  {
    title: "Equity Market",
    desc: "Master equity trading from scratch. Learn how to pick winning stocks with fundamental insights and pinpoint entries.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 5,999.00"
  },
  {
    title: "Currency Market",
    desc: "Understand global currency pairs and maximize returns with expert forex trading strategies tailored for the global markets.",
    image: "https://images.pexels.com/photos/259209/pexels-photo-259209.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: "₹ 4,999.00"
  },
  {
    title: "Dmat Account Operation",
    desc: "Learn to navigate demat accounts, use modern trading terminals, and place automated orders like a professional.",
    image: "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 999.00"
  }
];

const additionalCourses = [
  {
    title: "Technical Analysis",
    desc: "Master chart patterns, advanced indicators, price action, and volume analysis to perfectly time your entries and exits.",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 9,999.00"
  },
  {
    title: "Mutual Fund",
    desc: "Discover the best mutual funds, understand SIPs, and build a passive income portfolio for long-term growth.",
    image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 1,999.00"
  },
  {
    title: "Portfolio Managment",
    desc: "Learn advanced asset allocation, portfolio diversification, and dynamic rebalancing for institutional-grade wealth management.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 7,999.00"
  },
  {
    title: "Financial Planning",
    desc: "Comprehensive strategies for long-term wealth creation, goal-based investing, and smart asset allocation.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 3,999.00"
  },
  {
    title: "Trading Techniques",
    desc: "Learn diverse trading styles including scalping, day trading, swing trading, and deep value investing.",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 4,999.00"
  },
  {
    title: "Trading Strategies",
    desc: "Deploy proven, back-tested algorithmic setups for intraday, swing, and positional trading to maximize ROI.",
    image: "https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 3,999.00"
  },
  {
    title: "Risk Management",
    desc: "Protect your capital. Learn advanced position sizing, stop-loss formulas, and portfolio balancing techniques.",
    image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 2,999.00"
  },
  {
    title: "Advanced Psychological Training",
    desc: "Conquer FOMO and fear. Develop a winning mindset to trade with discipline and emotional stability in volatile markets.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    price: "₹ 4,999.00"
  }
];

const CoursesSection = ({ isCoursesPage = false }) => {
  const courses = isCoursesPage ? [...baseCourses, ...additionalCourses] : baseCourses;

  return (
    <section id="courses" className="py-8 md:py-12 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 max-w-[1200px]">

        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-black text-text-primary tracking-tight mb-4">
            Our <span className="text-[#166534]">Courses</span>
          </h2>
          <p className="text-text-secondary font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Elevate your trading journey with our premium, expertly crafted courses designed for serious investors and passionate learners.
          </p>
        </div>

        {/* Informational Section (Courses Page Only) */}
        {isCoursesPage && (
          <div className="mb-16 md:mb-20 bg-gradient-to-br from-[#166534]/5 to-transparent border border-[#166534]/15 rounded-[32px] p-8 md:p-12 shadow-2xl text-left relative overflow-hidden group">
            {/* Background Ambience */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#166534]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#166534]/10 transition-colors duration-700"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Column: Heading & Badge */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#166534]/10 text-[#166534] font-bold tracking-widest uppercase text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span>
                  Why Choose Advait?
                </div>

                <h3 className="text-3xl md:text-5xl font-display font-black leading-[1.15] text-text-primary tracking-tight">
                  Master the Markets with <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#166534] to-emerald-700">Advait Academy</span>
                </h3>

                <div className="h-1.5 w-24 bg-gradient-to-r from-[#166534] to-accent-secondary rounded-full"></div>

                {/* Stats / Highlights chips */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-white rounded-2xl border border-[#166534]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="text-2xl font-display font-black text-[#166534]">100%</div>
                    <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">Practical Learning</div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-[#166534]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="text-2xl font-display font-black text-[#166534]">Lifetime</div>
                    <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">Mentor Support</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative & Key Features */}
              <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-text-primary/10 lg:pl-10 text-justify">
                <p className="text-text-primary text-base md:text-lg font-light leading-relaxed">
                  At Advait Stock Market Academy, we believe that financial independence is achievable for everyone with the right knowledge, discipline, and mentorship. Our curriculum is meticulously designed by industry veterans to take you from a complete beginner to a confident, independent trader.
                </p>
                <p className="text-text-secondary text-sm md:text-base font-light leading-relaxed">
                  Whether you are looking to generate secondary income through intraday trading, build generational wealth through value investing, or master the complexities of derivative markets, our courses provide actionable, real-world strategies. We focus deeply not just on technical indicators, but on the crucial elements of risk management and trading psychology.
                </p>

                {/* Visual Checkmark benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-black/5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#166534]/10 flex items-center justify-center text-[#166534] shrink-0 font-bold text-xs">✓</div>
                    <span className="font-medium text-text-primary text-xs md:text-sm">Practical, Live-Market Training</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#166534]/10 flex items-center justify-center text-[#166534] shrink-0 font-bold text-xs">✓</div>
                    <span className="font-medium text-text-primary text-xs md:text-sm">Proprietary Trading Setups</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#166534]/10 flex items-center justify-center text-[#166534] shrink-0 font-bold text-xs">✓</div>
                    <span className="font-medium text-text-primary text-xs md:text-sm">Lifetime Mentorship Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#166534]/10 flex items-center justify-center text-[#166534] shrink-0 font-bold text-xs">✓</div>
                    <span className="font-medium text-text-primary text-xs md:text-sm">Risk Management Mastery</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Alternating List Layout */}
        <div className="flex flex-col">
          {courses.map((course, index) => {
            const isEven = index % 2 !== 0; // index 1, 3 etc. are visually 'Even' rows

            return (
              <div key={index} className="flex flex-col md:flex-row items-center border-b border-gray-100 py-8 md:py-12 gap-6 md:gap-12 group">

                {/* Content Block (Left for Odd, Right for Even) */}
                <div className={`w-full md:w-1/2 flex flex-col justify-center ${isEven ? 'md:order-2 md:pl-6 text-left' : 'md:pr-6 text-left md:text-right'}`}>
                  <div className={`w-8 h-[2px] bg-[#166534] mb-4 transform group-hover:scale-x-150 transition-transform duration-500 ${isEven ? 'origin-left' : 'origin-left md:origin-right md:ml-auto'}`}></div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-text-primary mb-3 leading-tight group-hover:text-[#166534] transition-colors duration-500">
                    {course.title}
                  </h3>
                  <p className={`text-text-secondary text-base md:text-lg leading-relaxed font-light mb-6 max-w-md ${isEven ? '' : 'md:ml-auto'}`}>
                    {course.desc}
                  </p>

                  {/* Price replacing Explore Course */}
                  <div className={`inline-flex flex-wrap items-center gap-3 mt-2 ${isEven ? '' : 'md:justify-end'}`}>
                    <Link
                      to={`/course/${encodeURIComponent(course.title)}`}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#166534] text-white text-xs md:text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-md w-fit"
                    >
                      Read More
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </div>
                </div>

                {/* Huge Number with Image Mask (Right for Odd, Left for Even) */}
                <div className={`w-full md:w-1/2 flex justify-center items-center ${isEven ? 'md:order-1' : ''}`}>
                  <div
                    className="text-[80px] md:text-[140px] lg:text-[180px] font-black leading-none tracking-tighter drop-shadow-2xl hover:scale-105 transition-transform duration-700 select-none"
                    style={{
                      backgroundImage: `url(${course.image})`,
                      backgroundColor: '#166534', // Fallback color if image fails to load
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Explore Courses Button */}
        {!isCoursesPage && (
          <div className="mt-10 flex justify-center">
            <Link to="/courses" className="inline-flex items-center gap-3 px-10 py-4 bg-text-primary text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-xl hover:bg-accent-primary transition-all hover:-translate-y-1 group">
              Explore Courses
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
        )}

      </div>

    </section>
  );
};

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const decodedTitle = decodeURIComponent(courseId || "");
  const allCourses = [...baseCourses, ...additionalCourses];
  const course = allCourses.find(c => c.title === decodedTitle);

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
    curriculum: ["Course overview and basics", "Practical sessions", "Q&A support"],
    benefits: ["Professional Mentorship", "Quality course materials"]
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


const GallerySection = ({ isGalleryPage = false }) => {
  const [activeImg, setActiveImg] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  const baseGalleryItems = [
    { url: "/Home/1.png", title: "Live Trading Floor", desc: "Experience the pulse of the market in our state-of-the-art facility." },
    { url: "/Home/2.png", title: "Mentorship Sessions", desc: "Get one-on-one guidance from experienced market professionals." },
    { url: "/Home/3.png", title: "Analysis Workshops", desc: "Deep dive into technical charts and fundamental data." },
    { url: "/Home/4.png", title: "Student Community", desc: "Collaborate, learn, and grow your wealth together." },
  ];

  const additionalGalleryItems = [
    { url: "/Home/17.jpg", title: "Live Trading Execution", desc: "Students actively executing real-time trades and managing portfolios using advanced trading terminals." },
    { url: "/Home/16.jpg", title: "Interactive Technical Workshops", desc: "Faculty actively monitoring and guiding students as they analyze live market charts and spot breakout patterns." },
    { url: "/Home/15.jpg", title: "Student Support & Onboarding", desc: "Our dedicated support team ensuring seamless onboarding, query resolution, and administrative assistance for all our traders." },
    { url: "/Home/14.jpg", title: "Live Market Mentorship", desc: "Students gaining hands-on experience under the expert guidance of our research analysts in the live trading environment." },
    { url: "/Home/13.jpg", title: "Dedicated Market Research", desc: "Continuous market analysis and strategy formulation by our experienced faculty to ensure top-tier education." },
    { url: "/Home/12.jpg", title: "Focused Learning Environment", desc: "Immersive classroom sessions designed to master the fundamentals of technical and fundamental analysis." },
    { url: "/Home/11.png", title: "Next Generation of Traders", desc: "Empowering eager minds with the knowledge and discipline required to thrive in the competitive stock market." },
    { url: "/Home/10.jpg", title: "Advanced Trading Concepts", desc: "In-depth lectures on complex market dynamics, risk management, and proprietary trading setups." },
    { url: "/Home/9.png", title: "Mastering Reversal Strategies", desc: "Learn to identify trend ends and pinpoint exact reversal points with volume analysis in our live classrooms." },
    { url: "/Home/8.jpg", title: "Personalized Trade Counseling", desc: "Get one-on-one portfolio reviews and trading psychology guidance from our veteran analysts." },
    { url: "/Home/7.jpg", title: "Expert Market Leadership", desc: "Guided by Prof. Satish A. Bobade, bringing decades of research analysis and institutional trading experience." },
    { url: "/Home/6.jpg", title: "Advait Stock Market Academy", desc: "Our premium campus dedicated exclusively to cultivating top-tier stock market traders and financial professionals." },
    { url: "/Home/5.png", title: "Engineering Trading Success", desc: "Celebrating the analytical minds that approach the stock market with precision, logic, and calculated strategy." },
  ];

  const galleryItems = isGalleryPage ? [...baseGalleryItems, ...additionalGalleryItems] : baseGalleryItems;

  // Autoplay Logic
  React.useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveImg((prevIndex) => (prevIndex + 1) % galleryItems.length);
      }, 3500); // Automatically cycle every 3.5 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, galleryItems.length]);

  const handleImageClick = (index) => {
    setActiveImg(index);
    setIsAutoPlaying(false); // Stop autoplay when user manually interacts
  };

  return (
    <section id="gallery" className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Decorative blur elements for premium feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary font-bold tracking-widest uppercase text-[10px] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"></span>
            Inside ASMA
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight mb-4">Our Premium <span className="text-accent-primary">Environment</span></h2>
          <p className="text-text-secondary text-base font-light leading-relaxed">Step into our state-of-the-art training facilities. A vibrant community of traders learning, growing, and succeeding together.</p>
        </div>

        {/* Informational Section (Gallery Page Only) */}
        {isGalleryPage && (
          <div className="mb-12 md:mb-16 bg-gradient-to-br from-[#166534]/5 to-transparent border border-[#166534]/15 rounded-[32px] p-8 md:p-12 shadow-2xl text-left relative overflow-hidden group">
            {/* Ambient light glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#166534]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#166534]/10 transition-colors duration-700"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Column: Heading, Badge, Stats */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary font-bold tracking-widest uppercase text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"></span>
                  Beyond the Charts
                </div>

                <h3 className="text-3xl md:text-5xl font-display font-black leading-[1.15] text-text-primary tracking-tight">
                  Experience the Life of a <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#166534] to-emerald-700">Professional Trader</span>
                </h3>

                <div className="h-1.5 w-24 bg-gradient-to-r from-[#166534] to-accent-secondary rounded-full"></div>

                {/* Premium Stat Card Chips */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-white rounded-2xl border border-[#166534]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="text-3xl font-display font-black text-[#166534]">100%</div>
                    <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">Practical Learning</div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-[#166534]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="text-3xl font-display font-black text-[#166534]">Live</div>
                    <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">Market Practice</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Paragraphs with Drop Cap */}
              <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-text-primary/10 lg:pl-10 text-justify">
                <p className="text-text-primary text-base md:text-lg font-light leading-relaxed">
                  Trading isn't just about reading charts; it's about the environment, the discipline, and the community you surround yourself with. At Advait Stock Market Academy, we've built a world-class ecosystem designed to foster focus, collaboration, and continuous growth.
                </p>
                <p className="text-text-secondary text-sm md:text-base font-light leading-relaxed">
                  From our high-tech live trading floors equipped with cutting-edge terminals to our dedicated mentorship zones and vibrant seminar halls, every inch of our academy is engineered for your success. Browse through our gallery to get a glimpse of the energetic atmosphere, the intense analysis workshops, and the strong community bonds that define the ASMA experience.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Cinematic Showcase Layout */}
        <div className="flex flex-col gap-3 md:gap-4 w-full max-w-5xl mx-auto">

          {/* Main Featured Image */}
          <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[450px] rounded-[24px] overflow-hidden shadow-xl group bg-bg-secondary border border-text-primary/5">
            <img loading="lazy"
              key={activeImg} // Forces re-render for transition if needed, or rely on CSS
              src={galleryItems[activeImg].url}
              alt={galleryItems[activeImg].title}
              className="w-full h-full object-cover transition-transform duration-[2s] ease-in-out group-hover:scale-105 animate-fade-in"
            />

            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Dynamic Content - Always Visible */}
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <div className="mb-2">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white transition-opacity duration-500">
                  {galleryItems[activeImg].title}
                </h3>
              </div>
              <div>
                <p className="text-white/80 text-sm md:text-base font-light transition-opacity duration-500">
                  {galleryItems[activeImg].desc}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Thumbnails */}
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {galleryItems.map((item, i) => (
              <div
                key={i}
                onClick={() => handleImageClick(i)}
                className={`relative h-16 sm:h-20 md:h-28 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${activeImg === i
                  ? 'ring-2 ring-accent-primary ring-offset-2 shadow-md scale-[1.02]'
                  : 'opacity-50 hover:opacity-100 hover:scale-[1.02]'
                  }`}
              >
                <img loading="lazy" src={item.url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />

                {/* Selection indicator */}
                {activeImg === i && (
                  <div className="absolute inset-0 bg-accent-primary/20 mix-blend-overlay"></div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

const AdvantageSection = () => {
  const [offsetY, setOffsetY] = React.useState(0);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const diff = (window.innerHeight / 2) - (rect.top + rect.height / 2);
        setOffsetY(diff);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="advantage" className="py-12 md:py-16 px-4 md:px-8 lg:px-12 bg-bg-primary relative overflow-hidden">

      {/* Massive Highlight Island (Soft Theme-Matched) */}
      <div className="max-w-6xl mx-auto bg-bg-secondary rounded-[30px] py-8 md:py-12 px-6 md:px-10 lg:px-12 relative overflow-hidden shadow-2xl border border-text-primary/5">

        {/* Island Inner Glows and Textures with Parallax */}
        <div
          className="absolute top-0 right-0 w-full h-full bg-cover bg-center pointer-events-none scale-100 transition-transform duration-[800ms] ease-out"
          style={{
            backgroundImage: "url('/advantage-bg.png')",
            transform: `translateY(${offsetY * 0.15}px)`
          }}
        ></div>

        <div className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-accent-primary font-bold tracking-widest uppercase text-xs mb-4 shadow-sm border border-text-primary/5">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-ping"></span>
              Our Core Strengths
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight mb-4 drop-shadow-sm">
              A Legacy of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-emerald-500">Trading Excellence</span>
            </h2>
            <p className="text-text-secondary text-base md:text-lg font-light leading-relaxed">Central India's most trusted and experienced stock market academy, elevating your trading journey through unparalleled expertise.</p>
          </div>

          {/* Premium Visual Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-6xl mx-auto">

            {/* Card 1: Legacy & Trust (Wide Top) */}
            <div className="md:col-span-2 group bg-white/90 backdrop-blur-md rounded-[30px] p-6 md:p-8 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(17,82,52,0.1)] transition-all duration-500 flex flex-col md:flex-row gap-6 lg:gap-10 items-center relative border border-text-primary/5 z-10 hover:-translate-y-1">
              {/* Massive Watermark with Parallax */}
              <div
                className="absolute -bottom-6 -right-6 text-[120px] lg:text-[180px] font-display font-black text-bg-secondary/60 pointer-events-none select-none z-0 tracking-tighter leading-none transition-transform duration-[800ms] ease-out"
                style={{ transform: `translateY(${offsetY * 0.1}px)` }}
              >20+</div>

              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-bg-secondary to-transparent rounded-bl-[80px] opacity-50 group-hover:scale-150 transition-transform duration-1000 pointer-events-none z-0"></div>

              <div className="w-full md:w-5/12 flex flex-col items-start relative z-10 border-b md:border-b-0 md:border-r border-text-primary/5 pb-6 md:pb-0 pr-0 md:pr-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center text-accent-primary group-hover:-rotate-6 transition-transform duration-500 shadow-inner">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div className="px-3 py-1 bg-accent-primary/10 text-accent-primary font-bold text-[10px] uppercase tracking-widest rounded-lg">Est. 2004</div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2 leading-snug">Academy Legacy <br />& Trust</h3>
              </div>

              <div className="w-full md:w-7/12 relative z-10 pl-0 md:pl-2">
                <ul className="space-y-4 text-text-secondary font-light text-base">
                  <li className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>The largest and most experienced stock market academy in Central India.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>Over 20 years of rich, hands-on experience in financial markets.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>Highly rated on Google and Just Dial by our satisfied students.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Practical Training (Square Left) */}
            <div className="group bg-white/90 backdrop-blur-md rounded-[30px] p-6 md:p-8 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(17,82,52,0.1)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between relative border border-text-primary/5 z-10">
              {/* Background Chart SVG Parallax */}
              <svg
                className="absolute -bottom-6 -right-6 w-48 h-48 text-bg-secondary/80 pointer-events-none z-0 transition-transform duration-[800ms] ease-out"
                fill="currentColor" viewBox="0 0 24 24"
                style={{ transform: `translateY(${offsetY * 0.1}px)` }}
              ><path d="M3 3v18h18v-2H5V3H3zm6 14h2v-4h-2v4zm4 0h2v-8h-2v8zm4 0h2v-6h-2v6z" /></svg>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <div className="text-3xl font-display font-black text-bg-secondary tracking-tighter">02</div>
                </div>

                <h3 className="text-xl md:text-2xl font-display font-bold text-text-primary mb-2">100% Practical <br />Live Training</h3>
                <div className="w-10 h-1 bg-accent-primary rounded-full mb-4"></div>

                <ul className="space-y-3 text-text-secondary font-light text-sm md:text-base">
                  <li className="flex items-start gap-2"><span className="text-accent-primary mt-0.5 text-base">✦</span> Every concept taught and demonstrated in the live market.</li>
                  <li className="flex items-start gap-2"><span className="text-accent-primary mt-0.5 text-base">✦</span> Unique trading strategies developed through years of research.</li>
                  <li className="flex items-start gap-2"><span className="text-accent-primary mt-0.5 text-base">✦</span> Focus on both technical and psychological aspects of trading.</li>
                  <li className="flex items-start gap-2"><span className="text-accent-primary mt-0.5 text-base">✦</span> Risk management techniques to safeguard investments.</li>
                </ul>
              </div>
            </div>

            {/* Card 3: Personalized Learning (Square Right) */}
            <div className="group bg-white/90 backdrop-blur-md rounded-[30px] p-6 md:p-8 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(17,82,52,0.1)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between relative border border-text-primary/5 z-10">
              {/* Background Target SVG Parallax */}
              <svg
                className="absolute -top-6 -right-6 w-48 h-48 text-bg-secondary/80 pointer-events-none z-0 transition-transform duration-[800ms] ease-out"
                fill="currentColor" viewBox="0 0 24 24"
                style={{ transform: `translateY(${offsetY * -0.1}px)` }}
              ><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm0-13a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z" /></svg>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center text-accent-primary group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <div className="text-3xl font-display font-black text-bg-secondary tracking-tighter">03</div>
                </div>

                <h3 className="text-xl md:text-2xl font-display font-bold text-text-primary mb-2">Personalized <br />Learning</h3>
                <div className="w-10 h-1 bg-accent-secondary rounded-full mb-4"></div>

                <ul className="space-y-3 text-text-secondary font-light text-sm md:text-base">
                  <li className="flex items-start gap-2"><span className="text-accent-secondary mt-0.5 text-base">✦</span> Personalized guidance tailored to each student’s progress.</li>
                  <li className="flex items-start gap-2"><span className="text-accent-secondary mt-0.5 text-base">✦</span> Flexible learning pace, adapted to your understanding.</li>
                  <li className="flex items-start gap-2"><span className="text-accent-secondary mt-0.5 text-base">✦</span> Training sessions supported with detailed, customized study material.</li>
                  <li className="flex items-start gap-2"><span className="text-accent-secondary mt-0.5 text-base">✦</span> Transformative approach—changing the way you think and trade.</li>
                </ul>
              </div>
            </div>

            {/* Card 4: Lifetime Support (Wide Bottom) */}
            <div className="md:col-span-2 group bg-white/90 backdrop-blur-md rounded-[30px] p-6 md:p-8 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(17,82,52,0.1)] transition-all duration-500 hover:-translate-y-1 flex flex-col md:flex-row-reverse gap-6 lg:gap-10 items-center relative border border-text-primary/5 z-10">
              {/* Background Infinity SVG Parallax */}
              <svg
                className="absolute -top-10 left-0 w-64 h-64 text-bg-secondary/80 pointer-events-none z-0 transition-transform duration-[800ms] ease-out"
                fill="currentColor" viewBox="0 0 24 24"
                style={{ transform: `translateY(${offsetY * 0.1}px)` }}
              ><path d="M12 2C8.134 2 5 5.134 5 9c0 3.866 3.134 7 7 7s7-3.134 7-7c0-3.866-3.134-7-7-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" /></svg>

              <div className="w-full md:w-5/12 flex flex-col items-start relative z-10 border-b md:border-b-0 md:border-l border-text-primary/5 pb-6 md:pb-0 pl-0 md:pl-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div className="px-3 py-1 bg-accent-primary/10 text-accent-primary font-bold text-[10px] uppercase tracking-widest rounded-lg">Unlimited</div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2 leading-snug">Lifetime Support <br />& Results</h3>
              </div>

              <div className="w-full md:w-7/12 relative z-10 pr-0 md:pr-4">
                <ul className="space-y-4 text-text-secondary font-light text-base">
                  <li className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>Lifetime access to updated market strategies and analyses.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>Continued post-course support to ensure your growth in trading.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>Proven methods for maximizing profits while minimizing losses.</span>
                  </li>
                  <li className="flex items-start gap-4 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>Master the skills to generate steady income with confidence.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

const ReviewsSection = () => {
  const reviews = [
    { text: "Advait Stock Market Academy is passionate about the share market. Because I experienced that, Mr Satish Sir has vast knowledge about the share market. He teaches a live market, which helps to understand better and faster. Sir personally guides each student. Thank you, sir, for enlarging my knowledge and my money also.", name: "Shubhangi Jampal", image: shubhangiImg, rating: 5, date: "3 weeks ago" },
    { text: "I had a great experience at Advait Stock Market Academy. The share market training was practical and easy to understand and their insurance services are trustworthy. A one-stop solution for learning and securing your financial future.", name: "Krishna Murlidhar", image: krishnaImg, rating: 5, date: "1 month ago" },
    { text: "Advait Stock Market Academy is the perfect place to learn trading and investing. The trainers explain everything clearly and their insurance services are reliable. I gained both knowledge and financial security here. Highly recommended for everyone in Nagpur!", name: "Vrushali Babhale", image: vrushaliImg, rating: 5, date: "2 months ago" }
  ];

  const StarRating = ({ rating }) => (
    <div className="flex gap-1 text-[#fbbc04]">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <section id="reviews" className="py-12 md:py-20 bg-accent-primary/5 text-text-primary overflow-hidden relative border-y border-text-primary/5">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-primary/10 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-secondary/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between max-w-4xl mx-auto mb-10 gap-6 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-accent-primary/20 text-accent-primary font-bold tracking-widest uppercase text-[9px] mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-ping"></span>
              Google Reviews
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-2 text-text-primary tracking-tight">
              Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Hundreds</span>
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              <div className="text-3xl font-display font-bold text-text-primary">4.9</div>
              <div className="flex flex-col">
                <StarRating rating={5} />
                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-0.5">Based on 150+ reviews</span>
              </div>
            </div>
          </div>

          <a href="https://www.google.com/search?sca_esv=6c41df8803dda356&rlz=1C1VDKB_enIN1135IN1135&sxsrf=ANbL-n4aznE4jH6uYxK6vCGuZ88KOD6uvQ:1781007623389&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOYHEMA5pfD6YKL4hg_LxYX2PZ2tGeZCIa4KyvdKWjZp9MQt2HI6-HzPhcL9PJmQcht8AIdiD4xjF3YhV-UyQa0857WJMdXn129T9f3LzBFnbMfwTZcGzK2iESk4XbciKSPMCFrpgiL_nwb0DSiPKvSSp47qLxGXb0kbWVmh5jq7yp12g8Q%3D%3D&q=Advait+Share+Market+Academy+%7C+Stock+Market+Trading+Training+Institute+Reviews&sa=X&ved=2ahUKEwjNz--1kvqUAxXGzzgGHdTfLe0Q0bkNegQIORAH&biw=1280&bih=585&dpr=1.5" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 bg-white border border-text-primary/10 hover:border-accent-primary/30 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all">
            <svg viewBox="0 0 48 48" className="w-6 h-6 group-hover:scale-110 transition-transform">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span className="font-bold text-sm uppercase tracking-wider text-text-primary">Write a Review</span>
          </a>
        </div>

        <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] pt-4 pb-12">
          <div className="flex w-max animate-marquee gap-6">
            {[...reviews, ...reviews, ...reviews, ...reviews].map((review, i) => (
              <div
                key={i}
                className="w-[85vw] sm:w-[340px] md:w-[420px] shrink-0 group relative bg-white border border-text-primary/10 p-6 md:p-8 rounded-[24px] hover:-translate-y-2 transition-all duration-500 hover:shadow-xl hover:border-accent-primary/20 cursor-pointer flex flex-col justify-between shadow-sm"
              >
                {/* User Header */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    {review.image ? (
                      <img loading="lazy" src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover shadow-sm ring-1 ring-text-primary/5" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-bold text-lg ring-1 ring-accent-primary/20">
                        {review.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-base text-text-primary group-hover:text-accent-primary transition-colors">{review.name}</div>
                      <div className="text-xs text-text-secondary font-medium">{review.date}</div>
                    </div>
                  </div>
                  <svg viewBox="0 0 48 48" className="w-6 h-6 opacity-80">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </div>

                <div className="mb-4 relative z-10">
                  <StarRating rating={review.rating} />
                </div>

                <div className="relative z-10 flex-grow">
                  <p className="text-sm md:text-[15px] font-medium text-text-secondary leading-relaxed line-clamp-5 group-hover:text-text-primary transition-colors duration-300">"{review.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

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
    <section id="contact-form" className="py-10 md:py-16 bg-bg-primary relative overflow-hidden">
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
            src="https://maps.google.com/maps?q=Advait+Stock+Market+Academy,+Nagpur&t=m&z=12&output=embed&iwloc=near" 
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
    </section>
  );
};

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
          <a href="mailto:advaitsharemarket@gmail.com" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-bg-primary/70 hover:bg-[#EA4335] hover:text-white hover:border-[#EA4335] transition-all duration-300 hover:-translate-y-1 shadow-sm">
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
            <a href="mailto:advaitsharemarket@gmail.com" className="hover:text-white transition-colors">advaitsharemarket@gmail.com</a>
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

const PrivacyPolicySection = () => {
  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="space-y-8 text-text-secondary leading-relaxed md:text-lg">
          <p>
            Advait Stock Market Academy website is owned by Advait Stock Market Academy, which is a data controller of your personal data.
          </p>
          <p>
            We have adopted this Privacy Policy, which determines how we are processing the information collected by Advait Stock Market Academy, which also provides the reasons why we must collect certain personal data about you. Therefore, you must read this Privacy Policy before using Advait Stock Market Academy website.
          </p>
          <p>
            We take care of your personal data and undertake to guarantee its confidentiality and security.
          </p>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">Personal information we collect:</h3>
            <p>
              When you visit the Advait Stock Market Academy, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the installed cookies on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products you view, what websites or search terms referred you to the Site, and how you interact with the Site. We refer to this automatically-collected information as "Device Information." Moreover, we might collect the personal data you provide to us (including but not limited to Name, Surname, Address, payment information, etc.) during registration to be able to fulfill the agreement.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">Why do we process your data?</h3>
            <p>
              Our top priority is customer data security, and, as such, we may process only minimal user data, only as much as it is absolutely necessary to maintain the website. Information collected automatically is used only to identify potential cases of abuse and establish statistical information regarding website usage. This statistical information is not otherwise aggregated in such a way that it would identify any particular user of the system.
            </p>
            <p>
              You can visit the website without telling us who you are or revealing any information, by which someone could identify you as a specific, identifiable individual. If, however, you wish to use some of the website's features, or you wish to receive our newsletter or provide other details by filling a form, you may provide personal data to us, such as your email, first name, last name, city of residence, organization, telephone number. You can choose not to provide us with your personal data, but then you may not be able to take advantage of some of the website's features.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">Your rights:</h3>
            <p>If you are a European resident, you have the following rights related to your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The right to be informed.</li>
              <li>The right of access.</li>
              <li>The right to rectification.</li>
              <li>The right to erasure.</li>
              <li>The right to restrict processing.</li>
              <li>The right to data portability.</li>
              <li>The right to object.</li>
              <li>Rights in relation to automated decision-making and profiling.</li>
            </ul>
            <p>
              If you would like to exercise this right, please contact us through the contact information below.
            </p>
            <p>
              Additionally, if you are a European resident, we note that we are processing your information in order to fulfill contracts we might have with you (for example, if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above. Additionally, please note that your information might be transferred outside of Europe, including Canada and the United States.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">Links to other websites:</h3>
            <p>
              Our website may contain links to other websites that are not owned or controlled by us. Please be aware that we are not responsible for such other websites or third parties' privacy practices. We encourage you to be aware when you leave our website and read the privacy statements of each website that may collect personal information.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">Information security:</h3>
            <p>
              We secure information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use, or disclosure. We keep reasonable administrative, technical, and physical safeguards to protect against unauthorized access, use, modification, and personal data disclosure in its control and custody. However, no data transmission over the Internet or wireless network can be guaranteed.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">Legal disclosure:</h3>
            <p>
              We will disclose any information we collect, use or receive if required or permitted by law, such as to comply with a subpoena or similar legal process, and when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const TermsConditionsSection = () => {
  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="space-y-8 text-text-secondary leading-relaxed md:text-lg">
          <p>
            Welcome to Advait Stock Market Academy!
          </p>
          <p>
            These terms and conditions outline the rules and regulations for the use of Advait Stock Market Academy's Website, located at https://advaitsharemarketacademy.in/.
          </p>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use Advait Stock Market Academy if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">Cookies:</h3>
            <p>
              The website uses cookies to help personalize your online experience. By accessing Advait Stock Market Academy, you agreed to use the required cookies.
            </p>
            <p>
              A cookie is a text file that is placed on your hard disk by a web page server. Cookies cannot be used to run programs or deliver viruses to your computer. Cookies are uniquely assigned to you and can only be read by a web server in the domain that issued the cookie to you.
            </p>
            <p>
              We may use cookies to collect, store, and track information for statistical or marketing purposes to operate our website. You have the ability to accept or decline optional Cookies. There are some required Cookies that are necessary for the operation of our website. These cookies do not require your consent as they always work. Please keep in mind that by accepting required Cookies, you also accept third-party Cookies, which might be used via third-party provided services if you use such services on our website, for example, a video display window provided by third parties and integrated into our website.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">License:</h3>
            <p>
              Unless otherwise stated, Advait Stock Market Academy and/or its licensors own the intellectual property rights for all material on Advait Stock Market Academy. All intellectual property rights are reserved. You may access this from Advait Stock Market Academy for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <p>You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Copy or republish material from Advait Stock Market Academy</li>
              <li>Sell, rent, or sub-license material from Advait Stock Market Academy</li>
              <li>Reproduce, duplicate or copy material from Advait Stock Market Academy</li>
              <li>Redistribute content from Advait Stock Market Academy</li>
            </ul>
            <p>
              This Agreement shall begin on the date hereof.
            </p>
            <p>
              Parts of this website offer users an opportunity to post and exchange opinions and information in certain areas of the website. Advait Stock Market Academy does not filter, edit, publish or review Comments before their presence on the website. Comments do not reflect the views and opinions of Advait Stock Market Academy, its agents, and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions. To the extent permitted by applicable laws, Advait Stock Market Academy shall not be liable for the Comments or any liability, damages, or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
            </p>
            <p>
              Advait Stock Market Academy reserves the right to monitor all Comments and remove any Comments that can be considered inappropriate, offensive, or causes breach of these Terms and Conditions.
            </p>
            <p>You warrant and represent that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
              <li>The Comments do not invade any intellectual property right, including without limitation copyright, patent, or trademark of any third party;</li>
              <li>The Comments do not contain any defamatory, libelous, offensive, indecent, or otherwise unlawful material, which is an invasion of privacy.</li>
              <li>The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
            </ul>
            <p>
              You hereby grant Advait Stock Market Academy a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats, or media.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">Hyperlinking to our Content:</h3>
            <p>The following organizations may link to our Website without prior written approval:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Government agencies;</li>
              <li>Search engines;</li>
              <li>News organizations;</li>
              <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
              <li>System-wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
            </ul>
            <p>
              These organizations may link to our home page, to publications, or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement, or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.
            </p>
            <p>We may consider and approve other link requests from the following types of organizations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Commonly-known consumer and/or business information sources;</li>
              <li>Dot.com community sites;</li>
              <li>Associations or other groups representing charities;</li>
              <li>Online directory distributors;</li>
              <li>Internet portals;</li>
              <li>Accounting, law, and consulting firms; and</li>
              <li>Educational institutions and trade associations.</li>
            </ul>
            <p>
              We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of Advait Stock Market Academy; and (d) the link is in the context of general resource information.
            </p>
            <p>
              These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement, or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site.
            </p>
            <p>
              If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to Advait Stock Market Academy. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.
            </p>
            <p>Approved organizations may hyperlink to our Website as follows:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>By use of our corporate name; or</li>
              <li>By use of the uniform resource locator being linked to; or</li>
              <li>Using any other description of our Website being linked to that makes sense within the context and format of content on the linking party's site.</li>
            </ul>
            <p>
              No use of Advait Stock Market Academy's logo or other artwork will be allowed for linking absent a trademark license agreement.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">Content Liability:</h3>
            <p>
              We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are raised on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene, or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">Reservation of Rights:</h3>
            <p>
              We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">Removal of links from our website:</h3>
            <p>
              If you find any link on our Website that is offensive for any reason, you are free to contact and inform us at any moment. We will consider requests to remove links, but we are not obligated to or so or to respond to you directly.
            </p>
            <p>
              We do not ensure that the information on this website is correct. We do not warrant its completeness or accuracy, nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-text-primary">Disclaimer:</h3>
            <p>
              To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Limit or exclude our or your liability for death or personal injury;</li>
              <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
              <li>Limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
              <li>Exclude any of our or your liabilities that may not be excluded under applicable law.</li>
            </ul>
            <p>
              The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort, and for breach of statutory duty.
            </p>
            <p>
              As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const BlogPageSection = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const categories = ['All', 'Trading', 'Investing', 'Technical Analysis', 'Fundamental Analysis'];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-12 md:py-20 bg-bg-primary relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12 bg-white/60 backdrop-blur-xl p-6 rounded-[28px] border border-text-primary/5 shadow-xl">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-bg-primary rounded-2xl border border-text-primary/10 text-sm focus:outline-none focus:border-accent-primary transition-all shadow-inner"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2.5 justify-center md:justify-end w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ${selectedCategory === cat
                  ? 'bg-text-primary text-bg-primary shadow-lg shadow-text-primary/10 scale-105'
                  : 'bg-white text-text-secondary border border-text-primary/5 hover:border-accent-primary hover:text-accent-primary'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-white rounded-[32px] border border-text-primary/10 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Image Wrap */}
                <div className="relative h-60 overflow-hidden">
                  <img loading="lazy"
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-accent-primary text-[10px] font-bold tracking-widest uppercase shadow-sm border border-text-primary/5">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-text-secondary text-xs font-medium mb-3">
                    <span>{post.date}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/35"></span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-text-primary mb-3 leading-snug group-hover:text-accent-primary transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>

                  <p className="text-text-secondary text-sm font-light leading-relaxed mb-6 flex-grow line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-text-primary/5 my-4"></div>

                  {/* Author and Read More */}
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-3">
                      <img loading="lazy"
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-text-primary/5"
                      />
                      <div>
                        <div className="text-xs font-bold text-text-primary">{post.author.name}</div>
                        <div className="text-[10px] text-text-secondary font-light">{post.author.role}</div>
                      </div>
                    </div>

                    <Link
                      to={`/blog/${post.id}`}
                      className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-text-primary hover:bg-accent-primary hover:text-white transition-all group/btn"
                    >
                      <svg
                        className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] border border-text-primary/10">
            <svg
              className="w-16 h-16 mx-auto text-text-secondary/35 mb-4 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-text-primary mb-2">No Articles Found</h3>
            <p className="text-text-secondary text-sm font-light">Try searching for different keywords or changing your filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const BlogPostSection = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Article Not Found</h2>
        <p className="text-text-secondary mb-8">The blog article you are looking for does not exist or has been moved.</p>
        <Link to="/blog" className="px-6 py-3 bg-accent-primary text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-text-primary transition-all">
          Back to Blog
        </Link>
      </div>
    );
  }

  // Find 3 other posts as related articles
  const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <article className="py-12 md:py-20 bg-bg-primary relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">

        {/* Breadcrumb / Category Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-widest uppercase mb-6 text-text-secondary">
          <Link to="/blog" className="hover:text-accent-primary transition-colors">Blog</Link>
          <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/35"></span>
          <span className="text-accent-primary">{post.category}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-text-primary mb-8 leading-[1.15] max-w-4xl">
          {post.title}
        </h1>

        {/* Author & Info Bar */}
        <div className="flex flex-wrap justify-between items-center gap-6 pb-8 border-b border-text-primary/10 mb-10">
          <div className="flex items-center gap-4">
            <img loading="lazy" src={post.author.avatar} alt={post.author.name} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-accent-primary shadow-md" />
            <div>
              <div className="text-sm md:text-base font-bold text-text-primary">{post.author.name}</div>
              <div className="text-xs text-text-secondary font-light">{post.author.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-text-secondary text-xs md:text-sm font-medium">
            <span>Published: {post.date}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/35"></span>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-[250px] sm:h-[400px] md:h-[550px] w-full rounded-[32px] overflow-hidden shadow-2xl mb-12 md:mb-16 border border-text-primary/10">
          <img loading="lazy" src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Layout Grid: Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">

          {/* Main Article Content */}
          <div className="lg:col-span-8 space-y-6">
            {post.content.map((block, idx) => {
              if (block.type === 'paragraph') {
                return (
                  <p key={idx} className="text-text-secondary text-base md:text-lg font-light leading-relaxed mb-6">
                    {block.text}
                  </p>
                );
              }
              if (block.type === 'heading') {
                return (
                  <h3 key={idx} className="text-2xl md:text-3xl font-display font-bold text-text-primary mt-10 mb-4 leading-tight">
                    {block.text}
                  </h3>
                );
              }
              if (block.type === 'blockquote') {
                return (
                  <blockquote key={idx} className="border-l-4 border-accent-primary bg-accent-primary/5 rounded-r-[24px] p-6 md:p-8 my-10 italic text-lg md:text-xl text-text-primary font-medium leading-relaxed shadow-sm">
                    "{block.text}"
                  </blockquote>
                );
              }
              if (block.type === 'list') {
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-3 my-6 text-text-secondary font-light text-base md:text-lg leading-relaxed">
                    {block.items.map((item, itemIdx) => {
                      const parts = item.split('**');
                      return (
                        <li key={itemIdx}>
                          {parts.map((part, partIdx) =>
                            partIdx % 2 === 1 ? <strong key={partIdx} className="font-bold text-text-primary">{part}</strong> : part
                          )}
                        </li>
                      );
                    })}
                  </ul>
                );
              }
              return null;
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">

            {/* Call to Action Box */}
            <div className="bg-text-primary rounded-[32px] p-8 shadow-2xl relative overflow-hidden text-white border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/20 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <span className="px-3 py-1 rounded-full bg-white/10 text-accent-primary text-[10px] font-bold tracking-widest uppercase mb-4 inline-block">
                  Masterclass
                </span>
                <h4 className="text-2xl font-display font-bold mb-4 text-white">Learn to Trade Profitably</h4>
                <p className="text-white/70 font-light text-sm leading-relaxed mb-6">
                  Ready to take your trading to the next level? Join Advait Stock Market Academy's practical stock market courses taught by seasoned professionals.
                </p>
                <Link to="/courses" className="w-full text-center block py-4 bg-accent-primary text-text-primary font-bold uppercase tracking-wider text-xs rounded-2xl hover:bg-white hover:text-text-primary transition-all shadow-lg hover:-translate-y-0.5">
                  View Our Courses
                </Link>
              </div>
            </div>

            {/* Related Articles */}
            <div className="bg-white rounded-[32px] p-8 border border-text-primary/10 shadow-lg">
              <h4 className="text-lg font-display font-bold text-text-primary mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-primary"></span>
                Related Articles
              </h4>
              <div className="space-y-6">
                {relatedPosts.map((related) => (
                  <Link key={related.id} to={`/blog/${related.id}`} className="group flex items-start gap-4">
                    <img loading="lazy" src={related.image} alt={related.title} className="w-16 h-16 rounded-xl object-cover border border-text-primary/5 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-accent-primary tracking-wider uppercase mb-1">{related.category}</div>
                      <h5 className="text-sm font-bold text-text-primary leading-snug group-hover:text-accent-primary transition-colors line-clamp-2">
                        {related.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </article>
  );
};

const VideoHero = () => (
  <>
    <section id="home" className="min-h-[100svh] relative overflow-hidden flex flex-col pt-32 md:pt-40 pb-10">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/quality_restoration_20260611155538832.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10 pointer-events-none"></div>
      
      {/* Top Left Text Content */}
      <div className="relative z-20 flex-grow flex flex-col justify-start mt-8 items-start text-left px-6 md:px-16 lg:px-24 w-full space-y-6 animate-fadeInUp">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-black leading-tight text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
          Advait Stock <br /> Market Academy
        </h1>
        <div className="pl-6 md:pl-8 border-l-[6px] border-accent-primary ml-1 md:ml-2">
          <p className="text-base md:text-lg lg:text-xl text-white/95 font-medium tracking-wide font-sans max-w-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-relaxed">
            Empowering your financial future <br className="hidden sm:block" /> with expert stock market training.
          </p>
        </div>
      </div>
    </section>


  </>
);

const Home = () => (
  <main className="flex-grow">
    <VideoHero />
    <MultiChartSection />
    <AboutSection />
    <ServicesSection />
    <CoursesSection />
    <GallerySection />
    <AdvantageSection />
    <ReviewsSection />
    <ContactSection />
  </main>
);

const PageWrapper = ({ children, backHash }) => {
  return (
    <main className="flex-grow pt-0 pb-12 min-h-screen relative bg-bg-secondary/5">

      {children}
    </main>
  );
};

const MarketNewsSection = () => {
  const [news, setNews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        // Appending a timestamp to the ET URL to force rss2json to bypass its 1-hour cache and fetch live news
        const timestamp = Date.now();
        const etRssUrl = encodeURIComponent(`https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms?nocache=${timestamp}`);
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${etRssUrl}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'ok' && data.items && data.items.length > 0) {
          const parsedNews = data.items.slice(0, 6).map((item, index) => {
            // Get image from enclosure or fallback
            let image = item.enclosure?.link || item.thumbnail;
            if (!image) {
              const fallbackImages = [
                "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=600&auto=format&fit=crop"
              ];
              image = fallbackImages[index % fallbackImages.length];
            }

            // Format date
            let formattedDate = item.pubDate;
            try {
              formattedDate = new Date(item.pubDate.replace(' ', 'T')).toLocaleDateString('en-IN', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });
            } catch (e) {
              // fallback to raw if date parse fails
            }

            // Clean description (remove HTML)
            let desc = item.description || "";
            desc = desc.replace(/<[^>]*>?/gm, '').trim();

            return {
              title: item.title,
              link: item.link,
              pubDate: formattedDate,
              description: desc.substring(0, 120) + '...',
              image: image
            };
          });

          setNews(parsedNews);
        } else {
          throw new Error("Failed to load ET news");
        }
      } catch (err) {
        console.error("Failed to fetch ET news:", err);
        // Fallback static data if fetch fails
        setNews([
          { title: "Market hits record high as IT stocks rally", link: "https://economictimes.indiatimes.com/markets", pubDate: "Today", description: "Indian benchmarks scaled new all-time highs driven by strong buying in IT and banking heavyweights.", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop" },
          { title: "FIIs remain net buyers for the 5th consecutive session", link: "https://economictimes.indiatimes.com/markets", pubDate: "Today", description: "Foreign institutional investors continued their buying spree, adding Rs 2,500 crore to Indian equities.", image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=600&auto=format&fit=crop" },
          { title: "RBI keeps repo rate unchanged at 6.5%", link: "https://economictimes.indiatimes.com/markets", pubDate: "Yesterday", description: "The Monetary Policy Committee decided to maintain status quo on key interest rates.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="py-16 bg-bg-secondary/5 relative">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary font-bold tracking-widest uppercase text-xs mb-4">Latest Updates</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-text-primary leading-tight font-bold">Economic Times <br className="hidden md:block" /> Market News</h2>
          </div>
          <a href="https://economictimes.indiatimes.com/markets" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-primary font-bold hover:gap-4 transition-all uppercase tracking-widest text-sm">
            View All on ET
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-3xl h-[400px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, idx) => (
              <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col h-full border border-text-primary/5">
                <div className="h-48 relative overflow-hidden shrink-0">
                  <img src={item.image} alt="news" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-wider bg-accent-primary/80 backdrop-blur px-2 py-1 rounded">{item.pubDate}</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors line-clamp-3">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{item.description}</p>
                  <div className="text-accent-primary text-sm font-bold flex items-center gap-2 mt-auto">
                    Read Article <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};



const LoginPageSection = () => {
  const [view, setView] = React.useState('login'); // 'login', 'signup'
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // For phone/email handling we can check if email includes @
    // Assuming email/password standard login
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      alert('Login Successful! Welcome to Advait Academy.');
      window.location.href = '/';
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      alert('Sign up Successful! You can now log in.');
      setView('login');
    }
  };

  return (
    <section className="py-20 min-h-[80vh] flex items-center justify-center relative bg-bg-secondary/10 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent-primary/10 rounded-full blur-[100px] mix-blend-multiply animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-[radial-gradient(#115234_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>

      <div className="container mx-auto px-4 relative z-10 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-text-primary/5 group relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-[30px] group-hover:bg-accent-primary/10 transition-colors duration-700"></div>
          
          <div className="text-center mb-8 relative z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary font-bold tracking-widest uppercase text-[10px] mb-4">
              {view === 'login' ? 'Welcome Back' : 'Join Us'}
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
              {view === 'login' ? 'User Login' : 'Create Account'}
            </h2>
            {error && <div className="mt-4 text-xs font-bold text-red-500 bg-red-50 py-2 rounded-lg border border-red-100 animate-pulse">{error}</div>}
          </div>

          {view === 'login' && (
            <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary/50">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="w-full pl-11 pr-4 py-3 bg-bg-secondary/50 border border-text-primary/10 rounded-xl focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs font-bold text-accent-primary hover:text-text-primary transition-colors">Forgot?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary/50">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
                    className="w-full pl-11 pr-4 py-3 bg-bg-secondary/50 border border-text-primary/10 rounded-xl focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-4 bg-text-primary text-bg-primary font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-accent-primary transition-all shadow-lg shadow-text-primary/10 flex items-center justify-center gap-2 group/btn ${loading ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                  {!loading && <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                </button>
              </div>

              <div className="mt-8 text-center text-sm font-medium text-text-secondary">
                Don't have an account? <button type="button" onClick={() => setView('signup')} className="text-accent-primary font-bold hover:underline ml-1">Sign up</button>
              </div>
            </form>
          )}

          {view === 'signup' && (
            <div className="space-y-6 relative z-10 animate-fadeInUp">
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary/50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email" 
                      className="w-full pl-11 pr-4 py-3 bg-bg-secondary/50 border border-text-primary/10 rounded-xl focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary/50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password" 
                      className="w-full pl-11 pr-4 py-3 bg-bg-secondary/50 border border-text-primary/10 rounded-xl focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 transition-all text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-3.5 bg-text-primary text-bg-primary font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-accent-primary transition-all shadow-lg shadow-text-primary/10 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {loading ? 'Signing Up...' : 'Sign Up with Email'}
                  </button>
                </div>
              </form>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-text-secondary text-[10px] font-bold uppercase tracking-widest">Or Continue With</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  className="flex-1 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all font-bold text-text-primary text-xs shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
              </div>

              <div className="mt-8 text-center text-sm font-medium text-text-secondary border-t border-gray-100 pt-6">
                Already have an account? <button type="button" onClick={() => setView('login')} className="text-accent-primary font-bold hover:underline ml-1">Log in</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};


const FREE_NOTES = [
  {
    id: 1,
    title: "Stock Market Reference Guide",
    summary: "Quick reference guide for common trading terms, candlestick patterns, and formulas.",
    actionUrl: "/stock-market-reference-guide.pdf"
  },
  {
    id: 2,
    title: "Technical Indicators Guide",
    summary: "Detailed notes explaining RSI, MACD, Bollinger Bands and how to use them effectively.",
    actionUrl: "/technical-indicators-guide.pdf"
  },
  {
    id: 3,
    title: "Options Trading Basics",
    summary: "Understand Calls, Puts, Strike Prices, the Greeks, and vertical spreads in this essential introduction.",
    content: (
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">What is an Option?</h4>
          <p>An option is a derivative contract that gives the buyer the right, but not the obligation, to buy or sell an underlying asset at a specific price (strike price) on or before a certain date (expiration date). Options allow traders to control 100 shares of stock for a fraction of the price, providing massive leverage.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Types of Options</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-text-primary">Call Option:</strong> Gives the buyer the right to BUY the underlying asset at the strike price. You buy a call if you are Bullish (expect the price to go UP).</li>
            <li><strong className="text-text-primary">Put Option:</strong> Gives the buyer the right to SELL the underlying asset at the strike price. You buy a put if you are Bearish (expect the price to go DOWN).</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Moneyness (ITM, OTM, ATM)</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-text-primary">In the Money (ITM):</strong> A call option where the strike price is below the current market price, or a put option where the strike is above the market price. Has intrinsic value and is safer to trade.</li>
            <li><strong className="text-text-primary">Out of the Money (OTM):</strong> A call option where the strike price is above the market price, or a put where the strike is below the market price. Cheaper, but highly risky as they expire worthless if the price doesn't move.</li>
            <li><strong className="text-text-primary">At the Money (ATM):</strong> When the strike price equals the current market price of the underlying asset. Highest extrinsic value.</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">The Options "Greeks"</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-text-primary">Delta:</strong> Measures the expected change in an option's price for a $1 change in the underlying asset's price. A delta of 0.50 means the option goes up $0.50 for every $1 the stock moves.</li>
            <li><strong className="text-text-primary">Theta:</strong> Measures the rate of time decay. Options lose value every day they get closer to expiration. Theta is the enemy of the option buyer, and the best friend of the option seller.</li>
            <li><strong className="text-text-primary">Vega:</strong> Measures sensitivity to implied volatility (IV). High IV drastically increases option premiums. Never buy options when IV is at historic highs!</li>
            <li><strong className="text-text-primary">Gamma:</strong> The rate of change of Delta. Highest for At-the-Money options close to expiration (Gamma Risk).</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Advanced Option Strategies</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-text-primary">Covered Call:</strong> Holding 100 shares of the underlying stock and selling 1 call option against it to generate premium income.</li>
            <li><strong className="text-text-primary">Protective Put:</strong> Holding the underlying stock and buying a put option as "insurance" against a market crash.</li>
            <li><strong className="text-text-primary">Bull Call Spread:</strong> Buying a lower strike call and selling a higher strike call. Limits potential profit but massively reduces the cost of the trade and protects against Theta decay.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Risk Management Strategies",
    summary: "Learn how to protect your capital, calculate position sizing, and survive drawdown periods.",
    content: (
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">The Golden 1% Rule</h4>
          <p>Never risk more than 1% of your total account capital on a single trade. If you have a ₹1,00,000 account, your maximum acceptable loss (if your stop-loss hits) should be ₹1,000. Professional traders understand that survival is more important than massive gains. The 1% rule ensures you can survive a losing streak of 10-20 trades without destroying your portfolio.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Risk/Reward Ratio (R:R)</h4>
          <p>Always aim for a risk-to-reward ratio of at least 1:2. If you are risking ₹1,000 (your stop loss distance), your target profit should be at least ₹2,000. With a 1:2 R:R, you only need to win 33% of your trades to break even! If you take 10 trades, lose 6 (lose ₹6000), and win 4 (make ₹8000), you are still net profitable.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Position Sizing Formula</h4>
          <p className="p-4 bg-bg-secondary/30 rounded-lg text-sm border border-gray-100 font-mono text-text-primary mb-3">Position Size = (Total Account Value * Risk %) / (Entry Price - Stop Loss Price)</p>
          <div className="bg-gray-50 border-l-4 border-accent-primary p-3 rounded text-sm text-text-primary">
            <strong>Example Calculation:</strong><br/>
            Account = ₹1,00,000. Risk = 1% (₹1000).<br/>
            Entry Price = ₹500. Stop Loss = ₹480. (Risk per share = ₹20)<br/>
            Position Size = 1000 / 20 = <strong>50 Shares.</strong>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Drawdowns & The Rule of Ruin</h4>
          <p>A drawdown is the peak-to-trough decline during a specific record period of an investment. If you lose 50% of your account, you do not need 50% to recover—you need <strong>100%</strong> just to get back to breakeven! This is why cutting losses early is the most critical skill in trading.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Scaling In and Out</h4>
          <p>You don't have to enter or exit a trade all at once. Professional traders use scaling to manage risk.<br/><strong>Scaling In:</strong> Buying 50% of your position at support, and the other 50% once the trend is confirmed.<br/><strong>Scaling Out:</strong> Selling half your position at your first profit target, moving your stop-loss to breakeven, and letting the rest "run" risk-free.</p>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Psychology of Trading",
    summary: "Master your mind, control your emotions, and develop the discipline of a consistently profitable trader.",
    content: (
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">The Role of Emotions</h4>
          <p>Trading is 20% strategy and 80% psychology. The two biggest emotions that destroy trading accounts are Fear and Greed. Fear makes you sell at the absolute bottom, and Greed makes you buy at the absolute top. Learning to execute your trading plan flawlessly regardless of how you feel is the ultimate goal.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Common Psychological Pitfalls</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-text-primary">Overtrading:</strong> Taking sub-optimal trades out of boredom or a desire to "make money quickly". The best trades jump off the screen at you. If you have to squint to see the setup, don't take it.</li>
            <li><strong className="text-text-primary">Moving Stop Losses:</strong> Refusing to accept a loss and moving your stop loss further away, turning a small manageable loss into an account-destroying disaster. Accept that losses are a business expense.</li>
            <li><strong className="text-text-primary">Revenge Trading:</strong> Trying to immediately win back money after a loss by doubling your position size. If you hit your daily loss limit, close the laptop and walk away.</li>
            <li><strong className="text-text-primary">FOMO (Fear Of Missing Out):</strong> Jumping into a trade late because it's already rocketing up. By the time it's obvious to everyone, you are providing exit liquidity for the smart money.</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Developing Discipline</h4>
          <p>Treat trading like a business, not a casino. Keep a detailed trading journal that logs not just entries and exits, but your emotional state during the trade. Review your mistakes every weekend, and never, ever enter a trade without a predefined entry, stop loss, and take profit level.</p>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Swing Trading Blueprint",
    summary: "A complete step-by-step framework for capturing multi-day and multi-week market trends.",
    content: (
      <div className="space-y-6 text-text-secondary leading-relaxed">
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">What is Swing Trading?</h4>
          <p>Unlike day trading (holding trades for minutes/hours), swing trading involves holding positions for several days to a few weeks to capture larger macro market moves. It requires significantly less screen time, eliminates intraday noise, and is the ideal strategy for those balancing trading with a full-time job.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">Top-Down Analysis Framework</h4>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-text-primary">1. Broad Market Trend:</strong> Check the NIFTY/SENSEX (or SPY/QQQ) on the daily/weekly chart. 75% of stocks follow the broad market. Trade WITH the overall market trend, never against it.</li>
            <li><strong className="text-text-primary">2. Sector Strength:</strong> Identify which sectors (e.g., IT, Banking, Auto, Pharma) are currently outperforming the broader market. Money rotates from sector to sector.</li>
            <li><strong className="text-text-primary">3. Stock Selection:</strong> Pick the strongest 1-2 stocks within those outperforming sectors. You want the market leaders, not the laggards.</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">The Moving Average Pullback Strategy</h4>
          <p>The most reliable swing trading setup. Stocks don't go up in a straight line; they breathe in and out. Wait for a strong stock in a confirmed uptrend to "breathe out" (pull back) to a key moving average (like the 20 EMA or 50 SMA) or a previous resistance-turned-support level on light volume.</p>
          <p className="mt-2">Look for a bullish reversal candlestick pattern (like a Hammer or Bullish Engulfing) at this support level as your entry trigger. Set your stop loss just below the swing low, and target the recent swing high for take-profit.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-primary mb-2 border-b pb-2">The Breakout Strategy</h4>
          <p>Identify a stock that has been consolidating sideways in a tight range or forming a pattern like a Cup and Handle or Bull Flag. Enter the trade when the price aggressively breaks above the resistance line on higher-than-average volume. The volume confirms that institutional buyers are participating in the breakout.</p>
        </div>
      </div>
    )
  }
];

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
      <section className="py-20 min-h-[50vh] flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">You are not logged in.</h2>
          <Link to="/login" className="px-6 py-3 bg-accent-primary text-text-primary rounded-full font-bold">Go to Login</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 min-h-[60vh] bg-bg-secondary/10 relative">
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
    </section>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  useEffect(() => {
    // Hardcode theme to pearl
    document.documentElement.setAttribute('data-theme', 'pearl');
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500 bg-bg-primary text-text-primary selection:bg-accent-primary/20 selection:text-text-primary scroll-smooth overflow-x-hidden">
      <ScrollToTop />
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<PageWrapper backHash="#analysis"><PageHero title="Analysis" subtitle="Real-time data, institutional insights, and proprietary technical sentiment." image="/hero_analysis_bg.png" tag="Market Intelligence" /><MarketNewsSection /><MultiChartSection /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper backHash="#about"><PageHero title="About Us" subtitle="Learn about our journey, our mission, and the experts behind Advait." image="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920&auto=format&fit=crop" tag="Our Story" /><AboutSection hideExploreButton={true} /><MissionVisionSection /><CoreValuesSection /></PageWrapper>} />
        <Route path="/services" element={<PageWrapper backHash="#services"><PageHero title="Services" subtitle="Comprehensive financial services designed to elevate your trading journey." image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop" tag="What We Offer" /><ServicesPageSection /></PageWrapper>} />
        <Route path="/service/:serviceId" element={<PageWrapper backHash="#services"><ServiceDetailsPage /></PageWrapper>} />
        <Route path="/courses" element={<PageWrapper backHash="#courses"><PageHero title="Courses" subtitle="Master the stock market with our expertly crafted educational programs." image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1920&auto=format&fit=crop" tag="Education" /><CoursesSection isCoursesPage={true} /></PageWrapper>} />
        <Route path="/course/:courseId" element={<PageWrapper backHash="#courses"><CourseDetailsPage /></PageWrapper>} />
        <Route path="/gallery" element={<PageWrapper backHash="#gallery"><PageHero title="Gallery" subtitle="A glimpse into our events, seminars, and academy culture." image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1920&auto=format&fit=crop" tag="Our Community" /><GallerySection isGalleryPage={true} /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper backHash="#contact"><PageHero title="Contact Us" subtitle="Get in touch with our experts. We're here to help you succeed." image="https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1920&auto=format&fit=crop" tag="Get in Touch" /><ContactSection isContactPage={true} /></PageWrapper>} />
        <Route path="/blog" element={<PageWrapper backHash="#home"><PageHero title="Academy Blog" subtitle="Insights, strategies, and tutorials from stock market experts." image="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1920&auto=format&fit=crop" tag="Learning Hub" /><BlogPageSection /></PageWrapper>} />
        <Route path="/blog/:id" element={<PageWrapper backHash="blog"><BlogPostSection /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper backHash="#home"><PageHero title="Student Dashboard" subtitle="Manage your courses, profile, and progress." image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1920&auto=format&fit=crop" tag="Dashboard" /><DashboardSection /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper backHash="#home"><PageHero title="Login" subtitle="Access your student dashboard and learning materials." image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1920&auto=format&fit=crop" tag="Account" /><LoginPageSection /></PageWrapper>} />
        <Route path="/privacy" element={<PageWrapper backHash="#home"><PageHero title="Privacy Policy" subtitle="How we handle and protect your personal data." image="/Home/4.png" tag="Legal" /><PrivacyPolicySection /></PageWrapper>} />
        <Route path="/terms" element={<PageWrapper backHash="#home"><PageHero title="Terms and Conditions" subtitle="Rules and regulations for the use of our website." image="/Home/5.png" tag="Legal" /><TermsConditionsSection /></PageWrapper>} />
      </Routes>
      <FooterSection />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919156953895?text=Hi%20Advait%20Academy!%20I%20want%20to%20inquire%20about%20your%20courses."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulsing outer ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 group-hover:opacity-0 transition-opacity"></span>

        {/* WhatsApp SVG Icon */}
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.66.986 3.292 1.493 4.9 1.495 5.429.001 9.85-4.417 9.853-9.848.001-2.633-1.025-5.101-2.871-6.948C16.62 1.997 14.161.98 11.536.98c-5.433 0-9.854 4.416-9.857 9.847-.001 1.93.515 3.501 1.49 5.093l-.989 3.616 3.733-.972.144.086zm11.352-7.147c-.287-.143-1.698-.838-1.96-.934-.263-.096-.454-.143-.645.143-.19.287-.738.934-.905 1.123-.166.19-.333.214-.62.071-.287-.143-1.21-.446-2.305-1.424-.853-.76-1.429-1.698-1.596-1.983-.167-.287-.018-.441.125-.583.129-.127.287-.335.43-.502.143-.167.19-.287.287-.477.096-.19.048-.358-.024-.502-.071-.143-.645-1.551-.884-2.123-.233-.56-.47-.482-.645-.49-.167-.008-.358-.01-.55-.01-.19 0-.501.071-.763.358-.262.287-1.002.979-1.002 2.387 0 1.408 1.026 2.768 1.17 2.96.143.19 2.019 3.084 4.891 4.324.683.294 1.217.47 1.633.603.687.218 1.312.187 1.806.114.549-.08 1.697-.693 1.937-1.362.24-.668.24-1.24.167-1.362-.072-.122-.263-.215-.55-.357z" />
        </svg>

        {/* Custom premium tooltip */}
        <span className="absolute right-full mr-3 bg-text-primary text-white text-xs font-bold py-2 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl whitespace-nowrap border border-white/10">
          Chat with us
        </span>
      </a>
    </div>
  );
}

export default App;
