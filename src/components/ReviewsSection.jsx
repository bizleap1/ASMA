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

const ReviewsSection = () => {
  const reviews = [
    { text: "Advait Stock Market Academy is passionate about the share market. Because I experienced that, Mr Satish Sir has vast knowledge about the share market. He teaches a live market, which helps to understand better and faster. Sir personally guides each student. Thank you, sir, for enlarging my knowledge and my money also.", name: "Shubhangi Jampal", image: shubhangiImg, rating: 5, date: "3 weeks ago" },
    { text: "I had a great experience at Advait Stock Market Academy. The share market training was practical and easy to understand and their insurance services are trustworthy. A one-stop solution for learning and securing your financial future.", name: "Krishna Murlidhar", image: krishnaImg, rating: 5, date: "1 month ago" },
    { text: "Advait Stock Market Academy is the perfect place to learn trading and investing. The trainers explain everything clearly and their insurance services are reliable. I gained both knowledge and financial security here. Highly recommended for everyone in Nagpur!", name: "Vrushali Babhale", image: vrushaliImg, rating: 5, date: "2 months ago" }
  ];

  const StarRating = ({ rating }) => (
    <div className="flex gap-1 text-[#fbbc04]">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <AnimatedSection id="reviews" className="py-12 md:py-20 bg-accent-primary/5 text-text-primary overflow-hidden relative border-y border-text-primary/5">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-primary/10 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-secondary/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between max-w-4xl mx-auto mb-10 gap-6 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-accent-primary/20 text-accent-primary font-bold tracking-widest uppercase text-[9px] mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-ping"></span>
              Google Reviews
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-2 text-text-primary tracking-tight">
              Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Hundreds</span>
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              <div className="text-3xl font-display font-bold text-text-primary">4.9</div>
              <div className="flex flex-col">
                <StarRating rating={5} />
                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-0.5">Based on 150+ reviews</span>
              </div>
            </div>
          </div>

          <a href="https://www.google.com/search?sca_esv=6c41df8803dda356&rlz=1C1VDKB_enIN1135IN1135&sxsrf=ANbL-n4aznE4jH6uYxK6vCGuZ88KOD6uvQ:1781007623389&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOYHEMA5pfD6YKL4hg_LxYX2PZ2tGeZCIa4KyvdKWjZp9MQt2HI6-HzPhcL9PJmQcht8AIdiD4xjF3YhV-UyQa0857WJMdXn129T9f3LzBFnbMfwTZcGzK2iESk4XbciKSPMCFrpgiL_nwb0DSiPKvSSp47qLxGXb0kbWVmh5jq7yp12g8Q%3D%3D&q=Advait+Share+Market+Academy+%7C+Stock+Market+Trading+Training+Institute+Reviews&sa=X&ved=2ahUKEwjNz--1kvqUAxXGzzgGHdTfLe0Q0bkNegQIORAH&biw=1280&bih=585&dpr=1.5" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 bg-white border border-text-primary/10 hover:border-accent-primary/30 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all">
            <svg viewBox="0 0 48 48" className="w-6 h-6 group-hover:scale-110 transition-transform">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span className="font-bold text-sm uppercase tracking-wider text-text-primary">Write a Review</span>
          </a>
        </div>

        <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] pt-4 pb-12">
          <div className="flex w-max animate-marquee gap-6">
            {[...reviews, ...reviews, ...reviews, ...reviews].map((review, i) => (
              <div
                key={i}
                className="w-[85vw] sm:w-[340px] md:w-[420px] shrink-0 group relative bg-white border border-text-primary/10 p-6 md:p-8 rounded-[24px] hover:-translate-y-2 transition-all duration-500 hover:shadow-xl hover:border-accent-primary/20 cursor-pointer flex flex-col justify-between shadow-sm"
              >
                {/* User Header */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    {review.image ? (
                      <img loading="lazy" src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover shadow-sm ring-1 ring-text-primary/5" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-bold text-lg ring-1 ring-accent-primary/20">
                        {review.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-base text-text-primary group-hover:text-accent-primary transition-colors">{review.name}</div>
                      <div className="text-xs text-text-secondary font-medium">{review.date}</div>
                    </div>
                  </div>
                  <svg viewBox="0 0 48 48" className="w-6 h-6 opacity-80">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </div>

                <div className="mb-4 relative z-10">
                  <StarRating rating={review.rating} />
                </div>

                <div className="relative z-10 flex-grow">
                  <p className="text-sm md:text-[15px] font-medium text-text-secondary leading-relaxed line-clamp-5 group-hover:text-text-primary transition-colors duration-300">"{review.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ReviewsSection;