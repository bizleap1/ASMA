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

const VideoHero = () => (
  <>
    <AnimatedSection id="home" className="min-h-[100svh] h-[100svh] relative overflow-hidden flex flex-col pt-32 md:pt-40 pb-10">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/quality_restoration_20260611155538832.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10 pointer-events-none"></div>
      
      {/* Top Left Text Content */}
      <div className="relative z-20 flex-grow flex flex-col justify-start mt-16 md:mt-20 lg:mt-24 items-start text-left px-6 md:px-16 lg:px-24 w-full space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-black leading-tight text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)] animate-fadeInUp will-change-transform-opacity">
          Advait Stock <br /> Market Academy
        </h1>
        <div className="pl-6 md:pl-8 border-l-[6px] border-accent-primary ml-1 md:ml-2 animate-fadeInUp delay-200 will-change-transform-opacity">
          <p className="text-base md:text-lg lg:text-xl text-white/95 font-medium tracking-wide font-sans max-w-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-relaxed">
            Empowering your financial future <br className="hidden sm:block" /> with expert stock market training.
          </p>
        </div>
      </div>
    </AnimatedSection>
  </>
);

export default VideoHero;