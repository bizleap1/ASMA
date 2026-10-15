import React from 'react';
import AnimatedSection from './AnimatedSection';

const PageHero = ({ title, subtitle, image, tag }) => (
  <AnimatedSection className="relative w-full pt-32 pb-14 md:pt-40 md:pb-16 flex items-center justify-center overflow-hidden border-b border-[#0B2117]/10 bg-[#0B2117]">
    {/* Background Image with Deep Institutional Overlay */}
    {image && (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transform scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url('${image}')` }}
      />
    )}

    {/* Multi-layered forest-green & vignette gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#05130D]/90 via-[#0B2117]/85 to-[#0B2117]/95" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#063925]/30 via-transparent to-transparent pointer-events-none" />

    {/* Content Container */}
    <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
      {/* Editorial Category Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#05130D]/70 backdrop-blur-md text-[#D4AF37] font-['Inter'] font-semibold tracking-wider uppercase text-[11px] mb-4 border border-[#D4AF37]/30 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
        {tag || "Advait Stock Market Academy"}
      </div>

      {/* Main Page Title */}
      <h1 className="text-3xl md:text-5xl font-['Manrope'] font-semibold text-white tracking-tight mb-3 leading-tight">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-white/85 text-sm md:text-base font-['Inter'] font-normal max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Subtle Gold Accent Divider */}
      <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-5 opacity-80" />
    </div>
  </AnimatedSection>
);

export default PageHero;