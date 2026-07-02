import React, { useEffect, useRef } from 'react';
import AnimatedSection from './AnimatedSection';
import { useInView, animate } from 'framer-motion';

const AnimatedCounter = ({ value, suffix, isDecimal }) => {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1], // very smooth deceleration
        onUpdate(v) {
          if (nodeRef.current) {
            let formatted;
            if (isDecimal) {
              formatted = v.toFixed(1);
            } else {
              formatted = Math.round(v).toLocaleString();
            }
            nodeRef.current.textContent = formatted + (suffix || "");
          }
        }
      });
      return () => controls.stop();
    }
  }, [value, inView, suffix, isDecimal]);

  return <span ref={nodeRef}>0{suffix}</span>;
};

const AchievementsSection = () => {
  const achievements = [
    {
      value: 10000,
      suffix: "+",
      isDecimal: false,
      label: "Students Trained",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      value: 4.9,
      suffix: "/5",
      isDecimal: true,
      label: "Average Rating",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    {
      value: 15,
      suffix: "+",
      isDecimal: false,
      label: "Industry Awards",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      value: 50,
      suffix: "+",
      isDecimal: false,
      label: "Trading Strategies",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <AnimatedSection id="achievements" className="py-12 md:py-16 relative bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary leading-tight">
            The Advait Impact
          </h2>
          <div className="w-16 h-1 bg-accent-primary mx-auto mt-4 rounded-full opacity-80"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 md:gap-x-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          {achievements.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-2 group pt-6 lg:pt-0 first:pt-0 lg:first:pt-0">
              <div className="w-14 h-14 rounded-full bg-gray-50 text-accent-primary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-accent-primary group-hover:text-white transition-all duration-300 ease-out">
                {item.icon}
              </div>
              
              <h3 className="text-2xl md:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary mb-2 tabular-nums drop-shadow-sm">
                <AnimatedCounter value={item.value} suffix={item.suffix} isDecimal={item.isDecimal} />
              </h3>
              
              <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider opacity-80">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default AchievementsSection;
