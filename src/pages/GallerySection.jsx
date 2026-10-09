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
  const [activeImg, setActiveImg] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [filterCategory, setFilterCategory] = React.useState('All');
  const [visibleItemsCount, setVisibleItemsCount] = React.useState(12);

  const newGalleryItems = [
    { url: "/videos/ANUJ9211.MP4", title: "Live Market Experience", desc: "Experience the pulse of live trading." },
    { url: "/videos/ANUJ9212-compressed.mp4", title: "Interactive Trading Floor", desc: "Join our active community of professional traders." },
    { url: "/videos/ANUJ9213.MP4", title: "Technical Analysis", desc: "In-depth chart breakdowns in real-time." },
    { url: "/new photos/WhatsApp Image 2026-09-18 at 5.34.41 PM.jpeg", title: "Student Classroom", desc: "Dedicated students focusing during intense sessions." },
    { url: "/new photos/WhatsApp Image 2026-09-18 at 5.35.18 PM.jpeg", title: "Faculty Mentorship", desc: "Guidance from our lead mentors." },
    { url: "/videos/ANUJ9216.MP4", title: "Market Psychology", desc: "Understanding the emotional side of trading." },
    { url: "/new photos/WhatsApp Image 2026-09-18 at 5.40.48 PM.jpeg", title: "Trading Setups", desc: "Our state of the art trading desks." },
    { url: "/videos/ANUJ9217.MP4", title: "Live Workshops", desc: "Interactive sessions with our experts." },
    { url: "/new photos/WhatsApp Image 2026-09-18 at 5.41.22 PM.jpeg", title: "Community Bonds", desc: "Learning and growing wealth together." },
    { url: "/videos/ANUJ9218.MP4", title: "Advanced Concepts", desc: "Deep dive into complex market dynamics." },
    { url: "/new photos/WhatsApp Image 2026-09-18 at 5.41.39 PM.jpeg", title: "Focused Learning", desc: "Immersive classroom environment." },
    { url: "/videos/ANUJ9219-compressed.mp4", title: "Execution Strategy", desc: "Executing real-time trades effectively." },
    { url: "/new photos/WhatsApp Image 2026-09-18 at 5.42.11 PM.jpeg", title: "Trade Counseling", desc: "One-on-one portfolio reviews." },
    { url: "/videos/ANUJ9221.MP4", title: "Market Insights", desc: "Continuous market analysis and strategy." },
  ];

  const homeGalleryItems = [
    { url: "/Home/new2.webp", title: "Student Classroom", desc: "Our dedicated students focusing during intense trading sessions." },
    { url: "/Home/new3.webp", title: "Faculty Mentorship", desc: "Guidance from our lead mentor on the trading floor." },
    { url: "/Home/new5.webp", title: "Interactive Discussions", desc: "Group discussions and doubt clearing sessions with faculty." },
    { url: "/Home/1.webp", title: "Live Trading Floor", desc: "Experience the pulse of the market in our state-of-the-art facility." },
    { url: "/Home/2.webp", title: "Mentorship Sessions", desc: "Get one-on-one guidance from experienced market professionals." },
    { url: "/Home/3.webp", title: "Analysis Workshops", desc: "Deep dive into technical charts and fundamental data." },
    { url: "/Home/4.webp", title: "Student Community", desc: "Collaborate, learn, and grow your wealth together." },
  ];

  const additionalGalleryItems = [
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

  const galleryItems = isGalleryPage ? [...newGalleryItems, ...homeGalleryItems, ...additionalGalleryItems] : homeGalleryItems;
  const imageItems = galleryItems.filter(item => !item.url.toLowerCase().endsWith('.mp4'));
  const displayItems = imageItems.slice(0, 7);

  // Autoplay Logic
  React.useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveImg((prevIndex) => (prevIndex + 1) % galleryItems.length);
      }, 3500); // Automatically cycle every 3.5 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, galleryItems.length]);

  const handleImageClick = (index) => {
    setActiveImg(index);
    setIsAutoPlaying(false); // Stop autoplay when user manually interacts
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev + 1) % galleryItems.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const filteredGallery = galleryItems.filter(item => {
    if (filterCategory === 'All') return true;
    const isVideo = item.url.toLowerCase().endsWith('.mp4');
    return filterCategory === 'Videos' ? isVideo : !isVideo;
  });
  const paginatedGallery = isGalleryPage ? filteredGallery.slice(0, visibleItemsCount) : [];

  return (
    <AnimatedSection id="gallery" className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Decorative blur elements for premium feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        {!isGalleryPage ? (
          <div className="text-center max-w-2xl mx-auto mb-12 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#b59a56]/10 text-[#b59a56] font-bold tracking-widest uppercase text-[10px] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b59a56] animate-pulse"></span>
              AWARDS
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[#1a2e22] leading-tight mb-4">
              An Insight Into Our Award<br className="hidden md:block" /> Ceremony Events
            </h2>
            <p className="text-[#5a6b5e] text-base font-bold leading-relaxed">
              Celebrating excellence, dedication, and the remarkable achievements of our trading community.
            </p>
          </div>
        ) : (
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary font-bold tracking-widest uppercase text-[10px] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"></span>
              Inside ASMA
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight mb-4">State-of-the-Art <span className="text-accent-primary">Infrastructure</span></h2>
            <p className="text-text-secondary text-base font-bold leading-relaxed">Step into our state-of-the-art training facilities. A vibrant community of traders learning, growing, and succeeding together.</p>
          </div>
        )}

        {/* Informational Section (Gallery Page Only) */}
        {isGalleryPage && (
          <div className="mb-12 md:mb-16 bg-gradient-to-br from-[#166534]/5 to-transparent border border-[#166534]/15 rounded-[32px] p-8 md:p-12 shadow-2xl text-left relative overflow-hidden group">
            {/* Ambient light glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#166534]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#166534]/10 transition-colors duration-700"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Column: Heading, Badge, Stats */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary font-bold tracking-widest uppercase text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"></span>
                  Beyond the Charts
                </div>

                <h3 className="text-3xl md:text-5xl font-display font-black leading-[1.15] text-text-primary tracking-tight">
                  Experience the Life of a <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#166534] to-emerald-700">Professional Trader</span>
                </h3>

                <div className="h-1.5 w-24 bg-gradient-to-r from-[#166534] to-accent-secondary rounded-full"></div>

                {/* Premium Stat Card Chips */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-white rounded-2xl border border-[#166534]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="text-3xl font-display font-black text-[#166534]">100%</div>
                    <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">Practical Learning</div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-[#166534]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="text-3xl font-display font-black text-[#166534]">Live</div>
                    <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">Market Practice</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Paragraphs with Drop Cap */}
              <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-text-primary/10 lg:pl-10 text-justify">
                <p className="text-text-primary text-base md:text-lg font-light leading-relaxed">
                  Trading isn't just about reading charts; it's about the environment, the discipline, and the community you surround yourself with. At Advait Stock Market Academy, we've built a world-class ecosystem designed to foster focus, collaboration, and continuous growth.
                </p>
                <p className="text-text-secondary text-sm md:text-base font-light leading-relaxed">
                  From our high-tech live trading floors equipped with cutting-edge terminals to our dedicated mentorship zones and vibrant seminar halls, every inch of our academy is engineered for your success. Browse through our gallery to get a glimpse of the energetic atmosphere, the intense analysis workshops, and the strong community bonds that define the ASMA experience.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Gallery Layout */}
        {!isGalleryPage && displayItems.length >= 7 ? (
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full h-auto lg:h-[500px] xl:h-[600px] mb-12">
              {/* Left Main Column */}
              <div className="flex gap-4 md:gap-6 lg:w-[32%] h-[600px] lg:h-full">
                {/* Sub-col 1 */}
                <div className="flex flex-col gap-4 md:gap-6 w-1/2 h-full">
                  <img loading="lazy" decoding="async" width="200" height="300" src={displayItems[0].url} className="w-full flex-grow-[1.6] object-cover rounded-[24px] shadow-md hover:scale-[1.02] transition-transform duration-500 cursor-pointer" alt={displayItems[0].title} onClick={() => { setActiveImg(galleryItems.indexOf(displayItems[0])); setIsLightboxOpen(true); }} />
                  <img loading="lazy" decoding="async" width="200" height="200" src={displayItems[1].url} className="w-full flex-grow-[1] object-cover rounded-[24px] shadow-md hover:scale-[1.02] transition-transform duration-500 cursor-pointer" alt={displayItems[1].title} onClick={() => { setActiveImg(galleryItems.indexOf(displayItems[1])); setIsLightboxOpen(true); }} />
                </div>
                {/* Sub-col 2 */}
                <div className="flex flex-col justify-center w-1/2 h-full py-8 md:py-16">
                  <img loading="lazy" decoding="async" width="200" height="400" src={displayItems[2].url} className="w-full h-full object-cover rounded-[24px] shadow-md hover:scale-[1.02] transition-transform duration-500 cursor-pointer" alt={displayItems[2].title} onClick={() => { setActiveImg(galleryItems.indexOf(displayItems[2])); setIsLightboxOpen(true); }} />
                </div>
              </div>

              {/* Center Main Column */}
              <div className="lg:w-[36%] h-[400px] lg:h-full flex flex-col justify-center py-4 md:py-8">
                <img loading="lazy" decoding="async" width="450" height="500" src={displayItems[3].url} className="w-full h-full object-cover rounded-[24px] shadow-xl hover:scale-[1.02] transition-transform duration-500 cursor-pointer" alt={displayItems[3].title} onClick={() => { setActiveImg(galleryItems.indexOf(displayItems[3])); setIsLightboxOpen(true); }} />
              </div>

              {/* Right Main Column */}
              <div className="flex gap-4 md:gap-6 lg:w-[32%] h-[600px] lg:h-full">
                {/* Sub-col 1 */}
                <div className="flex flex-col justify-center w-1/2 h-full py-8 md:py-16">
                  <img loading="lazy" decoding="async" width="200" height="400" src={displayItems[4].url} className="w-full h-full object-cover rounded-[24px] shadow-md hover:scale-[1.02] transition-transform duration-500 cursor-pointer" alt={displayItems[4].title} onClick={() => { setActiveImg(galleryItems.indexOf(displayItems[4])); setIsLightboxOpen(true); }} />
                </div>
                {/* Sub-col 2 */}
                <div className="flex flex-col gap-4 md:gap-6 w-1/2 h-full">
                  <img loading="lazy" decoding="async" width="200" height="300" src={displayItems[5].url} className="w-full flex-grow-[1.6] object-cover rounded-[24px] shadow-md hover:scale-[1.02] transition-transform duration-500 cursor-pointer" alt={displayItems[5].title} onClick={() => { setActiveImg(galleryItems.indexOf(displayItems[5])); setIsLightboxOpen(true); }} />
                  <img loading="lazy" decoding="async" width="200" height="200" src={displayItems[6].url} className="w-full flex-grow-[1] object-cover rounded-[24px] shadow-md hover:scale-[1.02] transition-transform duration-500 cursor-pointer" alt={displayItems[6].title} onClick={() => { setActiveImg(galleryItems.indexOf(displayItems[6])); setIsLightboxOpen(true); }} />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link to="/gallery" className="px-8 py-3.5 bg-[#b59a56] text-white text-sm font-bold tracking-widest uppercase rounded-xl hover:bg-[#1a2e22] transition-colors shadow-md text-center">
                MORE PHOTOS
              </Link>
              <Link to="/gallery" className="px-8 py-3.5 bg-transparent text-[#1a2e22] hover:text-[#b59a56] text-sm font-bold tracking-widest uppercase border-2 border-[#1a2e22] rounded-xl transition-colors text-center">
                MORE VIDEOS
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {/* Filter Pills */}
            <div className="flex justify-center flex-wrap gap-3 md:gap-4 mb-10">
              {['All', 'Photos', 'Videos'].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setFilterCategory(cat); setVisibleItemsCount(12); }}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                    filterCategory === cat 
                      ? 'bg-[#166534] text-white shadow-lg scale-105'
                      : 'bg-white text-text-secondary border border-[#166534]/20 hover:bg-[#166534]/5 hover:text-[#166534]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {paginatedGallery.map((item, i) => {
                const globalIndex = galleryItems.indexOf(item);
                const isVideo = item.url.toLowerCase().endsWith('.mp4');
                return (
                  <div
                    key={i}
                    onClick={() => { setActiveImg(globalIndex); setIsLightboxOpen(true); setIsAutoPlaying(false); }}
                    className="relative group rounded-[24px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer break-inside-avoid bg-bg-secondary border border-text-primary/5"
                  >
                    {isVideo ? (
                      <video src={item.url} preload="auto" autoPlay loop muted playsInline className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <img loading="lazy" src={item.url} alt={item.title} className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                      {isVideo && (
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                      <h3 className="text-xl font-display font-bold text-white mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.title}</h3>
                      <p className="text-white/80 text-sm font-light transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {visibleItemsCount < filteredGallery.length && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={() => setVisibleItemsCount(prev => prev + 8)}
                  className="px-8 py-3.5 bg-transparent text-[#166534] hover:bg-[#166534] hover:text-white text-sm font-bold tracking-widest uppercase border-2 border-[#166534] rounded-xl transition-colors shadow-sm"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/50 p-3 rounded-full z-50"
              onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Prev Button */}
            <button 
              className="absolute left-4 md:left-10 text-white/70 hover:text-white hover:scale-110 transition-all bg-black/50 p-4 rounded-full z-50"
              onClick={handlePrev}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Image/Video Container */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to backdrop
            >
              {galleryItems[activeImg].url.toLowerCase().endsWith('.mp4') ? (
                <video 
                  src={galleryItems[activeImg].url} 
                  className="w-full h-full object-contain rounded-xl shadow-2xl max-h-[80vh]"
                  controls autoPlay playsInline
                />
              ) : (
                <img 
                  src={galleryItems[activeImg].url} 
                  alt={galleryItems[activeImg].title}
                  className="w-full h-full object-contain rounded-xl shadow-2xl max-h-[80vh]"
                />
              )}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl pointer-events-none">
                <h3 className="text-2xl font-bold text-white mb-2">{galleryItems[activeImg].title}</h3>
                <p className="text-white/80">{galleryItems[activeImg].desc}</p>
              </div>
            </motion.div>

            {/* Next Button */}
            <button 
              className="absolute right-4 md:right-10 text-white/70 hover:text-white hover:scale-110 transition-all bg-black/50 p-4 rounded-full z-50"
              onClick={handleNext}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedSection>
  );
};

export default GallerySection;