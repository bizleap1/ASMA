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

const CoreValuesSection = () => {
  const values = [
    {
      title: "Integrity",
      desc: "We believe in transparent, honest education without false promises. We teach the absolute reality of the markets.",
      icon: <svg className="w-16 h-16 text-accent-primary mx-auto relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
    {
      title: "Practical Learning",
      desc: "Theory isn't enough. Our entire curriculum is based purely on live-market execution and real-world capital.",
      icon: <svg className="w-16 h-16 text-accent-primary mx-auto relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
    },
    {
      title: "Disciplined Approach",
      desc: "Success in trading stems from psychology. We instill strict risk management rules in all our students.",
      icon: <svg className="w-16 h-16 text-accent-primary mx-auto relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    },
    {
      title: "Financial Freedom",
      desc: "Our ultimate goal is to make you self-reliant, capable of navigating any market condition with confidence.",
      icon: <svg className="w-16 h-16 text-accent-primary mx-auto relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    }
  ];

  return (
    <AnimatedSection className="py-10 md:py-16 bg-white relative overflow-hidden">
      {/* Eye-catchy animated background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#115234_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>
      {/* Huge subtle glow behind the grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-accent-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">

        {/* Refined Heading */}
        <div className="text-center max-w-4xl mx-auto mb-20 relative">
          <div className="inline-block px-5 py-2 rounded-full bg-accent-primary/5 border border-accent-primary/10 text-accent-primary font-bold tracking-widest uppercase text-xs mb-8 shadow-sm">
            What Drives Us
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.1em] text-text-primary mb-6 font-display font-black">
            WE HAVE FAITH IN OUR <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">STUDENT FUTURE</span>
          </h2>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Our students are talented, hard-working and full of good ideas. We encourage and empower them to bring their ideas to life. Hands-on opportunities and live market execution are what we're all about.
          </p>
        </div>

        {/* Dynamic 4-Column Flat Grid with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 max-w-7xl mx-auto">
          {values.map((val, i) => (
            <div key={i} className="text-center flex flex-col items-center group relative p-6 rounded-3xl hover:bg-white hover:shadow-[0_20px_40px_rgba(17,82,52,0.08)] transition-all duration-500 cursor-default">

              {/* Icon Container with glowing background ring on hover */}
              <div className="mb-8 relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-accent-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
                {val.icon}
              </div>

              <h3 className="text-lg md:text-xl font-bold text-text-primary mb-4 tracking-wider group-hover:text-accent-primary transition-colors duration-300 relative">
                {val.title}
                {/* Underline effect that grows on hover */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent-secondary group-hover:w-12 transition-all duration-500"></div>
              </h3>

              <p className="text-text-secondary/80 text-sm leading-relaxed max-w-[250px] group-hover:text-text-secondary transition-colors duration-300 mt-2">
                {val.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </AnimatedSection>
  );
};

export default CoreValuesSection;