import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const GalleryHero = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const easeOut = [0.16, 1, 0.3, 1];

  return (
    <section className="relative pt-[115px] sm:pt-[140px] md:pt-[165px] lg:pt-[190px] pb-4 sm:pb-6 lg:pb-8 bg-[#FAF9F6] w-full px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="container mx-auto px-0 w-full max-w-7xl">
        {/* Eyebrow: ASMA GALLERY with subtle gold line reveal */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: easeOut }}
          className="flex items-center gap-2.5 mb-2.5 sm:mb-3.5 lg:mb-4"
        >
          <motion.span
            initial={shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="w-5 h-[1.5px] bg-[#D4AF37] origin-left shrink-0"
          />
          <span
            className="text-[11px] sm:text-[12px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            ASMA GALLERY
          </span>
        </motion.div>

        {/* 2-Column: 55% Heading Left, 45% Description Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-10 xl:gap-12 items-start text-left">
          {/* Left Column (55%): H1 */}
          <div className="lg:col-span-7 xl:col-span-7">
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.38 : 0.55, ease: easeOut }}
              className="text-[27px] sm:text-[34px] md:text-[42px] lg:text-[48px] xl:text-[52px] font-semibold text-[#1A3326] tracking-tight leading-[1.15]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
            >
              A Closer Look at <span className="text-[#D4AF37]">ASMA.</span>
            </motion.h1>
          </div>

          {/* Right Column (45%): Description */}
          <div className="lg:col-span-5 xl:col-span-5 lg:pt-2">
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.12, ease: easeOut }}
              className="text-[14px] sm:text-[15px] md:text-[15.5px] lg:text-[16px] text-[#4A6356] font-normal leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Explore photographs and videos from classroom sessions, academy activities and events at Advait Stock Market Academy in Nagpur.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryHero;
