import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeaturedCoursesSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const easeOut = [0.16, 1, 0.3, 1];
  const vp = { once: true, amount: 0.15 };

  const displayCourses = [
    {
      id: "advanced-foundation",
      programNumber: "01",
      title: "Advanced Foundation Program",
      desc: "Master equity mechanics, candlestick patterns, price action, and disciplined risk management.",
      image: "/e80ee201-5e4e-4806-b5bc-9434216dc4d4.webp",
      fallbackImage: "/e80ee201-5e4e-4806-b5bc-9434216dc4d4.png",
      rating: "4.9",
      level: "Foundation Level",
      duration: "2 Months",
      link: "/course/advanced-foundation"
    },
    {
      id: "professional-master-program",
      programNumber: "02",
      title: "Professional Master Program",
      desc: "Advanced mastery in futures, options trading, institutional order flows, and live market execution.",
      image: "/prof.master program.webp",
      fallbackImage: "/prof.master program.png",
      rating: "5.0",
      level: "Mastery Level",
      duration: "4 Months",
      link: "/course/professional-master-program"
    }
  ];

  return (
    <section id="featured-courses" className="pt-12 md:pt-16 lg:pt-18 pb-6 md:pb-8 lg:pb-9 bg-[#FAF9F5] relative border-b border-black/5 w-full px-4 md:px-8 lg:px-12">
      <div className="container mx-auto px-1 md:px-0">
        
        {/* Header Block - Aligned with Navbar container */}
        <div className="mb-8 sm:mb-10 lg:mb-[44px]">
          <div className="max-w-3xl">
            {/* Clean Eyebrow with Subtle Gold Line Reveal + Text Fade-in (400ms) */}
            <div className="flex items-center gap-2.5 mb-3">
              <motion.span
                initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={vp}
                transition={{ duration: 0.4, ease: easeOut }}
                className="w-[22px] h-[1.5px] bg-[#D4AF37] shrink-0 origin-left"
              />
              <motion.span
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={vp}
                transition={{ duration: 0.4, delay: 0.1, ease: easeOut }}
                className="text-[12px] font-medium tracking-[0.16em] uppercase text-[#063925]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                OUR PROGRAMS
              </motion.span>
            </div>

            {/* Approved SEO & Brand Heading (Fade-up 16px, 600ms) */}
            <motion.h2
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 10 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.4 : 0.6, delay: 0.1, ease: easeOut }}
              className="text-[30px] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[50px] font-semibold text-[#1A3326] leading-[1.16] tracking-tight mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Stock Market Courses Built for <span className="text-[#D4AF37]">Practical Learning.</span>
            </motion.h2>

            {/* Description (Fade-up 10px, 450ms) */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.35 : 0.45, delay: 0.2, ease: easeOut }}
              className="text-[15px] lg:text-[16px] text-[#4A6356] font-normal leading-[1.6] max-w-[680px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Explore stock market courses at ASMA in Nagpur, designed to help you understand trading concepts, technical analysis and risk management through practical learning.
            </motion.p>
          </div>
        </div>

        {/* Alternating Editorial Course Showcase */}
        <div className="space-y-6 lg:space-y-7">
          {displayCourses.map((course, idx) => {
            const isEven = idx % 2 === 1; // Course 2: Content Left, Image Right

            // Course 01: Image x:-20, Content x:16 | Course 02: Image x:20, Content x:-16 | Mobile: y:10
            const imgInitial = shouldReduceMotion
              ? { opacity: 1, x: 0, y: 0 }
              : isMobile
              ? { opacity: 0, y: 10 }
              : { opacity: 0, x: idx === 0 ? -20 : 20 };

            const contentInitial = shouldReduceMotion
              ? { opacity: 1, x: 0, y: 0 }
              : isMobile
              ? { opacity: 0, y: 10 }
              : { opacity: 0, x: idx === 0 ? 16 : -16 };

            return (
              <div key={course.id}>
                <Link
                  to={course.link}
                  className="bg-white rounded-[5px] border border-black/10 overflow-hidden block transition-colors duration-[250ms] hover:border-[#063925]/35 group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch lg:h-[430px] xl:h-[440px]">
                    {/* Visual Asset (Course 01: -20px->0, 650ms | Course 02: 20px->0, 650ms) */}
                    <motion.div
                      initial={imgInitial}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={vp}
                      transition={{ duration: isMobile ? 0.4 : 0.65, ease: easeOut }}
                      className={`relative w-full overflow-hidden bg-[#F8F9FA] flex items-center justify-center ${
                        isEven
                          ? 'order-1 lg:order-2 lg:col-span-5 lg:h-full lg:border-l border-b lg:border-b-0 border-black/5'
                          : 'order-1 lg:order-1 lg:col-span-5 lg:h-full lg:border-r border-b lg:border-b-0 border-black/5'
                      }`}
                    >
                      <div className="w-full h-full aspect-square lg:aspect-auto max-w-[380px] sm:max-w-[420px] lg:max-w-none mx-auto flex items-center justify-center overflow-hidden">
                        <picture className="w-full h-full flex items-center justify-center">
                          <source srcSet={course.image} type="image/webp" />
                          <img
                            src={course.fallbackImage}
                            alt={course.title}
                            width="560"
                            height="560"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain lg:object-cover object-center transition-transform duration-[250ms] ease-out group-hover:scale-[1.02]"
                          />
                        </picture>
                      </div>
                    </motion.div>

                    {/* Content Block (Course 01: 16px->0, 600ms | Course 02: -16px->0, 600ms) */}
                    <motion.div
                      initial={contentInitial}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={vp}
                      transition={{ duration: isMobile ? 0.4 : 0.6, delay: isMobile ? 0.08 : 0.05, ease: easeOut }}
                      className={`p-6 sm:p-7 lg:p-8 xl:p-10 flex flex-col justify-center ${
                        isEven
                          ? 'order-2 lg:order-1 lg:col-span-7'
                          : 'order-2 lg:order-2 lg:col-span-7'
                      }`}
                    >
                      {/* Program Label */}
                      <div
                        className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#D4AF37] mb-2"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        ASMA PROGRAM {course.programNumber}
                      </div>

                      {/* Course Title: Manrope 600 */}
                      <h3
                        className="text-[22px] sm:text-[24px] lg:text-[26px] font-semibold text-[#1A3326] leading-snug tracking-tight mb-2.5 group-hover:text-[#063925] transition-colors duration-[250ms]"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                      >
                        {course.title}
                      </h3>

                      {/* Description: Inter 400, max 2 lines */}
                      <p
                        className="text-[14px] sm:text-[14.5px] lg:text-[15px] text-[#4A6356] font-normal leading-[1.6] line-clamp-2 mb-4 max-w-xl"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {course.desc}
                      </p>

                      {/* Clean Editorial Metadata Row: Subtle Fade-in after content */}
                      <motion.div
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={vp}
                        transition={{ duration: 0.4, delay: isMobile ? 0.15 : 0.25, ease: easeOut }}
                        className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[14px] sm:text-[14.5px] font-medium text-[#2C4A3B] mb-5 sm:mb-6"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {/* Rating with Gold Star */}
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[#D4AF37] fill-current shrink-0" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{course.rating}</span>
                        </span>

                        <span className="text-black/20 select-none">|</span>

                        {/* Level */}
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[#4A6356]/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>{course.level}</span>
                        </span>

                        <span className="text-black/20 select-none">|</span>

                        {/* Duration */}
                        <span className="inline-flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[#4A6356]/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{course.duration}</span>
                        </span>
                      </motion.div>

                      {/* Aligned Explore Course CTA: Subtle Fade-in after content */}
                      <motion.div
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={vp}
                        transition={{ duration: 0.4, delay: isMobile ? 0.2 : 0.35, ease: easeOut }}
                      >
                        <span
                          className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wider uppercase text-[#063925] group-hover:text-[#D4AF37] transition-colors duration-[250ms]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          <span>Explore Course</span>
                          <svg
                            className="w-4 h-4 transition-transform duration-[250ms] ease-out group-hover:translate-x-[3px]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </motion.div>
                    </motion.div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Global Link */}
        <div className="mt-8 lg:mt-9 text-center">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#063925] hover:text-[#D4AF37] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span>View All Courses</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedCoursesSection;
