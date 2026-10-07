import React, { useState } from 'react';

// Sample data for the learning hub
const mediaContent = {
  youtube: {
    featured: {
      title: "ASMA Offline Batch starts 15 September",
      description: "Join Advait Share Market Academy's upcoming offline batch starting September 15. Learn directly from the experts in a comprehensive, hands-on environment.",
      thumbnail: "https://i.ytimg.com/vi/RuwJDUGmMko/maxresdefault.jpg",
      platform: "YouTube",
      sourceType: "youtube",
      meta: "NEW BATCH • ANNOUNCEMENT",
      id: "RuwJDUGmMko"
    },
    list: [
      {
        title: "Avoid the hype. Invest with understanding.",
        thumbnail: "https://i.ytimg.com/vi/FP0KdwnWhc8/hqdefault.jpg",
        platform: "YouTube",
        sourceType: "youtube",
        meta: "MINDSET",
        id: "FP0KdwnWhc8"
      },
      {
        title: "A stock falling, doesn't automatically mean it's a bargain.",
        thumbnail: "https://i.ytimg.com/vi/c-cFGIe_Kqw/hqdefault.jpg",
        platform: "YouTube",
        sourceType: "youtube",
        meta: "ANALYSIS",
        id: "c-cFGIe_Kqw"
      },
      {
        title: "Small. Learn smart. Grow with discipline.",
        thumbnail: "https://i.ytimg.com/vi/g-dINon688c/hqdefault.jpg",
        platform: "YouTube",
        sourceType: "youtube",
        meta: "STRATEGY",
        id: "g-dINon688c"
      }
    ]
  },
  reels: {
    featured: {
      title: "Master Market Psychology",
      description: "A glimpse into the real learning experience at Advait Share Market Academy. Stop guessing and start analyzing.",
      thumbnail: "/logo.png",
      platform: "Instagram Reel",
      sourceType: "instagram",
      meta: "PSYCHOLOGY",
      id: "Dc_aB3TTvyS" 
    },
    list: [
      {
        title: "Trading Strategy Insights",
        thumbnail: "/logo.png",
        platform: "Instagram Reel",
        sourceType: "instagram",
        meta: "STRATEGY",
        id: "Dc7oLIpTtWo"
      },
      {
        title: "Risk Management Basics",
        thumbnail: "/logo.png",
        platform: "Instagram Reel",
        sourceType: "instagram",
        meta: "LEARNING",
        id: "DcVzyqYTu3d"
      },
      {
        title: "Live Market Analysis",
        thumbnail: "/logo.png",
        platform: "Instagram Reel",
        sourceType: "instagram",
        meta: "ANALYSIS",
        id: "DcJGyNlTHUU"
      }
    ]
  },
  shorts: {
    featured: {
      title: "Real learning. Real experience. Real growth.",
      description: "A glimpse into the real learning experience at Advait Share Market Academy. Stop guessing and start analyzing.",
      thumbnail: "https://i.ytimg.com/vi/loqs401dPqY/maxresdefault.jpg",
      platform: "YouTube Shorts",
      sourceType: "youtube",
      meta: "HIGHLIGHT",
      id: "loqs401dPqY"
    },
    list: [
      {
        title: "Avoid the hype. Invest with understanding.",
        thumbnail: "https://i.ytimg.com/vi/FP0KdwnWhc8/hqdefault.jpg",
        platform: "YouTube Shorts",
        sourceType: "youtube",
        meta: "MINDSET",
        id: "FP0KdwnWhc8"
      },
      {
        title: "A stock falling, doesn't automatically mean it's a bargain.",
        thumbnail: "https://i.ytimg.com/vi/c-cFGIe_Kqw/hqdefault.jpg",
        platform: "YouTube Shorts",
        sourceType: "youtube",
        meta: "ANALYSIS",
        id: "c-cFGIe_Kqw"
      },
      {
        title: "Small. Learn smart. Grow with discipline.",
        thumbnail: "https://i.ytimg.com/vi/g-dINon688c/hqdefault.jpg",
        platform: "YouTube Shorts",
        sourceType: "youtube",
        meta: "STRATEGY",
        id: "g-dINon688c"
      }
    ]
  }
};

