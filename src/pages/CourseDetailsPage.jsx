import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { courseFaqs } from '../data';
import { toast } from '../utils/notification';
import SEO from '../components/SEO';

// Genuine Course Database with fact-checked curriculum, durations & posters
const COURSE_CATALOG = {
  'advanced-foundation': {
    slug: 'advanced-foundation',
    id: 'advanced-foundation',
    title: 'Advanced Foundation',
    badge: 'Beginner to Intermediate',
    duration: '~2 Months',
    learningMode: 'Online Live & Offline Classroom',
    center: 'Besa–Pipla Road, Nagpur',
    description:
      'Build a solid, practical understanding of financial markets, technical analysis, Demat operations, and disciplined risk management. Designed for individuals starting their journey towards financial literacy and confident market execution.',
    poster: '/advanced foundtation course.webp',
    posterFallback: '/e80ee201-5e4e-4806-b5bc-9434216dc4d4.png',
    curriculum: [
      'Equity Market',
      'Commodity Market',
      'Demat & Account Operations',
      'Technical Analysis',
      'Mindset Development',
      'Mutual Funds & SIP',
      'Portfolio Management',
      'Risk Management',
      'Financial Planning',
      'Market Psychology'
    ],
    benefits: [
      {
        title: 'Professional Mentorship',
        description: 'Direct guidance from Satish Bobade and senior market mentors at our Nagpur academy.'
      },
      {
        title: 'Quality Course Materials',
        description: 'Structured reference handbooks, candlestick cheat sheets, and practical scanning templates.'
      },
      {
        title: 'Dedicated Query Support',
        description: 'Post-batch doubt-solving assistance, chart reviews, and active community interaction.'
      },
      {
        title: 'Live Market Training Access',
        description: 'Practical trading desk access during market hours (9:15 AM – 3:30 PM) to practice live chart analysis alongside mentors.'
      }
    ]
  },
  'professional-master-program': {
    slug: 'professional-master-program',
    id: 'professional-master-program',
    title: 'Professional Master Program',
    badge: 'Advanced Mastery',
    duration: '~4 Months',
    learningMode: 'Online Live & Offline Classroom',
    center: 'Besa–Pipla Road, Nagpur',
    description:
      'Advanced trading techniques for serious market practitioners. Professional Master Program builds upon foundational market principles to master derivatives, institutional strategies, fundamental valuation, and portfolio optimization.',
    poster: '/prof.master program.webp',
    posterFallback: '/prof.master program.png',
    curriculum: [
      'Futures Market',
      'Options Market',
      'Advanced Trading Techniques',
      'Master Trading Strategies',
      'Fundamental Analysis',
      'Portfolio Optimization',
      'Advanced Psychological Training'
    ],
    benefits: [
      {
        title: 'Professional Mentorship',
        description: 'Direct 1-on-1 strategy formulation with Satish Bobade and senior options practitioners.'
      },
      {
        title: 'Quality Course Materials',
        description: 'Institutional-grade derivatives manuals, Option Greeks formulas, and multi-leg spread playbooks.'
      },
      {
        title: 'Dedicated Query Support',
        description: 'Continuous trade log audits, risk management checks, and lifetime peer trader network.'
      },
      {
        title: 'Live Market Training Access',
        description: 'Multi-screen terminal access at our Nagpur campus during market hours (9:15 AM – 3:30 PM) for real-time live market execution.'
      }
    ]
  }
};

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const decodedId = decodeURIComponent(courseId || '').toLowerCase().trim();

  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const easeOut = [0.16, 1, 0.3, 1];

  // Resolve static data or fallback
  const staticData = COURSE_CATALOG[decodedId] || null;
  const [course, setCourse] = useState(staticData);
  const [isLoading, setIsLoading] = useState(!staticData);

  useEffect(() => {
    // Scroll to top on course change
    window.scrollTo({ top: 0, behavior: 'instant' });

    const fetchCourse = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', decodedId)
          .single();

        if (error) {
          if (!staticData) throw error;
        } else if (data) {
          setCourse(prev => ({
            ...prev,
            ...data,
            description: staticData?.description || data.description || data.desc,
            duration: staticData?.duration || data.duration,
            learningMode: staticData?.learningMode || data.learningMode,
            poster: staticData?.poster || data.image,
            curriculum: staticData?.curriculum || data.curriculum || [],
            benefits: staticData?.benefits || prev?.benefits || []
          }));
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [decodedId]);

  // Form submission: Saves to Supabase 'enrollments' table & triggers WhatsApp for guests
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setIsEnrolling(true);
    setEnrollSuccess(false);

    try {
      const formData = new FormData(e.target);
      const name = formData.get('name')?.toString().trim();
      const email = formData.get('email')?.toString().trim();
      const phone = formData.get('phone')?.toString().trim();
      const msg = formData.get('message')?.toString().trim();

      if (!name || !email || !phone) {
        toast.error('Please fill in all required fields.');
        setIsEnrolling(false);
        return;
      }

      const { data: authData } = await supabase.auth.getSession();
      const user = authData?.session?.user;

      const { error: insertError } = await supabase
        .from('enrollments')
        .insert({
          course_id: course?.id || decodedId,
          course_name: course?.title || 'Stock Market Course',
          student_name: name,
          email: email,
          phone: phone,
          notes: msg || null,
          status: 'pending',
          auth_user_id: user ? user.id : null
        });

      if (insertError) {
        console.error('Error inserting enrollment:', insertError);
        toast.error('Failed to submit request. Please try again.');
        setIsEnrolling(false);
        return;
      }

      if (user) {
        setEnrollSuccess(true);
        toast.success('Enrollment request submitted! Our admissions desk will review shortly.');
        setTimeout(() => {
          setIsModalOpen(false);
          setEnrollSuccess(false);
        }, 2500);
      } else {
        const text = `Hi Advait Academy! I would like to enroll in ${course?.title || 'the course'}.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nNotes: ${msg || 'Interested in upcoming batch timings and fee structure.'}`;
        window.open(`https://wa.me/919156953895?text=${encodeURIComponent(text)}`, '_blank');
        setIsModalOpen(false);
        toast.success('Application received! Connecting via WhatsApp...');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FAF9F6]">
        <div className="w-9 h-9 border-2 border-[#063925] border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-32 text-center text-[#1A3326] min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center px-4">
        <SEO title="Course Not Found | ASMA" noindex={true} path={`/course/${decodedId}`} />
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2 font-['Inter']">
          Advait Stock Market Academy
        </span>
        <h2 className="text-2xl sm:text-3xl font-['Manrope'] font-semibold mb-3">Course Not Found.</h2>
        <p className="text-sm text-[#4A6356] max-w-md mb-6 font-['Inter']">
          The requested course could not be located. Please check our course directory for our current educational programs in Nagpur.
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#063925] hover:bg-[#0B2117] text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-colors font-['Inter']"
        >
          ← Return to Courses
        </Link>
      </div>
    );
  }

  // SEO metadata & Structured Data
  const seoTitle = course.slug === 'advanced-foundation'
    ? 'Beginner Stock Market Course in Nagpur | ASMA'
    : course.slug === 'professional-master-program'
    ? 'Options Trading Course in Nagpur – Master Program | ASMA'
    : `${course.title} | Stock Market Course in Nagpur`;

  const seoDesc = course.slug === 'advanced-foundation'
    ? 'Advanced Foundation: technical analysis, candlesticks, risk management and live-market practice for beginners. Syllabus, duration and fees.'
    : course.slug === 'professional-master-program'
    ? 'Futures & options, advanced strategies, fundamental analysis and trading psychology. Syllabus, batch dates and fees for ASMA Professional Master Program.'
    : (course.description || `Enroll in ${course.title} at Advait Stock Market Academy, Nagpur.`);

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    'name': course.title,
    'description': seoDesc,
    'provider': {
      '@type': 'EducationalOrganization',
      'name': 'Advait Stock Market Academy',
      'sameAs': 'https://www.asmaonline.in'
    }
  };

  // Prioritize course-specific FAQs first
  const sortedFaqs = [...courseFaqs].sort((a, b) => {
    if (course.slug === 'advanced-foundation') {
      const aIsBeginner = a.question.toLowerCase().includes('beginner');
      const bIsBeginner = b.question.toLowerCase().includes('beginner');
      if (aIsBeginner && !bIsBeginner) return -1;
      if (!aIsBeginner && bIsBeginner) return 1;
    } else if (course.slug === 'professional-master-program') {
      const aIsMaster = a.question.toLowerCase().includes('master program') || a.question.toLowerCase().includes('options trading');
      const bIsMaster = b.question.toLowerCase().includes('master program') || b.question.toLowerCase().includes('options trading');
      if (aIsMaster && !bIsMaster) return -1;
      if (!aIsMaster && bIsMaster) return 1;
    }
    return 0;
  });

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A3326]">
      <SEO
        title={seoTitle}
        description={seoDesc}
        path={`/course/${course.slug || decodedId}`}
        image={course.poster}
        schema={courseSchema}
      />

      {/* =========================================================================
          SECTION 01 — COURSE HERO (Warm Off-White Editorial 55/45 Split)
          ========================================================================= */}
      <section className="relative pt-[120px] sm:pt-[140px] md:pt-[160px] lg:pt-[175px] pb-10 sm:pb-14 lg:pb-16 bg-[#FAF9F6] w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="container mx-auto px-0 w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            
            {/* LEFT COLUMN (approx 55%): Title, Description, Duration, Mode & CTA */}
            <div className="lg:col-span-7 text-left">
              {/* Eyebrow: subtle gold line + COURSE PROGRAM */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: easeOut }}
                className="flex items-center gap-2 mb-3 sm:mb-3.5"
              >
                <motion.span
                  initial={shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: easeOut }}
                  className="w-4 h-[1.5px] bg-[#D4AF37] origin-left shrink-0"
                />
                <span className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.16em] uppercase text-[#063925] font-['Inter']">
                  COURSE PROGRAM
                </span>
                <span className="text-[11px] text-[#4A6356] font-['Inter'] hidden sm:inline">•</span>
                <span className="text-[11px] text-[#4A6356] font-['Inter'] hidden sm:inline">
                  {course.badge}
                </span>
              </motion.div>

              {/* Dynamic H1 */}
              <motion.h1
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOut }}
                className="text-[30px] sm:text-[38px] md:text-[44px] lg:text-[48px] xl:text-[52px] font-semibold text-[#1A3326] tracking-tight leading-[1.12] mb-4 sm:mb-5 font-['Manrope']"
              >
                {course.title}
              </motion.h1>

              {/* Short Meaningful Description */}
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.08, ease: easeOut }}
                className="text-[14.5px] sm:text-[15.5px] text-[#4A6356] font-normal leading-relaxed mb-6 sm:mb-8 font-['Inter'] max-w-2xl"
              >
                {course.description}
              </motion.p>

              {/* Clean Text Metadata Bar (Separated by Thin Dividers, No Badges) */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.12, ease: easeOut }}
                className="py-4 border-t border-b border-[#063925]/10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-7 sm:mb-8"
              >
                <div>
                  <span className="text-[10.5px] uppercase tracking-wider text-[#4A6356] font-medium font-['Inter'] block mb-0.5">
                    Duration
                  </span>
                  <span className="text-[14.5px] sm:text-[15px] font-semibold text-[#1A3326] font-['Manrope']">
                    {course.duration}
                  </span>
                </div>

                <div className="hidden sm:block w-[1px] h-8 bg-[#063925]/10" />

                <div>
                  <span className="text-[10.5px] uppercase tracking-wider text-[#4A6356] font-medium font-['Inter'] block mb-0.5">
                    Learning Mode
                  </span>
                  <span className="text-[14.5px] sm:text-[15px] font-semibold text-[#1A3326] font-['Manrope']">
                    {course.learningMode}
                  </span>
                </div>

                <div className="hidden sm:block w-[1px] h-8 bg-[#063925]/10" />

                <div>
                  <span className="text-[10.5px] uppercase tracking-wider text-[#4A6356] font-medium font-['Inter'] block mb-0.5">
                    Training Desk
                  </span>
                  <span className="text-[14.5px] sm:text-[15px] font-semibold text-[#1A3326] font-['Manrope']">
                    {course.center}
                  </span>
                </div>
              </motion.div>

              {/* Primary "Enroll Now" CTA Button */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.16, ease: easeOut }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-3.5 bg-[#063925] hover:bg-[#0B2117] text-white rounded-[2px] font-['Inter'] font-semibold uppercase tracking-wider text-xs transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Enroll in Program</span>
                  <span className="text-[#D4AF37] font-bold">→</span>
                </button>
                <a
                  href="https://wa.me/919156953895?text=Hi%20Advait%20Academy!%20I%20have%20an%20enquiry%20regarding%20the%20course."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#063925]/5 hover:bg-[#063925]/10 text-[#063925] rounded-[2px] border border-[#063925]/20 font-['Inter'] font-semibold uppercase tracking-wider text-xs transition-colors duration-200 text-center"
                >
                  Chat with Admissions
                </a>
              </motion.div>
            </div>

            {/* RIGHT COLUMN (approx 45%): Original Course Poster */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: easeOut }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[420px] sm:max-w-[440px] rounded-[2px] overflow-hidden border border-[#063925]/12 bg-white shadow-xs">
                <picture>
                  <source srcSet={course.poster} type="image/webp" />
                  <img
                    src={course.posterFallback || course.poster}
                    alt={`${course.title} Program Poster – Advait Stock Market Academy`}
                    className="w-full h-auto object-cover block"
                    loading="eager"
                    width={800}
                    height={800}
                  />
                </picture>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 — COMPREHENSIVE CURRICULUM (Numbered Two-Column Editorial Grid)
          ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-white border-t border-[#063925]/10">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-8 sm:mb-12 text-left">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#063925] font-['Inter'] block mb-1.5">
              WHAT YOU WILL LEARN
            </span>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1A3326] font-['Manrope'] tracking-tight">
                Explore the Curriculum.
              </h2>
              <span className="text-xs sm:text-[13px] text-[#4A6356] font-['Inter'] font-medium">
                {course.curriculum.length} Core Curriculum Modules
              </span>
            </div>
          </div>

          {/* Two-Column Numbered Editorial Topic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 lg:gap-x-16 border-t border-[#063925]/10">
            {course.curriculum.map((topic, idx) => (
              <motion.div
                key={idx}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 6 : 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.35), ease: easeOut }}
                className="py-4 sm:py-4.5 border-b border-[#063925]/10 flex items-start gap-4 text-left group hover:bg-[#FAF9F6]/60 transition-colors px-1"
              >
                <span className="font-['Manrope'] font-semibold text-[#D4AF37] text-sm sm:text-base tabular-nums shrink-0 mt-0.5">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3 className="font-['Manrope'] font-semibold text-[15px] sm:text-[16px] text-[#1A3326] group-hover:text-[#063925] transition-colors leading-snug">
                    {topic}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 — LEARNING EXPERIENCE & BENEFITS (Genuine Mentorship & Classroom)
          ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#FAF9F6]">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-8 sm:mb-12 text-left">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#063925] font-['Inter'] block mb-1.5">
              THE LEARNING EXPERIENCE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1A3326] font-['Manrope'] tracking-tight mb-2">
              Learn Through Practical Experience.
            </h2>
            <p className="text-[14px] text-[#4A6356] font-['Inter'] leading-relaxed max-w-2xl">
              We focus on practical execution rather than textbook theory. Students learn to navigate real-market dynamics alongside experienced mentors at our Nagpur campus.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Authentic Classroom Live-Market Photo */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="lg:col-span-6"
            >
              <div className="rounded-[2px] overflow-hidden border border-[#063925]/12 bg-white shadow-xs">
                <picture>
                  <source srcSet="/live-market-training.webp" type="image/webp" />
                  <img
                    src="/new photos/live-market-training.jpeg"
                    alt="Satish Bobade mentoring students on live market trading desk at Advait Stock Market Academy Nagpur"
                    className="w-full h-auto aspect-video sm:aspect-[4/3] object-cover block"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </picture>
                <div className="p-4 bg-white border-t border-[#063925]/10 text-left">
                  <div className="text-xs sm:text-sm font-semibold text-[#1A3326] font-['Manrope'] mb-0.5">
                    Live Market Trading Desk • Nagpur Campus
                  </div>
                  <div className="text-[12px] text-[#4A6356] font-['Inter']">
                    Mentors guide students through live charting, multi-timeframe analysis, and disciplined trade execution during market hours.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Editorial Benefits List */}
            <div className="lg:col-span-6 space-y-0 divide-y divide-[#063925]/10 border-t border-b border-[#063925]/10 text-left">
              {course.benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 6 : 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: easeOut }}
                  className="py-5"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                    <h3 className="text-[16px] font-semibold text-[#1A3326] font-['Manrope']">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-[13.5px] sm:text-[14px] text-[#4A6356] font-['Inter'] leading-relaxed pl-3.5">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 — COURSE FAQS (Minimal Full-Width Editorial Accordion)
          ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-white border-t border-[#063925]/10">
        <div className="container mx-auto max-w-4xl text-left">
          
          <div className="mb-8 sm:mb-10 text-left">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#063925] font-['Inter'] block mb-1.5">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A3326] font-['Manrope'] tracking-tight mb-2">
              Questions About {course.title}.
            </h2>
            <p className="text-[14px] text-[#4A6356] font-['Inter'] leading-relaxed">
              Find answers regarding admissions, batch timings, offline training at Besa–Pipla Road, and course outcomes.
            </p>
          </div>

          {/* Minimal Editorial Accordion */}
          <div className="divide-y divide-[#063925]/10 border-t border-b border-[#063925]/10">
            {sortedFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-4 sm:py-4.5">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    className="w-full text-left flex justify-between items-start gap-4 group cursor-pointer focus:outline-none select-none"
                  >
                    <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#1A3326] group-hover:text-[#063925] transition-colors leading-snug font-['Manrope'] pr-2">
                      {faq.question}
                    </h3>
                    <span className="flex-shrink-0 text-[#1A3326] group-hover:text-[#063925] mt-0.5 transition-colors">
                      <div className="w-5 h-5 flex items-center justify-center">
                        {isOpen ? (
                          <svg className="w-4 h-4 text-[#D4AF37] transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-[#063925]/70 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                          </svg>
                        )}
                      </div>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: easeOut }}
                        className="overflow-hidden"
                      >
                        <p className="pt-2 pb-1 pr-4 sm:pr-8 text-[#4A6356] text-[13.5px] sm:text-[14px] font-normal leading-relaxed font-['Inter']">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 05 — COMPACT ADMISSIONS CTA (Dark Forest-Green Banner)
          ========================================================================= */}
      <section className="py-12 sm:py-14 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-[#063925] text-white">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 text-left">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#D4AF37] font-['Inter'] block mb-2">
              ADMISSIONS & BATCH SCHEDULES
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white font-['Manrope'] tracking-tight mb-2">
              Interested in {course.title}?
            </h2>
            <p className="text-[14px] text-white/80 font-['Inter'] font-normal leading-relaxed">
              Connect directly with our admissions desk in Nagpur for syllabus details, upcoming batch schedules, and classroom seat availability.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#C5A059] text-[#063925] font-['Inter'] font-semibold uppercase tracking-wider text-xs rounded-[2px] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Enroll Now</span>
              <span className="font-bold">→</span>
            </button>
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-['Inter'] font-semibold uppercase tracking-wider text-xs rounded-[2px] transition-colors duration-200 text-center"
            >
              Contact Desk
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          WORKING ENROLLMENT MODAL (Supabase + WhatsApp guest fallback)
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#063925]/75 backdrop-blur-xs transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-[2px] p-6 sm:p-8 md:p-9 w-full max-w-lg border border-[#063925]/15 shadow-xl text-left">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#4A6356] hover:text-[#1A3326] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <span className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#063925] font-['Inter'] block mb-1">
                ADMISSION REGISTRATION
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#1A3326] font-['Manrope'] tracking-tight mb-1.5">
                Inquire for {course.title}
              </h3>
              <p className="text-[13px] text-[#4A6356] font-['Inter'] leading-relaxed">
                Submit your contact details below. Our admissions desk will contact you with batch schedules, fee structure, and offline training details in Nagpur.
              </p>
            </div>

            {enrollSuccess ? (
              <div className="text-center py-6 bg-[#FAF9F6] rounded-[2px] border border-[#063925]/15">
                <div className="w-9 h-9 bg-[#063925] text-white rounded-full flex items-center justify-center mx-auto mb-2.5">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-[#1A3326] font-['Manrope'] mb-1">Application Submitted</h4>
                <p className="text-xs text-[#4A6356] font-['Inter']">Our admissions team will review your application and contact you shortly.</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleCourseSubmit}>
                <div>
                  <label className="block text-[11px] font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-[#EA4335]">*</span>
                  </label>
                  <input
                    required
                    name="name"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    className="w-full min-h-[46px] px-3.5 py-2.5 rounded-[2px] border border-[#063925]/18 bg-[#FAF9F6] focus:bg-white focus:border-[#063925] outline-none text-xs sm:text-sm font-['Inter'] transition-colors duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-[#EA4335]">*</span>
                    </label>
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="rahul@example.com"
                      className="w-full min-h-[46px] px-3.5 py-2.5 rounded-[2px] border border-[#063925]/18 bg-[#FAF9F6] focus:bg-white focus:border-[#063925] outline-none text-xs sm:text-sm font-['Inter'] transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-[#EA4335]">*</span>
                    </label>
                    <input
                      required
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full min-h-[46px] px-3.5 py-2.5 rounded-[2px] border border-[#063925]/18 bg-[#FAF9F6] focus:bg-white focus:border-[#063925] outline-none text-xs sm:text-sm font-['Inter'] transition-colors duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1.5">
                    Message or Prior Experience (Optional)
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Mention if you prefer online or offline classroom batches in Nagpur..."
                    className="w-full p-3.5 rounded-[2px] border border-[#063925]/18 bg-[#FAF9F6] focus:bg-white focus:border-[#063925] outline-none text-xs sm:text-sm font-['Inter'] resize-none transition-colors duration-200 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isEnrolling}
                  className="w-full min-h-[46px] py-3 bg-[#063925] hover:bg-[#0B2117] text-white font-['Inter'] font-semibold uppercase tracking-wider text-xs rounded-[2px] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>{isEnrolling ? 'Submitting Application...' : 'Submit Enrollment Request'}</span>
                  {!isEnrolling && <span className="text-[#D4AF37] font-bold">→</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseDetailsPage;