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
import NotificationScroller from '../components/NotificationScroller';
import LatestUpdatesSection from '../components/LatestUpdatesSection';
import SocialLearningHub from '../components/SocialLearningHub';
import FaqSection from '../components/FaqSection';
import { courseFaqs } from '../data';

const defaultCourses = (coursePackages || []).map(p => ({
  ...p,
  slug: p.id,
  curriculum: p.coursesIncluded
}));

const CoursesSection = ({ isCoursesPage = false }) => {
  const [courses, setCourses] = useState(defaultCourses);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setCourses(data);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses(defaultCourses);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const displayItems = isCoursesPage ? courses : courses.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32 bg-white">
        <div className="w-12 h-12 border-4 border-[#166534] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
    <AnimatedSection id="courses" className="py-16 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 max-w-7xl">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#063925]/10 text-[#063925] font-['Inter'] font-semibold tracking-wider uppercase text-[11px] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              Professional Curriculum
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-['Manrope'] font-semibold text-[#1A3326] leading-tight tracking-tight">
              Comprehensive Stock Market Training Programs
            </h2>
          </div>
          <p className="text-[#4A6356] font-['Inter'] font-normal text-sm md:text-base max-w-md leading-relaxed">
            Elevate your financial literacy and execution discipline with structured offline and online programs in Nagpur.
          </p>
        </div>

        {isCoursesPage && (
          <div className="mb-14 md:mb-18">
            <LatestUpdatesSection />
          </div>
        )}

        {/* Informational Section (Courses Page Only) */}
        {isCoursesPage && (
          <div className="mb-16 md:mb-20 bg-[#F2F5F3] border border-[#063925]/10 rounded-[4px] p-6 md:p-10 lg:p-12 text-left relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Column */}
              <div className="lg:col-span-5 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#063925]/10 text-[#063925] font-['Inter'] font-semibold tracking-wider uppercase text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                  Why Choose Advait?
                </div>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-['Manrope'] font-semibold leading-tight text-[#1A3326] tracking-tight">
                  Master the Markets with Nagpur's Premier Academy
                </h3>

                {/* Highlights chips */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 bg-white rounded-[4px] border border-[#063925]/10">
                    <div className="text-xl font-['Manrope'] font-semibold text-[#063925]">100%</div>
                    <div className="text-[10px] text-[#4A6356] font-['Inter'] font-semibold uppercase tracking-wider mt-0.5">Practical Market Screen</div>
                  </div>
                  <div className="p-3.5 bg-white rounded-[4px] border border-[#063925]/10">
                    <div className="text-xl font-['Manrope'] font-semibold text-[#063925]">Lifetime</div>
                    <div className="text-[10px] text-[#4A6356] font-['Inter'] font-semibold uppercase tracking-wider mt-0.5">Trading Community</div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="/ASMA_brochure_updated.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#063925] hover:bg-[#0B2117] text-white font-['Inter'] font-semibold uppercase tracking-wider text-xs rounded-[4px] transition-all shadow-sm"
                  >
                    <span>Download Academy Brochure</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-[#063925]/10 lg:pl-10">
                <p className="text-[#1A3326] text-sm md:text-base font-['Inter'] font-normal leading-relaxed">
                  Advait Stock Market Academy bridges the gap between academic theory and real-time order execution. Guided by founder Satish Bobade with over 20 years of hands-on experience, our students learn to navigate volatile market environments with calculated risk parameters.
                </p>
                <p className="text-[#4A6356] text-xs md:text-sm font-['Inter'] font-normal leading-relaxed">
                  Every batch includes live-session practice on live terminals, detailed case studies on breakout formations, and disciplined money management protocols.
                </p>

                {/* Benefits List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#063925]/10">
                  <div className="flex items-center gap-2.5 text-xs font-['Inter'] font-medium text-[#1A3326]">
                    <div className="w-5 h-5 rounded-[2px] bg-[#063925]/10 flex items-center justify-center text-[#063925] shrink-0 font-bold text-[10px]">✓</div>
                    <span>Practical Live Market Floor</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-['Inter'] font-medium text-[#1A3326]">
                    <div className="w-5 h-5 rounded-[2px] bg-[#063925]/10 flex items-center justify-center text-[#063925] shrink-0 font-bold text-[10px]">✓</div>
                    <span>Proprietary Breakout Setups</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-['Inter'] font-medium text-[#1A3326]">
                    <div className="w-5 h-5 rounded-[2px] bg-[#063925]/10 flex items-center justify-center text-[#063925] shrink-0 font-bold text-[10px]">✓</div>
                    <span>Direct Faculty Doubt Clearing</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-['Inter'] font-medium text-[#1A3326]">
                    <div className="w-5 h-5 rounded-[2px] bg-[#063925]/10 flex items-center justify-center text-[#063925] shrink-0 font-bold text-[10px]">✓</div>
                    <span>Risk-to-Reward Psychology</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Clean Editorial Course List */}
        <div className="space-y-6">
          {displayItems.map((pkg, index) => (
            <div
              key={index}
              className="bg-[#F2F5F3]/50 rounded-[4px] border border-[#063925]/10 p-6 md:p-8 hover:border-[#D4AF37]/50 hover:shadow-[0_8px_30px_rgba(6,57,37,0.06)] transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
            >
              {/* Left / Info */}
              <div className="flex-1 max-w-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-['Manrope'] font-semibold text-xs text-[#063925] bg-[#063925]/10 px-2 py-0.5 rounded-[2px]">
                    Track #{String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-['Inter'] text-[#4A6356]">
                    {pkg.duration || "Comprehensive Program"}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-['Manrope'] font-semibold text-[#1A3326] mb-2 leading-snug group-hover:text-[#063925] transition-colors">
                  {pkg.title}
                </h3>
                <p className="text-xs md:text-sm font-['Inter'] font-normal text-[#4A6356] leading-relaxed mb-4">
                  {pkg.desc}
                </p>

                {/* Modules Tags */}
                {pkg.curriculum && Array.isArray(pkg.curriculum) && (
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.curriculum.map((courseName, cIdx) => (
                      <span key={cIdx} className="px-2.5 py-1 bg-white text-[#063925] rounded-[2px] text-[10px] font-['Inter'] font-semibold uppercase tracking-wider border border-[#063925]/10">
                        {courseName}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right / CTA */}
              <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 w-full md:w-auto">
                <Link
                  to={`/course/${pkg.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#063925] hover:bg-[#0B2117] text-white text-xs font-['Inter'] font-semibold uppercase tracking-wider rounded-[4px] transition-all shadow-sm w-full sm:w-auto"
                >
                  <span>View Details</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Explore All Courses Button on Homepage */}
        {!isCoursesPage && (
          <div className="mt-12 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#063925] hover:bg-[#0B2117] text-white font-['Inter'] font-semibold uppercase tracking-wider text-xs rounded-[4px] shadow-sm hover:shadow-md transition-all duration-200"
            >
              <span>Explore All Courses & Batches</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}

      </div>
    </AnimatedSection>
    {isCoursesPage && <FaqSection faqs={courseFaqs} />}
    </>
  );
};

export default CoursesSection;