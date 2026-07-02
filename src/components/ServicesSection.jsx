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

const ServicesSection = () => {
  const services = [
    {
      title: "Share Market Training",
      desc: "In-depth courses on stock market investing, trading strategies, technical analysis and financial planning for beginners and advanced learners.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Stock Investment",
      desc: "Unlock your wealth potential with smart stock investments - guided strategies, expert insights and confident decisions for a secure financial future.",
      image: "https://images.pexels.com/photos/4386404/pexels-photo-4386404.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Mutual Fund Investment",
      desc: "Grow your wealth steadily with smart mutual fund investments - guided by experts for secure, diversified and goal-oriented financial success.",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <AnimatedSection id="services" className="py-10 md:py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4 md:gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-secondary/10 text-accent-primary font-bold tracking-widest uppercase text-xs mb-4 md:mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
              What We Do
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight">
              Exclusive Financial <span className="text-accent-primary">Solutions</span>
            </h2>
          </div>
          <p className="text-text-secondary text-sm max-w-md font-bold leading-relaxed mb-2 md:text-right">
            At Advait Stock Market Academy, we offer comprehensive services to help you grow financially and stay protected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-min md:auto-rows-[280px] mb-12 md:mb-16">
          <div className="md:col-span-2 md:row-span-2 relative rounded-[24px] md:rounded-[32px] overflow-hidden group cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-500 border border-text-primary/5 min-h-[350px] md:min-h-[400px]">
            <img loading="lazy" src={services[0].image} alt={services[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/95 via-text-primary/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between pointer-events-none">
              <Link to="/service/share-market-training" className="self-end pointer-events-auto overflow-hidden flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-accent-primary group-hover:border-accent-primary transition-all duration-500 shadow-xl h-14 w-14 group-hover:w-36 group-hover:px-4">
                <span className="text-white font-bold text-xs uppercase tracking-widest whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs group-hover:mr-2 transition-all duration-500">Read More</span>
                <svg className="w-6 h-6 text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <div>
                <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
                  Featured
                </div>
                <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 group-hover:text-accent-primary transition-colors duration-500">{services[0].title}</h3>
              </div>
            </div>
          </div>

          <div className="relative rounded-[32px] overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500 border border-text-primary/5">
            <img loading="lazy" src={services[1].image} alt={services[1].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/95 via-text-primary/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
              <Link to="/service/stock-investment" className="self-end pointer-events-auto overflow-hidden flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-accent-primary group-hover:border-accent-primary transition-all duration-500 shadow-xl h-10 w-10 group-hover:w-32 group-hover:px-4">
                <span className="text-white font-bold text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs group-hover:mr-2 transition-all duration-500">Read More</span>
                <svg className="w-5 h-5 text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 group-hover:text-accent-primary transition-colors duration-500">{services[1].title}</h3>
              </div>
            </div>
          </div>

          <div className="relative rounded-[32px] overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500 border border-text-primary/5">
            <img loading="lazy" src={services[2].image} alt={services[2].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/95 via-text-primary/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
              <Link to="/service/mutual-fund-investment" className="self-end pointer-events-auto overflow-hidden flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-accent-primary group-hover:border-accent-primary transition-all duration-500 shadow-xl h-10 w-10 group-hover:w-32 group-hover:px-4">
                <span className="text-white font-bold text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs group-hover:mr-2 transition-all duration-500">Read More</span>
                <svg className="w-5 h-5 text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 group-hover:text-accent-primary transition-colors duration-500">{services[2].title}</h3>
              </div>
            </div>
          </div>

        </div>

        <div className="text-center">
          <a href="/services" className="inline-flex items-center gap-3 px-10 py-4 bg-text-primary text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-xl hover:bg-accent-primary transition-all hover:-translate-y-1 group">
            Explore All Services
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>

      </div>
    </AnimatedSection>
  );
};

export default ServicesSection;