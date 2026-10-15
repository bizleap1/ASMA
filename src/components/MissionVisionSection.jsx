import React from 'react';
import AnimatedSection from './AnimatedSection';

const MissionVisionSection = () => (
  <AnimatedSection className="py-16 md:py-24 bg-[#F2F5F3] relative border-b border-[#0B2117]/10">
    <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="inline-block px-3 py-1 rounded-[4px] bg-[#063925]/10 text-[#063925] font-['Inter'] font-semibold text-xs tracking-wider uppercase mb-3 border border-[#063925]/20">
          Our Foundation & Outlook
        </span>
        <h2 className="text-3xl md:text-4xl font-['Manrope'] font-semibold text-[#1A3326] tracking-tight">
          Purpose-Driven Market Education
        </h2>
        <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
      </div>

      {/* 2 Institutional Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {/* Mission Card */}
        <div className="bg-white border border-[#0B2117]/10 rounded-[4px] p-8 lg:p-12 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#063925]" />
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[#D4AF37] font-['Inter'] font-semibold text-xs tracking-widest uppercase">
                01 / Mission
              </span>
              <div className="w-8 h-8 rounded-[4px] bg-[#063925]/5 border border-[#063925]/10 flex items-center justify-center text-[#063925]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-['Manrope'] font-semibold text-[#1A3326] mb-4">
              Our Mission
            </h3>
            <p className="text-[#4A6356] text-base font-['Inter'] font-normal leading-relaxed mb-6">
              To empower individuals with practical, live-market trading education. We aim to break the myths of the stock market and provide structured, risk-managed strategies that create consistent, independent traders.
            </p>
          </div>
          <div className="pt-6 border-t border-[#0B2117]/5 flex items-center gap-2 text-xs font-['Inter'] font-semibold text-[#063925] tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#063925]" />
            Practical Live Execution &bull; Capital Protection
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-white border border-[#0B2117]/10 rounded-[4px] p-8 lg:p-12 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]" />
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[#D4AF37] font-['Inter'] font-semibold text-xs tracking-widest uppercase">
                02 / Vision
              </span>
              <div className="w-8 h-8 rounded-[4px] bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#997A15]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-['Manrope'] font-semibold text-[#1A3326] mb-4">
              Our Vision
            </h3>
            <p className="text-[#4A6356] text-base font-['Inter'] font-normal leading-relaxed mb-6">
              To be Central India's most trusted financial education platform, fostering a community of financially literate and disciplined investors who can confidently navigate and profit from global and domestic markets.
            </p>
          </div>
          <div className="pt-6 border-t border-[#0B2117]/5 flex items-center gap-2 text-xs font-['Inter'] font-semibold text-[#063925] tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            Long-term Wealth Creation &bull; Disciplined Mindset
          </div>
        </div>
      </div>
    </div>
  </AnimatedSection>
);

export default MissionVisionSection;