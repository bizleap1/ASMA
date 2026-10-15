import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { serviceData } from '../data';
import SEO from '../components/SEO';

const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const service = serviceData.find((s) => s.id === serviceId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const easeOut = [0.16, 1, 0.3, 1];

  const handleServiceSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const text = `Hi Advait Academy! I have an enquiry regarding ${service?.title || 'your services'}.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`;
    window.open(`https://wa.me/919156953895?text=${encodeURIComponent(text)}`, '_blank');
    setIsFormOpen(false);
  };

  if (!service) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen pt-44 pb-28 text-center px-4">
        <SEO title="Service Not Found | ASMA" noindex={true} path={`/service/${serviceId || ''}`} />
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-['Manrope'] font-semibold text-[#1A3326] mb-3">
            Service Offering Not Found
          </h1>
          <p className="text-sm font-['Inter'] text-[#4A6356] mb-6">
            The requested service may have been updated or moved.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#063925] text-white text-xs font-['Inter'] font-semibold uppercase tracking-wider rounded-[4px] hover:bg-[#0B2117] transition-colors"
          >
            ← View All Services
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic category-based copy for final CTA
  const getCtaSubtext = () => {
    if (service.category === 'Training') {
      return 'Connect with our faculty at ASMA Nagpur to discuss curriculum details, batch timings, and practical live trading sessions.';
    }
    if (service.category === 'Investment') {
      return 'Speak with our research desk in Nagpur to understand tailored strategies, asset allocation, and advisory processes.';
    }
    if (service.category === 'Insurance') {
      return 'Consult with our policy desk in Nagpur to evaluate coverage options, claims assistance, and customized protection plans.';
    }
    return 'Connect directly with our advisory desk at ASMA Nagpur for complete guidance and consultation.';
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.desc || service.fullDesc,
    serviceType: service.category,
    provider: {
      '@type': 'FinancialService',
      name: 'Advait Stock Market Academy',
      telephone: '+91-9156953895',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nagpur',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
    },
    areaServed: 'Nagpur, Maharashtra, India',
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <SEO
        title={`${service.title} in Nagpur | ASMA`}
        description={service.desc || service.fullDesc}
        path={`/service/${service.id}`}
        image={service.image}
        schema={serviceSchema}
      />

      {/* 1. HERO SECTION (55% Content Left, 45% Image Right) */}
      <section className="relative pt-[144px] sm:pt-[160px] lg:pt-[186px] pb-10 sm:pb-12 lg:pb-16 bg-[#FAF9F6] border-b border-[#0B2117]/10 w-full px-4 md:px-8 lg:px-12">
        <div className="container mx-auto px-1 md:px-0 w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left 55%: Eyebrow, H1, Description, Enquiry CTA */}
            <div className="lg:col-span-7 xl:col-span-7 text-left">
              {/* Category Eyebrow with gold line */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: easeOut }}
                className="flex items-center gap-2.5 mb-3 sm:mb-3.5"
              >
                <motion.span
                  initial={shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: easeOut }}
                  className="w-5 h-[1.5px] bg-[#D4AF37] origin-left shrink-0"
                />
                <span
                  className="text-[11.5px] sm:text-[12px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {service.category.toUpperCase()} SERVICE
                </span>
              </motion.div>

              {/* Dynamic H1 */}
              <motion.h1
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 8 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: isMobile ? 0.38 : 0.55, ease: easeOut }}
                className="text-[30px] sm:text-[34px] md:text-[40px] lg:text-[46px] font-semibold text-[#1A3326] tracking-tight leading-[1.15] mb-4 sm:mb-5"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {service.title}
              </motion.h1>

              {/* Concise Description */}
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 6 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: isMobile ? 0.38 : 0.55, delay: 0.08, ease: easeOut }}
                className="text-[14.5px] sm:text-[15.5px] text-[#4A6356] leading-relaxed mb-6 sm:mb-7 max-w-xl"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {service.desc}
              </motion.p>

              {/* Enquiry CTA Button */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: isMobile ? 6 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: isMobile ? 0.35 : 0.45, delay: 0.14, ease: easeOut }}
                className="flex flex-wrap items-center gap-3.5"
              >
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 bg-[#063925] hover:bg-[#0B2117] text-white font-['Inter'] font-semibold text-[13px] tracking-wider uppercase rounded-[4px] shadow-sm transition-colors duration-200 cursor-pointer min-h-[46px]"
                >
                  <span>Enquire About This Service</span>
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </motion.div>
            </div>

            {/* Right 45%: Original Image */}
            <div className="lg:col-span-5 xl:col-span-5 w-full">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: easeOut }}
                className="w-full relative"
              >
                <div className="relative overflow-hidden rounded-[6px] border border-[#0B2117]/10 shadow-[0_4px_20px_rgba(11,33,23,0.06)] bg-[#EDEBE6] aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] max-h-[340px]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICE OVERVIEW SECTION */}
      <section className="py-12 sm:py-14 lg:py-16 bg-[#FFFFFF] border-b border-[#0B2117]/10 w-full px-4 md:px-8 lg:px-12">
        <div className="container mx-auto px-1 md:px-0 w-full max-w-7xl">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-4 h-[1.5px] bg-[#D4AF37]" />
              <span
                className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                SERVICE OVERVIEW
              </span>
            </div>

            <h2
              className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-[#1A3326] tracking-tight leading-snug mb-5"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Detailed Scope & Information
            </h2>

            <div className="text-[#2D4538] text-[15px] sm:text-[16px] font-['Inter'] font-normal leading-[1.8] space-y-4">
              <p>{service.fullDesc}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. KEY BENEFITS SECTION */}
      <section className="py-12 sm:py-14 lg:py-16 bg-[#FAF9F6] border-b border-[#0B2117]/10 w-full px-4 md:px-8 lg:px-12">
        <div className="container mx-auto px-1 md:px-0 w-full max-w-7xl">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: easeOut }}
          >
            <div className="mb-8 sm:mb-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-4 h-[1.5px] bg-[#D4AF37]" />
                <span
                  className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  VERIFIED DELIVERABLES
                </span>
              </div>

              <h2
                className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-[#1A3326] tracking-tight leading-snug"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Key Benefits
              </h2>
            </div>

            {/* Minimal Editorial List / 2-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-5xl">
              {service.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[4px] p-5 sm:p-6 border border-[#0B2117]/10 flex items-start gap-4 transition-colors duration-200 hover:border-[#D4AF37]/50"
                >
                  <span
                    className="text-[13px] sm:text-[14px] font-semibold text-[#D4AF37] tracking-wider shrink-0 mt-0.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    0{idx + 1}
                  </span>
                  <div className="border-l border-[#0B2117]/10 pl-4">
                    <p
                      className="text-[15px] sm:text-[16px] font-semibold text-[#1A3326] leading-snug"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      {benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. FINAL CTA SECTION (Compact Dark Forest Green Strip) */}
      <section className="py-12 sm:py-14 md:py-16 bg-[#06261A] text-white w-full px-4 md:px-8 lg:px-12 border-t border-[#0B2117]/20">
        <div className="container mx-auto px-1 md:px-0 w-full max-w-7xl">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10"
          >
            {/* Service-Specific Heading & Subtext */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-4 h-[1.5px] bg-[#D4AF37]" />
                <span
                  className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#D4AF37]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  DIRECT ENQUIRY & ADVISORY
                </span>
              </div>

              <h2
                className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-white tracking-tight leading-tight mb-3"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Have Questions About {service.title}?
              </h2>

              <p
                className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {getCtaSubtext()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 shrink-0">
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 bg-[#D4AF37] hover:bg-[#C5A059] text-[#06261A] font-['Inter'] font-semibold text-xs tracking-wider uppercase rounded-[4px] shadow-sm transition-colors duration-200 cursor-pointer min-h-[46px]"
              >
                <span>Enquire on WhatsApp</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <a
                href="tel:+919156953895"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/20 hover:border-[#D4AF37] text-white/90 hover:text-white font-['Inter'] font-semibold text-xs tracking-wider uppercase rounded-[4px] transition-colors duration-200 min-h-[46px]"
              >
                <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+91 91569 53895</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. INQUIRY MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0B2117]/70 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          />
          <div className="relative bg-white rounded-[6px] p-6 sm:p-8 md:p-10 w-full max-w-lg shadow-2xl border border-[#0B2117]/10 z-10">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-5 right-5 text-[#4A6356] hover:text-[#1A3326] transition-colors p-1"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-3.5 h-[1.5px] bg-[#D4AF37]" />
                <span className="text-[#063925] font-['Inter'] font-semibold text-[11px] tracking-wider uppercase block">
                  SERVICE ENQUIRY
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-['Manrope'] font-semibold text-[#1A3326]">
                Enquire About {service.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#4A6356] font-['Inter'] mt-1.5 leading-relaxed">
                Submit your contact details and our team in Nagpur will connect directly on WhatsApp.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleServiceSubmit}>
              <div>
                <label className="block text-xs font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  required
                  name="name"
                  type="text"
                  className="w-full px-4 py-2.5 rounded-[4px] border border-[#0B2117]/20 bg-[#FAF9F6] focus:bg-white focus:border-[#063925] outline-none text-sm font-['Inter'] text-[#1A3326] transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    className="w-full px-4 py-2.5 rounded-[4px] border border-[#0B2117]/20 bg-[#FAF9F6] focus:bg-white focus:border-[#063925] outline-none text-sm font-['Inter'] text-[#1A3326] transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1.5">
                    Phone
                  </label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    className="w-full px-4 py-2.5 rounded-[4px] border border-[#0B2117]/20 bg-[#FAF9F6] focus:bg-white focus:border-[#063925] outline-none text-sm font-['Inter'] text-[#1A3326] transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#063925] hover:bg-[#0B2117] text-white font-['Inter'] font-semibold uppercase tracking-wider text-xs rounded-[4px] transition-colors mt-2 cursor-pointer shadow-sm"
              >
                Send Enquiry to WhatsApp Desk
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailsPage;