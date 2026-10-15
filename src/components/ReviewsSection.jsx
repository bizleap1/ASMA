import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import shubhangiImg from '../assets/shubhangi.png';
import krishnaImg from '../assets/krishna.png';
import vrushaliImg from '../assets/vrushali.png';

const reviews = [
  {
    text: "Advait Stock Market Academy is passionate about the share market. Mr. Satish Sir has vast knowledge and teaches directly in the live market, which helps understand concepts faster. Sir personally guides each student.",
    name: "Shubhangi Jampal",
    image: shubhangiImg,
    rating: 5,
    date: "3 weeks ago",
    batch: "Advanced Classroom Batch"
  },
  {
    text: "I had a great experience at Advait Stock Market Academy. The share market training was practical and easy to understand. A complete one-stop solution for mastering technical analysis and securing your financial future.",
    name: "Krishna Murlidhar",
    image: krishnaImg,
    rating: 5,
    date: "1 month ago",
    batch: "Professional Master Program"
  },
  {
    text: "Advait Stock Market Academy is the perfect place to learn trading and investing in Nagpur. The trainers explain everything clearly, especially chart patterns and risk control. Highly recommended for everyone in Nagpur!",
    name: "Vrushali Babhale",
    image: vrushaliImg,
    rating: 5,
    date: "2 months ago",
    batch: "Foundation Program"
  }
];

