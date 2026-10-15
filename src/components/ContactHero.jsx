import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const ContactHero = () => {
  const shouldReduceMotion = useReducedMotion();
  const easeOut = [0.16, 1, 0.3, 1];

  return (
    <section className="relative pt-[115px] sm:pt-[130px] md:pt-[145px] lg:pt-[160px] pb-6 sm:pb-7 lg:pb-8 bg-[#FAF9F6] w-full px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="container mx-auto px-0 w-full max-w-7xl">
        
        {/* Eyebrow: Minimal clean editorial text, no fake lines or pills */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: easeOut }}
          className="mb-2 sm:mb-2.5"
        >
          <span
            className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            CONTACT ASMA
          </span>
        </motion.div>

        {/* 2-Column Desktop Grid: Heading Left (55%), Description Right (45%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-10 xl:gap-12 items-start text-left">
          {/* Left Column: H1 */}
          <div className="lg:col-span-7 xl:col-span-7">
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
              className="text-[30px] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[50px] font-semibold text-[#1A3326] tracking-tight leading-[1.14]"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
            >
              Let's <span className="text-[#D4AF37]">Connect.</span>
            </motion.h1>
          </div>

          {/* Right Column: Description */}
          <div className="lg:col-span-5 xl:col-span-5 lg:pt-2">
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.08, ease: easeOut }}
              className="text-[14px] sm:text-[15px] lg:text-[15.5px] text-[#4A6356] font-normal leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Questions about our courses, batch timings or services? Connect with Advait Stock Market Academy in Nagpur.
            </motion.p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactHero;
