import React from 'react';
import AnimatedSection from './AnimatedSection';

const CoreValuesSection = () => {
  const values = [
    {
      step: "01",
      title: "Integrity & Transparency",
      desc: "We believe in transparent, honest education without false get-rich promises. We teach the absolute reality of institutional market dynamics.",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      step: "02",
      title: "Practical Market Execution",
      desc: "Theory alone is never sufficient. Our entire training framework is conducted with live-market chart analysis and real order flow scenarios.",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      step: "03",
      title: "Disciplined Risk Management",
      desc: "Trading longevity stems from psychology and capital preservation. We drill strict position sizing and predefined risk into every student.",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      step: "04",
      title: "Empowered Self-Reliance",
      desc: "Our ultimate objective is transforming learners into independent market operators capable of evaluating opportunities without external tips.",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <AnimatedSection className="py-16 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-[4px] bg-[#063925]/10 text-[#063925] font-['Inter'] font-semibold text-xs tracking-wider uppercase mb-3 border border-[#063925]/20">
            What Drives Advait
          </span>
          <h2 className="text-3xl md:text-4xl font-['Manrope'] font-semibold text-[#1A3326] tracking-tight">
            Our Core Educational Principles
          </h2>
          <p className="text-[#4A6356] text-sm md:text-base font-['Inter'] font-normal max-w-xl mx-auto mt-3">
            Structured methodologies and mentorship ethics designed to build disciplined, long-term market participants.
          </p>
          <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
        </div>

        {/* 4-Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="bg-[#F2F5F3] border border-[#0B2117]/10 rounded-[4px] p-6 lg:p-7 flex flex-col justify-between group hover:border-[#D4AF37] hover:bg-white hover:shadow-sm transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[#D4AF37] font-['Inter'] font-semibold text-xs tracking-widest">
                    {val.step}
                  </span>
                  <div className="w-9 h-9 rounded-[4px] bg-[#063925]/5 border border-[#063925]/10 flex items-center justify-center text-[#063925] group-hover:bg-[#063925] group-hover:text-white transition-colors duration-300">
                    {val.icon}
                  </div>
                </div>
                <h3 className="text-lg font-['Manrope'] font-semibold text-[#1A3326] mb-3 group-hover:text-[#063925] transition-colors duration-300">
                  {val.title}
                </h3>
                <p className="text-[#4A6356] text-sm font-['Inter'] font-normal leading-relaxed">
                  {val.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default CoreValuesSection;