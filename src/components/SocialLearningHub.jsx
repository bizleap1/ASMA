import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Original ASMA media content for YouTube & Instagram Reels (2x2 Grid)
const mediaContent = {
  youtube: [
    {
      id: "RwlabezrpuI",
      title: "Why 95% of Traders Lose Money | Satish Bobade | ASMA Unfiltered",
      description: "Founder Satish Bobade breaks down trading psychology, emotional discipline, and why proper risk management is essential to survive and grow in the stock market.",
      thumbnail: "https://i.ytimg.com/vi/RwlabezrpuI/maxresdefault.jpg",
      platform: "YouTube",
      sourceType: "youtube",
      meta: "PODCAST • ASMA UNFILTERED"
    },
    {
      id: "ajRBUoWpTOE",
      title: "90% Trades Right, Still Losing Money? Here's WHY!",
      description: "What if you’re right in 9 out of 10 trades and still end up in a loss? Learn why a high success ratio without proper risk-reward leads to trading failure.",
      thumbnail: "https://i.ytimg.com/vi/ajRBUoWpTOE/maxresdefault.jpg",
      platform: "YouTube",
      sourceType: "youtube",
      meta: "RISK MANAGEMENT"
    }
  ],
  reels: [
    {
      id: "DfPkY6tTcuz",
      title: "Nifty +300, Sensex +1,000 | Key Reasons Behind The Market Rally",
      description: "Satish Bobade breaks down the major institutional inflows and macroeconomic triggers driving the sharp breakout in Nifty and Sensex.",
      thumbnail: "/reels/reel_1.webp",
      platform: "Instagram Reel",
      sourceType: "instagram",
      meta: "MARKET RALLY"
    },
    {
      id: "DfIBxVWzpH3",
      title: "Good Results = Higher Stock Price? Market Reality Explained",
      description: "Why do fundamentally solid stocks sometimes fall even after strong quarterly results? Understand market expectations vs reality.",
      thumbnail: "/reels/reel_2.webp",
      platform: "Instagram Reel",
      sourceType: "instagram",
      meta: "EARNINGS & ANALYSIS"
    },
    {
      id: "DfFrS9RTcJd",
      title: "Expiry Ke Din Option Trading Karte Ho? Risk & Truth",
      description: "Learn the high-risk pitfalls of expiry day zero-hero trades, theta decay, and how disciplined traders protect their capital.",
      thumbnail: "/reels/reel_3.webp",
      platform: "Instagram Reel",
      sourceType: "instagram",
      meta: "OPTIONS TRADING"
    },
    {
      id: "DfAW-2vTUI9",
      title: "Market Minute With ASMA | Nifty Expiry Day Analysis",
      description: "Quick, actionable market breakdown by Satish Bobade on managing volatility and positioning around Nifty expiry sessions.",
      thumbnail: "/reels/reel_4.webp",
      platform: "Instagram Reel",
      sourceType: "instagram",
      meta: "MARKET MINUTE"
    }
  ]
};