const StarRating = ({ rating = 5 }) => (
  <div className="flex gap-1 text-[#D4AF37]" aria-label={`${rating} out of 5 stars`}>
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'fill-gray-200'}`} viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ReviewsSection = () => {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Prevent floating WhatsApp button from covering review content
  useEffect(() => {
    const whatsappBtn = document.getElementById('whatsapp-floating-btn');
    if (!whatsappBtn || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          whatsappBtn.style.opacity = '0';
          whatsappBtn.style.visibility = 'hidden';
          whatsappBtn.style.pointerEvents = 'none';
        } else {
          whatsappBtn.style.opacity = '1';
          whatsappBtn.style.visibility = 'visible';
          whatsappBtn.style.pointerEvents = 'auto';
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      if (whatsappBtn) {
        whatsappBtn.style.opacity = '1';
        whatsappBtn.style.visibility = 'visible';
        whatsappBtn.style.pointerEvents = 'auto';
      }
    };
  }, []);

  const easeOut = [0.16, 1, 0.3, 1];
  const vp = { once: true, amount: 0.15 };

  // Quadruple reviews for seamless infinite scrolling loop (-50% transform)
  const infiniteReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  return (
    <section 
      ref={sectionRef}
      id="reviews" 
      className="pt-10 sm:pt-12 md:pt-14 pb-3 sm:pb-4 lg:pb-5 bg-[#FAF9F5] border-b border-black/5 relative w-full overflow-hidden"
    >
      {/* Header Container */}
      <div className="container mx-auto px-5 sm:px-6 md:px-8 lg:px-12 max-w-7xl relative z-10 mb-8 sm:mb-10 lg:mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5 sm:gap-6">
          <div className="max-w-2xl text-left">
            {/* Eyebrow: STUDENT EXPERIENCES with subtle gold line */}
            <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
              <motion.span
                initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={vp}
                transition={{ duration: 0.4, ease: easeOut }}
                className="w-[22px] h-[1.5px] bg-[#D4AF37] shrink-0 origin-left"
              />
              <span 
                className="text-[11.5px] sm:text-[12px] font-medium tracking-[0.16em] uppercase text-[#063925]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                STUDENT EXPERIENCES
              </span>
            </div>

            {/* Main Heading: Left-aligned with subtle gold accent, smooth fade-up 12px, 550ms */}
            <motion.h2 
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.55, delay: 0.08, ease: easeOut }}
              className="text-[28px] sm:text-[34px] lg:text-[38px] xl:text-[40px] font-semibold text-[#1A3326] leading-[1.18] tracking-tight text-left"
              style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
            >
              Learning That Speaks <span className="text-[#D4AF37]">for Itself.</span>
            </motion.h2>

            {/* Verified Google Rating Display: gentle fade-in, 450ms */}
            <motion.div 
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={vp}
              transition={{ duration: 0.45, delay: 0.16, ease: easeOut }}
              className="flex items-center gap-3 mt-3 sm:mt-4"
            >
              <span className="text-xl sm:text-2xl font-semibold text-[#1A3326]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                5.0
              </span>
              <div className="flex flex-col">
                <StarRating rating={5} />
                <span 
                  className="text-[11px] font-medium text-[#4A6356] tracking-wider uppercase mt-0.5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Based on Verified Google Reviews
                </span>
              </div>
            </motion.div>
          </div>

          {/* Action: Write a Review with Google Logo, subtle fade-in */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={vp}
            transition={{ duration: 0.45, delay: 0.2, ease: easeOut }}
            className="self-start lg:self-end shrink-0"
          >
            <a
              href="https://www.google.com/search?sca_esv=6c41df8803dda356&rlz=1C1VDKB_enIN1135IN1135&sxsrf=ANbL-n4aznE4jH6uYxK6vCGuZ88KOD6uvQ:1781007623389&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOYHEMA5pfD6YKL4hg_LxYX2PZ2tGeZCIa4KyvdKWjZp9MQt2HI6-HzPhcL9PJmQcht8AIdiD4xjF3YhV-UyQa0857WJMdXn129T9f3LzBFnbMfwTZcGzK2iESk4XbciKSPMCFrpgiL_nwb0DSiPKvSSp47qLxGXb0kbWVmh5jq7yp12g8Q%3D%3D&q=Advait+Share+Market+Academy+%7C+Stock+Market+Trading+Training+Institute+Reviews&sa=X&ved=2ahUKEwjNz--1kvqUAxXGzzgGHdTfLe0Q0bkNegQIORAH&biw=1280&bih=585&dpr=1.5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 bg-white border border-black/10 hover:border-[#063925]/30 text-[#1A3326] hover:text-[#063925] text-xs font-semibold uppercase tracking-wider rounded-[4px] transition-all shadow-sm whitespace-nowrap group"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <svg viewBox="0 0 48 48" className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 group-hover:scale-110 transition-transform">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>Write a Review</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Simultaneously Scrolling Testimonials (Infinite Seamless Marquee) */}
      <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_32px,_black_calc(100%-32px),transparent_100%)] sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_80px,_black_calc(100%-80px),transparent_100%)] pt-2 pb-3.5">
        <div 
          className="flex w-max animate-marquee gap-4 sm:gap-5 lg:gap-6 hover:[animation-play-state:paused]"
          style={{ animationDuration: '36s' }}
        >
          {infiniteReviews.map((review, i) => (
            <div
              key={`${review.name}-${i}`}
              className="w-[86vw] sm:w-[380px] md:w-[420px] lg:w-[460px] shrink-0 bg-white rounded-[6px] border border-black/8 p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-[#063925]/20 text-left transition-all duration-300 ease-out cursor-pointer group"
            >
              <div>
                {/* Header: Student Info + Google Logo */}
                <div className="flex items-center justify-between mb-3.5 gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.image}
                      alt={review.name}
                      loading="lazy"
                      className="w-11 h-11 rounded-full object-cover border border-black/10 shrink-0"
                    />
                    <div>
                      <h3 
                        className="font-semibold text-[15px] sm:text-[16px] text-[#1A3326] leading-snug group-hover:text-[#063925] transition-colors"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                      >
                        {review.name}
                      </h3>
                      <div 
                        className="text-[11.5px] text-[#4A6356] font-normal"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {review.date}
                      </div>
                    </div>
                  </div>

                  {/* Google Logo on Each Card */}
                  <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0 opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </div>

                {/* Stars */}
                <div className="mb-3.5">
                  <StarRating rating={review.rating} />
                </div>

                {/* Review Body */}
                <p 
                  className="text-[13.5px] sm:text-[14px] text-[#2C4A3B] font-normal leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  "{review.text}"
                </p>
              </div>

              {/* Footer Tag */}
              <div className="pt-3 border-t border-black/5 flex items-center justify-between mt-auto gap-2">
                <span 
                  className="text-[10.5px] font-semibold uppercase tracking-wider text-[#063925]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {review.batch}
                </span>
                <span 
                  className="text-[10.5px] font-medium text-[#1A3326]/75 flex items-center gap-1 shrink-0"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <svg className="w-3.5 h-3.5 text-[#063925] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Student
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;