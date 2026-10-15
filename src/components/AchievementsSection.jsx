import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, useInView, animate } from 'framer-motion';

const CountUpNumber = ({ target, delay = 0, shouldReduceMotion }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!ref.current || shouldReduceMotion || hasAnimatedRef.current) return;

    if (!isInView) {
      ref.current.textContent = "0";
      return;
    }

    hasAnimatedRef.current = true;
    ref.current.textContent = "0";

    const timer = setTimeout(() => {
      const controls = animate(0, target, {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(latest) {
          if (ref.current) {
            ref.current.textContent = Math.round(latest).toLocaleString();
          }
        }
      });
      return () => controls.stop();
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, target, delay, shouldReduceMotion]);

  return <span ref={ref}>{target.toLocaleString()}</span>;
};

const AchievementsSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const easeOut = [0.16, 1, 0.3, 1];
  const vp = { once: true, amount: 0.2 };

  const stats = [
    {
      value: 10000,
      suffix: "+",
      label: "Students Trained"
    },
    {
      value: 5,
      suffix: "/5",
      label: "Average Rating"
    },
    {
      value: 15,
      suffix: "+",
      label: "Industry Awards"
    },
    {
      value: 50,
      suffix: "+",
      label: "Trading Strategies"
    }
  ];

  return (
    <section id="achievements" className="py-14 lg:py-11 bg-[#F8F9FA] border-y border-black/5">
      <div className="container mx-auto px-5 md:px-8 lg:px-12 max-w-6xl">
        
        {/* Section Heading - Centered on desktop & mobile */}
        <div className="mb-6 sm:mb-8 lg:mb-11 text-center">
          <motion.h2
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: isMobile ? 0.35 : 0.6, ease: easeOut }}
            className="text-[30px] sm:text-3xl lg:text-[34px] font-semibold text-[#1A3326] leading-tight tracking-tight text-center"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            The Advait Impact
          </motion.h2>
        </div>

        {/* Four Statistics Row (1 horizontal row on desktop, 2x2 grid on mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 py-2 sm:py-3 lg:py-4">
          {stats.map((item, idx) => (
            <motion.div
              key={idx}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{
                duration: isMobile ? 0.32 : 0.45,
                delay: shouldReduceMotion ? 0 : idx * (isMobile ? 0.05 : 0.1),
                ease: easeOut
              }}
              className={`flex flex-col justify-center px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-4 lg:py-1 ${
                idx % 2 === 0 ? 'border-r border-black/10' : 'border-r-0 lg:border-r lg:border-black/10'
              } ${
                idx === 3 ? 'lg:border-r-0' : ''
              } ${
                idx < 2 ? 'border-b border-black/10 lg:border-b-0' : ''
              }`}
            >
              <div
                className="text-[32px] sm:text-[36px] lg:text-[42px] xl:text-[46px] font-semibold text-[#1A3326] tracking-tight leading-none mb-1.5 sm:mb-2 lg:mb-2.5"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                <CountUpNumber
                  target={item.value}
                  delay={idx * (isMobile ? 0.06 : 0.1)}
                  shouldReduceMotion={shouldReduceMotion}
                />
                <span className="text-[#D4AF37] font-semibold ml-0.5">{item.suffix}</span>
              </div>
              <span
                className="text-[11px] sm:text-[11.5px] lg:text-[12.5px] font-medium tracking-[0.12em] uppercase text-[#4A6356] leading-snug"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AchievementsSection;
