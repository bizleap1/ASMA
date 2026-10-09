import React from 'react';
import AnimatedSection from './AnimatedSection';
import PhoneNumber from './PhoneNumber';

const AboutSection = ({ hideExploreButton = false }) => {
  const features = [
    {
      title: "Technical Analysis",
      subtitle: "Advanced Charts",
      icon: <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
    },
    {
      title: "Smart Money Concept",
      subtitle: "Institutional Trading",
      icon: <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      title: "Intraday & Swing",
      subtitle: "Live Execution",
      icon: <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
      title: "Risk Management",
      subtitle: "Capital Protection",
      icon: <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
  ];

  return (
    <AnimatedSection id="about" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Image */}
          <div className="w-full lg:w-5/12 relative pb-8 lg:pb-0 pr-0 lg:pr-8">
            <div className="relative rounded-2xl shadow-2xl aspect-[4/5] max-w-md mx-auto lg:mx-0 lg:ml-auto group">
              {/* Image Container with overflow hidden */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden border border-text-primary/10">
                <img 
                  loading="lazy"
                  src="/asma founder.png" 
                  alt="Satish Bobade — Founder"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              
              {/* Experience Badge overlay - Simple & Clean */}
              <div className="absolute -bottom-6 lg:bottom-6 right-3 sm:right-4 lg:-right-8 bg-white rounded-xl px-5 sm:px-6 py-3.5 sm:py-4 shadow-xl border border-black/5 flex items-center gap-4 sm:gap-5 z-20 w-max">
                
                <div className="text-4xl md:text-5xl font-black text-accent-secondary tracking-tighter">
                  20+
                </div>
                
                <div className="w-px h-10 bg-black/10"></div>

                <div className="text-text-primary font-bold text-xs sm:text-sm md:text-base leading-snug">
                  Years of Real <br/>Market Experience
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="w-full lg:w-7/12 flex flex-col justify-center">
            <div className="inline-flex px-4 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary font-bold tracking-wider uppercase text-xs mb-6 w-max border border-accent-primary/20">
              Live Market Trading Education
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight mb-6">
              Master the Market with <span className="text-accent-primary">Confidence</span>
            </h2>

            {/* Founder Credit - Minimal & Premium */}
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-1 h-8 bg-[#D4AF37] rounded-full shrink-0"></div>
              <div>
                <div className="text-[15px] md:text-[16px] font-semibold text-[#173D2B] tracking-wider uppercase leading-tight">
                  Satish Bobade
                </div>
                <div className="text-[11px] md:text-[12px] font-medium text-[#173D2B]/70 uppercase tracking-[0.16em] mt-0.5">
                  Founder, ASMA
                </div>
              </div>
            </div>
            
            <div className="mb-10 border-l-4 border-accent-primary pl-6 py-2">
              <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3 leading-snug">
                Central India's Most Experienced Stock Market Academy
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed">
                Designed for <strong className="text-text-primary">beginners to professional traders</strong>, we teach strictly in live markets. Our disciplined, confidence-driven strategies ensure practical learning that translates to real-world success.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-bg-secondary/50 transition-colors border border-transparent hover:border-text-primary/5">
                  <div className="w-12 h-12 rounded-lg bg-accent-primary/10 flex items-center justify-center shrink-0 shadow-sm">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary text-base mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-text-secondary text-[11px] uppercase tracking-widest font-semibold">
                      {feature.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Journey/CTA Section */}
        {hideExploreButton && (
          <div className="mt-16 lg:mt-24 rounded-3xl bg-text-primary p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="w-full md:w-2/3 relative z-10">
              <h4 className="text-accent-primary font-display font-bold tracking-wide text-2xl md:text-3xl mb-4">Our Journey</h4>
              <p className="text-white/80 text-base md:text-lg leading-relaxed font-light">
                For over two decades, Advait Stock Market Academy has been at the forefront of financial education in Central India. We started with a simple vision to demystify the stock market, and today we have empowered thousands of students to achieve financial independence through practical, live-market training and mentorship.
              </p>
            </div>

            <div className="w-full md:w-1/3 relative z-10 flex justify-center md:justify-end">
              <a href="tel:09156953895" className="px-8 py-4 bg-accent-primary text-text-primary font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-white transition-all text-center shadow-lg shadow-accent-primary/30 hover:-translate-y-1">
                Call Now: <PhoneNumber number="09156953895" />
              </a>
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
};

export default AboutSection;