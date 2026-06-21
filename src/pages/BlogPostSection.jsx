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

const BlogPostSection = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Article Not Found</h2>
        <p className="text-text-secondary mb-8">The blog article you are looking for does not exist or has been moved.</p>
        <Link to="/blog" className="px-6 py-3 bg-accent-primary text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-text-primary transition-all">
          Back to Blog
        </Link>
      </div>
    );
  }

  // Find 3 other posts as related articles
  const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <article className="py-12 md:py-20 bg-bg-primary relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">

        {/* Breadcrumb / Category Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-widest uppercase mb-6 text-text-secondary">
          <Link to="/blog" className="hover:text-accent-primary transition-colors">Blog</Link>
          <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/35"></span>
          <span className="text-accent-primary">{post.category}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-text-primary mb-8 leading-[1.15] max-w-4xl">
          {post.title}
        </h1>

        {/* Author & Info Bar */}
        <div className="flex flex-wrap justify-between items-center gap-6 pb-8 border-b border-text-primary/10 mb-10">
          <div className="flex items-center gap-4">
            <img loading="lazy" src={post.author.avatar} alt={post.author.name} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-accent-primary shadow-md" />
            <div>
              <div className="text-sm md:text-base font-bold text-text-primary">{post.author.name}</div>
              <div className="text-xs text-text-secondary font-light">{post.author.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-text-secondary text-xs md:text-sm font-medium">
            <span>Published: {post.date}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/35"></span>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-[250px] sm:h-[400px] md:h-[550px] w-full rounded-[32px] overflow-hidden shadow-2xl mb-12 md:mb-16 border border-text-primary/10">
          <img loading="lazy" src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Layout Grid: Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">

          {/* Main Article Content */}
          <div className="lg:col-span-8 space-y-6">
            {post.content.map((block, idx) => {
              if (block.type === 'paragraph') {
                return (
                  <p key={idx} className="text-text-secondary text-base md:text-lg font-light leading-relaxed mb-6">
                    {block.text}
                  </p>
                );
              }
              if (block.type === 'heading') {
                return (
                  <h3 key={idx} className="text-2xl md:text-3xl font-display font-bold text-text-primary mt-10 mb-4 leading-tight">
                    {block.text}
                  </h3>
                );
              }
              if (block.type === 'blockquote') {
                return (
                  <blockquote key={idx} className="border-l-4 border-accent-primary bg-accent-primary/5 rounded-r-[24px] p-6 md:p-8 my-10 italic text-lg md:text-xl text-text-primary font-medium leading-relaxed shadow-sm">
                    "{block.text}"
                  </blockquote>
                );
              }
              if (block.type === 'list') {
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-3 my-6 text-text-secondary font-light text-base md:text-lg leading-relaxed">
                    {block.items.map((item, itemIdx) => {
                      const parts = item.split('**');
                      return (
                        <li key={itemIdx}>
                          {parts.map((part, partIdx) =>
                            partIdx % 2 === 1 ? <strong key={partIdx} className="font-bold text-text-primary">{part}</strong> : part
                          )}
                        </li>
                      );
                    })}
                  </ul>
                );
              }
              return null;
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">

            {/* Call to Action Box */}
            <div className="bg-text-primary rounded-[32px] p-8 shadow-2xl relative overflow-hidden text-white border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/20 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <span className="px-3 py-1 rounded-full bg-white/10 text-accent-primary text-[10px] font-bold tracking-widest uppercase mb-4 inline-block">
                  Masterclass
                </span>
                <h4 className="text-2xl font-display font-bold mb-4 text-white">Learn to Trade Profitably</h4>
                <p className="text-white/70 font-light text-sm leading-relaxed mb-6">
                  Ready to take your trading to the next level? Join Advait Stock Market Academy's practical stock market courses taught by seasoned professionals.
                </p>
                <Link to="/courses" className="w-full text-center block py-4 bg-accent-primary text-text-primary font-bold uppercase tracking-wider text-xs rounded-2xl hover:bg-white hover:text-text-primary transition-all shadow-lg hover:-translate-y-0.5">
                  View Our Courses
                </Link>
              </div>
            </div>

            {/* Related Articles */}
            <div className="bg-white rounded-[32px] p-8 border border-text-primary/10 shadow-lg">
              <h4 className="text-lg font-display font-bold text-text-primary mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-primary"></span>
                Related Articles
              </h4>
              <div className="space-y-6">
                {relatedPosts.map((related) => (
                  <Link key={related.id} to={`/blog/${related.id}`} className="group flex items-start gap-4">
                    <img loading="lazy" src={related.image} alt={related.title} className="w-16 h-16 rounded-xl object-cover border border-text-primary/5 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] font-bold text-accent-primary tracking-wider uppercase mb-1">{related.category}</div>
                      <h5 className="text-sm font-bold text-text-primary leading-snug group-hover:text-accent-primary transition-colors line-clamp-2">
                        {related.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </article>
  );
};

export default BlogPostSection;