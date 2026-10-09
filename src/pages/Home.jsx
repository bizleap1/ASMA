import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { blogPosts } from '../blogData';
import shubhangiImg from '../assets/shubhangi.png';
import krishnaImg from '../assets/krishna.png';
import vrushaliImg from '../assets/vrushali.png';
import { serviceData, courseDetails, baseCourses, additionalCourses, FREE_NOTES, homeFaqs } from '../data';
import SEO from '../components/SEO';
import MultiChartSection from '../components/MultiChartSection';
import AboutSection from '../components/AboutSection';
import AchievementsSection from '../components/AchievementsSection';
import FeaturedCoursesSection from '../components/FeaturedCoursesSection';
import ServicesSection from '../components/ServicesSection';
import SocialLearningHub from '../components/SocialLearningHub';
import CoursesSection from './CoursesSection';
import GallerySection from './GallerySection';
import AdvantageSection from '../components/AdvantageSection';
import ReviewsSection from '../components/ReviewsSection';
import FaqSection from '../components/FaqSection';
import ContactSection from './ContactSection';
import VideoHero from '../components/VideoHero';
const Home = () => {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Advait Stock Market Academy",
    "alternateName": "ASMA",
    "url": "https://www.asmaonline.in",
    "logo": "https://www.asmaonline.in/logo-dark.png",
    "description": "Stock market and trading institute in Nagpur founded by Satish Bobade, offering practical live-market training, technical analysis, and derivatives courses.",
    "founder": {
      "@type": "Person",
      "name": "Satish Bobade",
      "jobTitle": "Founder"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plot No. 20, Near Pipla Fata, Besa-Pipla Road",
      "addressLocality": "Nagpur",
      "addressRegion": "Maharashtra",
      "postalCode": "440034",
      "addressCountry": "IN"
    },
    "telephone": "+919156953895"
  };

  return (
    <main className="flex-grow">
      <SEO
        title="Stock Market Classes in Nagpur | Advait Stock Market Academy"
        description="Learn trading with live-market practice at ASMA, Besa–Pipla Road, Nagpur. Beginner to advanced courses, offline & online batches. Book a free demo."
        path="/"
        keywords="stock market classes in Nagpur, share market institute Nagpur, trading courses Nagpur, ASMA Nagpur, technical analysis classes"
        schema={homeSchema}
      />
      <VideoHero />
    <AboutSection />
    <AchievementsSection />
    <FeaturedCoursesSection />
    <MultiChartSection />
    <ServicesSection />
    <SocialLearningHub />
    <CoursesSection />
    <GallerySection />
    <AdvantageSection />
    <ReviewsSection />
    <FaqSection faqs={homeFaqs} />
    <ContactSection />
  </main>
  );
};

export default Home;