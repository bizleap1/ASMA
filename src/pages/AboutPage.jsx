import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import FaqSection from '../components/FaqSection';
import { aboutContactFaqs } from '../data';

const AboutPage = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const easeOut = [0.16, 1, 0.3, 1];
  const vp = { once: true, amount: 0.15 };

  // Factual Key Metrics
  const stats = [
    { value: '10,000+', label: 'Students Mentored', sub: 'Across Nagpur & Maharashtra' },
    { value: '20+ Years', label: 'Market Experience', sub: 'Active Trading Since 2006' },
    { value: '5.0 / 5', label: 'Average Rating', sub: 'Verified Student Reviews' },
    { value: '50+', label: 'Practical Strategies', sub: 'Equity, F&O & Commodities' },
  ];

  // Learning Principles
  const learningPrinciples = [
    {
      index: '01',
      title: 'Integrity & Transparency',
      desc: 'Practical teaching without get-rich-quick promises.',
    },
    {
      index: '02',
      title: 'Live-Market Learning',
      desc: 'Understand price action and trading concepts through market examples.',
    },
    {
      index: '03',
      title: 'Disciplined Risk Management',
      desc: 'Learn position sizing, risk awareness and responsible decisions.',
    },
    {
      index: '04',
      title: 'Independent Thinking',
      desc: 'Build analytical skills instead of relying on unverified trading tips.',
    },
  ];

  // Campus & Classroom Highlights
  const campusImages = [
    {
      src: '/Home/1.webp',
      alt: 'Reception and front entrance desk at ASMA Nagpur campus',
      title: 'Reception & Welcome Desk',
      desc: 'Main academy reception and counselor desk at Besa–Pipla Road.',
    },
    {
      src: '/Home/3.webp',
      alt: 'Live market trading classroom and mentor desks at ASMA Nagpur',
      title: 'Live Trading Classroom',
      desc: 'Dedicated student workstations for real-time chart analysis.',
    },
    {
      src: '/Home/4.webp',
      alt: 'Official ASMA academy branding and information display in Nagpur',
      title: 'Academy Resource Desk',
      desc: 'Official institutional branding and student guidance center.',
    },
  ];

  return (
    <div className="bg-[#FAF9F5] text-[#1A3326]">
      {/* 1. HERO SECTION - Premium Minimal Editorial Page Intro */}
      <section className="relative pt-[136px] sm:pt-[152px] lg:pt-[186px] pb-6 sm:pb-8 lg:pb-10 bg-[#FAF9F5] w-full px-4 md:px-8 lg:px-12">
        <div className="container mx-auto px-1 md:px-0 w-full">


          {/* Minimal Gold Line Eyebrow */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="flex items-center gap-2.5 mb-4 sm:mb-5"
          >
            <span className="w-5 h-[1.5px] bg-[#D4AF37] shrink-0" />
            <span
              className="text-[11.5px] sm:text-[12px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              GET TO KNOW ASMA
            </span>
          </motion.div>

          {/* Asymmetrical Editorial Header: ~60% Heading Left, ~40% Description Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 xl:gap-12 items-start">
            {/* Left Column: Heading (H1) */}
            <div className="lg:col-span-7 xl:col-span-7">
              <motion.h1
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: easeOut }}
                className="text-[32px] sm:text-[38px] md:text-[42px] lg:text-[44px] xl:text-[48px] font-semibold text-[#1A3326] tracking-tight leading-[1.15]"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
              >
                About <span className="text-[#D4AF37]">Advait</span>{' '}
                <span className="inline-block">Stock Market Academy.</span>
              </motion.h1>
            </div>

            {/* Right Column: Concise Editorial Description */}
            <div className="lg:col-span-5 xl:col-span-5 lg:pt-2">
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15, ease: easeOut }}
                className="text-[15px] sm:text-[15.5px] lg:text-[16px] text-[#4A6356] font-normal leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Discover ASMA's approach to stock market training in Nagpur, combining practical learning, technical analysis and risk management.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUNDER & HEAD MENTOR SECTION (Satish Bobade) */}
      <section className="pt-6 sm:pt-8 lg:pt-12 pb-4 sm:pb-6 bg-[#FAF9F5]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-start">
            
            {/* Left Column: Authentic Founder Photograph & Attribution */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 10 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.35 : 0.55, ease: easeOut }}
              className="lg:col-span-5 flex flex-col items-center lg:items-start"
            >
              <div className="w-full max-w-[340px] sm:max-w-[370px] rounded-[4px] border border-black/10 bg-[#F2F5F3] overflow-hidden">
                <picture>
                  <source srcSet="/asma%20founder.webp" type="image/webp" />
                  <img
                    src="/asma%20founder.png"
                    alt="Satish Bobade — Founder and Head Mentor at Advait Stock Market Academy Nagpur"
                    width="448"
                    height="560"
                    decoding="async"
                    className="w-full h-[370px] sm:h-[430px] lg:h-[460px] object-cover object-top"
                  />
                </picture>
              </div>

              {/* Attribution Below Photograph: Left: Name / Designation — Right: 20+ Years / Market Experience */}
              <div className="w-full max-w-[340px] sm:max-w-[370px] mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-2">
                {/* Left: Founder Name & Designation */}
                <div>
                  <h3
                    className="text-[23px] sm:text-[24px] font-semibold text-[#1A3326] tracking-tight leading-tight"
                    style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                  >
                    Satish Bobade
                  </h3>
                  <p
                    className="text-[14px] sm:text-[14.5px] text-[#4A6356] font-normal leading-normal mt-0.5"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                  >
                    Founder &amp; Head Mentor
                  </p>
                </div>

                {/* Right: 20+ Years / Market Experience */}
                <div className="sm:text-right">
                  <div
                    className="text-[19px] sm:text-[20px] font-semibold text-[#C5A028] leading-tight"
                    style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                  >
                    20+ Years
                  </div>
                  <p
                    className="text-[13px] sm:text-[13.5px] text-[#1A3326] font-medium leading-normal mt-0.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Market Experience
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Founder's Story & Philosophy */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.55, ease: easeOut }}
              className="lg:col-span-7 flex flex-col justify-start lg:pt-1"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-5 h-[1.5px] bg-[#D4AF37] shrink-0" />
                <span
                  className="text-[11.5px] sm:text-[12px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  MEET THE FOUNDER
                </span>
              </div>

              {/* Heading */}
              <h2
                className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-[#1A3326] leading-[1.25] tracking-tight mb-4"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
              >
                Demystifying the Markets Through <span className="text-[#D4AF37]">Practical Discipline.</span>
              </h2>

              {/* Concise Narrative Paragraphs */}
              <div
                className="space-y-3.5 text-[14.5px] sm:text-[15.5px] text-[#4A6356] font-normal leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <p>
                  Led by Satish Bobade, Advait Stock Market Academy in Nagpur focuses on practical stock market education, technical analysis and disciplined risk management.
                </p>
                <p>
                  The approach emphasizes understanding market behavior, developing analytical skills and making informed decisions rather than relying on unverified trading tips.
                </p>
              </div>

              {/* 4 Core Learning Strengths: Clean, Minimal 2x2 Layout without decorative dots/boxes */}
              <div className="pt-5 mt-5 border-t border-black/10 grid grid-cols-2 gap-x-6 gap-y-3 max-w-sm">
                {[
                  'Price Action',
                  'Risk Management',
                  'Practical Learning',
                  'Mentorship'
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="text-[14px] sm:text-[14.5px] font-semibold text-[#1A3326] tracking-tight"
                    style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION - Clean Editorial Layout */}
      <section className="pt-4 sm:pt-6 pb-8 sm:pb-10 bg-[#FAF9F5]">
        <div className="container mx-auto px-5 sm:px-6 lg:px-12 max-w-5xl">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
            {/* Eyebrow: subtle gold-line reveal & text fade-in */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={vp}
              transition={{ duration: 0.4, ease: easeOut }}
              className="flex items-center justify-center gap-2 mb-2.5"
            >
              <motion.span
                initial={shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={vp}
                transition={{ duration: 0.4, ease: easeOut }}
                className="w-5 h-[1.5px] bg-[#D4AF37] origin-left"
              />
              <span
                className="text-[11.5px] sm:text-[12px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                OUR PURPOSE
              </span>
              <motion.span
                initial={shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={vp}
                transition={{ duration: 0.4, ease: easeOut }}
                className="w-5 h-[1.5px] bg-[#D4AF37] origin-right"
              />
            </motion.div>

            {/* Main Heading: smooth fade-up (14px desktop / 8px mobile, 550ms / 400ms) */}
            <motion.h2
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.4 : 0.55, ease: easeOut }}
              className="text-[28px] sm:text-[32px] lg:text-[34px] font-semibold text-[#1A3326] tracking-tight leading-[1.2]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
            >
              Our Mission. <span className="text-[#D4AF37]">Our Vision.</span>
            </motion.h2>
          </div>

          {/* 2-Column Editorial Grid with Vertical Divider (Desktop) & Horizontal Divider (Mobile) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={vp}
            transition={{ duration: 0.4, ease: easeOut }}
            className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black/10"
          >
            {/* 01 / MISSION Column */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.38 : 0.55, ease: easeOut }}
              className="pb-8 md:pb-0 md:pr-10 lg:pr-14 flex flex-col justify-start"
            >
              <span
                className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C5A028] mb-2 block"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                01 / MISSION
              </span>
              <h3
                className="text-xl sm:text-[22px] font-semibold text-[#1A3326] tracking-tight mb-2.5"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
              >
                Empowering Independent Learners
              </h3>
              <p
                className="text-[14px] sm:text-[15px] text-[#4A6356] font-normal leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                To provide practical stock market education that builds analytical skills, risk awareness and disciplined decision-making across real market conditions.
              </p>
            </motion.div>

            {/* 02 / VISION Column: starts 120ms after Mission on desktop, gentle stagger on mobile */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.38 : 0.55, delay: isMobile ? 0.08 : 0.12, ease: easeOut }}
              className="pt-8 md:pt-0 md:pl-10 lg:pl-14 flex flex-col justify-start"
            >
              <span
                className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#C5A028] mb-2 block"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                02 / VISION
              </span>
              <h3
                className="text-xl sm:text-[22px] font-semibold text-[#1A3326] tracking-tight mb-2.5"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
              >
                Building a Trusted Learning Community
              </h3>
              <p
                className="text-[14px] sm:text-[15px] text-[#4A6356] font-normal leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                To make structured market education more accessible and encourage informed, responsible participation in financial markets through ongoing mentorship.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. CAMPUS & CLASSROOM PRESENCE IN NAGPUR */}
      <section className="pt-8 sm:pt-10 pb-12 md:pb-16 bg-[#FAF9F5] border-b border-black/5 w-full px-4 md:px-8 lg:px-12">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={vp}
                transition={{ duration: 0.4, ease: easeOut }}
                className="flex items-center gap-2 mb-2"
              >
                <motion.span
                  initial={shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={vp}
                  transition={{ duration: 0.4, ease: easeOut }}
                  className="w-5 h-[1.5px] bg-[#D4AF37] origin-left"
                />
                <span
                  className="text-[11.5px] sm:text-[12px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  CAMPUS &amp; LEARNING DESK
                </span>
              </motion.div>
              <motion.h2
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={vp}
                transition={{ duration: isMobile ? 0.4 : 0.55, ease: easeOut }}
                className="text-2xl sm:text-3xl font-semibold text-[#1A3326] tracking-tight text-left"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
              >
                Inside the ASMA Nagpur Training Center
              </motion.h2>
            </div>
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={vp}
              transition={{ duration: 0.45, ease: easeOut }}
              className="text-[13px] sm:text-[14px] text-[#4A6356] max-w-md font-normal text-left"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Equipped with live multi-screen charting displays, dedicated student trading terminals, and direct mentor desks on Besa–Pipla Road.
            </motion.p>
          </div>

          {/* Genuine Academy Classroom Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {campusImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={vp}
                transition={{
                  duration: isMobile ? 0.38 : 0.5,
                  delay: isMobile ? idx * 0.06 : idx * 0.1,
                  ease: easeOut
                }}
                className="bg-white border border-black/10 rounded-[5px] overflow-hidden flex flex-col group shadow-none"
              >
                <div className="relative h-52 sm:h-56 overflow-hidden bg-[#EAEFEA]">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-250 lg:group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3
                      className="text-[15px] sm:text-[16px] font-semibold text-[#1A3326] mb-1"
                      style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                    >
                      {img.title}
                    </h3>
                    <p
                      className="text-[13px] text-[#556960] leading-snug"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {img.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Compact Location & Directions Bar */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={vp}
            transition={{ duration: 0.45, ease: easeOut }}
            className="mt-6 p-4 sm:p-5 rounded-[5px] bg-white border border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[4px] bg-[#063925]/10 text-[#063925] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#063925]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-[#1A3326]" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
                  Plot 28, Oshian SuperCity 3, Besa–Pipla Road, Nagpur
                </p>
                <p className="text-[12px] text-[#718079]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Open Daily 8:00 AM – 10:00 PM for Classroom Counseling &amp; Live Batches
                </p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Advait+Stock+Market+Academy+Besa+Nagpur"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[12.5px] font-semibold text-[#063925] border border-[#063925]/30 rounded-[4px] hover:bg-[#063925] hover:text-white transition-colors shrink-0"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Get Directions
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* 5. LEARNING PRINCIPLES - Premium Editorial 4-Column Layout (Deep Forest Green) */}
      <section className="py-12 md:py-16 bg-[#08291D] text-white">
        <div className="container mx-auto px-5 sm:px-6 lg:px-12 max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            {/* Eyebrow: symmetrical gold-line reveal & text fade-in */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={vp}
              transition={{ duration: 0.4, ease: easeOut }}
              className="flex items-center justify-center gap-2 mb-2.5"
            >
              <motion.span
                initial={shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={vp}
                transition={{ duration: 0.4, ease: easeOut }}
                className="w-5 h-[1.5px] bg-[#D4AF37] origin-left"
              />
              <span
                className="text-[11.5px] sm:text-[12px] font-semibold tracking-[0.16em] uppercase text-[#D4AF37]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                OUR LEARNING PRINCIPLES
              </span>
              <motion.span
                initial={shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={vp}
                transition={{ duration: 0.4, ease: easeOut }}
                className="w-5 h-[1.5px] bg-[#D4AF37] origin-right"
              />
            </motion.div>

            {/* Heading: gentle fade-up 12px, 550ms */}
            <motion.h2
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.4 : 0.55, ease: easeOut }}
              className="text-[26px] sm:text-[30px] md:text-[34px] font-semibold text-white tracking-tight leading-[1.2]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
            >
              Principles That Shape <span className="text-[#D4AF37]">Our Teaching.</span>
            </motion.h2>

            {/* Description: soft fade-in, 450ms */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={vp}
              transition={{ duration: 0.45, ease: easeOut }}
              className="text-[14px] sm:text-[15px] text-white/70 font-normal leading-relaxed mt-2.5 max-w-xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Four principles behind ASMA's approach to practical stock market education in Nagpur.
            </motion.p>
          </div>

          {/* 4 Clean Editorial Columns: 1 row on desktop, stacked on mobile with subtle dividers */}
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {learningPrinciples.map((principle, idx) => (
              <motion.div
                key={idx}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={vp}
                transition={{
                  duration: isMobile ? 0.35 : 0.45,
                  delay: isMobile ? idx * 0.05 : idx * 0.09,
                  ease: easeOut,
                }}
                className="py-5 sm:py-6 first:pt-0 last:pb-0 md:py-0 md:px-5 lg:px-7 first:md:pl-0 last:md:pr-0 flex flex-col justify-start"
              >
                <span
                  className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#D4AF37] mb-2 sm:mb-2.5 block"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {principle.index}
                </span>
                <h3
                  className="text-[17px] sm:text-[18px] font-semibold text-white tracking-tight mb-2 leading-snug"
                  style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                >
                  {principle.title}
                </h3>
                <p
                  className="text-[13.5px] sm:text-[14px] text-white/70 font-normal leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {principle.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <FaqSection
        faqs={aboutContactFaqs}
        title="About Advait Academy: FAQs"
        subtitle="Clear answers about our founder, Nagpur campus, live-market batches, and student mentorship."
        eyebrow="ADVAIT ACADEMY ADMISSIONS &amp; QUERIES"
      />

      {/* 6. ADMISSIONS CTA - Compact 2-Column Closing Section */}
      <section className="py-7 sm:py-8 lg:py-9 bg-[#06261A] text-white border-t border-[#D4AF37]/20 relative overflow-hidden w-full px-4 md:px-8 lg:px-12">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column (60%): Eyebrow, Heading, Description */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.45, ease: easeOut }}
              className="lg:col-span-7 text-center lg:text-left"
            >
              {/* Eyebrow */}
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-1.5">
                <motion.span
                  initial={shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={vp}
                  transition={{ duration: 0.4, ease: easeOut }}
                  className="w-4 sm:w-5 h-[1.5px] bg-[#D4AF37] origin-left"
                />
                <span
                  className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.16em] uppercase text-[#D4AF37]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  START YOUR JOURNEY
                </span>
              </div>

              {/* Heading: Manrope 600, 32-36px desktop, 26-28px mobile */}
              <h2
                className="text-[26px] sm:text-[28px] md:text-[32px] lg:text-[35px] font-semibold text-white tracking-tight leading-[1.2] mb-2"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
              >
                Take the Next Step in <br className="hidden sm:inline" />
                <span className="text-[#D4AF37] sm:whitespace-nowrap">Your Market Learning.</span>
              </h2>

              {/* Description: Inter 15px, max 2 lines */}
              <p
                className="text-[14px] sm:text-[15px] text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Explore stock market courses at ASMA in Nagpur and connect with our team for admissions and program details.
              </p>
            </motion.div>

            {/* Right Column (40%): CTA Buttons & Phone Link */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={vp}
              transition={{ duration: 0.45, ease: easeOut }}
              className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center"
            >
              {/* Buttons: 48px height, 4px corners, smooth 200ms transition */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto h-[48px] px-6 inline-flex items-center justify-center rounded-[4px] bg-[#D4AF37] text-[#06261A] font-semibold text-[13.5px] hover:bg-[#E5C158] active:bg-[#C5A028] transition-colors duration-200 shadow-sm text-center shrink-0"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Explore Courses
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto h-[48px] px-6 inline-flex items-center justify-center rounded-[4px] bg-transparent text-white border border-white/25 font-semibold text-[13.5px] hover:bg-white/10 hover:border-white/40 active:bg-white/15 transition-colors duration-200 text-center shrink-0"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Contact Admissions
                </Link>
              </div>

              {/* Phone Link below buttons */}
              <a
                href="tel:+919156953895"
                className="inline-flex items-center gap-1.5 text-white/75 hover:text-[#D4AF37] text-[13px] transition-colors duration-200 mt-2.5 py-0.5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 91569 53895</span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
