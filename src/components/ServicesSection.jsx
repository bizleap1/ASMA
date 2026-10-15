import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const ServicesSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const easeOut = [0.16, 1, 0.3, 1];
  const vp = { once: true, amount: 0.15 };

  // Featured 3 services with authentic ASMA financial visual assets
  const featuredService = {
    id: "share-market-training",
    title: "Share Market Training",
    category: "Education & Mentorship",
    desc: "Structured classroom and live-market mentorship covering price action, technical analysis, and disciplined execution.",
    image: "/live-market-training.webp",
    highlights: ["Live Market Practice", "Technical & Options Analysis", "Lifetime Mentor Support"]
  };

  const secondaryServices = [
    {
      id: "stock-investment",
      title: "Stock Investment Guidance",
      category: "Equity Advisory",
      desc: "Fundamental equity research and disciplined stock selection strategies for long-term compound wealth creation.",
      image: "/1-percent-rule.webp"
    },
    {
      id: "mutual-fund-investment",
      title: "Mutual Fund Investment",
      category: "Portfolio Planning",
      desc: "Systematic investment planning (SIP) and tailored fund allocations aligned with your financial milestones.",
      image: "/asma-philosophy.webp"
    }
  ];

  return (
    <section
      id="services"
      className="pt-8 md:pt-10 lg:pt-12 pb-6 md:pb-8 lg:pb-9 bg-[#FAF9F5] relative w-full px-4 md:px-8 lg:px-12 overflow-hidden"
    >
      <div className="container mx-auto px-1 md:px-0">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 lg:mb-12 gap-6">
          <div className="max-w-2xl">
            {/* Eyebrow: OUR SERVICES with subtle gold accent line */}
            <div className="flex items-center gap-2.5 mb-3">
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
                transition={{ duration: 0.4, delay: 0.08, ease: easeOut }}
                className="text-[12px] font-medium tracking-[0.16em] uppercase text-[#063925]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                OUR SERVICES
              </motion.span>
            </div>

            {/* Main Heading - Fade-up 16px, 600ms */}
            <motion.h2
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 8 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.35 : 0.6, delay: 0.1, ease: easeOut }}
              className="text-[28px] sm:text-[34px] lg:text-[38px] xl:text-[40px] font-semibold text-[#1A3326] leading-[1.18] tracking-tight"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Beyond Market Education. <br className="hidden sm:inline" />
              <span className="text-[#D4AF37]">Explore Financial Solutions.</span>
            </motion.h2>
          </div>

          {/* Editorial Description - Gentle fade-up 10px, 450ms */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 6 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: isMobile ? 0.35 : 0.45, delay: 0.2, ease: easeOut }}
            className="text-[14.5px] sm:text-[15.5px] text-[#4A6356] font-normal leading-relaxed max-w-md"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Explore share market training, stock investment and mutual fund services offered by ASMA in Nagpur.
          </motion.p>
        </div>

        {/* Asymmetrical Editorial Grid (55% Featured Left / 45% Stacked Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">

          {/* Left Column: Featured Share Market Training (Fade-up 18px, 650ms) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 8 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: isMobile ? 0.4 : 0.65, delay: isMobile ? 0.05 : 0.22, ease: easeOut }}
            className="lg:col-span-7 flex flex-col"
          >
            <Link
              to={`/service/${featuredService.id}`}
              className="group bg-white rounded-[6px] border border-black/8 hover:border-[#063925]/30 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(6,57,37,0.06)] transition-all duration-[240ms] ease-out flex flex-col h-full"
            >
              {/* Image Container - Subtle 1.02 hover zoom, overflow clipped */}
              <div className="relative aspect-[16/9] sm:aspect-[16/9] lg:aspect-auto lg:h-[200px] xl:h-[215px] overflow-hidden bg-black/5 shrink-0">
                <img
                  src={featuredService.image}
                  alt={featuredService.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[240ms] ease-out group-hover:scale-[1.02]"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 lg:p-5.5 xl:p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3
                    className="text-[20px] sm:text-[22px] lg:text-[22px] xl:text-[24px] font-semibold text-[#1A3326] group-hover:text-[#063925] transition-colors leading-snug mb-2 sm:mb-2.5"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {featuredService.title}
                  </h3>
                  <p
                    className="text-[13.5px] sm:text-[14px] text-[#4A6356] font-normal leading-relaxed mb-3.5 sm:mb-4"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {featuredService.desc}
                  </p>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                    {featuredService.highlights.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-[11px] sm:text-[11.5px] font-medium text-[#1A3326] bg-[#F2F5F3] px-2.5 py-0.5 sm:py-1 rounded-[3px] border border-black/5"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 sm:pt-3.5 border-t border-black/5 flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-2 text-[12px] sm:text-[12.5px] font-semibold uppercase tracking-wider text-[#063925] group-hover:text-[#D4AF37] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <span>Explore Service Details</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-[240ms] ease-out group-hover:translate-x-[3px]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Right Column: Two Stacked Cards (Fade-up 14px, 550ms staggered) */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-4.5 justify-between">
            {secondaryServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 8 : 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={vp}
                transition={{
                  duration: isMobile ? 0.4 : 0.55,
                  delay: isMobile ? 0.05 : (idx === 0 ? 0.34 : 0.44),
                  ease: easeOut
                }}
                className="flex-1 flex flex-col"
              >
                <Link
                  to={`/service/${service.id}`}
                  className="group bg-white rounded-[6px] border border-black/8 hover:border-[#063925]/30 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(6,57,37,0.06)] transition-all duration-[240ms] ease-out flex flex-col sm:flex-row h-full"
                >
                  {/* Thumbnail Image - Subtle 1.02 hover zoom, overflow clipped */}
                  <div className="w-full sm:w-[36%] lg:w-[36%] aspect-[16/9] sm:aspect-auto relative overflow-hidden bg-black/5 shrink-0">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-[240ms] ease-out group-hover:scale-[1.02]"
                    />
                  </div>

                  {/* Content */}
                  <div className="w-full sm:w-[64%] lg:w-[64%] p-4 sm:p-4.5 lg:p-4 xl:p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3
                        className="text-[16px] sm:text-[17px] lg:text-[17px] xl:text-[18px] font-semibold text-[#1A3326] group-hover:text-[#063925] transition-colors leading-snug mb-1.5"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                      >
                        {service.title}
                      </h3>
                      <p
                        className="text-[12.5px] sm:text-[13px] text-[#4A6356] font-normal leading-relaxed mb-3"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {service.desc}
                      </p>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-2.5 sm:pt-3 border-t border-black/5 flex items-center justify-between">
                      <span
                        className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-semibold uppercase tracking-wider text-[#063925] group-hover:text-[#D4AF37] transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <span>Learn More</span>
                        <svg
                          className="w-3.5 h-3.5 transition-transform duration-[240ms] ease-out group-hover:translate-x-[3px]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Global Explore All Services CTA - Soft fade-in, 400ms */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 6 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.4, delay: isMobile ? 0.1 : 0.5, ease: easeOut }}
          className="text-center pt-6 md:pt-7"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#063925] hover:text-[#D4AF37] transition-colors group"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span>Explore All Services</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-[3px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default ServicesSection;