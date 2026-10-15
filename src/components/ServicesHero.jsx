import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const ServicesHero = () => {
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
    <section className="relative pt-[144px] sm:pt-[160px] lg:pt-[190px] pb-8 sm:pb-10 lg:pb-12 bg-[#FAF9F6] border-b border-[#0B2117]/10 w-full px-4 md:px-8 lg:px-12">
      <div className="container mx-auto px-1 md:px-0 w-full">
        {/* Eyebrow: OUR SERVICES with subtle gold line reveal */}
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
            OUR SERVICES
          </span>
        </motion.div>

        {/* 2-Column: 55% Heading Left, 45% Description Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 xl:gap-12 items-start text-left">
          {/* Left Column (55%): H1 */}
          <div className="lg:col-span-7 xl:col-span-7">
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.38 : 0.55, ease: easeOut }}
              className="text-[30px] sm:text-[34px] md:text-[42px] lg:text-[48px] xl:text-[52px] font-semibold text-[#1A3326] tracking-tight leading-[1.14]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
            >
              Explore Our{' '}
              <span className="text-[#D4AF37]">Financial Services.</span>
            </motion.h1>
          </div>

          {/* Right Column (45%): Description */}
          <div className="lg:col-span-5 xl:col-span-5 lg:pt-2">
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.12, ease: easeOut }}
              className="text-[15px] sm:text-[15.5px] lg:text-[16px] text-[#4A6356] font-normal leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Discover stock market education, investment-related services and insurance offerings available through ASMA in Nagpur.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
