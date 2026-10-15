import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const strengths = [
  {
    num: "01",
    title: "Practical Market Learning",
    desc: "Apply technical analysis, price action and risk management directly during live trading market hours."
  },
  {
    num: "02",
    title: "Guided Mentorship",
    desc: "Receive personalized mentor feedback tailored to your pace, refining trading psychology and execution."
  },
  {
    num: "03",
    title: "Structured Learning",
    desc: "Progress systematically from stock market fundamentals to advanced technical analysis and derivatives."
  },
  {
    num: "04",
    title: "Continued Learning Support",
    desc: "Access ongoing post-course doubt clearing, active alumni community and updated market strategies."
  }
];

const AdvantageSection = () => {
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

  return (
    <section 
      id="advantage" 
      className="pt-4 sm:pt-5 md:pt-6 lg:pt-7 pb-12 sm:pb-14 md:pb-16 lg:pb-20 bg-[#FAF9F5] relative w-full px-5 sm:px-6 md:px-8 lg:px-12 overflow-hidden"
    >
      <div className="container mx-auto px-0 max-w-7xl relative z-10">
        
        {/* Header Block: Left-aligned, Manrope 600 + Inter */}
        <div className="max-w-3xl text-left mb-7 sm:mb-9 lg:mb-12">
          {/* Eyebrow: Gold line reveal (400ms) + Text fade-in (400ms) */}
          <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
            <motion.span
              initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={vp}
              transition={{ duration: 0.4, ease: easeOut }}
              className="w-[22px] h-[1.5px] bg-[#D4AF37] shrink-0 origin-left"
            />
            <motion.span 
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={vp}
              transition={{ duration: 0.4, delay: 0.05, ease: easeOut }}
              className="text-[11.5px] sm:text-[12px] font-medium tracking-[0.16em] uppercase text-[#063925]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              WHY CHOOSE ASMA
            </motion.span>
          </div>

          {/* Main Heading: Smooth fade-up 14px, 600ms (mobile 8px, 380ms) */}
          <motion.h2 
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 8 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: isMobile ? 0.38 : 0.6, delay: 0.08, ease: easeOut }}
            className="text-[30px] xs:text-[32px] sm:text-[34px] md:text-[42px] lg:text-[46px] xl:text-[48px] font-semibold text-[#1A3326] leading-[1.16] tracking-tight text-left"
            style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
          >
            <span>More Than Learning.</span>
            <span className="block text-[#D4AF37]">A Practical Approach.</span>
          </motion.h2>

          {/* Description: Soft fade-up 8px, 450ms */}
          <motion.p 
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.45, delay: isMobile ? 0.12 : 0.16, ease: easeOut }}
            className="text-[15px] sm:text-[15.5px] text-[#4A6356] font-normal leading-relaxed max-w-xl mt-2.5 sm:mt-3 text-left"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
          >
            Discover a practical approach to stock market training in Nagpur, combining structured education, market-based learning and mentor guidance.
          </motion.p>
        </div>

        {/* Divider lines: Subtle opacity reveal 400ms */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={vp}
          transition={{ duration: 0.4, ease: easeOut }}
          className="grid grid-cols-1 md:grid-cols-2 border-t border-b border-black/8 divide-y divide-black/8 md:divide-y-0"
        >
          {strengths.map((item, idx) => (
            <motion.div
              key={item.num}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 8 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={isMobile ? { once: true, amount: 0.2 } : vp}
              transition={{ 
                duration: isMobile ? 0.35 : 0.45, 
                delay: isMobile ? 0 : (0.1 + idx * 0.09), 
                ease: easeOut 
              }}
              className={`py-4.5 xs:py-5 sm:py-6 md:py-6.5 lg:py-7 ${
                idx % 2 === 0 ? 'md:pr-8 lg:pr-12 md:border-r border-black/8' : 'md:pl-8 lg:pl-12'
              } ${
                idx < 2 ? 'md:border-b border-black/8' : ''
              } flex flex-col justify-start text-left`}
            >
              <span 
                className="text-[12px] sm:text-[13px] font-semibold text-[#D4AF37] tracking-[0.16em] uppercase mb-1.5 sm:mb-2 block font-mono"
              >
                {item.num}
              </span>
              <h3 
                className="text-[17px] xs:text-[18px] sm:text-[20px] lg:text-[21px] font-semibold text-[#1A3326] leading-snug mb-1.5 sm:mb-2 text-left"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
              >
                {item.title}
              </h3>
              <p 
                className="text-[13px] xs:text-[13.5px] sm:text-[14.5px] text-[#4A6356] font-normal leading-relaxed text-left"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default AdvantageSection;