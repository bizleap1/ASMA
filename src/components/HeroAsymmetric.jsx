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

const HeroAsymmetric = () => (
  <AnimatedSection id="home" className="min-h-[100svh] relative overflow-hidden flex items-center pt-32 md:pt-40 pb-12 md:pb-24 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1920")' }}>
    {/* Dark/Blur Overlay for Background Image */}
    <div className="absolute inset-0 bg-bg-primary/90 md:bg-bg-primary/80 backdrop-blur-[2px] z-0"></div>

    {/* Animated Background Elements */}
    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }}></div>
    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-secondary/10 rounded-full blur-[150px] mix-blend-multiply animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>

    <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center pt-8 md:pt-12">

      {/* Left Content Area */}
      <div className="space-y-8 md:space-y-10 relative z-20">

        {/* Floating Interactive Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 border border-accent-primary/30 rounded-full text-accent-primary text-xs font-bold tracking-widest uppercase bg-white/40 backdrop-blur-md shadow-lg shadow-accent-primary/10 hover:shadow-accent-primary/30 hover:-translate-y-1 transition-all cursor-default group">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-primary group-hover:bg-accent-secondary transition-colors"></span>
          </span>
          Learn, Explore & Be Wealthy...
        </div>

        {/* Premium Gradient Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold leading-[1.1] drop-shadow-sm tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-text-primary via-text-primary to-text-secondary">
          Advait Stock <br /> Market Academy
        </h1>

        {/* Modern Accent Line */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-1.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"></div>
          <div className="w-4 h-1.5 bg-accent-secondary rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-accent-secondary/50 rounded-full"></div>
        </div>

        {/* Description */}
        <p className="text-xl text-text-secondary max-w-lg font-light leading-relaxed border-l-4 border-accent-primary/20 pl-6 py-2">
          Empowering your financial future with expert stock market training and comprehensive insurance solutions for a secure and confident tomorrow.
        </p>

        {/* Interactive Button Group */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-4">
          <a href="#contact-form" className="relative group px-8 sm:px-10 py-4 sm:py-5 bg-text-primary text-bg-primary font-bold uppercase tracking-widest text-sm rounded-2xl overflow-hidden shadow-2xl hover:shadow-text-primary/40 transition-all hover:-translate-y-1 w-full sm:w-auto text-center">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center gap-3">
              Contact Us
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </a>

          <a href="#courses" className="text-text-primary font-bold text-sm tracking-widest uppercase hover:text-accent-primary transition-colors flex items-center justify-center gap-2 group w-full sm:w-auto mt-2 sm:mt-0">
            Explore Courses
            <div className="w-8 h-px bg-text-primary group-hover:w-12 group-hover:bg-accent-primary transition-all"></div>
          </a>
        </div>
      </div>

      {/* Right Image Area with Floating Glassmorphism Cards */}
      <div className="relative h-[400px] sm:h-[450px] md:h-[650px] flex items-center justify-center perspective-1000 mt-8 md:mt-0 w-full mb-10 md:mb-0">
        <div className="relative w-full h-full flex items-center justify-center transform-style-3d group scale-[0.85] sm:scale-100">

          {/* Back Glowing Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-accent-primary to-accent-secondary rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 z-0 animate-pulse" style={{ animationDuration: '4s' }}></div>

          {/* Main Image */}
          <div className="relative z-10 p-2 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md rounded-full shadow-[0_0_40px_rgba(0,0,0,0.1)] border border-white/50 group-hover:shadow-[0_0_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:scale-[1.02]">
            <img loading="lazy" src="/founder.jpeg?v=3" alt="Advait Stock Market Academy Founder" className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] object-cover rounded-full border-4 border-bg-primary bg-bg-secondary object-center" />
          </div>

          {/* Floating Card 1: Experience Badge */}
          <div className="absolute top-0 sm:top-10 right-0 sm:right-4 md:-right-8 w-48 sm:w-64 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[20px] sm:rounded-3xl shadow-2xl p-4 sm:p-6 z-20 transform translate-y-4 group-hover:-translate-y-2 transition-transform duration-700 delay-100 hover:scale-105">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-accent-primary mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <div className="font-display text-xl sm:text-2xl font-bold text-text-primary">20<span className="font-black">+</span> Years</div>
            <div className="text-[10px] sm:text-xs text-text-secondary uppercase tracking-widest font-bold mt-1">Market Experience</div>
          </div>

          {/* Floating Card 2: Live Analysis */}
          <div className="absolute bottom-4 sm:bottom-10 left-0 sm:left-4 md:-left-8 w-56 sm:w-72 bg-bg-secondary/80 backdrop-blur-xl border border-text-primary/10 rounded-[20px] sm:rounded-3xl shadow-2xl p-4 sm:p-6 z-20 transform -translate-y-4 group-hover:translate-y-2 transition-transform duration-700 delay-200 hover:scale-105">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div>
                <div className="font-display text-base sm:text-xl font-bold text-text-primary">Live Analysis</div>
                <div className="text-[9px] sm:text-xs text-accent-primary font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent-primary animate-pulse"></span> Active Market
                </div>
              </div>
              <div className="text-text-primary font-bold font-sans text-sm sm:text-base">+24.5%</div>
            </div>

            {/* Mini Chart Mockup */}
            <div className="flex items-end gap-1 sm:gap-1.5 h-12 sm:h-16 mt-3 sm:mt-4">
              {[40, 55, 30, 70, 45, 90, 65, 100].map((height, i) => (
                <div key={i} className="w-full bg-gradient-to-t from-accent-primary to-accent-secondary rounded-t-sm transition-all duration-1000 hover:brightness-125" style={{ height: `${height}%`, transitionDelay: `${i * 100}ms` }}></div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  </AnimatedSection>
);

export default HeroAsymmetric;