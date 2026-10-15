import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { courseFaqs } from '../data';

const CoursesPage = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState('Advanced Foundation');
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const easeOut = [0.16, 1, 0.3, 1];

  const toggleFaq = (idx) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  const handleAdmissionSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const course = formData.get('course') || selectedCourseForModal;
    const text = `Hi Advait Academy! I would like to enquire about admission for ${course}.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`;
    window.open(`https://wa.me/919156953895?text=${encodeURIComponent(text)}`, '_blank');
    setIsAdmissionOpen(false);
  };

  // Verified Academy Announcements (Updated October 2026 Batch Information)
  const announcements = [
    {
      id: 'oct-batch',
      tag: 'NEW BATCH ANNOUNCEMENT',
      date: 'Starting 21 October',
      badge: 'Admissions Open',
      title: 'Admissions Open for Next Offline & Online Batch',
      desc: 'Join our comprehensive practical stock market batch covering technical analysis, live market execution, and capital protection. Offline sessions held at our Nagpur classroom on Besa–Pipla Road, alongside interactive live online access.',
      poster: '/updated_poster_1.webp',
      posterFallback: '/updated_poster_1.PNG',
      features: [
        'Live Market Practical Floor',
        'Technical Analysis & Risk Management',
        'Online & Offline Classroom Modes'
      ],
      ctaText: 'Enquire for 21 Oct Batch'
    },
    {
      id: 'small-batch',
      tag: 'INTENSIVE MENTORSHIP',
      date: 'Starting 21st Oct',
      badge: 'Limited Seats',
      title: 'Small-Batch Training (Only 5 Students per Batch)',
      desc: 'Experience high-touch, personalized coaching with strictly limited batch sizes to ensure individual attention, live screen practice, and 1-on-1 doubt clearing directly with senior mentors.',
      poster: '/updated_poster_2.webp',
      posterFallback: '/updated_poster_2.PNG',
      features: [
        'Only 5 Students Per Batch',
        '20+ Years Market Education Legacy',
        'Lifetime Mentorship & Free Repeat Classes'
      ],
      ctaText: 'Reserve Small-Batch Seat'
    },
    {
      id: 'demo-class',
      tag: 'EXPERIENCE ASMA',
      date: '21 October • 9:00 AM',
      badge: 'Free Demo Class',
      title: 'Complimentary Live Demo Session',
      desc: 'Understand how the financial markets really operate before you enroll. Learn the fundamentals of price action, candlestick patterns, and walk through a structured, practical roadmap for trading success.',
      poster: '/updated_poster_3.webp',
      posterFallback: '/updated_poster_3.PNG',
      features: [
        'How Markets Actually Work',
        'Basics of Charts & Price Action',
        'A Practical Learning Roadmap'
      ],
      ctaText: 'Book Free Demo Seat'
    }
  ];

  const programs = [
    {
      id: 'advanced-foundation',
      programNumber: '01',
      title: 'Advanced Foundation',
      badge: 'Beginner to Intermediate',
      duration: 'Approx. 2 Months',
      learningMode: 'Online Live & Offline Classroom (Nagpur)',
      overview:
        'Build a solid, practical understanding of financial markets, technical analysis, Demat operations, and disciplined risk management. Designed for individuals starting their journey towards financial literacy and confident market execution.',
      poster: '/e80ee201-5e4e-4806-b5bc-9434216dc4d4.webp',
      posterFallback: '/e80ee201-5e4e-4806-b5bc-9434216dc4d4.png',
      slug: 'advanced-foundation',
      keyTopics: [
        'Equity Market Fundamentals',
        'Commodity & Currency Markets',
        'Demat & Trading Account Operations',
        'Technical Analysis & Price Action',
        'Risk Management & Capital Protection',
        'Trading Mindset & Market Psychology'
      ]
    },
    {
      id: 'professional-master-program',
      programNumber: '02',
      title: 'Professional Master Program',
      badge: 'Advanced Mastery',
      duration: 'Approx. 4 Months',
      learningMode: 'Online Live & Offline Classroom (Nagpur)',
      overview:
        'Advanced trading techniques for serious market practitioners. Professional Master Program builds upon the Advanced Foundation curriculum to master derivatives, institutional order strategies, fundamental company valuation, and portfolio optimization.',
      poster: '/prof.master program.webp',
      posterFallback: '/prof.master program.png',
      slug: 'professional-master-program',
      keyTopics: [
        'Futures Market & Leverage Mechanics',
        'Options Strategies & Option Greeks',
        'Advanced Technical Trading Setups',
        'Fundamental Analysis & Valuation Ratios',
        'Portfolio Optimization & Hedging',
        'Advanced Psychological Discipline'
      ]
    }
  ];

  const currentAnnouncement = announcements[activeAnnouncement];

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A3326]">
      {/* 1. HERO SECTION (Compact Editorial 60/40 Split) */}
      <section className="relative pt-[144px] sm:pt-[160px] lg:pt-[190px] pb-6 sm:pb-8 lg:pb-9 bg-[#FAF9F6] w-full px-4 md:px-8 lg:px-12">
        <div className="container mx-auto px-1 md:px-0 w-full max-w-7xl">
          {/* Eyebrow: OUR COURSES with gold line reveal */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="flex items-center gap-2.5 mb-3.5 sm:mb-4"
          >
            <motion.span
              initial={shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: easeOut }}
              className="w-5 h-[1.5px] bg-[#D4AF37] origin-left shrink-0"
            />
            <span
              className="text-[11.5px] sm:text-[12px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              OUR COURSES
            </span>
          </motion.div>

          {/* 60/40 Editorial Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 xl:gap-12 items-start text-left">
            {/* Left 60%: H1 */}
            <div className="lg:col-span-7 xl:col-span-7">
              <motion.h1
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: isMobile ? 0.38 : 0.55, ease: easeOut }}
                className="text-[30px] sm:text-[34px] md:text-[42px] lg:text-[48px] xl:text-[50px] font-semibold text-[#1A3326] tracking-tight leading-[1.14]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Stock Market Courses in <span className="text-[#D4AF37]">Nagpur.</span>
              </motion.h1>
            </div>

            {/* Right 40%: Description */}
            <div className="lg:col-span-5 xl:col-span-5 lg:pt-2">
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.08, ease: easeOut }}
                className="text-[14.5px] sm:text-[15.5px] md:text-[16px] text-[#4A6356] font-normal leading-[1.65]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Explore practical stock market training at ASMA, from market fundamentals and technical analysis to futures, options and risk management.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT'S TRENDING NOW — ACADEMY ANNOUNCEMENTS (Compact Feature Layout) */}
      <section className="pt-6 sm:pt-8 md:pt-10 pb-12 sm:pb-14 md:pb-16 bg-[#FAF9F6] border-b border-[#0B2117]/10 w-full px-4 md:px-8 lg:px-12">
        <div className="container mx-auto px-1 md:px-0 w-full max-w-7xl">
          {/* Header & Tab Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 text-left">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-[1.5px] bg-[#D4AF37]" />
                <span
                  className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  ACADEMY ANNOUNCEMENTS
                </span>
              </div>
              <h2
                className="text-[24px] sm:text-[28px] md:text-[34px] font-semibold text-[#1A3326] tracking-tight leading-snug"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                What's Trending <span className="text-[#D4AF37]">Now.</span>
              </h2>
            </div>

            {/* Announcement Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-[4px] border border-[#0B2117]/10 self-start md:self-auto">
              {announcements.map((ann, idx) => (
                <button
                  key={ann.id}
                  onClick={() => setActiveAnnouncement(idx)}
                  className={`px-3 sm:px-4 py-1.5 text-xs font-['Inter'] font-semibold rounded-[3px] transition-colors duration-200 cursor-pointer ${
                    activeAnnouncement === idx
                      ? 'bg-[#063925] text-white shadow-xs'
                      : 'text-[#4A6356] hover:text-[#1A3326]'
                  }`}
                >
                  {idx === 0 ? 'Batch 21 Oct' : idx === 1 ? 'Small Batch' : 'Free Demo'}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Card */}
          <motion.div
            key={currentAnnouncement.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="bg-white rounded-[6px] border border-[#0B2117]/10 p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(11,33,23,0.05)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center text-left">
              {/* Left / Info (7 Cols) */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-[3px] bg-[#063925]/10 text-[#063925] font-['Inter'] font-semibold uppercase tracking-wider text-[11px]">
                    {currentAnnouncement.tag}
                  </span>
                  <span className="px-2.5 py-1 rounded-[3px] bg-[#FAF9F6] border border-[#0B2117]/10 text-[#063925] font-['Inter'] font-semibold text-xs">
                    {currentAnnouncement.date}
                  </span>
                  <span className="px-2.5 py-1 rounded-[3px] bg-[#D4AF37]/15 text-[#8C6D1F] font-['Inter'] font-semibold text-xs">
                    {currentAnnouncement.badge}
                  </span>
                </div>

                <h3
                  className="text-[22px] sm:text-[26px] md:text-[30px] font-semibold text-[#1A3326] tracking-tight leading-snug"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {currentAnnouncement.title}
                </h3>

                <p
                  className="text-[14.5px] sm:text-[15.5px] text-[#4A6356] font-normal leading-[1.7]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {currentAnnouncement.desc}
                </p>

                {/* Features List */}
                <div className="space-y-2 pt-1 border-t border-[#0B2117]/10">
                  {currentAnnouncement.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-[13px] font-['Inter'] text-[#1A3326]">
                      <span className="w-4 h-4 rounded-full bg-[#063925]/10 flex items-center justify-center text-[#063925] font-bold text-[10px] shrink-0">
                        ✓
                      </span>
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedCourseForModal(currentAnnouncement.title);
                      setIsAdmissionOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#063925] hover:bg-[#0B2117] text-white text-xs font-['Inter'] font-semibold uppercase tracking-wider rounded-[4px] shadow-sm transition-colors duration-200 cursor-pointer min-h-[46px]"
                  >
                    <span>{currentAnnouncement.ctaText}</span>
                    <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>

                  <a
                    href="tel:+919156953895"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-[#0B2117]/15 hover:border-[#063925] text-[#063925] text-xs font-['Inter'] font-semibold uppercase tracking-wider rounded-[4px] transition-colors duration-200 min-h-[46px]"
                  >
                    <span>Call +91 91569 53895</span>
                  </a>
                </div>
              </div>

              {/* Right / Visual Poster (5 Cols) */}
              <div className="lg:col-span-5 flex justify-center">
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.55, ease: easeOut }}
                  className="relative w-full max-w-[340px] rounded-[6px] overflow-hidden border border-[#0B2117]/10 shadow-[0_6px_24px_rgba(11,33,23,0.08)] bg-[#0B2117]"
                >
                  <img
                    src={currentAnnouncement.poster}
                    alt={currentAnnouncement.title}
                    className="w-full h-auto object-contain block"
                    loading="eager"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. WHY CHOOSE ADVAIT? (Practical Learning & Brochure Section) */}
      <section className="py-14 sm:py-16 md:py-20 bg-white border-b border-[#0B2117]/10 w-full px-4 md:px-8 lg:px-12">
        <div className="container mx-auto px-1 md:px-0 w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start text-left">
            {/* Left 5 Cols: Overview, Metrics & Brochure Download */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-4 h-[1.5px] bg-[#D4AF37]" />
                <span
                  className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  WHY CHOOSE ASMA
                </span>
              </div>

              <h2
                className="text-[24px] sm:text-[28px] md:text-[34px] font-semibold text-[#1A3326] tracking-tight leading-snug"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Master the Markets with Nagpur's Premier Academy
              </h2>

              <p
                className="text-[14.5px] text-[#4A6356] font-normal leading-[1.7]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Advait Stock Market Academy bridges the gap between academic theory and real-time order execution. Guided by founder Satish Bobade with over 20 years of hands-on experience, our students learn to navigate volatile market environments with calculated risk parameters.
              </p>

              {/* 2 Highlight Chips */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-4 bg-[#FAF9F6] rounded-[4px] border border-[#0B2117]/10">
                  <div
                    className="text-2xl font-bold text-[#063925]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    100%
                  </div>
                  <div className="text-[11px] text-[#4A6356] font-['Inter'] font-semibold uppercase tracking-wider mt-1">
                    Practical Live Screen
                  </div>
                </div>
                <div className="p-4 bg-[#FAF9F6] rounded-[4px] border border-[#0B2117]/10">
                  <div
                    className="text-2xl font-bold text-[#063925]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    Lifetime
                  </div>
                  <div className="text-[11px] text-[#4A6356] font-['Inter'] font-semibold uppercase tracking-wider mt-1">
                    Trading Community
                  </div>
                </div>
              </div>

              {/* Download Brochure CTA */}
              <div className="pt-2">
                <a
                  href="/ASMA_brochure_updated.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#063925] hover:bg-[#0B2117] text-white text-xs font-['Inter'] font-semibold uppercase tracking-wider rounded-[4px] shadow-sm transition-colors duration-200 min-h-[46px]"
                >
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Academy Brochure (PDF)</span>
                </a>
              </div>
            </div>

            {/* Right 7 Cols: Detailed Pillars & Verified Benefits */}
            <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-[#0B2117]/10 lg:pl-10">
              <p
                className="text-[14.5px] sm:text-[15.5px] text-[#1A3326] font-normal leading-[1.75]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Every batch includes live-session practice on real trading terminals, in-depth analysis of breakout formations, and disciplined money management protocols to build consistent execution.
              </p>

              {/* Verified Learning Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#0B2117]/10">
                <div className="p-4 rounded-[4px] bg-[#FAF9F6] border border-[#0B2117]/10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#063925]/10 flex items-center justify-center text-[#063925] font-bold text-xs shrink-0">
                      ✓
                    </span>
                    <h4
                      className="text-[14.5px] font-semibold text-[#1A3326]"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      Practical Live Market Floor
                    </h4>
                  </div>
                  <p className="text-xs text-[#4A6356] font-['Inter'] leading-relaxed pl-7">
                    Execute trades and observe order flow dynamics during live trading sessions in Nagpur.
                  </p>
                </div>

                <div className="p-4 rounded-[4px] bg-[#FAF9F6] border border-[#0B2117]/10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#063925]/10 flex items-center justify-center text-[#063925] font-bold text-xs shrink-0">
                      ✓
                    </span>
                    <h4
                      className="text-[14.5px] font-semibold text-[#1A3326]"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      Proprietary Breakout Setups
                    </h4>
                  </div>
                  <p className="text-xs text-[#4A6356] font-['Inter'] leading-relaxed pl-7">
                    Time-tested chart setups, trendline rules, and price action indicators refined over 20+ years.
                  </p>
                </div>

                <div className="p-4 rounded-[4px] bg-[#FAF9F6] border border-[#0B2117]/10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#063925]/10 flex items-center justify-center text-[#063925] font-bold text-xs shrink-0">
                      ✓
                    </span>
                    <h4
                      className="text-[14.5px] font-semibold text-[#1A3326]"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      Direct Faculty Doubt Clearing
                    </h4>
                  </div>
                  <p className="text-xs text-[#4A6356] font-['Inter'] leading-relaxed pl-7">
                    Direct access to Satish Bobade and market veterans with dedicated personal doubt-clearing sessions.
                  </p>
                </div>

                <div className="p-4 rounded-[4px] bg-[#FAF9F6] border border-[#0B2117]/10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#063925]/10 flex items-center justify-center text-[#063925] font-bold text-xs shrink-0">
                      ✓
                    </span>
                    <h4
                      className="text-[14.5px] font-semibold text-[#1A3326]"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      Risk-to-Reward Psychology
                    </h4>
                  </div>
                  <p className="text-xs text-[#4A6356] font-['Inter'] leading-relaxed pl-7">
                    Rigorous capital preservation rules, position sizing formulas, and emotional discipline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR TWO PROGRAMS (Wide Editorial Showcases) */}
      <section className="py-14 sm:py-16 md:py-20 bg-[#FAF9F6] border-b border-[#0B2117]/10 w-full px-4 md:px-8 lg:px-12">
        <div className="container mx-auto px-1 md:px-0 w-full max-w-7xl">
          {/* Section Header */}
          <div className="mb-10 sm:mb-12 md:mb-16 text-left">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-5 h-[1.5px] bg-[#D4AF37]" />
              <span
                className="text-[11.5px] sm:text-[12px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                OUR TWO PROGRAMS
              </span>
            </div>
            <h2
              className="text-[26px] sm:text-[32px] md:text-[38px] font-semibold text-[#1A3326] tracking-tight leading-snug mb-3"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Find Your <span className="text-[#D4AF37]">Learning Path.</span>
            </h2>
            <p
              className="text-[14.5px] sm:text-[15.5px] text-[#4A6356] max-w-2xl font-normal leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Elevate your financial literacy and execution discipline with structured offline classroom and interactive online programs in Nagpur.
            </p>
          </div>

          {/* Program Showcases */}
          <div className="space-y-12 sm:space-y-16 lg:space-y-20">
            {programs.map((prog) => (
              <motion.div
                key={prog.id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: isMobile ? 0.38 : 0.5, ease: easeOut }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center pb-12 sm:pb-16 lg:pb-20 border-b border-[#0B2117]/10 last:border-b-0 last:pb-0"
              >
                {/* 35-40% Left: Original Course Poster */}
                <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-start">
                  <div className="relative w-full max-w-[380px] aspect-square rounded-[6px] overflow-hidden border border-[#0B2117]/10 shadow-[0_4px_24px_rgba(11,33,23,0.06)] bg-white group">
                    <img
                      src={prog.poster}
                      alt={`${prog.title} Course Poster`}
                      className="w-full h-full object-cover object-center transition-transform duration-250 ease-out group-hover:scale-[1.02]"
                      loading="eager"
                      onError={(e) => {
                        if (prog.posterFallback && e.target.src !== prog.posterFallback) {
                          e.target.src = prog.posterFallback;
                        }
                      }}
                    />
                  </div>
                </div>

                {/* 60-65% Right: Information, Metadata, Key Topics, CTA */}
                <div className="lg:col-span-7 xl:col-span-7 text-left space-y-4 sm:space-y-5">
                  {/* Metadata Chips Strip */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-['Inter']">
                    <span className="px-2.5 py-1 rounded-[3px] bg-[#063925] text-white font-semibold uppercase tracking-wider text-[11px]">
                      PROGRAM {prog.programNumber}
                    </span>
                    <span className="px-2.5 py-1 rounded-[3px] bg-white border border-[#0B2117]/10 text-[#063925] font-semibold">
                      {prog.duration}
                    </span>
                    <span className="px-2.5 py-1 rounded-[3px] bg-white border border-[#0B2117]/10 text-[#4A6356]">
                      {prog.learningMode}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3
                    className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-[#1A3326] tracking-tight leading-snug"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {prog.title}
                  </h3>

                  {/* Course Overview */}
                  <p
                    className="text-[14.5px] sm:text-[15.5px] text-[#4A6356] leading-[1.7] max-w-2xl font-normal"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {prog.overview}
                  </p>

                  {/* Key Syllabus Topics */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-3.5 h-[1.5px] bg-[#D4AF37]" />
                      <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#063925] font-['Inter']">
                        CORE SYLLABUS TOPICS
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                      {prog.keyTopics.map((topic, tIdx) => (
                        <div
                          key={tIdx}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-[3px] bg-white border border-[#0B2117]/10 text-[#1A3326] text-[13px] font-['Inter']"
                        >
                          <span className="text-[#D4AF37] text-xs font-bold">✓</span>
                          <span className="font-medium text-[#1A3326] truncate">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Actions */}
                  <div className="pt-3 flex flex-wrap items-center gap-3.5">
                    <Link
                      to={`/course/${prog.slug}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#063925] hover:bg-[#0B2117] text-white text-xs font-['Inter'] font-semibold uppercase tracking-wider rounded-[4px] shadow-sm transition-colors duration-200 min-h-[44px]"
                    >
                      <span>View Course Details</span>
                      <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>

                    <button
                      onClick={() => {
                        setSelectedCourseForModal(prog.title);
                        setIsAdmissionOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#063925]/20 hover:border-[#063925] text-[#063925] text-xs font-['Inter'] font-semibold uppercase tracking-wider rounded-[4px] transition-colors duration-200 min-h-[44px] cursor-pointer"
                    >
                      <span>Enquire on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COURSE FAQS (Minimal Editorial Accordion) */}
      <section className="py-14 sm:py-16 md:py-20 bg-white border-b border-[#0B2117]/10 w-full px-4 md:px-8 lg:px-12">
        <div className="container mx-auto px-1 md:px-0 w-full max-w-4xl text-left">
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="w-4 h-[1.5px] bg-[#D4AF37]" />
              <span
                className="text-[11.5px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                FREQUENTLY ASKED QUESTIONS
              </span>
            </div>
            <h2
              className="text-[26px] sm:text-[32px] md:text-[36px] font-semibold text-[#1A3326] tracking-tight leading-snug"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Questions About Our Courses.
            </h2>
          </div>

          <div className="border-t border-[#0B2117]/10 divide-y divide-[#0B2117]/10">
            {courseFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="transition-colors">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-5 sm:py-5.5 text-left flex items-center justify-between gap-4 group cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span
                      className="text-[15px] sm:text-[16.5px] font-semibold text-[#1A3326] group-hover:text-[#063925] transition-colors leading-snug"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium border transition-colors ${
                        isOpen
                          ? 'border-[#D4AF37] text-[#D4AF37] bg-[#FAF9F6]'
                          : 'border-[#0B2117]/15 text-[#063925] group-hover:border-[#D4AF37] group-hover:text-[#D4AF37]'
                      }`}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: easeOut }}
                        className="overflow-hidden"
                      >
                        <p
                          className="pb-5 sm:pb-6 text-[14px] sm:text-[15px] text-[#4A6356] font-normal leading-[1.75]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FINAL ADMISSIONS CTA (Compact Dark Forest Green Strip) */}
      <section className="py-12 sm:py-14 md:py-16 bg-[#06261A] text-white w-full px-4 md:px-8 lg:px-12 border-t border-[#0B2117]/20">
        <div className="container mx-auto px-1 md:px-0 w-full max-w-7xl">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10 text-left"
          >
            {/* Left: Heading and Description */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-4 h-[1.5px] bg-[#D4AF37]" />
                <span
                  className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#D4AF37]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  READY TO GET STARTED?
                </span>
              </div>

              <h2
                className="text-[26px] sm:text-[30px] md:text-[34px] font-semibold text-white tracking-tight leading-tight mb-2.5"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Start Learning with ASMA.
              </h2>

              <p
                className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Explore the right stock market training program for your learning goals and connect with our admissions team.
              </p>
            </div>

            {/* Right: CTA Actions */}
            <div className="flex flex-wrap items-center gap-3.5 shrink-0">
              <button
                onClick={() => {
                  setSelectedCourseForModal('General Course Enquiry');
                  setIsAdmissionOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 bg-[#D4AF37] hover:bg-[#C5A059] text-[#06261A] font-['Inter'] font-semibold text-xs tracking-wider uppercase rounded-[4px] shadow-sm transition-colors duration-200 cursor-pointer min-h-[46px]"
              >
                <span>Connect with Admissions</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <a
                href="tel:+919156953895"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-white/20 hover:border-[#D4AF37] text-white/90 hover:text-white font-['Inter'] font-semibold text-xs tracking-wider uppercase rounded-[4px] transition-colors duration-200 min-h-[46px]"
              >
                <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+91 91569 53895</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ADMISSIONS ENQUIRY MODAL */}
      {isAdmissionOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0B2117]/70 backdrop-blur-sm"
            onClick={() => setIsAdmissionOpen(false)}
          />
          <div className="relative bg-white rounded-[6px] p-6 sm:p-8 md:p-10 w-full max-w-lg shadow-2xl border border-[#0B2117]/10 z-10 text-left">
            <button
              onClick={() => setIsAdmissionOpen(false)}
              className="absolute top-5 right-5 text-[#4A6356] hover:text-[#1A3326] transition-colors p-1 cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-3.5 h-[1.5px] bg-[#D4AF37]" />
                <span className="text-[#063925] font-['Inter'] font-semibold text-[11px] tracking-wider uppercase block">
                  ADMISSIONS DESK
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-['Manrope'] font-semibold text-[#1A3326]">
                Enquire with ASMA Admissions
              </h3>
              <p className="text-xs sm:text-[13px] text-[#4A6356] font-['Inter'] mt-1.5 leading-relaxed">
                Connect with our academic counselors in Nagpur for batch timings, curriculum details, and enrollment queries.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleAdmissionSubmit}>
              <div>
                <label className="block text-xs font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  required
                  name="name"
                  type="text"
                  className="w-full px-4 py-2.5 rounded-[4px] border border-[#0B2117]/20 bg-[#FAF9F6] focus:bg-white focus:border-[#063925] outline-none text-sm font-['Inter'] text-[#1A3326] transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1.5">
                  Interested Program
                </label>
                <select
                  name="course"
                  defaultValue={selectedCourseForModal}
                  className="w-full px-4 py-2.5 rounded-[4px] border border-[#0B2117]/20 bg-[#FAF9F6] focus:bg-white focus:border-[#063925] outline-none text-sm font-['Inter'] text-[#1A3326] transition-colors"
                >
                  <option value="Advanced Foundation">Advanced Foundation (Approx. 2 Months)</option>
                  <option value="Professional Master Program">Professional Master Program (Approx. 4 Months)</option>
                  <option value="21 Oct Batch Enquiry">New Batch Starting 21 Oct (Online/Offline)</option>
                  <option value="Small Batch Enquiry">Small Batch (Only 5 Students per Batch)</option>
                  <option value="Free Demo Class Enquiry">Free Demo Class (21 Oct 9:00 AM)</option>
                  <option value="General Course Enquiry">General Course Counseling</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    className="w-full px-4 py-2.5 rounded-[4px] border border-[#0B2117]/20 bg-[#FAF9F6] focus:bg-white focus:border-[#063925] outline-none text-sm font-['Inter'] text-[#1A3326] transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1.5">
                    Phone
                  </label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    className="w-full px-4 py-2.5 rounded-[4px] border border-[#0B2117]/20 bg-[#FAF9F6] focus:bg-white focus:border-[#063925] outline-none text-sm font-['Inter'] text-[#1A3326] transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#063925] hover:bg-[#0B2117] text-white font-['Inter'] font-semibold uppercase tracking-wider text-xs rounded-[4px] transition-colors mt-2 cursor-pointer shadow-sm"
              >
                Send Enquiry to Admissions on WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
