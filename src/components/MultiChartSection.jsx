import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MultiChartSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loadedTabs, setLoadedTabs] = useState({ 0: true });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    setLoadedTabs(prev => ({ ...prev, [activeTab]: true }));
  }, [activeTab]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lazy load chart when entering viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Prevent floating WhatsApp button from covering chart controls while in this section
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
      { threshold: 0.02 }
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

  // Verified TradingView symbols from Git history for benchmark index charts without embed errors
  const charts = [
    {
      id: "nifty",
      name: "NIFTY 50",
      symbol: "BSE:NIFTYBEES",
      badge: "NSE Benchmark Index",
      liveUrl: "https://in.tradingview.com/chart/?symbol=NSE%3ANIFTY",
      src: "https://s.tradingview.com/embed-widget/advanced-chart/?locale=en&theme=light&symbol=BSE%3ANIFTYBEES&interval=D&timezone=Asia%2FKolkata&hide_top_toolbar=1&hide_legend=1&save_image=0&enable_publishing=0&backgroundColor=rgba(255,255,255,1)"
    },
    {
      id: "banknifty",
      name: "BANK NIFTY",
      symbol: "BSE:BANKBEES",
      badge: "NSE Banking Sector",
      liveUrl: "https://in.tradingview.com/chart/?symbol=NSE%3ABANKNIFTY",
      src: "https://s.tradingview.com/embed-widget/advanced-chart/?locale=en&theme=light&symbol=BSE%3ABANKBEES&interval=D&timezone=Asia%2FKolkata&hide_top_toolbar=1&hide_legend=1&save_image=0&enable_publishing=0&backgroundColor=rgba(255,255,255,1)"
    },
    {
      id: "sensex",
      name: "SENSEX",
      symbol: "BSE:SENSEX",
      badge: "BSE Benchmark Index",
      liveUrl: "https://in.tradingview.com/chart/?symbol=BSE%3ASENSEX",
      src: "https://s.tradingview.com/embed-widget/advanced-chart/?locale=en&theme=light&symbol=BSE%3ASENSEX&interval=D&timezone=Asia%2FKolkata&hide_top_toolbar=1&hide_legend=1&save_image=0&enable_publishing=0&backgroundColor=rgba(255,255,255,1)"
    },
    {
      id: "niftynxt50",
      name: "NIFTY NXT 50",
      symbol: "BSE:JUNIORBEES",
      badge: "NSE Growth Index",
      liveUrl: "https://in.tradingview.com/chart/?symbol=NSE%3ANIFTYNXT50",
      src: "https://s.tradingview.com/embed-widget/advanced-chart/?locale=en&theme=light&symbol=BSE%3AJUNIORBEES&interval=D&timezone=Asia%2FKolkata&hide_top_toolbar=1&hide_legend=1&save_image=0&enable_publishing=0&backgroundColor=rgba(255,255,255,1)"
    }
  ];

  const currentChart = charts[activeTab] || charts[0];

  // Three concise feature points for the editorial list
  const features = [
    {
      title: "Real-Time Price Structure",
      desc: "Live daily price candles across major Indian benchmark indices."
    },
    {
      title: "Key Level Identification",
      desc: "Clear support, resistance and market momentum zones."
    },
    {
      title: "Multi-Index Coverage",
      desc: "Instant switching between Nifty 50, Bank Nifty, Sensex & Nifty Next 50."
    }
  ];

  return (
    <section
      id="analysis"
      ref={sectionRef}
      className="pt-10 md:pt-14 lg:pt-16 pb-8 md:pb-10 lg:pb-12 relative bg-[#06261A] text-white border-b border-black/10 w-full px-4 md:px-8 lg:px-12 overflow-hidden"
    >
      <div className="container mx-auto px-1 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Column: Approx. 40% (lg:col-span-5) */}
          <div className="order-1 lg:col-span-5 flex flex-col justify-center">
            
            {/* Eyebrow: Gold line reveal + fade-in (400ms) */}
            <div className="flex items-center gap-2.5 mb-3.5">
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
                transition={{ duration: 0.4, delay: 0.08, ease: easeOut }}
                className="text-[12px] font-medium tracking-[0.16em] uppercase text-[#D4AF37]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                MARKET ANALYSIS
              </motion.span>
            </div>

            {/* Heading: Smooth fade-up 16px (600ms) */}
            <motion.h2
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 10 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.35 : 0.6, delay: 0.1, ease: easeOut }}
              className="text-[28px] sm:text-[34px] lg:text-[40px] xl:text-[44px] font-semibold text-white leading-[1.18] tracking-tight mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Understand the Market. <br className="hidden sm:inline" />
              <span className="text-[#D4AF37]">Analyze with Clarity.</span>
            </motion.h2>

            {/* Description: Soft fade-in (450ms) */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={vp}
              transition={{ duration: isMobile ? 0.35 : 0.45, delay: 0.24, ease: easeOut }}
              className="text-[15px] lg:text-[16px] text-white/75 font-normal leading-[1.65] max-w-xl mb-6 lg:mb-8"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Explore market charts and technical analysis tools to better understand price movements, trends and trading concepts.
            </motion.p>

            {/* Editorial Features List - Three feature points staggered fade-up (400ms each, 80ms apart) */}
            <div className="space-y-3.5 mb-8 pb-8 border-b border-white/10">
              {features.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 8 : 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={vp}
                  transition={{
                    duration: isMobile ? 0.35 : 0.4,
                    delay: (isMobile ? 0.24 : 0.32) + idx * 0.08,
                    ease: easeOut
                  }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span
                      className="text-[14px] sm:text-[14.5px] font-medium text-white tracking-tight shrink-0"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.title}:
                    </span>
                    <span
                      className="text-[13px] text-white/60 font-normal leading-relaxed"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.desc}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA linking to /analysis - Gentle fade-in (400ms) with 3px arrow hover */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={vp}
              transition={{ duration: 0.4, delay: 0.58, ease: easeOut }}
            >
              <Link
                to="/analysis"
                className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wider uppercase text-[#D4AF37] hover:text-white transition-colors group"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span>Explore Full Analysis Desk</span>
                <svg
                  className="w-4 h-4 transition-transform duration-[200ms] ease-out group-hover:translate-x-[3px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>

          </div>

          {/* Right Column: Approx. 60% (lg:col-span-7) Live Interactive Interface */}
          {/* Subtle fade-in + 12px movement (650ms, almost together with heading) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 8 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: isMobile ? 0.4 : 0.65, delay: 0.12, ease: easeOut }}
            className="order-2 lg:col-span-7 w-full overflow-hidden"
          >
            <div className="bg-[#03150E] rounded-[6px] border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex flex-col w-full">
              
              {/* Terminal Header & Navigation Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 bg-[#020D08] px-3 py-2.5 gap-2.5">
                
                {/* Index Switcher Tabs (Horizontally scrollable on mobile, no page overflow) */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {charts.map((chart, idx) => {
                    const isActive = activeTab === idx;
                    return (
                      <button
                        key={chart.id}
                        type="button"
                        onClick={() => setActiveTab(idx)}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-[3px] text-[11px] sm:text-[12px] font-medium tracking-wide transition-all duration-[200ms] ease-out shrink-0 cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-[#06261A] text-[#D4AF37] border border-[#D4AF37]/35 shadow-sm'
                            : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {chart.name}
                      </button>
                    );
                  })}
                </div>

                {/* Status Indicator & Live 1-Min Link with 3px hover arrow */}
                <div className="flex items-center justify-between sm:justify-end gap-3 text-[11px] text-white/60 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] opacity-90" />
                    <span className="font-medium text-white/80">NSE &amp; BSE Feed</span>
                  </div>
                  <span className="text-white/20 select-none">|</span>
                  <a
                    href={currentChart.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-1 text-[#D4AF37] hover:text-white transition-colors font-medium whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <span>Open 1-Min Chart</span>
                    <svg className="w-3 h-3 transition-transform duration-[200ms] ease-out group-hover/link:translate-x-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

              </div>

              {/* Chart Title Strip */}
              <div className="bg-[#041B12] px-3.5 py-2 border-b border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white tracking-wide" style={{ fontFamily: "'Manrope', sans-serif" }}>
                    {currentChart.name}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-[11px] text-[#D4AF37] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {currentChart.badge}
                  </span>
                </div>
                <div className="text-[11px] text-white/50 hidden sm:block" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Daily Candles • Asia/Kolkata
                </div>
              </div>

              {/* Chart Frame: Responsive height for desktop, laptop and mobile */}
              <div className="relative w-full h-[350px] sm:h-[390px] md:h-[420px] lg:h-[440px] xl:h-[460px] bg-white">
                {isVisible ? (
                  charts.map((chart, idx) => {
                    const isTabActive = activeTab === idx;
                    if (!loadedTabs[idx] && !isTabActive) return null;
                    return (
                      <div
                        key={chart.id}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-150 ${
                          isTabActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                      >
                        <iframe
                          className="w-full h-full border-0 bg-white"
                          scrolling="no"
                          title={chart.name}
                          src={chart.src}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#06261A] text-white/50 text-xs gap-3">
                    <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                    <span>Loading market data...</span>
                  </div>
                )}
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MultiChartSection;