// Video Modal Component
const VideoModal = ({ media, onClose }) => {
  React.useEffect(() => {
    if (media) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [media]);

  if (!media) return null;

  const isVertical = media.platform.toLowerCase().includes('reel') || media.platform.toLowerCase().includes('short');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-12 py-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className={`relative w-full bg-black rounded-2xl shadow-2xl z-10 animate-[fadeIn_0.3s_ease-out] ${isVertical ? 'max-w-sm md:max-w-md' : 'max-w-5xl'}`}>
        
        {/* Visible Close Button (Placed OUTSIDE the box so it never overlaps video UI) */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 md:-right-12 text-white hover:text-[#d4af37] transition-all z-30 bg-black/50 hover:bg-black backdrop-blur-sm rounded-full p-2 hover:scale-110"
        >
          <svg className="w-8 h-8 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className={`relative w-full overflow-hidden rounded-2xl ${isVertical ? 'h-[85vh] max-h-[850px]' : 'pt-[56.25%]'}`}>
          {media.sourceType === 'youtube' ? (
            <iframe 
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${media.id}?autoplay=1`} 
              title={media.title}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          ) : (
            <iframe 
              className="absolute inset-0 w-full h-full"
              src={`https://www.instagram.com/p/${media.id}/embed`} 
              title={media.title}
              frameBorder="0" 
              scrolling="no"
              allowTransparency="true"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

import AnimatedSection from './AnimatedSection';

const SocialLearningHub = () => {
  const [activeTab, setActiveTab] = useState('youtube');
  const [activeMedia, setActiveMedia] = useState(null);
  
  const currentContent = mediaContent[activeTab];

  return (
    <AnimatedSection id="social-hub" className="py-20 md:py-28 bg-[#faf9f6]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1280px]">
        
        {/* SECTION TITLE AREA */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <span className="text-[#b59a56] font-bold uppercase tracking-widest text-xs mb-4 block">
              SOCIAL LEARNING HUB
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-[#1a2e22] mb-4 leading-tight">
              Watch, Learn & Stay Connected
            </h2>
            <p className="text-[#3b4d42] text-base md:text-lg">
              Explore market insights, educational videos, reels, and practical trading content across Advait’s social platforms.
            </p>
          </div>
          
          {/* TAB SWITCHER */}
          <div className="flex bg-white rounded-xl p-1 border border-[#e6e2d8] shadow-sm self-start lg:self-end shrink-0">
            {[
              { id: 'youtube', label: 'YouTube' },
              { id: 'reels', label: 'Instagram Reels' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-[#faf9f6] text-[#b59a56] border border-[#e6e2d8] shadow-[0_2px_8px_rgba(0,0,0,0.04)]' 
                    : 'text-[#5a6b5e] hover:text-[#1a2e22] border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* LAYOUT: TWO-COLUMN CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-12">
          
          {/* LEFT COLUMN: FEATURED VIDEO CARD (~65%) */}
          <div 
            className="lg:col-span-8 group cursor-pointer"
            onClick={() => setActiveMedia(currentContent.featured)}
          >
            <div className="bg-[#fcfbf9] rounded-[20px] border border-[#e6e2d8] shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
              
              {/* Large Thumbnail Area */}
              <div className="relative aspect-video w-full overflow-hidden bg-[#1a2e22]">
                <img 
                  src={currentContent.featured.thumbnail} 
                  alt={currentContent.featured.title} 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
                
                {/* Platform Tag */}
                <div className="absolute top-4 left-4 bg-[#fcfbf9]/90 backdrop-blur-md px-3 py-1.5 rounded-md flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#1a2e22]"></span>
                  <span className="text-xs font-bold text-[#1a2e22] tracking-wider uppercase">{currentContent.featured.platform}</span>
                </div>

                {/* Centered Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-[#fcfbf9]/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-[#1a2e22] ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4l12 6-12 6V4z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Featured Card Content */}
              <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[#b59a56] font-bold text-[10px] tracking-widest uppercase mb-3 block">
                    {currentContent.featured.meta}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-[#1a2e22] mb-3 leading-tight group-hover:text-[#b59a56] transition-colors">
                    {currentContent.featured.title}
                  </h3>
                  <p className="text-[#5a6b5e] text-sm md:text-base line-clamp-2 leading-relaxed">
                    {currentContent.featured.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STACK OF 3 CARDS (~35%) */}
          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8 justify-between">
            {currentContent.list.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveMedia(item)}
                className="bg-[#fcfbf9] rounded-2xl border border-[#e6e2d8] p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group h-full"
              >
                {/* Small Thumbnail */}
                <div className="relative w-32 h-24 shrink-0 rounded-xl overflow-hidden bg-[#1a2e22]">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title} 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-3 h-3 text-[#1a2e22] ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4l12 6-12 6V4z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Small Card Content */}
                <div className="flex flex-col flex-grow py-1">
                  <span className="text-[9px] font-bold text-[#b59a56] tracking-widest uppercase mb-1.5 block">
                    {item.meta}
                  </span>
                  <h4 className="text-[#1a2e22] font-bold text-sm leading-snug line-clamp-2 group-hover:text-[#b59a56] transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[#7a8b7e] text-[10px] mt-2 block font-medium uppercase tracking-wider">
                    {item.platform}
                  </span>
                </div>
              </div>
            ))}
            
            {/* VIEW MORE BUTTON */}
            <a 
              href={activeTab === 'youtube' ? "https://www.youtube.com/@advaitsharemarketacademy-x5p" : "https://www.instagram.com/asma_stockmarket/"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 md:mt-0 flex items-center justify-center gap-2 bg-transparent hover:bg-[#fcfbf9] text-[#1a2e22] py-3 px-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 border border-dashed border-[#d0c9b8] hover:border-[#1a2e22] group"
            >
              View More {activeTab === 'youtube' ? 'Videos' : 'Reels'}
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

        </div>

        {/* BOTTOM ROW */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#e6e2d8] gap-6">
          
          {/* Info List */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-[#3b4d42] text-sm md:text-base font-medium">
            <span>500+ Educational Videos</span>
            <span className="hidden sm:inline-block text-[#d0c9b8]">•</span>
            <span>Daily Market Reels</span>
            <span className="hidden sm:inline-block text-[#d0c9b8]">•</span>
            <span>Live Learning Content</span>
          </div>
          
          {/* Social Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <a 
              href="https://www.youtube.com/@advaitsharemarketacademy-x5p"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-transparent hover:bg-[#b59a56] text-[#b59a56] hover:text-white font-bold text-sm tracking-widest uppercase px-6 py-3 rounded-xl transition-all duration-300 border-2 border-[#b59a56] shadow-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              Subscribe
            </a>
            <a 
              href="https://www.instagram.com/asma_stockmarket/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-transparent hover:bg-[#1a2e22] text-[#1a2e22] hover:text-[#b59a56] font-bold text-sm tracking-widest uppercase px-6 py-3 rounded-xl transition-all duration-300 border-2 border-[#1a2e22] shadow-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              Follow
            </a>
          </div>
        </div>

      </div>
      
      {/* Video Modal Render */}
      <VideoModal media={activeMedia} onClose={() => setActiveMedia(null)} />
    </AnimatedSection>
  );
};

export default SocialLearningHub;
