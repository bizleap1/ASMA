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
import AnimatedSection from '../components/AnimatedSection';

const BlogPageSection = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const categories = ['All', 'Trading', 'Investing', 'Technical Analysis', 'Fundamental Analysis'];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AnimatedSection className="py-12 md:py-20 bg-bg-primary relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12 bg-white/60 backdrop-blur-xl p-6 rounded-[28px] border border-text-primary/5 shadow-xl">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-bg-primary rounded-2xl border border-text-primary/10 text-sm focus:outline-none focus:border-accent-primary transition-all shadow-inner"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2.5 justify-center md:justify-end w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ${selectedCategory === cat
                  ? 'bg-text-primary text-bg-primary shadow-lg shadow-text-primary/10 scale-105'
                  : 'bg-white text-text-secondary border border-text-primary/5 hover:border-accent-primary hover:text-accent-primary'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-white rounded-[32px] border border-text-primary/10 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Image Wrap */}
                <div className="relative h-60 overflow-hidden">
                  <img loading="lazy"
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-accent-primary text-[10px] font-bold tracking-widest uppercase shadow-sm border border-text-primary/5">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-text-secondary text-xs font-medium mb-3">
                    <span>{post.date}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/35"></span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-text-primary mb-3 leading-snug group-hover:text-accent-primary transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>

                  <p className="text-text-secondary text-sm font-light leading-relaxed mb-6 flex-grow line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-text-primary/5 my-4"></div>

                  {/* Author and Read More */}
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-3">
                      <img loading="lazy"
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-text-primary/5"
                      />
                      <div>
                        <div className="text-xs font-bold text-text-primary">{post.author.name}</div>
                        <div className="text-[10px] text-text-secondary font-light">{post.author.role}</div>
                      </div>
                    </div>

                    <Link
                      to={`/blog/${post.id}`}
                      className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-text-primary hover:bg-accent-primary hover:text-white transition-all group/btn"
                    >
                      <svg
                        className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] border border-text-primary/10">
            <svg
              className="w-16 h-16 mx-auto text-text-secondary/35 mb-4 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-text-primary mb-2">No Articles Found</h3>
            <p className="text-text-secondary text-sm font-light">Try searching for different keywords or changing your filters.</p>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
};

export default BlogPageSection;