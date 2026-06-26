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
import PhoneNumber from './PhoneNumber';

const AboutSection = ({ hideExploreButton = false }) => {
  const features = [
    {
      title: "Technical Analysis",
      subtitle: "Advanced Charts",
      icon: <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
    },
    {
      title: "Smart Money Concept",
      subtitle: "Institutional Trading",
      icon: <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      title: "Intraday & Swing",
      subtitle: "Live Execution",
      icon: <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
      title: "Risk Management",
      subtitle: "Capital Protection",
      icon: <svg className="w-6 h-6 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
  ];

  const checklist = [
    "Minimal fees with installment facility",
    "Free lifetime repeat classes",
    "Guaranteed lifetime support",
    "Trusted by thousands of satisfied students"
  ];

  return (
    <AnimatedSection id="about" className="py-8 md:py-12 relative bg-bg-secondary/10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-block px-5 py-2 rounded-full bg-white border border-accent-primary/20 text-accent-primary font-bold tracking-widest uppercase text-xs mb-6 shadow-sm">
            Live Market Trading Education
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight">
            Master the Market with <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Confidence</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

          {/* Box 1: The Image & Experience */}
          <div className="lg:col-span-1 relative rounded-[32px] overflow-hidden shadow-2xl group min-h-[400px] border border-white/50">
            <img loading="lazy"
              src="/founder.jpg"
              alt="Advait Academy Leadership"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000 ease-out brightness-105 contrast-105 saturate-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/95 via-text-primary/40 to-transparent"></div>

            </div>

          {/* Box 2: The Core Message */}
          <div className="lg:col-span-2 flex flex-col gap-2 md:gap-4">
            <div className="px-2 md:px-4 w-full overflow-hidden">
              <div className="flex items-baseline font-display leading-none drop-shadow-sm whitespace-nowrap">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-accent-primary">20</span>
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-accent-secondary">+</span>
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-text-primary italic font-bold ml-2">Years of Real Market Experience</span>
              </div>
            </div>
            
            <div className="flex-1 rounded-[32px] bg-white border border-text-primary/5 p-8 md:p-12 shadow-lg flex flex-col justify-center relative overflow-hidden group hover:border-accent-primary/30 transition-colors duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-secondary/10 rounded-full blur-[80px] group-hover:bg-accent-primary/20 transition-colors duration-700"></div>
            <h3 className="text-2xl md:text-4xl font-display font-bold text-text-primary mb-6 relative z-10 leading-snug">
              Central India's Most Experienced Stock Market Academy
            </h3>
            <p className="text-text-secondary text-lg md:text-xl leading-relaxed relative z-10 mt-4">
              Designed for <strong className="text-text-primary font-bold">beginners to professional traders</strong>, we teach strictly in live markets. Our disciplined, confidence-driven strategies ensure practical learning that translates to real-world success. <br/><br/>
              With our deep expertise in Technical Analysis and Smart Money Concepts, we focus on empowering students with actionable strategies for Intraday and Swing trading. Our ultimate goal is to instill strong risk management principles to ensure your capital is always protected while you achieve consistent growth.
            </p>
          </div>

          </div>



          {/* Box 4: Our Journey & CTA (Spans all columns) - Only on About Page */}
          {hideExploreButton && (
            <div className="lg:col-span-3 rounded-[32px] bg-text-primary p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 shadow-2xl relative overflow-hidden mt-2">
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-accent-primary rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

              <div className="w-full md:w-2/3 relative z-10 flex flex-col justify-center">
                <h4 className="text-accent-primary font-display font-bold tracking-wide text-2xl md:text-3xl lg:text-4xl mb-4 drop-shadow-sm">Our Journey</h4>
                <p className="text-white/90 text-sm md:text-base leading-relaxed">
                  For over two decades, Advait Stock Market Academy has been at the forefront of financial education in Central India. We started with a simple vision to demystify the stock market, and today we have empowered thousands of students to achieve financial independence through practical, live-market training and mentorship.
                </p>
              </div>

              <div className="w-full md:w-1/3 flex flex-col justify-center items-center md:items-end relative z-10 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10 h-full">
                <a href="tel:09156953895" className="px-8 py-4 bg-accent-primary text-text-primary font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all w-full text-center shadow-lg shadow-accent-primary/20 hover:scale-105 active:scale-95">
                  Call Now: <PhoneNumber number="09156953895" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default AboutSection;