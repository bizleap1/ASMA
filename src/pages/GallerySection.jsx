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

  const baseGalleryItems = [
    { url: "/Home/new1.png", title: "Live Market Training", desc: "Expert faculty explaining complex market concepts with live chart analysis." },
    { url: "/Home/new2.png", title: "Student Classroom", desc: "Our dedicated students focusing during intense trading sessions." },
    { url: "/Home/new3.png", title: "Faculty Mentorship", desc: "Guidance from our lead mentor on the trading floor." },
    { url: "/Home/new4.png", title: "Welcome to ASMA", desc: "Reception area of Advait Share Market Academy." },
    { url: "/Home/new5.png", title: "Interactive Discussions", desc: "Group discussions and doubt clearing sessions with faculty." },
    { url: "/Home/1.png", title: "Live Trading Floor", desc: "Experience the pulse of the market in our state-of-the-art facility." },
    { url: "/Home/2.png", title: "Mentorship Sessions", desc: "Get one-on-one guidance from experienced market professionals." },
    { url: "/Home/3.png", title: "Analysis Workshops", desc: "Deep dive into technical charts and fundamental data." },
    { url: "/Home/4.png", title: "Student Community", desc: "Collaborate, learn, and grow your wealth together." },
  ];

  const additionalGalleryItems = [
    { url: "/Home/17.jpg", title: "Live Trading Execution", desc: "Students actively executing real-time trades and managing portfolios using advanced trading terminals." },
    { url: "/Home/16.jpg", title: "Interactive Technical Workshops", desc: "Faculty actively monitoring and guiding students as they analyze live market charts and spot breakout patterns." },
    { url: "/Home/15.jpg", title: "Student Support & Onboarding", desc: "Our dedicated support team ensuring seamless onboarding, query resolution, and administrative assistance for all our traders." },
    { url: "/Home/14.jpg", title: "Live Market Mentorship", desc: "Students gaining hands-on experience under the expert guidance of our research analysts in the live trading environment." },
    { url: "/Home/13.jpg", title: "Dedicated Market Research", desc: "Continuous market analysis and strategy formulation by our experienced faculty to ensure top-tier education." },
    { url: "/Home/12.jpg", title: "Focused Learning Environment", desc: "Immersive classroom sessions designed to master the fundamentals of technical and fundamental analysis." },
    { url: "/Home/11.png", title: "Next Generation of Traders", desc: "Empowering eager minds with the knowledge and discipline required to thrive in the competitive stock market." },
    { url: "/Home/10.jpg", title: "Advanced Trading Concepts", desc: "In-depth lectures on complex market dynamics, risk management, and proprietary trading setups." },
    { url: "/Home/9.png", title: "Mastering Reversal Strategies", desc: "Learn to identify trend ends and pinpoint exact reversal points with volume analysis in our live classrooms." },
    { url: "/Home/8.jpg", title: "Personalized Trade Counseling", desc: "Get one-on-one portfolio reviews and trading psychology guidance from our veteran analysts." },
    { url: "/Home/7.jpg", title: "Expert Market Leadership", desc: "Guided by Prof. Satish A. Bobade, bringing decades of research analysis and institutional trading experience." },
    { url: "/Home/6.jpg", title: "Advait Stock Market Academy", desc: "Our premium campus dedicated exclusively to cultivating top-tier stock market traders and financial professionals." },
    { url: "/Home/5.png", title: "Engineering Trading Success", desc: "Celebrating the analytical minds that approach the stock market with precision, logic, and calculated strategy." },
  ];

  const galleryItems = isGalleryPage ? [...baseGalleryItems, ...additionalGalleryItems] : baseGalleryItems;

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

  return (
    <AnimatedSection id="gallery" className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Decorative blur elements for premium feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary font-bold tracking-widest uppercase text-[10px] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"></span>
            Inside ASMA
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight mb-4">State-of-the-Art <span className="text-accent-primary">Infrastructure</span></h2>
          <p className="text-text-secondary text-base font-bold leading-relaxed">Step into our state-of-the-art training facilities. A vibrant community of traders learning, growing, and succeeding together.</p>
        </div>

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

        {/* Cinematic Showcase Layout */}
        <div className="flex flex-col gap-3 md:gap-4 w-full max-w-5xl mx-auto">

          {/* Main Featured Image */}
          <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[450px] rounded-[24px] overflow-hidden shadow-xl group bg-bg-secondary border border-text-primary/5">
            <img loading="lazy"
              key={activeImg} // Forces re-render for transition if needed, or rely on CSS
              src={galleryItems[activeImg].url}
              alt={galleryItems[activeImg].title}
              className="w-full h-full object-cover transition-transform duration-[2s] ease-in-out group-hover:scale-105 animate-fade-in"
            />

            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Dynamic Content - Always Visible */}
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <div className="mb-2">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white transition-opacity duration-500">
                  {galleryItems[activeImg].title}
                </h3>
              </div>
              <div>
                <p className="text-white/80 text-sm md:text-base font-light transition-opacity duration-500">
                  {galleryItems[activeImg].desc}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Thumbnails */}
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {galleryItems.map((item, i) => (
              <div
                key={i}
                onClick={() => handleImageClick(i)}
                className={`relative h-16 sm:h-20 md:h-28 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${activeImg === i
                  ? 'ring-2 ring-accent-primary ring-offset-2 shadow-md scale-[1.02]'
                  : 'opacity-50 hover:opacity-100 hover:scale-[1.02]'
                  }`}
              >
                <img loading="lazy" src={item.url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />

                {/* Selection indicator */}
                {activeImg === i && (
                  <div className="absolute inset-0 bg-accent-primary/20 mix-blend-overlay"></div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
};

export default GallerySection;