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

const AdvantageSection = () => {
  const [offsetY, setOffsetY] = React.useState(0);
  const sectionRef = React.useRef(null);

  React.useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const diff = (window.innerHeight / 2) - (rect.top + rect.height / 2);
        setOffsetY(diff);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatedSection ref={sectionRef} id="advantage" className="py-12 md:py-16 px-4 md:px-8 lg:px-12 bg-bg-primary relative overflow-hidden">

      {/* Massive Highlight Island (Soft Theme-Matched) */}
      <div className="max-w-6xl mx-auto bg-bg-secondary rounded-[30px] py-8 md:py-12 px-6 md:px-10 lg:px-12 relative overflow-hidden shadow-2xl border border-text-primary/5">

        {/* Island Inner Glows and Textures with Parallax */}
        <div
          className="absolute top-0 right-0 w-full h-full bg-cover bg-center pointer-events-none scale-100 transition-transform duration-[800ms] ease-out"
          style={{
            backgroundImage: "url('/advantage-bg.png')",
            transform: `translateY(${offsetY * 0.15}px)`
          }}
        ></div>

        <div className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-accent-primary font-bold tracking-widest uppercase text-xs mb-4 shadow-sm border border-text-primary/5">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-ping"></span>
              Our Core Strengths
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight mb-4 drop-shadow-sm">
              A Legacy of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-emerald-500">Trading Excellence</span>
            </h2>
            <p className="text-text-secondary text-base md:text-lg font-bold leading-relaxed">Central India's most trusted and experienced stock market academy, elevating your trading journey through unparalleled expertise.</p>
          </div>

          {/* Premium Visual Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-6xl mx-auto">

            {/* Card 1: Legacy & Trust (Wide Top) */}
            <div className="md:col-span-2 group bg-white/90 backdrop-blur-md rounded-[30px] p-6 md:p-8 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(17,82,52,0.1)] transition-all duration-500 flex flex-col md:flex-row gap-6 lg:gap-10 items-center relative border border-text-primary/5 z-10 hover:-translate-y-1">
              {/* Massive Watermark with Parallax */}
              <div
                className="absolute -bottom-6 -right-6 text-[120px] lg:text-[180px] font-display font-black text-bg-secondary/60 pointer-events-none select-none z-0 tracking-tighter leading-none transition-transform duration-[800ms] ease-out"
                style={{ transform: `translateY(${offsetY * 0.1}px)` }}
              >20+</div>

              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-bg-secondary to-transparent rounded-bl-[80px] opacity-50 group-hover:scale-150 transition-transform duration-1000 pointer-events-none z-0"></div>

              <div className="w-full md:w-5/12 flex flex-col items-start relative z-10 border-b md:border-b-0 md:border-r border-text-primary/5 pb-6 md:pb-0 pr-0 md:pr-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center text-accent-primary group-hover:-rotate-6 transition-transform duration-500 shadow-inner">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div className="px-3 py-1 bg-accent-primary/10 text-accent-primary font-bold text-[10px] uppercase tracking-widest rounded-lg">Est. 2004</div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2 leading-snug">Academy Legacy <br />& Trust</h3>
              </div>

              <div className="w-full md:w-7/12 relative z-10 pl-0 md:pl-2">
                <ul className="space-y-4 text-text-secondary font-bold text-base">
                  <li className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>The largest and most experienced stock market academy in Central India.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>Over 20 years of rich, hands-on experience in financial markets.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>Highly rated on Google and Just Dial by our satisfied students.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Practical Training (Square Left) */}
            <div className="group bg-white/90 backdrop-blur-md rounded-[30px] p-6 md:p-8 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(17,82,52,0.1)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between relative border border-text-primary/5 z-10">
              {/* Background Chart SVG Parallax */}
              <svg
                className="absolute -bottom-6 -right-6 w-48 h-48 text-bg-secondary/80 pointer-events-none z-0 transition-transform duration-[800ms] ease-out"
                fill="currentColor" viewBox="0 0 24 24"
                style={{ transform: `translateY(${offsetY * 0.1}px)` }}
              ><path d="M3 3v18h18v-2H5V3H3zm6 14h2v-4h-2v4zm4 0h2v-8h-2v8zm4 0h2v-6h-2v6z" /></svg>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <div className="text-3xl font-display font-black text-bg-secondary tracking-tighter">02</div>
                </div>

                <h3 className="text-xl md:text-2xl font-display font-bold text-text-primary mb-2">100% Practical <br />Live Training</h3>
                <div className="w-10 h-1 bg-accent-primary rounded-full mb-4"></div>

                <ul className="space-y-3 text-text-secondary font-bold text-sm md:text-base">
                  <li className="flex items-start gap-2"><span className="text-accent-primary mt-0.5 text-base">✦</span> Every concept taught and demonstrated in the live market.</li>
                  <li className="flex items-start gap-2"><span className="text-accent-primary mt-0.5 text-base">✦</span> Unique trading strategies developed through years of research.</li>
                  <li className="flex items-start gap-2"><span className="text-accent-primary mt-0.5 text-base">✦</span> Focus on both technical and psychological aspects of trading.</li>
                  <li className="flex items-start gap-2"><span className="text-accent-primary mt-0.5 text-base">✦</span> Risk management techniques to safeguard investments.</li>
                </ul>
              </div>
            </div>

            {/* Card 3: Personalized Learning (Square Right) */}
            <div className="group bg-white/90 backdrop-blur-md rounded-[30px] p-6 md:p-8 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(17,82,52,0.1)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between relative border border-text-primary/5 z-10">
              {/* Background Target SVG Parallax */}
              <svg
                className="absolute -top-6 -right-6 w-48 h-48 text-bg-secondary/80 pointer-events-none z-0 transition-transform duration-[800ms] ease-out"
                fill="currentColor" viewBox="0 0 24 24"
                style={{ transform: `translateY(${offsetY * -0.1}px)` }}
              ><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm0-13a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z" /></svg>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center text-accent-primary group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <div className="text-3xl font-display font-black text-bg-secondary tracking-tighter">03</div>
                </div>

                <h3 className="text-xl md:text-2xl font-display font-bold text-text-primary mb-2">Personalized <br />Learning</h3>
                <div className="w-10 h-1 bg-accent-secondary rounded-full mb-4"></div>

                <ul className="space-y-3 text-text-secondary font-bold text-sm md:text-base">
                  <li className="flex items-start gap-2"><span className="text-accent-secondary mt-0.5 text-base">✦</span> Personalized guidance tailored to each student’s progress.</li>
                  <li className="flex items-start gap-2"><span className="text-accent-secondary mt-0.5 text-base">✦</span> Flexible learning pace, adapted to your understanding.</li>
                  <li className="flex items-start gap-2"><span className="text-accent-secondary mt-0.5 text-base">✦</span> Training sessions supported with detailed, customized study material.</li>
                  <li className="flex items-start gap-2"><span className="text-accent-secondary mt-0.5 text-base">✦</span> Transformative approach—changing the way you think and trade.</li>
                </ul>
              </div>
            </div>

            {/* Card 4: Lifetime Support (Wide Bottom) */}
            <div className="md:col-span-2 group bg-white/90 backdrop-blur-md rounded-[30px] p-6 md:p-8 overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(17,82,52,0.1)] transition-all duration-500 hover:-translate-y-1 flex flex-col md:flex-row-reverse gap-6 lg:gap-10 items-center relative border border-text-primary/5 z-10">
              {/* Background Infinity SVG Parallax */}
              <svg
                className="absolute -top-10 left-0 w-64 h-64 text-bg-secondary/80 pointer-events-none z-0 transition-transform duration-[800ms] ease-out"
                fill="currentColor" viewBox="0 0 24 24"
                style={{ transform: `translateY(${offsetY * 0.1}px)` }}
              ><path d="M12 2C8.134 2 5 5.134 5 9c0 3.866 3.134 7 7 7s7-3.134 7-7c0-3.866-3.134-7-7-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" /></svg>

              <div className="w-full md:w-5/12 flex flex-col items-start relative z-10 border-b md:border-b-0 md:border-l border-text-primary/5 pb-6 md:pb-0 pl-0 md:pl-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div className="px-3 py-1 bg-accent-primary/10 text-accent-primary font-bold text-[10px] uppercase tracking-widest rounded-lg">Unlimited</div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-display font-bold text-text-primary mb-2 leading-snug">Lifetime Support <br />& Results</h3>
              </div>

              <div className="w-full md:w-7/12 relative z-10 pr-0 md:pr-4">
                <ul className="space-y-4 text-text-secondary font-bold text-base">
                  <li className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>Lifetime access to updated market strategies and analyses.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>Continued post-course support to ensure your growth in trading.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>Proven methods for maximizing profits while minimizing losses.</span>
                  </li>
                  <li className="flex items-start gap-4 bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-accent-primary"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>
                    <span>Master the skills to generate steady income with confidence.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default AdvantageSection;