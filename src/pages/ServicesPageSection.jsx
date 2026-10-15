import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { serviceData } from '../data';

// Concise, natural 1-2 line descriptions for visual-first card previews without ellipses
const serviceCardDescriptions = {
  'share-market-training': "Learn market fundamentals, technical analysis and structured trading concepts.",
  'stock-investment': "Guided equity investment strategies and portfolio insights for long-term wealth.",
  'mutual-fund-investment': "Goal-oriented mutual fund advisory and systematic SIP planning for steady growth.",
  'psychological-training': "Master emotional discipline and risk control for consistent trading execution.",
  'derivatives-trading': "Learn advanced Futures and Options strategies with structured risk management.",
  'portfolio-management': "Personalized asset allocation and active portfolio guidance to protect capital.",
  'algo-trading': "Systematic rule-based execution and custom algorithmic trading setups.",
  'commodity-currency': "Navigate MCX metals, energy, and global forex markets with expert insights.",
  'financial-planning': "Comprehensive roadmaps for retirement, tax optimization, and wealth creation.",
  'health-insurance': "Comprehensive medical coverage with cashless hospitalization benefits nationwide.",
  'term-insurance': "Affordable high-cover term plans to secure your family's financial future.",
  'motor-insurance': "Reliable bike and car insurance covering accidental damage with quick claims.",
  'life-insurance': "Lifelong financial protection and wealth-building investment benefits.",
  'travel-insurance': "Medical and travel emergency protection for domestic and international trips.",
  'property-insurance': "Protect residential and commercial properties against fire, theft, and natural risks."
};

const ServicesPageSection = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const easeOut = [0.16, 1, 0.3, 1];

  // All 15 authentic services with verified natural 1-2 line preview descriptions
  const allServices = serviceData.map(s => ({
    ...s,
    cardDesc: serviceCardDescriptions[s.id] || s.desc
  }));

  const categories = [
    { label: 'All Services', value: 'All', count: allServices.length },
    { label: 'Training', value: 'Training', count: allServices.filter(s => s.category === 'Training').length },
    { label: 'Investment', value: 'Investment', count: allServices.filter(s => s.category === 'Investment').length },
    { label: 'Insurance', value: 'Insurance', count: allServices.filter(s => s.category === 'Insurance').length }
  ];

  const displayedServices = activeFilter === 'All'
    ? allServices
    : allServices.filter(s => s.category === activeFilter);

  const handleFilterClick = (categoryValue) => {
    if (activeFilter === categoryValue) return;
    setActiveFilter(categoryValue);
  };

  return (
    <section className="pt-6 sm:pt-8 md:pt-10 pb-16 sm:pb-20 md:pb-24 bg-[#FAF9F6] w-full px-4 md:px-8 lg:px-12 relative">
      <div className="container mx-auto px-1 md:px-0 w-full max-w-7xl">
        
        {/* Category Filters: Horizontally scrollable on mobile without page overflow */}
        <div className="mb-7 sm:mb-9 lg:mb-10 overflow-x-auto no-scrollbar -mx-1 px-1 py-1">
          <div className="flex items-center gap-2 sm:gap-2.5 w-max">
            {categories.map((cat) => {
              const isActive = activeFilter === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleFilterClick(cat.value)}
                  className={`px-4 sm:px-5 py-2 rounded-[5px] text-[12px] sm:text-[12.5px] font-['Inter'] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer whitespace-nowrap border shrink-0 flex items-center gap-2 select-none touch-manipulation ${
                    isActive
                      ? 'bg-[#063925] text-white border-[#063925] shadow-sm'
                      : 'bg-white text-[#1A3326] border-[#0B2117]/12 hover:border-[#063925] hover:text-[#063925]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded transition-colors duration-200 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#0B2117]/5 text-[#4A6356]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual-First Services Card Grid: 3-col Desktop (~55% image ratio), 2-col Tablet, Compact Horizontal Mobile */}
        <div className="relative min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.15, ease: easeOut }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
            >
              {displayedServices.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 4 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: isMobile ? 0.2 : 0.28,
                    delay: shouldReduceMotion ? 0 : Math.min(idx * 0.04, 0.16),
                    ease: easeOut
                  }}
                  className="group bg-white rounded-[6px] border border-[#0B2117]/10 hover:border-[#063925] overflow-hidden shadow-sm transition-colors duration-200 flex flex-row md:flex-col h-full"
                >
                  {/* Card Image: Prominent ~55% height on Desktop (~220-230px), Horizontal Thumbnail on Mobile (104-112px) */}
                  <div className="w-[104px] sm:w-[112px] md:w-full h-auto md:h-[220px] lg:h-[230px] shrink-0 overflow-hidden bg-[#0B2117] relative">
                    <img
                      loading="lazy"
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover object-[center_30%] transition-transform duration-250 ease-out md:group-hover:scale-[1.02] opacity-95 group-hover:opacity-100"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 sm:p-4 md:p-5 flex flex-col flex-grow justify-between min-w-0">
                    <div>
                      <h3
                        className="text-[16px] sm:text-[17px] md:text-[20px] lg:text-[21px] font-semibold text-[#1A3326] md:group-hover:text-[#063925] transition-colors tracking-tight leading-snug mb-1.5 md:mb-2"
                        style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                      >
                        {service.title}
                      </h3>
                      <p
                        className="text-[#4A6356] text-[13px] sm:text-[13.5px] md:text-[14px] lg:text-[14.5px] font-normal leading-relaxed line-clamp-2 mb-3 md:mb-4"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {service.cardDesc}
                      </p>
                    </div>

                    {/* Bottom CTA: View Details with small animated arrow */}
                    <div className="mt-auto pt-2.5 md:pt-3.5 md:border-t md:border-[#0B2117]/8 flex items-center justify-between">
                      <Link
                        to={`/service/${service.id}`}
                        className="inline-flex items-center gap-1.5 text-[#063925] group-hover:text-[#D4AF37] text-[13px] md:text-[13.5px] font-semibold tracking-normal transition-colors duration-200"
                      >
                        View Details
                        <svg
                          className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-[3px]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default ServicesPageSection;