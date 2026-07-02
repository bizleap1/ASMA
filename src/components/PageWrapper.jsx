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
import SEO from './SEO';

const PageWrapper = ({ children, backHash, seoTitle, seoDesc, seoKeywords }) => {
  return (
    <main className="flex-grow pt-0 pb-12 min-h-screen relative bg-bg-secondary/5">
      {seoTitle && <SEO title={seoTitle} description={seoDesc} keywords={seoKeywords} />}
      {children}
    </main>
  );
};

export default PageWrapper;