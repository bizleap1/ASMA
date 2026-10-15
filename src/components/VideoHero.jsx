import React from 'react';
import { Link } from 'react-router-dom';

const VideoHero = () => {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Respect prefers-reduced-motion with static poster fallback
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionQuery.matches && videoRef.current) {
        videoRef.current.pause();
      }
      const handleMotionChange = (e) => {
        if (e.matches && videoRef.current) {
          videoRef.current.pause();
        } else if (!e.matches && videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      };
      motionQuery.addEventListener('change', handleMotionChange);

      const params = new URLSearchParams(window.location.search);
      const seek = params.get('seek');
      if (seek) {
        const time = parseFloat(seek);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = time;
        }
      }

      return () => {
        motionQuery.removeEventListener('change', handleMotionChange);
      };
    }
  }, []);

  return (
    <section id="home" className="min-h-[100svh] h-[100svh] relative overflow-hidden flex flex-col justify-start md:justify-center pt-[112px] sm:pt-24 md:pt-44 lg:pt-48 pb-8 sm:pb-16 bg-[#030906]">
      {/* Unified Hero Video with Instant Poster & Responsive Framing (1 Resource Request) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex flex-col justify-end md:block">
        <div className="relative w-full h-[52%] min-[390px]:h-[56%] min-h-[300px] min-[390px]:min-h-[380px] md:static md:w-full md:h-full md:min-h-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/hero_poster.webp"
            className="w-full h-[106%] min-[390px]:h-[112%] object-cover object-[80%_center] -translate-y-[10px] min-[390px]:-translate-y-[28px] md:absolute md:inset-0 md:w-full md:h-full md:object-cover md:object-center md:translate-y-0"
          >
            <source src="/hero_bg_optimized.mp4" type="video/mp4" />
          </video>
          {/* Top smooth blend into dark hero background (mobile only) */}
          <div className="md:hidden absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#030906] via-[#030906]/60 to-transparent pointer-events-none" />
          {/* Left subtle edge blend (mobile only) */}
          <div className="md:hidden absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#030906] to-transparent pointer-events-none" />
          {/* Right subtle edge blend (mobile only) */}
          <div className="md:hidden absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-[#030906]/40 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Localized Dark Gradient Behind Upper Text Area on Mobile */}
      <div
        className="md:hidden absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-[#030906] via-[#030906]/95 to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Hero Text Content & Functional CTAs */}
      <div className="relative z-20 w-full px-6 md:px-8 lg:px-12">
        <div className="container mx-auto px-0">
          <div className="flex flex-col items-start text-left max-w-3xl space-y-4 sm:space-y-5 md:space-y-6 mt-0 sm:mt-6 md:mt-8">
            <h1
              style={{ fontFamily: "'Manrope', sans-serif" }}
              className="hero-anim-h1 text-[32px] min-[375px]:text-[34px] min-[390px]:text-[36px] sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-semibold tracking-tight leading-[1.12] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] motion-reduce:animate-none"
            >
              Advait Stock <br /> Market Academy
              <span className="sr-only"> – Stock Market Classes in Nagpur</span>
            </h1>

            {/* Subtitle with Refined Muted Golden Accent Line */}
            <div className="flex items-stretch gap-[18px] md:gap-[20px] max-w-[550px]">
              <span className="hero-anim-line w-[2px] bg-[#C5A059] shrink-0 rounded-full motion-reduce:animate-none" aria-hidden="true"></span>
              <p
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="hero-anim-subtitle text-[16px] md:text-[20px] text-white/90 font-normal leading-[1.5] tracking-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] motion-reduce:animate-none"
              >
                Empowering your financial future with expert stock market training.
              </p>
            </div>

            {/* Two Functional CTAs - Staggered entrance on desktop & mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 pt-2 sm:pt-4 w-full sm:w-auto">
              <Link
                to="/courses"
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="hero-anim-cta-primary group h-[50px] w-full sm:w-auto px-6 rounded-[4px] bg-[#D4AF37] hover:bg-[#c29d2b] text-[#0B2117] font-semibold text-[16px] tracking-normal inline-flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm hover:shadow-[0_4px_12px_rgba(212,175,55,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] text-center select-none motion-reduce:animate-none"
              >
                <span>Explore Courses</span>
                <svg className="w-4 h-4 text-[#0B2117] transition-transform duration-200 ease-out group-hover:translate-x-[2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <a
                href="tel:09156953895"
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="hero-anim-cta-secondary group h-[50px] w-full sm:w-auto px-6 rounded-[4px] bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/35 backdrop-blur-sm font-semibold text-[16px] tracking-normal inline-flex items-center justify-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] text-center select-none motion-reduce:animate-none"
              >
                <svg className="w-4 h-4 text-[#D4AF37] transition-transform duration-200 ease-out group-hover:translate-x-[2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Inquire Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoHero;