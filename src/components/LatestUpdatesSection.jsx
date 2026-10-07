import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LatestUpdatesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const announcements = [
    {
      date: "Sept 10th",
      title: "New Offline Batch Commencing!",
      desc: "We are thrilled to announce our next comprehensive batch covering Technical Analysis and Options Strategies. Seats are highly limited to ensure personalized attention.",
      image: "/updates_poster_revamped.png",
      features: [
        "Live Market Practical Sessions",
        "Proprietary Trading Setups & Strategies",
        "Lifetime Mentorship & Community Access"
      ]
    },
    {
      date: "Sept 15th",
      title: "Upcoming Online & Offline Batch!",
      desc: "Join our intensive program starting mid-September. Master the stock market with expert guidance and proven strategies to start your journey towards financial freedom.",
      image: "/updates_poster.png",
      features: [
        "Live Interactive Classes",
        "Learn From Anywhere",
        "Flexible Timings & Recordings Available"
      ]
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
  };

  const item = announcements[currentIndex];

  return (
    <section id="latest-updates" className="py-6 md:py-10 bg-[#faf8f5] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0B2117]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-50"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 max-w-[1200px]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-12">
          <div className="text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D4AF37]/30 shadow-sm text-[#B8860B] font-bold tracking-widest uppercase text-[9px] mb-2"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4AF37]"></span>
              </span>
              Academy Announcements
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-4xl font-display font-black text-text-primary tracking-tight"
            >
              What's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B2117] to-[#1a4a35]">Trending</span> Now
            </motion.h2>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white border border-[#D4AF37]/30 flex items-center justify-center text-[#0B2117] hover:bg-[#0B2117] hover:text-[#D4AF37] hover:border-[#0B2117] transition-all shadow-sm group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white border border-[#D4AF37]/30 flex items-center justify-center text-[#0B2117] hover:bg-[#0B2117] hover:text-[#D4AF37] hover:border-[#0B2117] transition-all shadow-sm group"
            >
              <svg className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-12 w-full"
            >
              {/* Image Poster Column */}
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                <div className="relative group w-full max-w-[320px]">
                  {/* Glow Effect */}
                  <div className="absolute -inset-2 bg-gradient-to-tr from-[#D4AF37] via-[#f7e5b5] to-[#D4AF37] rounded-[1.2rem] blur-lg opacity-40 group-hover:opacity-70 transition duration-700"></div>
                  
                  {/* Glass Container */}
                  <div className="relative rounded-[1.2rem] p-2 bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="relative rounded-lg overflow-hidden bg-[#0B2117]">
                      <img
                        src={item.image}
                        alt={`Update - ${item.title}`}
                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Column */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[1.2rem] shadow-[0_8px_25px_-10px_rgba(0,0,0,0.05)] border border-white hover:shadow-[0_10px_30px_-10px_rgba(212,175,55,0.15)] transition-all duration-500 relative overflow-hidden h-full flex flex-col justify-between max-w-[480px]">
                  
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#f7e5b5] to-[#D4AF37]"></div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#0B2117] text-[#D4AF37] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                        {item.date}
                      </span>
                      <span className="text-text-secondary text-xs font-medium flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                        Trending
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-display font-black text-text-primary mb-3 leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-text-secondary mb-6 leading-relaxed text-sm">
                      {item.desc}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      {item.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-md shadow-sm border border-gray-50 hover:-translate-y-0.5 transition-transform">
                          <div className="w-6 h-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-[#B8860B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <span className="text-xs md:text-sm font-semibold text-text-primary">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <a href="tel:09156953895" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0B2117] text-white font-bold uppercase tracking-widest text-[11px] rounded-lg shadow-md hover:bg-[#1a4a35] hover:shadow-lg hover:shadow-[#0B2117]/20 transition-all hover:-translate-y-1 w-full group/btn relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                      Inquire Now
                      <svg className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default LatestUpdatesSection;
