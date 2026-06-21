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

const PageHero = ({ title, subtitle, image, tag }) => (
  <AnimatedSection className="relative w-full pt-36 pb-16 md:pt-48 md:pb-20 flex items-center justify-center overflow-hidden border-b border-text-primary/10 shadow-sm">
    <div
      className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url('${image}')` }}
    ></div>

    {/* Strong dark overlay to guarantee white text visibility against complex charts */}
    <div className="absolute inset-0 bg-black/75"></div>

    <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto animate-fadeInUp">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white font-bold tracking-widest uppercase text-[10px] md:text-xs mb-4 border border-white/20 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        {tag || "Advait Stock Market Academy"}
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white tracking-widest mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,1)] uppercase">
        {title}
      </h1>
      <p className="text-white/90 text-sm md:text-base font-medium max-w-xl mx-auto drop-shadow-md">
        {subtitle}
      </p>
    </div>
  </AnimatedSection>
);

export default PageHero;