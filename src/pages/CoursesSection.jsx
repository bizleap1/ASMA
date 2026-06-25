import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { blogPosts } from '../blogData';
import shubhangiImg from '../assets/shubhangi.png';
import krishnaImg from '../assets/krishna.png';
import vrushaliImg from '../assets/vrushali.png';
import { serviceData, courseDetails, baseCourses, additionalCourses, coursePackages, FREE_NOTES } from '../data';
import AnimatedSection from '../components/AnimatedSection';

const CoursesSection = ({ isCoursesPage = false }) => {
  const displayItems = isCoursesPage ? coursePackages : coursePackages.slice(0, 3);

  return (
    <AnimatedSection id="courses" className="py-8 md:py-12 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 max-w-[1200px]">

        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-black text-text-primary tracking-tight mb-4">
            Professional Trading <span className="text-[#166534]">Curriculum</span>
          </h2>
          <p className="text-text-secondary font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Elevate your trading journey with our premium, expertly crafted courses designed for serious investors and passionate learners.
          </p>
        </div>

        {/* Informational Section (Courses Page Only) */}
        {isCoursesPage && (
          <div className="mb-16 md:mb-20 bg-gradient-to-br from-[#166534]/5 to-transparent border border-[#166534]/15 rounded-[32px] p-8 md:p-12 shadow-2xl text-left relative overflow-hidden group">
            {/* Background Ambience */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#166534]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#166534]/10 transition-colors duration-700"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Column: Heading & Badge */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#166534]/10 text-[#166534] font-bold tracking-widest uppercase text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#166534]"></span>
                  Why Choose Advait?
                </div>

                <h3 className="text-3xl md:text-5xl font-display font-black leading-[1.15] text-text-primary tracking-tight">
                  Master the Markets with <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#166534] to-emerald-700">Advait Academy</span>
                </h3>

                <div className="h-1.5 w-24 bg-gradient-to-r from-[#166534] to-accent-secondary rounded-full"></div>

                {/* Stats / Highlights chips */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-white rounded-2xl border border-[#166534]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="text-2xl font-display font-black text-[#166534]">100%</div>
                    <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">Practical Learning</div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-[#166534]/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="text-2xl font-display font-black text-[#166534]">Lifetime</div>
                    <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">Mentor Support</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative & Key Features */}
              <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-text-primary/10 lg:pl-10 text-justify">
                <p className="text-text-primary text-base md:text-lg font-light leading-relaxed">
                  At Advait Stock Market Academy, we believe that financial independence is achievable for everyone with the right knowledge, discipline, and mentorship. Our curriculum is meticulously designed by industry veterans to take you from a complete beginner to a confident, independent trader.
                </p>
                <p className="text-text-secondary text-sm md:text-base font-light leading-relaxed">
                  Whether you are looking to generate secondary income through intraday trading, build generational wealth through value investing, or master the complexities of derivative markets, our courses provide actionable, real-world strategies. We focus deeply not just on technical indicators, but on the crucial elements of risk management and trading psychology.
                </p>

                {/* Visual Checkmark benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-black/5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#166534]/10 flex items-center justify-center text-[#166534] shrink-0 font-bold text-xs">✓</div>
                    <span className="font-medium text-text-primary text-xs md:text-sm">Practical, Live-Market Training</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#166534]/10 flex items-center justify-center text-[#166534] shrink-0 font-bold text-xs">✓</div>
                    <span className="font-medium text-text-primary text-xs md:text-sm">Proprietary Trading Setups</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#166534]/10 flex items-center justify-center text-[#166534] shrink-0 font-bold text-xs">✓</div>
                    <span className="font-medium text-text-primary text-xs md:text-sm">Lifetime Mentorship Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#166534]/10 flex items-center justify-center text-[#166534] shrink-0 font-bold text-xs">✓</div>
                    <span className="font-medium text-text-primary text-xs md:text-sm">Risk Management Mastery</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Alternating List Layout */}
        <div className="flex flex-col">
          {displayItems.map((pkg, index) => {
            const isEven = index % 2 !== 0; // index 1, 3 etc. are visually 'Even' rows

            return (
              <div key={index} className="flex flex-col md:flex-row items-center border-b border-gray-100 py-8 md:py-12 gap-6 md:gap-12 group">

                {/* Content Block (Left for Odd, Right for Even) */}
                <div className={`w-full md:w-1/2 flex flex-col justify-center ${isEven ? 'md:order-2 md:pl-6 text-left' : 'md:pr-6 text-left md:text-right'}`}>
                  <div className={`w-8 h-[2px] bg-[#166534] mb-4 transform group-hover:scale-x-150 transition-transform duration-500 ${isEven ? 'origin-left' : 'origin-left md:origin-right md:ml-auto'}`}></div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-text-primary mb-3 leading-tight group-hover:text-[#166534] transition-colors duration-500">
                    {pkg.title}
                  </h3>
                  <p className={`text-text-secondary text-base md:text-lg leading-relaxed font-light mb-4 max-w-md ${isEven ? '' : 'md:ml-auto'}`}>
                    {pkg.desc}
                  </p>
                  
                  {pkg.coursesIncluded && (
                    <div className={`flex flex-wrap gap-2 mb-6 ${isEven ? '' : 'md:justify-end'}`}>
                      {pkg.coursesIncluded.map((courseName, cIdx) => (
                        <span key={cIdx} className="px-3 py-1 bg-[#166534]/5 text-[#166534] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#166534]/10">
                          {courseName}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price replacing Explore Course */}
                  <div className={`inline-flex flex-wrap items-center gap-3 mt-2 ${isEven ? '' : 'md:justify-end'}`}>
                    <Link
                      to={`/course/${pkg.id}`}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#166534] text-white text-xs md:text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-md w-fit"
                    >
                      View Package Details
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </div>
                </div>

                {/* Huge Number with Image Mask (Right for Odd, Left for Even) */}
                <div className={`w-full md:w-1/2 flex justify-center items-center ${isEven ? 'md:order-1' : ''}`}>
                  <div
                    className="text-[80px] md:text-[140px] lg:text-[180px] font-black leading-none tracking-tighter drop-shadow-2xl hover:scale-105 transition-transform duration-700 select-none"
                    style={{
                      backgroundImage: `url(${pkg.image})`,
                      backgroundColor: '#166534', // Fallback color if image fails to load
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Explore Courses Button */}
        {!isCoursesPage && (
          <div className="mt-10 flex justify-center">
            <Link to="/courses" className="inline-flex items-center gap-3 px-10 py-4 bg-text-primary text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-xl hover:bg-accent-primary transition-all hover:-translate-y-1 group">
              Explore Courses
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
        )}

      </div>

    </AnimatedSection>
  );
};

export default CoursesSection;