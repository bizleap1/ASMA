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

const MissionVisionSection = () => (
  <AnimatedSection className="py-10 md:py-16 bg-bg-secondary/10 relative">
    <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">

      {/* 2x2 Checkerboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-[40px] overflow-hidden shadow-2xl border border-white/50">

        {/* Row 1: Mission (Text Left, Image Right) */}
        <div className="bg-white p-8 lg:p-12 flex flex-col justify-center relative group">
          <h3 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4 leading-tight tracking-tight">
            Our Mission
          </h3>
          <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-0">
            To empower individuals with practical, live-market trading education. We aim to break the myths of the stock market and provide structured, risk-managed strategies that create consistent, independent traders.
          </p>
        </div>

        <div className="h-full min-h-[300px] lg:min-h-[400px] relative bg-bg-secondary/20 overflow-hidden group">
          {/* Subtle color overlay to match theme */}
          <div className="absolute inset-0 bg-accent-primary/10 mix-blend-multiply z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
          <img loading="lazy"
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop"
            alt="Mission"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Row 2: Vision (Image Left, Text Right on Desktop) */}
        {/* We use order to switch them on mobile so images don't stack directly */}
        <div className="h-full min-h-[300px] lg:min-h-[400px] relative bg-bg-secondary/20 overflow-hidden group order-last md:order-none">
          {/* Subtle color overlay to match theme */}
          <div className="absolute inset-0 bg-accent-primary/10 mix-blend-multiply z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
          <img loading="lazy"
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop"
            alt="Vision"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="bg-white p-8 lg:p-12 flex flex-col justify-center relative group">
          <h3 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4 leading-tight tracking-tight">
            Our Vision
          </h3>
          <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-0">
            To be Central India's most trusted financial education platform, fostering a community of financially literate and disciplined investors who can confidently navigate and profit from global markets.
          </p>
        </div>

      </div>

    </div>
  </AnimatedSection>
);

export default MissionVisionSection;