// Video Modal Component: mounts player only when user clicks
const VideoModal = ({ media, onClose }) => {
  useEffect(() => {
    if (media) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [media, onClose]);

  if (!media) return null;

  const isVertical = media.platform.toLowerCase().includes('reel') || media.platform.toLowerCase().includes('short');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-8 py-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div className={`relative w-full bg-black rounded-xl overflow-hidden shadow-2xl z-10 animate-[fadeIn_0.25s_ease-out] ${isVertical ? 'max-w-sm md:max-w-md' : 'max-w-4xl'}`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          aria-label="Close video"
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors z-30 bg-black/60 hover:bg-black/90 backdrop-blur-sm rounded-full p-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className={`relative w-full ${isVertical ? 'h-[80vh] max-h-[750px]' : 'aspect-video'}`}>
          {media.sourceType === 'youtube' ? (
            <iframe 
              className="w-full h-full border-0"
              src={`https://www.youtube.com/embed/${media.id}?autoplay=1&rel=0`} 
              title={media.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          ) : (
            <iframe 
              className="w-full h-full border-0"
              src={`https://www.instagram.com/reel/${media.id}/embed`} 
              title={media.title}
              scrolling="no"
              allowTransparency="true"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const SocialLearningHub = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('youtube');
  const [activeMedia, setActiveMedia] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const easeOut = [0.16, 1, 0.3, 1];
  const vp = { once: true, amount: 0.15 };

  const currentContent = mediaContent[activeTab];

  return (
    <section 
      id="social-hub" 
      className="pt-6 sm:pt-8 lg:pt-9 pb-6 sm:pb-8 lg:pb-9 bg-[#FAF9F5] relative w-full px-5 sm:px-6 md:px-8 lg:px-12 overflow-hidden"
    >
      <div className="container mx-auto px-0">
        
        {/* Header Block: Left-aligned content + Touch-friendly Tab Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 sm:mb-8 lg:mb-12 gap-5 sm:gap-6">
          <div className="max-w-2xl text-left">
            {/* Eyebrow: SOCIAL LEARNING HUB - left-aligned */}
            <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
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
                transition={{ duration: 0.38, delay: 0.05, ease: easeOut }}
                className="text-[11.5px] sm:text-[12px] font-medium tracking-[0.16em] uppercase text-[#063925]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                SOCIAL LEARNING HUB
              </motion.span>
            </div>

            {/* Main Heading: Left-aligned, Manrope 600, ~30–34px on mobile */}
            <motion.h2
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 8 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.38 : 0.6, delay: isMobile ? 0.05 : 0.1, ease: easeOut }}
              className="text-[30px] xs:text-[32px] sm:text-[34px] lg:text-[38px] xl:text-[40px] font-semibold text-[#1A3326] leading-[1.16] tracking-tight text-left"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Learn Beyond <span className="text-[#D4AF37]">the Classroom.</span>
            </motion.h2>

            {/* Description: Left-aligned, Inter 400, ~15px on mobile */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 8 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.38 : 0.45, delay: isMobile ? 0.08 : 0.18, ease: easeOut }}
              className="text-[15px] sm:text-[15.5px] text-[#4A6356] font-normal leading-relaxed max-w-xl mt-2.5 sm:mt-3 text-left"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Explore stock market insights, trading education videos and practical learning content from ASMA on YouTube and Instagram.
            </motion.p>
          </div>
          
          {/* Tab Switcher: Two equal-width touch-friendly controls on mobile, smooth 200ms active indicator */}
          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex bg-white rounded-[6px] p-1 border border-black/8 shadow-sm shrink-0 relative mt-1 sm:mt-0">
            {[
              { id: 'youtube', label: 'YouTube' },
              { id: 'reels', label: 'Instagram Reels' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative min-h-[44px] sm:min-h-0 py-2.5 sm:py-2 px-3 sm:px-4 text-center flex items-center justify-center text-[13px] sm:text-xs font-semibold rounded-[4px] transition-colors duration-200 z-10 ${
                    isActive ? 'text-white' : 'text-[#4A6356] hover:text-[#1A3326]'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="socialTabActiveIndicator"
                      className="absolute inset-0 bg-[#063925] rounded-[4px] -z-10 shadow-sm"
                      transition={{ duration: 0.2, ease: easeOut }}
                    />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Showcase: 2x2 Grid (1 row me 2 videos, proper 50% / 50% split) */}
        <motion.div
          onViewportEnter={() => setHasEnteredViewport(true)}
          viewport={vp}
        >
          {/* Tab content crossfade in 200ms without restarting whole section */}
          <motion.div
            key={activeTab}
            initial={hasEnteredViewport ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {activeTab === 'youtube' ? (
              // YouTube: 2x2 Grid (1 row me 2 videos, proper 50% / 50% split)
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-stretch">
                {currentContent.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={shouldReduceMotion || hasEnteredViewport ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 8 : 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={vp}
                    transition={{
                      duration: isMobile ? 0.38 : 0.5,
                      delay: isMobile ? (0.05 + (idx % 2) * 0.04) : (0.12 + Math.floor(idx / 2) * 0.08 + (idx % 2) * 0.06),
                      ease: easeOut
                    }}
                    className="flex flex-col h-full"
                  >
                    <div
                      onClick={() => setActiveMedia(item)}
                      className="group bg-white rounded-[6px] border border-black/8 hover:border-[#063925]/30 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(6,57,37,0.06)] transition-all duration-200 ease-out flex flex-col h-full cursor-pointer"
                    >
                      {/* Thumbnail Container: 16:9 for YouTube */}
                      <div className="relative w-full overflow-hidden bg-[#06261A] shrink-0 aspect-video flex items-center justify-center">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 ease-out md:group-hover:scale-[1.02]"
                        />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/15 md:group-hover:bg-black/20 transition-colors duration-200">
                          <div className="w-12 h-12 sm:w-13 sm:h-13 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg md:group-hover:scale-108 transition-all duration-200 ease-out">
                            <svg className="w-5 h-5 text-[#063925] ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4l12 6-12 6V4z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5 lg:p-5.5 flex flex-col justify-between flex-grow text-left">
                        <div>
                          <span 
                            className="text-[#D4AF37] text-[10.5px] font-semibold tracking-wider uppercase mb-1.5 sm:mb-2 block text-left"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {item.meta}
                          </span>
                          <h3 
                            className="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold text-[#1A3326] md:group-hover:text-[#063925] transition-colors duration-200 leading-snug mb-1.5 sm:mb-2 line-clamp-2 text-left"
                            style={{ fontFamily: "'Manrope', sans-serif" }}
                          >
                            {item.title}
                          </h3>
                          <p 
                            className="text-[12.5px] sm:text-[13px] text-[#4A6356] font-normal leading-relaxed mb-3 sm:mb-4 line-clamp-2 text-left"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {item.description}
                          </p>
                        </div>

                        {/* Bottom Action */}
                        <div className="pt-2.5 sm:pt-3 border-t border-black/5 flex items-center justify-between">
                          <span
                            className="inline-flex items-center gap-2 text-[11.5px] sm:text-[12px] font-semibold uppercase tracking-wider text-[#063925] md:group-hover:text-[#D4AF37] transition-colors duration-200"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            <span>Watch Video</span>
                            <svg
                              className="w-4 h-4 transition-transform duration-200 ease-out md:group-hover:translate-x-[3px]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Instagram Reels: Pure 9:16 Vertical Reel Ratio, 4 across, NO text below
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
                {currentContent.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={shouldReduceMotion || hasEnteredViewport ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 8 : 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={vp}
                    transition={{
                      duration: isMobile ? 0.38 : 0.5,
                      delay: isMobile ? (0.04 + idx * 0.04) : (0.08 + idx * 0.05),
                      ease: easeOut
                    }}
                    className="flex flex-col"
                  >
                    <div
                      onClick={() => setActiveMedia(item)}
                      className="group relative w-full aspect-[9/16] rounded-[8px] sm:rounded-[10px] overflow-hidden bg-[#06261A] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_28px_rgba(6,57,37,0.18)] transition-all duration-300 cursor-pointer border border-black/10"
                    >
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 ease-out md:group-hover:scale-[1.03]"
                      />

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/15 md:group-hover:bg-black/25 transition-colors duration-200">
                        <div className="w-11 h-11 sm:w-13 sm:h-13 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg md:group-hover:scale-110 transition-all duration-200 ease-out">
                          <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#063925] ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4l12 6-12 6V4z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Bottom Bar: Community info & external social CTAs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-3 sm:pt-4 gap-4 sm:gap-6 mt-5 sm:mt-6">
          <div 
            className="flex flex-wrap justify-start items-center gap-x-2.5 sm:gap-x-4 gap-y-1.5 text-[#4A6356] text-xs sm:text-[13px] font-medium text-left"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span>500+ Educational Videos</span>
            <span className="text-black/20">•</span>
            <span>Daily Market Reels</span>
            <span className="text-black/20">•</span>
            <span>Live Learning Content</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
            <a 
              href={activeTab === 'youtube' ? "https://www.youtube.com/@advaitsharemarketacademy-x5p" : "https://www.instagram.com/asma_stockmarket/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white hover:bg-[#FAF9F5] text-[#063925] border border-black/10 hover:border-[#063925]/30 text-xs font-semibold uppercase tracking-wider px-3.5 sm:px-4 py-2.5 rounded-[4px] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span>View More on {activeTab === 'youtube' ? 'YouTube' : 'Instagram'}</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <div className="flex items-center gap-2">
              <a 
                href="https://www.youtube.com/@advaitsharemarketacademy-x5p"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#063925] hover:bg-[#0B2117] text-white text-xs font-semibold uppercase tracking-wider px-3.5 sm:px-4 py-2.5 rounded-[4px] transition-colors shadow-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <svg className="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>Subscribe</span>
              </a>
              <a 
                href="https://www.instagram.com/asma_stockmarket/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-black/10 hover:border-[#063925] bg-white text-[#063925] text-xs font-semibold uppercase tracking-wider px-3.5 sm:px-4 py-2.5 rounded-[4px] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#063925] shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                <span>Follow</span>
              </a>
            </div>
          </div>
        </div>

      </div>
      
      {/* Video Modal: only mounts player when clicked */}
      <VideoModal media={activeMedia} onClose={() => setActiveMedia(null)} />
    </section>
  );
};

export default SocialLearningHub;
