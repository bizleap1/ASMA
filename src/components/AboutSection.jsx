import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const AboutSection = () => {
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

  const features = [
    {
      title: "Technical Analysis",
      icon: (
        <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      title: "Smart Money Concept",
      icon: (
        <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Intraday & Swing",
      icon: (
        <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Risk Management",
      icon: (
        <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
  ];

  return (
    <section id="about" className="py-8 md:py-12 lg:py-14 bg-[#FAF9F5] border-b border-black/5">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center">
          
          {/* Left Column: Founder Photo & Clean Typography Caption */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            {/* Founder Photograph - Fade-in with 14px upward movement, 650ms */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 10 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.35 : 0.65, ease: easeOut }}
              className="w-full max-w-[340px] sm:max-w-[360px] rounded-[4px] border border-black/10 bg-[#F2F5F3] overflow-hidden shadow-sm"
            >
              <picture>
                <source srcSet="/asma%20founder.webp" type="image/webp" />
                <img
                  src="/asma%20founder.png"
                  alt="Satish Bobade — Founder, Advait Stock Market Academy"
                  width="448"
                  height="560"
                  className="w-full h-[360px] sm:h-[420px] lg:h-[450px] xl:h-[465px] object-cover object-top"
                />
              </picture>
            </motion.div>
          </div>

          {/* Right Column: Editorial Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow - Subtle gold line reveal and text fade-in, 400ms */}
            <div className="flex items-center gap-2.5 mb-3">
              <motion.span
                initial={shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={vp}
                transition={{ duration: isMobile ? 0.3 : 0.4, ease: easeOut }}
                style={{ transformOrigin: 'left' }}
                className="w-[22px] h-[1.5px] bg-[#D4AF37] shrink-0"
              />
              <motion.span
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={vp}
                transition={{ duration: isMobile ? 0.3 : 0.4, delay: isMobile ? 0.04 : 0.08, ease: easeOut }}
                className="text-[12px] font-medium tracking-[0.16em] uppercase text-[#063925]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                THE ASMA APPROACH
              </motion.span>
            </div>
            
            {/* Main Heading - Smooth fade-up, 14px, 600ms */}
            <motion.h2
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.35 : 0.6, delay: isMobile ? 0.06 : 0.1, ease: easeOut }}
              className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-semibold text-[#1A3326] leading-[1.2] tracking-tight mb-3.5 sm:mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Master the Market with <span className="text-[#D4AF37]">Confidence</span>
            </motion.h2>

            {/* Founder Highlight - Prominent Badge with Gold & Forest Green Accents */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 4 : 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.3 : 0.45, delay: isMobile ? 0.07 : 0.12, ease: easeOut }}
              className="inline-flex self-start flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#D4AF37]/25 via-[#D4AF37]/15 to-[#FAF9F5] border border-[#D4AF37]/60 rounded-xl px-3.5 sm:px-4 py-2 mb-4 sm:mb-4.5 shadow-sm"
            >
              <span
                className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold text-[#063925] tracking-tight leading-snug"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Mr. Satish Bobade
              </span>
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#063925] text-[#D4AF37] text-[11px] sm:text-[11.5px] font-semibold tracking-wider uppercase shadow-xs self-start sm:self-auto"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Founder &amp; Head Mentor
              </span>
            </motion.div>

            {/* Refined Secondary Statement - Soft fade-in, 450ms */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.3 : 0.45, delay: isMobile ? 0.08 : 0.16, ease: easeOut }}
              className="text-[16px] sm:text-[17px] lg:text-[18.5px] font-semibold text-[#1A3326] leading-snug mb-2.5 sm:mb-3"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Central India's Most Experienced Stock Market Academy
            </motion.p>

            {/* Description - Fade-up 8px, 450ms */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 4 : 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.3 : 0.45, delay: isMobile ? 0.1 : 0.22, ease: easeOut }}
              className="text-[14.5px] sm:text-[15.5px] lg:text-[16.5px] text-[#4A6356] font-normal leading-relaxed max-w-xl mb-4 sm:mb-5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Practical stock market training in Nagpur, focused on market understanding, technical analysis and risk management.
            </motion.p>

            {/* 20+ Years of Real Market Experience - Subtle fade-up, 500ms */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 6 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.35 : 0.5, delay: isMobile ? 0.12 : 0.28, ease: easeOut }}
              className="flex items-baseline gap-2 sm:gap-2.5 mb-5 flex-wrap"
            >
              <span
                className="text-[22px] sm:text-[25px] lg:text-[27px] font-semibold text-[#D4AF37] leading-none"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                20+ Years
              </span>
              <span
                className="text-[14px] sm:text-[15px] lg:text-[16px] font-medium text-[#063925] leading-none"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                of Real Market Experience
              </span>
            </motion.div>

            {/* Four Feature Items - Staggered fade-in (70ms delay desktop, 40ms mobile, 350ms each) */}
            <div className="grid grid-cols-2 gap-x-3 sm:gap-x-6 gap-y-3 sm:gap-y-3.5">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={vp}
                  transition={{
                    duration: isMobile ? 0.3 : 0.35,
                    delay: (isMobile ? 0.15 : 0.34) + idx * (isMobile ? 0.04 : 0.07),
                    ease: easeOut
                  }}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 flex items-center justify-center shrink-0 text-[#D4AF37]">
                    {feature.icon}
                  </span>
                  <span className="font-semibold text-[#1A3326] text-[12.5px] sm:text-[14.5px] lg:text-[15px] leading-snug" style={{ fontFamily: "'Manrope', sans-serif" }}>
                    {feature.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;