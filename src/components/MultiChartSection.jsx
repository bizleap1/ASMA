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
import AnimatedSection from './AnimatedSection';

const MultiChartSection = () => {
  const [isVisible, setIsVisible] = React.useState(true);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only load once
        }
      },
      { rootMargin: '400px' } // Load when within 400px of scrolling into view
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatedSection id="analysis" ref={sectionRef} className="py-10 md:py-16 relative overflow-hidden bg-bg-secondary/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-accent-primary/10 blur-[120px] rounded-full pointer-events-none mix-blend-multiply"></div>
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary font-bold tracking-widest uppercase text-xs mb-4">Real-Time Data</div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-text-primary leading-tight font-bold">Advanced Multi-Chart <br className="hidden md:block" /> Analysis Hub</h2>
            </div>
            <p className="text-text-secondary font-bold max-w-md md:pt-3">
              Monitor the pulse of the Indian markets with our professional 4-screen setup. Identify trends, track sectors, and make informed decisions instantly.
            </p>
          </div>
        </div>

        {/* Emerald Glowing Border Wrapper */}
        <div className="relative mx-auto max-w-6xl rounded-[24px] p-1.5 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary shadow-[0_0_80px_rgba(17,82,52,0.2)] group transition-all duration-700 hover:shadow-[0_0_120px_rgba(17,82,52,0.4)]">

          {/* The 2x2 Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-[2px] bg-text-primary/10 rounded-[20px] overflow-hidden h-[600px] md:h-[800px] w-full">

            {/* Chart 1: SENSEX */}
            <div className="w-full h-full bg-white relative group/chart flex items-center justify-center border-b lg:border-b-0 lg:border-r border-text-primary/10">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg-secondary/5 z-0 animate-pulse">
                <div className="w-8 h-8 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
                <div className="text-text-secondary/50 font-bold tracking-widest text-[10px] uppercase">Loading Data...</div>
              </div>
              <div className="absolute top-4 left-4 z-20 font-bold font-sans text-sm text-text-primary pointer-events-none drop-shadow-sm bg-white/80 px-2 py-1 rounded backdrop-blur-sm">SENSEX</div>
              {isVisible && (
                <iframe
                  className="relative z-10 bg-white"
                  scrolling="no"
                  allowtransparency="true"
                  frameBorder="0"
                  src="https://s.tradingview.com/embed-widget/advanced-chart/?locale=en&theme=light&symbol=BSE%3ASENSEX&interval=D&timezone=Asia%2FKolkata&hide_top_toolbar=1&hide_legend=1&save_image=0&enable_publishing=0&backgroundColor=rgba(255,255,255,1)"
                  style={{ boxSizing: 'border-box', height: '100%', width: '100%' }}>
                </iframe>
              )}
              <a href="https://in.tradingview.com/chart/?symbol=BSE%3ASENSEX" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 z-20 bg-[#166534] text-white text-xs font-bold px-3 py-2 rounded shadow-lg hover:bg-[#0f4523] transition-all flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                View Live 1-Min Chart
              </a>
            </div>

            {/* Chart 2: NIFTY 50 (via NIFTYBEES ETF) */}
            <div className="w-full h-full bg-white relative group/chart flex items-center justify-center border-b lg:border-b-0 border-text-primary/10">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg-secondary/5 z-0 animate-pulse">
                <div className="w-8 h-8 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
                <div className="text-text-secondary/50 font-bold tracking-widest text-[10px] uppercase">Loading Data...</div>
              </div>
              <div className="absolute top-4 left-4 z-20 font-bold font-sans text-sm text-text-primary pointer-events-none drop-shadow-sm bg-white/80 px-2 py-1 rounded backdrop-blur-sm">NIFTY 50</div>
              {isVisible && (
                <iframe
                  className="relative z-10 bg-white"
                  scrolling="no"
                  allowtransparency="true"
                  frameBorder="0"
                  src="https://s.tradingview.com/embed-widget/advanced-chart/?locale=en&theme=light&symbol=BSE%3ANIFTYBEES&interval=D&timezone=Asia%2FKolkata&hide_top_toolbar=1&hide_legend=1&save_image=0&enable_publishing=0&backgroundColor=rgba(255,255,255,1)"
                  style={{ boxSizing: 'border-box', height: '100%', width: '100%' }}>
                </iframe>
              )}
              <a href="https://in.tradingview.com/chart/?symbol=NSE%3ANIFTY" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 z-20 bg-[#166534] text-white text-xs font-bold px-3 py-2 rounded shadow-lg hover:bg-[#0f4523] transition-all flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                View Live 1-Min Chart
              </a>
            </div>

            {/* Chart 3: BANK NIFTY (via BANKBEES ETF) */}
            <div className="w-full h-full bg-white relative group/chart flex items-center justify-center border-b lg:border-b-0 lg:border-r lg:border-t border-text-primary/10">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg-secondary/5 z-0 animate-pulse">
                <div className="w-8 h-8 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
                <div className="text-text-secondary/50 font-bold tracking-widest text-[10px] uppercase">Loading Data...</div>
              </div>
              <div className="absolute top-4 left-4 z-20 font-bold font-sans text-sm text-text-primary pointer-events-none drop-shadow-sm bg-white/80 px-2 py-1 rounded backdrop-blur-sm">BANK NIFTY</div>
              {isVisible && (
                <iframe
                  className="relative z-10 bg-white"
                  scrolling="no"
                  allowtransparency="true"
                  frameBorder="0"
                  src="https://s.tradingview.com/embed-widget/advanced-chart/?locale=en&theme=light&symbol=BSE%3ABANKBEES&interval=D&timezone=Asia%2FKolkata&hide_top_toolbar=1&hide_legend=1&save_image=0&enable_publishing=0&backgroundColor=rgba(255,255,255,1)"
                  style={{ boxSizing: 'border-box', height: '100%', width: '100%' }}>
                </iframe>
              )}
              <a href="https://in.tradingview.com/chart/?symbol=NSE%3ABANKNIFTY" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 z-20 bg-[#166534] text-white text-xs font-bold px-3 py-2 rounded shadow-lg hover:bg-[#0f4523] transition-all flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                View Live 1-Min Chart
              </a>
            </div>

            {/* Chart 4: NIFTY NXT 50 (via JUNIORBEES ETF) */}
            <div className="w-full h-full bg-white relative group/chart flex items-center justify-center lg:border-t border-text-primary/10">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg-secondary/5 z-0 animate-pulse">
                <div className="w-8 h-8 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
                <div className="text-text-secondary/50 font-bold tracking-widest text-[10px] uppercase">Loading Data...</div>
              </div>
              <div className="absolute top-4 left-4 z-20 font-bold font-sans text-sm text-text-primary pointer-events-none drop-shadow-sm bg-white/80 px-2 py-1 rounded backdrop-blur-sm">NIFTY NXT 50</div>
              {isVisible && (
                <iframe
                  className="relative z-10 bg-white"
                  scrolling="no"
                  allowtransparency="true"
                  frameBorder="0"
                  src="https://s.tradingview.com/embed-widget/advanced-chart/?locale=en&theme=light&symbol=BSE%3AJUNIORBEES&interval=D&timezone=Asia%2FKolkata&hide_top_toolbar=1&hide_legend=1&save_image=0&enable_publishing=0&backgroundColor=rgba(255,255,255,1)"
                  style={{ boxSizing: 'border-box', height: '100%', width: '100%' }}>
                </iframe>
              )}
              <a href="https://in.tradingview.com/chart/?symbol=NSE%3ANIFTYNXT50" target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 z-20 bg-[#166534] text-white text-xs font-bold px-3 py-2 rounded shadow-lg hover:bg-[#0f4523] transition-all flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                View Live 1-Min Chart
              </a>
            </div>

          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default MultiChartSection;