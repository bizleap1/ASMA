import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedSection from './AnimatedSection';

const FeaturedCoursesSection = () => {
  const displayCourses = [
    {
      id: "advanced-foundation",
      title: "Advanced Foundation",
      desc: "A complete beginner-to-intermediate program to help you understand markets, build core skills and develop the right trading mindset.",
      image: "/e80ee201-5e4e-4806-b5bc-9434216dc4d4.png",
      webpImage: "/e80ee201-5e4e-4806-b5bc-9434216dc4d4.webp",
      rating: "4.9",
      badge: "Foundation Level",
      duration: "2 Months"
    },
    {
      id: "professional-master-program",
      title: "Professional Master Program",
      desc: "An advanced program for serious learners who want to master trading strategies, analyze markets deeply and trade with confidence.",
      image: "/prof.master program.png",
      webpImage: "/prof.master program.webp",
      rating: "5.0",
      badge: "Mastery Level",
      duration: "4 Months"
    }
  ];

  return (
    <AnimatedSection id="featured-courses" className="py-16 md:py-24 bg-[#faf9f6]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1300px]">
        
        {/* Header Area */}
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <h4 className="text-[#b59a56] uppercase font-bold tracking-widest text-xs md:text-sm">
            OUR COURSES
          </h4>
          <h2 className="text-3xl md:text-5xl font-black text-[#1a2e22] leading-tight font-display">
            Pick A <span className="text-[#b59a56]">Course</span> To Get Started
          </h2>
          <div className="w-24 h-1 bg-[#166534] mt-2"></div>
        </div>

        {/* Courses Grid Container */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          
          {displayCourses.map((course, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="bg-white rounded-[24px] p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#166534]/5 flex flex-col group gap-8"
            >
              {/* Image Box */}
              <div className="relative w-full rounded-[16px] overflow-hidden shadow-sm border border-black/5 bg-[#f8f9fa]">
                <picture>
                  <source srcSet={course.webpImage} type="image/webp" />
                  <img
                    src={course.image}
                    alt={course.title}
                    width="600"
                    height="600"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </picture>
              </div>

              {/* Text Content */}
              <div className="flex-grow flex flex-col">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center gap-1 bg-[#166534] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    {course.rating}
                  </span>
                  <span className="bg-[#166534]/10 text-[#166534] px-3 py-1 rounded-full text-[10px] font-bold border border-[#166534]/20 tracking-wider">
                    {course.badge}
                  </span>
                  <span className="bg-[#b59a56]/10 text-[#b59a56] px-3 py-1 rounded-full text-[10px] font-bold border border-[#b59a56]/20 tracking-wider">
                    {course.duration}
                  </span>
                </div>

                <h3 className="text-2xl lg:text-3xl font-display font-black text-[#1a2e22] mb-3">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-8">
                  {course.desc}
                </p>
                
                {/* Bottom Action Row */}
                <div className="mt-auto pt-5 border-t border-gray-100 flex justify-start items-center">
                  <Link 
                    to={`/course/${course.id}`}
                    className="bg-[#166534] hover:bg-[#0f4523] text-white text-xs font-bold px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg uppercase tracking-widest flex items-center gap-2"
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          
        </div>

      </div>
    </AnimatedSection>
  );
};

export default FeaturedCoursesSection;
