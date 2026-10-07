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

const PhoneNumber = ({ number }) => {
  const [lang, setLang] = React.useState('en');
  React.useEffect(() => {
    if (document.cookie.includes('googtrans=/en/hi')) {
      setLang('hi');
    }
  }, []);

  if (lang === 'en') return <>{number}</>;

  const hindiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  const hindiNumber = number.toString().split('').map(char => {
    if (/[0-9]/.test(char)) return hindiDigits[parseInt(char)];
    return char;
  }).join('');
  return <span className="translate-no" translate="no">{hindiNumber}</span>;
};

export default PhoneNumber;