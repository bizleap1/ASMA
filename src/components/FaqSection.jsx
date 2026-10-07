import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

const FaqItem = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="border-b border-[#1a2e22]/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full text-left py-5 px-2 md:px-4 flex justify-between items-center group transition-colors hover:bg-[#1a2e22]/5 rounded-lg"
      >
        <h3 className="text-base md:text-lg font-bold text-[#1a2e22] pr-8 group-hover:text-[#166534] transition-colors">
          {faq.question}
        </h3>
        <span className="flex-shrink-0 text-[#b59a56]">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-6 h-6 rounded-full bg-[#1a2e22]/5 flex items-center justify-center group-hover:bg-[#b59a56]/20 group-hover:text-[#b59a56] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 px-2 md:px-4 text-gray-600 text-sm md:text-base leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqSection = ({ faqs, title = "Frequently Asked Questions", subtitle = "Got questions? We've got answers." }) => {
  const [openIndex, setOpenIndex] = useState(0);

  // Generate JSON-LD Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <AnimatedSection className="py-16 md:py-24 bg-[#faf9f6]">
      {/* Inject JSON-LD into the head or body securely */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[900px]">
        {/* Header */}
        <div className="text-center mb-12">
          <h4 className="text-[#b59a56] uppercase font-bold tracking-widest text-xs md:text-sm mb-4">
            FAQS
          </h4>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1a2e22] leading-tight font-display mb-4">
            {title}
          </h2>
          <p className="text-gray-600">
            {subtitle}
          </p>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#1a2e22]/5 p-2 md:p-6 lg:p-8">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default FaqSection;
