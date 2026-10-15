import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const FaqItem = ({ faq, isOpen, onToggle, index, shouldReduceMotion }) => {
  const itemRef = useRef(null);
  const easeOut = [0.16, 1, 0.3, 1];



  return (
    <motion.div 
      ref={itemRef}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ 
        duration: 0.35, 
        delay: shouldReduceMotion ? 0 : Math.min(index * 0.03, 0.3), 
        ease: easeOut 
      }}
      className="py-4 sm:py-5"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-btn-${index}`}
        className="w-full text-left flex justify-between items-start gap-4 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#063925]/30 rounded-sm select-none"
      >
        <h3 
          className="text-[15px] sm:text-[16px] md:text-[17px] font-semibold text-[#1A3326] group-hover:text-[#063925] transition-colors leading-snug pr-2"
          style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
        >
          {faq.question}
        </h3>
        
        {/* Clean Plus/Minus Icon with 200ms transition */}
        <span className="flex-shrink-0 text-[#1A3326] group-hover:text-[#063925] mt-0.5 transition-colors">
          <div className="w-5 h-5 flex items-center justify-center">
            {isOpen ? (
              <svg 
                className="w-4 h-4 text-[#D4AF37] transition-transform duration-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            ) : (
              <svg 
                className="w-4 h-4 transition-transform duration-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
              </svg>
            )}
          </div>
        </span>
      </button>

      {/* Accordion Content with subtle 220ms transition */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-btn-${index}`}
            initial={shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p 
              className="pt-2.5 pb-1 pr-4 sm:pr-8 text-[#4A6356] text-[13.5px] sm:text-[14.5px] font-normal leading-relaxed text-left"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FaqSection = ({ 
  faqs = [], 
  title, 
  subtitle = "Find answers about stock market courses, admissions and practical trading education at ASMA in Nagpur.",
  eyebrow = "FREQUENTLY ASKED QUESTIONS",
  className = ""
}) => {
  const [openIndex, setOpenIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const easeOut = [0.16, 1, 0.3, 1];
  const vp = { once: true, amount: 0.15 };

  // Preserve JSON-LD Structured Data for Technical SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (faqs || []).map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const renderHeading = () => {
    if (!title || title === "Frequently Asked Questions") {
      return (
        <>
          Your Questions, <span className="text-[#D4AF37]">Answered.</span>
        </>
      );
    }
    if (typeof title === 'string' && title.includes('Answered.')) {
      const parts = title.split('Answered.');
      return (
        <>
          {parts[0]}<span className="text-[#D4AF37]">Answered.</span>{parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section 
      id="faq" 
      className={`pt-2 sm:pt-4 md:pt-6 pb-6 sm:pb-8 md:pb-10 bg-[#FAF9F6] relative px-5 sm:px-6 md:px-8 lg:px-12 w-full ${className}`}
    >
      {/* Inject JSON-LD into DOM for Technical SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto px-0 max-w-7xl relative z-10">
        
        {/* Split Layout: Desktop 35% Left Sticky Intro / 65% Right Scrollable Accordion */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
          
          {/* Left Area (Desktop ~35% sticky intro top-aligned, Mobile stacked) */}
          <div className="w-full lg:w-[35%] lg:sticky lg:top-24 xl:top-28 text-left self-start shrink-0">
            {/* Eyebrow: FREQUENTLY ASKED QUESTIONS with subtle gold line */}
            <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
              <motion.span
                initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={vp}
                transition={{ duration: 0.4, ease: easeOut }}
                className="w-[22px] h-[1.5px] bg-[#D4AF37] shrink-0 origin-left"
              />
              <span 
                className="text-[11.5px] sm:text-[12px] font-medium tracking-[0.16em] uppercase text-[#063925]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {eyebrow}
              </span>
            </div>

            {/* Main Heading: Manrope 600 with subtle gold accent */}
            <motion.h2 
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.55, delay: 0.08, ease: easeOut }}
              className="text-[28px] sm:text-[34px] lg:text-[38px] xl:text-[40px] font-semibold text-[#1A3326] leading-[1.18] tracking-tight text-left"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
            >
              {renderHeading()}
            </motion.h2>

            {/* Description: Inter 400 */}
            <motion.p 
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.45, delay: 0.14, ease: easeOut }}
              className="text-[14.5px] sm:text-[15px] text-[#4A6356] font-normal leading-relaxed max-w-md mt-2.5 sm:mt-3.5 text-left"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              {subtitle}
            </motion.p>

            {/* Contact Admissions Desk Link (Top-aligned under description on both Mobile & Desktop) */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={vp}
              transition={{ duration: 0.45, delay: 0.2, ease: easeOut }}
              className="mt-5 sm:mt-6 lg:mt-8 pt-4 sm:pt-5 lg:pt-6 border-t border-black/8 mb-6 lg:mb-0"
            >
              <p className="text-xs sm:text-[13px] text-[#4A6356] font-normal">
                Still have questions?{" "}
                <a 
                  href="#contact" 
                  className="text-[#063925] font-semibold underline underline-offset-2 hover:text-[#D4AF37] transition-colors"
                >
                  Contact Admissions Desk
                </a>
              </p>
            </motion.div>
          </div>

          {/* Right Area (Desktop ~65% Scrollable Accordion, max-height ~72vh, Mobile normal full-height) */}
          <div className="w-full lg:w-[65%] lg:max-h-[72vh] lg:overflow-y-auto lg:overscroll-contain lg:pr-3 xl:pr-4 border-y border-black/8 divide-y divide-black/8 [scrollbar-width:thin] [scrollbar-color:rgba(6,57,37,0.25)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#063925]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#063925]/35">
            {faqs.map((faq, index) => (
              <FaqItem
                key={faq.question || index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default FaqSection;
