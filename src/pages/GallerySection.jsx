import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { blogPosts } from '../blogData';
import shubhangiImg from '../assets/shubhangi.png';
import krishnaImg from '../assets/krishna.png';
import vrushaliImg from '../assets/vrushali.png';
import { serviceData, courseDetails, baseCourses, additionalCourses, FREE_NOTES } from '../data';
import AnimatedSection from '../components/AnimatedSection';
import Home from './Home';

const GallerySection = ({ isGalleryPage = false }) => {
  const location = useLocation();
  const [activeImg, setActiveImg] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [filterCategory, setFilterCategory] = React.useState(() => {
    return location?.state?.category || 'All';
  });
  const [visibleItemsCount, setVisibleItemsCount] = React.useState(12);

  React.useEffect(() => {
    if (location?.state?.category) {
      setFilterCategory(location.state.category);
    }
  }, [location?.state]);

  // Master lists of ASMA media assets
  const rawVideos = [
    { url: "/videos/ANUJ9211.MP4", title: "Live Market Experience", desc: "Experience the pulse of live trading on our Nagpur trading floor." },
    { url: "/videos/ANUJ9212-compressed.mp4", title: "Interactive Trading Floor", desc: "Join our active community of professional traders." },
    { url: "/videos/ANUJ9213.MP4", title: "Technical Analysis Lab", desc: "In-depth chart breakdowns and multi-timeframe analysis." },
    { url: "/videos/ANUJ9216.MP4", title: "Market Psychology", desc: "Understanding emotional discipline and systematic risk management." },
    { url: "/videos/ANUJ9217.MP4", title: "Live Trading Workshops", desc: "Interactive sessions with our research analysts and mentors." },
    { url: "/videos/ANUJ9218.MP4", title: "Advanced Market Concepts", desc: "Deep dive into options chain, Greeks and institutional flow." },
    { url: "/videos/ANUJ9219-compressed.mp4", title: "Execution Strategy", desc: "Executing disciplined real-time orders on professional setups." },
    { url: "/videos/ANUJ9221.MP4", title: "Continuous Market Insights", desc: "Comprehensive post-market analysis and strategy debrief." },
    { url: "/videos/podcast-session-compressed.mp4", title: "Market Insights Podcast", desc: "Behind the scenes of our exclusive market strategy and trader mindset podcast session." },
  ];

  const rawPortraitPhotos = [
    { url: "/new photos/podcast-founder-portrait.webp", title: "Founder Podcast Session", desc: "Exclusive interview and trading mindset session with ASMA founder Prof. Satish A. Bobade." },
    { url: "/new photos/podcast-studio-behind-scenes.webp", title: "Behind the Scenes Studio", desc: "Inside our media recording studio capturing in-depth market strategies and mentoring sessions." },
    { url: "/new photos/WhatsApp Image 2026-09-18 at 5.34.41 PM.jpeg", title: "Student Classroom", desc: "Dedicated students focusing during intense live market sessions." },
    { url: "/new photos/WhatsApp Image 2026-09-18 at 5.35.18 PM.jpeg", title: "Faculty Mentorship", desc: "Guidance from our lead mentors on trading setups." },
    { url: "/new photos/WhatsApp Image 2026-09-18 at 5.40.48 PM.jpeg", title: "Trading Setups", desc: "Our state-of-the-art multi-monitor trading terminals." },
    { url: "/new photos/WhatsApp Image 2026-09-18 at 5.41.22 PM.jpeg", title: "Community Bonds", desc: "Learning, sharing strategies and growing wealth together." },
    { url: "/new photos/WhatsApp Image 2026-09-18 at 5.41.39 PM.jpeg", title: "Focused Learning", desc: "Immersive classroom environment in Besa–Pipla, Nagpur." },
    { url: "/new photos/WhatsApp Image 2026-09-18 at 5.42.11 PM.jpeg", title: "Trade Counseling", desc: "One-on-one portfolio reviews and risk mentorship." },
  ];

  const rawLandscapePhotos = [
    { url: "/Home/new2.webp", title: "Student Classroom", desc: "Our dedicated students focusing during intense trading sessions." },
    { url: "/Home/new3.webp", title: "Faculty Mentorship", desc: "Guidance from our lead mentor on the trading floor." },
    { url: "/Home/new5.webp", title: "Interactive Discussions", desc: "Group discussions and doubt clearing sessions with faculty." },
    { url: "/Home/1.webp", title: "Live Trading Floor", desc: "Experience the pulse of the market in our state-of-the-art facility." },
    { url: "/Home/2.webp", title: "Mentorship Sessions", desc: "Get one-on-one guidance from experienced market professionals." },
    { url: "/Home/3.webp", title: "Analysis Workshops", desc: "Deep dive into technical charts and fundamental data." },
    { url: "/Home/4.webp", title: "Student Community", desc: "Collaborate, learn, and grow your wealth together." },
    { url: "/Home/17.webp", title: "Live Trading Execution", desc: "Students actively executing real-time trades and managing portfolios using advanced trading terminals." },
    { url: "/Home/16.webp", title: "Interactive Technical Workshops", desc: "Faculty actively monitoring and guiding students as they analyze live market charts and spot breakout patterns." },
    { url: "/Home/15.webp", title: "Student Support & Onboarding", desc: "Our dedicated support team ensuring seamless onboarding, query resolution, and administrative assistance for all our traders." },
    { url: "/Home/14.webp", title: "Live Market Mentorship", desc: "Students gaining hands-on experience under the expert guidance of our research analysts in the live trading environment." },
    { url: "/Home/13.webp", title: "Dedicated Market Research", desc: "Continuous market analysis and strategy formulation by our experienced faculty to ensure top-tier education." },
    { url: "/Home/12.webp", title: "Focused Learning Environment", desc: "Immersive classroom sessions designed to master the fundamentals of technical and fundamental analysis." },
    { url: "/Home/11.webp", title: "Next Generation of Traders", desc: "Empowering eager minds with the knowledge and discipline required to thrive in the competitive stock market." },
    { url: "/Home/10.webp", title: "Advanced Trading Concepts", desc: "In-depth lectures on complex market dynamics, risk management, and proprietary trading setups." },
    { url: "/Home/9.webp", title: "Mastering Reversal Strategies", desc: "Learn to identify trend ends and pinpoint exact reversal points with volume analysis in our live classrooms." },
    { url: "/Home/8.webp", title: "Personalized Trade Counseling", desc: "Get one-on-one portfolio reviews and trading psychology guidance from our veteran analysts." },
    { url: "/Home/7.webp", title: "Expert Market Leadership", desc: "Guided by Prof. Satish A. Bobade, bringing decades of research analysis and institutional trading experience." },
    { url: "/Home/6.webp", title: "Advait Stock Market Academy", desc: "Our premium campus dedicated exclusively to cultivating top-tier stock market traders and financial professionals." },
    { url: "/Home/5.webp", title: "Engineering Trading Success", desc: "Celebrating the analytical minds that approach the stock market with precision, logic, and calculated strategy." },
  ];

  // Curated lists with identical 4-column balanced masonry rhythm (Landscape, Portrait, Landscape per column)
  const photoGalleryList = [
    // Column 1 (initial 3 - Brand new podcast portrait at top)
    rawPortraitPhotos[0],
    rawLandscapePhotos[0],
    rawLandscapePhotos[1],
    // Column 2 (initial 3 - Brand new studio behind scenes at top)
    rawPortraitPhotos[1],
    rawLandscapePhotos[2],
    rawLandscapePhotos[3],
    // Column 3 (initial 3)
    rawLandscapePhotos[4],
    rawPortraitPhotos[2],
    rawLandscapePhotos[5],
    // Column 4 (initial 3)
    rawLandscapePhotos[6],
    rawPortraitPhotos[3],
    rawLandscapePhotos[7],
    // Next batch (Load More)
    rawLandscapePhotos[8],
    rawPortraitPhotos[4],
    rawLandscapePhotos[9],
    rawLandscapePhotos[10],
    rawPortraitPhotos[5],
    rawLandscapePhotos[11],
    rawLandscapePhotos[12],
    rawPortraitPhotos[6],
    rawLandscapePhotos[13],
    rawLandscapePhotos[14],
    rawPortraitPhotos[7],
    rawLandscapePhotos[15],
    // Remaining items
    rawLandscapePhotos[16],
    rawLandscapePhotos[17],
    rawLandscapePhotos[18],
    rawLandscapePhotos[19],
  ];

  const videoGalleryList = [
    // Column 1 (initial 3 - Podcast video at top)
    rawVideos[8], // Market Insights Podcast (Portrait video)
    rawVideos[0],
    rawVideos[2],
    // Column 2 (initial 3)
    rawVideos[3],
    rawVideos[1], // Portrait video
    rawVideos[4],
    // Column 3 (initial 3)
    rawVideos[5],
    rawVideos[6], // Portrait video
    rawVideos[7],
    // Column 4 (initial 3)
    { ...rawVideos[0], title: "Risk Management Protocol", desc: "Calculating position sizes and stop losses in real time on active desks." },
    { ...rawVideos[8], title: "Trader Mindset Podcast", desc: "Key discussions on psychological endurance and discipline in volatile markets." }, // Portrait
    { ...rawVideos[4], title: "Institutional Price Action", desc: "Volume profile and key level analysis on the trading floor." },
    // Next batch (Load More)
    { ...rawVideos[2], title: "Chart Pattern Mastery", desc: "Identifying candlestick formations and volume confirmations." },
    { ...rawVideos[1], title: "Student Floor Synergy", desc: "Collaborative student trading desks and live review." },
    { ...rawVideos[3], title: "Emotion Control in Volatile Markets", desc: "Executing rules-based trading under market pressure." },
    { ...rawVideos[6], title: "One-on-One Position Review", desc: "Mentor feedback on live risk exposure and trade entries." },
    { ...rawVideos[5], title: "Derivatives Strategy Setup", desc: "Options hedging and risk mitigation strategies." },
    { ...rawVideos[8], title: "Podcast Discussion Session", desc: "Mentors breaking down market cycles and disciplined execution." },
    { ...rawVideos[7], title: "Daily Market Wrap & Journaling", desc: "Post-market trade logging and statistical analysis." },
    { ...rawVideos[0], title: "Terminal Execution Skills", desc: "Fast order routing and risk-defined stop loss placement." },
  ];

  const allGalleryList = [
    // Top 3 recent items: 1st Founder Portrait, 2nd Studio Behind the Scenes, 3rd Podcast Session Video
    rawPortraitPhotos[0],
    rawPortraitPhotos[1],
    rawVideos[8], // Market Insights Podcast (3rd position in All)
    rawVideos[0],
    rawLandscapePhotos[0],
    rawLandscapePhotos[1],
    rawVideos[2],
    rawPortraitPhotos[2], // Portrait photo
    rawLandscapePhotos[2],
    rawVideos[3],
    rawPortraitPhotos[3], // Portrait photo
    rawLandscapePhotos[3],
    // Next batch (Load More)
    rawVideos[6], // Portrait video
    rawVideos[4],
    rawVideos[5],
    rawPortraitPhotos[4],
    rawLandscapePhotos[4],
    rawLandscapePhotos[5],
    rawPortraitPhotos[5],
    rawVideos[7],
    rawVideos[1], // Portrait video
    rawPortraitPhotos[6],
    rawLandscapePhotos[6],
    rawLandscapePhotos[7],
    rawPortraitPhotos[7],
    rawVideos[8], // Podcast session
    // Remaining items
    rawLandscapePhotos[8],
    rawLandscapePhotos[9],
    rawLandscapePhotos[10],
    rawLandscapePhotos[11],
    rawLandscapePhotos[12],
    rawLandscapePhotos[13],
    rawLandscapePhotos[14],
    rawLandscapePhotos[15],
    rawLandscapePhotos[16],
    rawLandscapePhotos[17],
    rawLandscapePhotos[18],
    rawLandscapePhotos[19],
  ];

  // Preserved for Home page display
  const homeGalleryItems = rawLandscapePhotos.slice(0, 7);
  const displayItems = homeGalleryItems;

  const currentGalleryList = isGalleryPage 
    ? (filterCategory === 'Photos' ? photoGalleryList : filterCategory === 'Videos' ? videoGalleryList : allGalleryList)
    : homeGalleryItems;

  const filteredGallery = currentGalleryList;
  const paginatedGallery = isGalleryPage ? filteredGallery.slice(0, visibleItemsCount) : [];

  // Autoplay Logic
  React.useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveImg((prevIndex) => (prevIndex + 1) % filteredGallery.length);
      }, 3500); // Automatically cycle every 3.5 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredGallery.length]);

  const handleImageClick = (index) => {
    setActiveImg(index);
    setIsAutoPlaying(false); // Stop autoplay when user manually interacts
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev + 1) % filteredGallery.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
  };

  return (
    <AnimatedSection id="gallery" className={`${!isGalleryPage ? 'pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4 lg:pb-5 bg-[#FAF9F5]' : 'pt-2 sm:pt-4 md:pt-6 pb-20 sm:pb-20 md:pb-24 bg-[#FAF9F6]'} relative`}>
      <div className="container mx-auto px-3.5 sm:px-6 md:px-8 lg:px-12 relative z-10 max-w-7xl">
        {!isGalleryPage && (
          <div className="mb-8 sm:mb-10 lg:mb-12 text-center max-w-3xl mx-auto">
            {/* Eyebrow: Centered with horizontal gold lines on both sides */}
            <div className="flex items-center justify-center gap-2.5 mb-2.5 sm:mb-3">
              <span className="w-[22px] h-[1.5px] bg-[#D4AF37] shrink-0" />
              <span 
                className="text-[11.5px] sm:text-[12px] font-medium tracking-[0.16em] uppercase text-[#063925]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                LIFE AT ASMA
              </span>
              <span className="w-[22px] h-[1.5px] bg-[#D4AF37] shrink-0" />
            </div>

            {/* Heading: Centered Manrope 600 with subtle gold accent */}
            <h2 
              className="text-[28px] sm:text-[34px] lg:text-[38px] xl:text-[40px] font-semibold text-[#1A3326] leading-[1.18] tracking-tight text-center"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
            >
              Inside the <span className="text-[#D4AF37]">ASMA Experience.</span>
            </h2>

            {/* Description: Centered Inter supporting text */}
            <p 
              className="text-[14.5px] sm:text-[15px] md:text-[15.5px] text-[#4A6356] font-normal leading-relaxed max-w-2xl mt-2.5 sm:mt-3 mx-auto text-center"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Explore moments from classroom sessions, mentorship and academy events at Advait Stock Market Academy in Nagpur.
            </p>
          </div>
        )}

        {/* Gallery Layout */}
        {!isGalleryPage && displayItems.length >= 7 ? (
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-5 w-full h-auto lg:h-[500px] xl:h-[560px] mb-4 sm:mb-5">
              {/* Left Column */}
              <div className="flex gap-4 md:gap-5 lg:w-[32%] h-[560px] lg:h-full">
                <div className="flex flex-col gap-4 md:gap-5 w-1/2 h-full">
                  <img loading="lazy" decoding="async" width="200" height="300" src={displayItems[0].url} className="w-full flex-grow-[1.6] object-cover rounded-[4px] border border-[#063925]/10 shadow-sm hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer" alt={displayItems[0].title} onClick={() => { setActiveImg(filteredGallery.indexOf(displayItems[0])); setIsLightboxOpen(true); }} />
                  <img loading="lazy" decoding="async" width="200" height="200" src={displayItems[1].url} className="w-full flex-grow-[1] object-cover rounded-[4px] border border-[#063925]/10 shadow-sm hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer" alt={displayItems[1].title} onClick={() => { setActiveImg(filteredGallery.indexOf(displayItems[1])); setIsLightboxOpen(true); }} />
                </div>
                <div className="flex flex-col justify-center w-1/2 h-full py-6 md:py-12">
                  <img loading="lazy" decoding="async" width="200" height="400" src={displayItems[2].url} className="w-full h-full object-cover rounded-[4px] border border-[#063925]/10 shadow-sm hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer" alt={displayItems[2].title} onClick={() => { setActiveImg(filteredGallery.indexOf(displayItems[2])); setIsLightboxOpen(true); }} />
                </div>
              </div>

              {/* Center Main Column */}
              <div className="lg:w-[36%] h-[380px] lg:h-full flex flex-col justify-center py-2 md:py-6">
                <img loading="lazy" decoding="async" width="450" height="500" src={displayItems[3].url} className="w-full h-full object-cover rounded-[4px] border border-[#063925]/10 shadow-md hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer" alt={displayItems[3].title} onClick={() => { setActiveImg(filteredGallery.indexOf(displayItems[3])); setIsLightboxOpen(true); }} />
              </div>

              {/* Right Column */}
              <div className="flex gap-4 md:gap-5 lg:w-[32%] h-[560px] lg:h-full">
                <div className="flex flex-col justify-center w-1/2 h-full py-6 md:py-12">
                  <img loading="lazy" decoding="async" width="200" height="400" src={displayItems[4].url} className="w-full h-full object-cover rounded-[4px] border border-[#063925]/10 shadow-sm hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer" alt={displayItems[4].title} onClick={() => { setActiveImg(filteredGallery.indexOf(displayItems[4])); setIsLightboxOpen(true); }} />
                </div>
                <div className="flex flex-col gap-4 md:gap-5 w-1/2 h-full">
                  <img loading="lazy" decoding="async" width="200" height="300" src={displayItems[5].url} className="w-full flex-grow-[1.6] object-cover rounded-[4px] border border-[#063925]/10 shadow-sm hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer" alt={displayItems[5].title} onClick={() => { setActiveImg(filteredGallery.indexOf(displayItems[5])); setIsLightboxOpen(true); }} />
                  <img loading="lazy" decoding="async" width="200" height="200" src={displayItems[6].url} className="w-full flex-grow-[1] object-cover rounded-[4px] border border-[#063925]/10 shadow-sm hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer" alt={displayItems[6].title} onClick={() => { setActiveImg(filteredGallery.indexOf(displayItems[6])); setIsLightboxOpen(true); }} />
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 mt-2 sm:mt-3 w-full sm:w-auto">
              <Link 
                to="/gallery" 
                state={{ category: 'Photos' }}
                className="flex-1 sm:flex-initial sm:w-auto min-h-[44px] px-5 sm:px-7 py-3 bg-[#063925] hover:bg-[#0B2117] text-white text-xs font-semibold tracking-wider uppercase rounded-[4px] transition-colors duration-200 shadow-sm text-center inline-flex items-center justify-center"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                MORE PHOTOS
              </Link>
              <Link 
                to="/gallery" 
                state={{ category: 'Videos' }}
                className="flex-1 sm:flex-initial sm:w-auto min-h-[44px] px-5 sm:px-7 py-3 bg-white hover:bg-[#063925]/5 text-[#063925] border border-[#063925]/30 hover:border-[#063925] text-xs font-semibold tracking-wider uppercase rounded-[4px] transition-all duration-200 text-center inline-flex items-center justify-center"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                MORE VIDEOS
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {/* Filter Pills */}
            <div className="flex justify-center flex-wrap gap-2 sm:gap-2.5 mb-6 sm:mb-8 lg:mb-10">
              {['All', 'Photos', 'Videos'].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setFilterCategory(cat); setVisibleItemsCount(12); }}
                  className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-[4px] text-[11.5px] sm:text-xs font-['Inter'] font-semibold tracking-wider uppercase transition-all duration-200 active:scale-95 ${
                    filterCategory === cat 
                      ? 'bg-[#063925] text-white shadow-sm'
                      : 'bg-white text-[#4A6356] border border-[#063925]/10 hover:border-[#063925]/30 hover:text-[#1A3326]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Masonry Grid: 2 columns on mobile (360px-430px), 3 on lg, 4 on xl */}
            <div className="columns-2 lg:columns-3 xl:columns-4 gap-2.5 sm:gap-3.5 lg:gap-5">
              {paginatedGallery.map((item, i) => {
                const isVideo = item.url.toLowerCase().endsWith('.mp4');
                return (
                  <div
                    key={i}
                    onClick={() => { setActiveImg(i); setIsLightboxOpen(true); setIsAutoPlaying(false); }}
                    className="relative group rounded-[4px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer break-inside-avoid mb-2.5 sm:mb-3.5 lg:mb-5 bg-[#F2F5F3] border border-[#063925]/10"
                  >
                    {isVideo ? (
                      <video src={item.url} preload="auto" autoPlay loop muted playsInline className="w-full h-auto object-cover transform group-hover:scale-103 transition-transform duration-500 block" />
                    ) : (
                      <img loading="lazy" src={item.url} alt={item.title} className="w-full h-auto object-cover transform group-hover:scale-103 transition-transform duration-500 block" />
                    )}

                    {/* Overlay: Subtle bottom scrim on mobile so photos/faces remain unobstructed, full rich overlay on desktop hover */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 sm:p-3 lg:p-4 lg:inset-0 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                      {isVideo && (
                        <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 lg:top-3 lg:right-3 bg-black/40 lg:bg-white/20 backdrop-blur-md rounded-full p-1 sm:p-1.5">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                      <h3 className="text-[11px] sm:text-sm lg:text-base font-['Manrope'] font-semibold text-white leading-tight mb-0.5 line-clamp-1 sm:line-clamp-2">{item.title}</h3>
                      <p className="hidden sm:block text-white/80 text-xs font-['Inter'] font-normal line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {visibleItemsCount < filteredGallery.length && (
              <div className="flex justify-center mt-6 sm:mt-8 lg:mt-10">
                <button 
                  onClick={() => setVisibleItemsCount(prev => prev + 8)}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-[#063925] hover:bg-[#063925] hover:text-white text-[11.5px] sm:text-xs font-['Inter'] font-semibold tracking-wider uppercase border border-[#063925]/20 rounded-[4px] transition-all shadow-sm active:scale-98"
                >
                  Load More Media
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && filteredGallery[activeImg] && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm p-3 sm:p-4 md:p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-3.5 right-3.5 sm:top-6 sm:right-6 text-white/80 hover:text-white transition-colors bg-black/60 hover:bg-black/80 p-2 sm:p-3 rounded-full z-50 touch-manipulation"
              onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
              aria-label="Close Lightbox"
            >
              <svg className="w-5 h-5 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Prev Button */}
            <button 
              className="absolute left-2 sm:left-4 md:left-10 text-white/80 hover:text-white hover:scale-105 transition-all bg-black/60 hover:bg-black/80 p-2 sm:p-3.5 md:p-4 rounded-full z-50 touch-manipulation"
              onClick={handlePrev}
              aria-label="Previous Media"
            >
              <svg className="w-5 h-5 sm:w-7 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Image/Video Container */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[85vh] sm:max-h-[90vh] w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to backdrop
            >
              {filteredGallery[activeImg].url.toLowerCase().endsWith('.mp4') ? (
                <video 
                  src={filteredGallery[activeImg].url} 
                  className="w-full h-auto max-h-[72vh] sm:max-h-[80vh] object-contain rounded-lg sm:rounded-xl shadow-2xl"
                  controls autoPlay playsInline
                />
              ) : (
                <img 
                  src={filteredGallery[activeImg].url} 
                  alt={filteredGallery[activeImg].title}
                  className="w-full h-auto max-h-[72vh] sm:max-h-[80vh] object-contain rounded-lg sm:rounded-xl shadow-2xl"
                />
              )}
              <div className="w-full bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 sm:p-4 md:p-6 rounded-b-lg sm:rounded-b-xl text-left pointer-events-none">
                <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-white mb-0.5 sm:mb-2">{filteredGallery[activeImg].title}</h3>
                <p className="text-white/80 text-xs sm:text-sm line-clamp-2 sm:line-clamp-none">{filteredGallery[activeImg].desc}</p>
              </div>
            </motion.div>

            {/* Next Button */}
            <button 
              className="absolute right-2 sm:right-4 md:right-10 text-white/80 hover:text-white hover:scale-105 transition-all bg-black/60 hover:bg-black/80 p-2 sm:p-3.5 md:p-4 rounded-full z-50 touch-manipulation"
              onClick={handleNext}
              aria-label="Next Media"
            >
              <svg className="w-5 h-5 sm:w-7 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedSection>
  );
};

export default GallerySection;