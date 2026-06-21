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
import SEO from '../components/SEO';
import MultiChartSection from '../components/MultiChartSection';
import AboutSection from '../components/AboutSection';
import AchievementsSection from '../components/AchievementsSection';
import ServicesSection from '../components/ServicesSection';
import CoursesSection from './CoursesSection';
import GallerySection from './GallerySection';
import AdvantageSection from '../components/AdvantageSection';
import ReviewsSection from '../components/ReviewsSection';
import ContactSection from './ContactSection';
import VideoHero from '../components/VideoHero';

const Home = () => (
  <main className="flex-grow">
    <SEO title="Home" description="Advait Stock Market Academy - The best place to learn technical analysis, options trading, and fundamental analysis in India." keywords="stock market academy, trading classes, learn trading India, best stock market courses" />
    <VideoHero />
    <AboutSection />
    <AchievementsSection />
    <MultiChartSection />
    <ServicesSection />
    <CoursesSection />
    <GallerySection />
    <AdvantageSection />
    <ReviewsSection />
    <ContactSection />
  </main>
);

export default Home;