import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { toast } from '../utils/notification';

const ContactSection = ({ isContactPage = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const easeOut = [0.16, 1, 0.3, 1];
  const vp = { once: true, amount: 0.15 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fname = formData.get('fname') || '';
    const lname = formData.get('lname') || '';
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || '';
    const message = formData.get('message') || '';

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('visitors').insert([{
        name: `${fname} ${lname}`.trim(),
        email,
        phone,
        message,
        status: 'new'
      }]);

      if (error) throw error;

      const text = `Hi Advait Academy!%0A%0A*Name:* ${fname} ${lname}%0A*Phone:* ${phone}%0A*Email:* ${email}%0A*Message:* ${message}`;
      window.open(`https://wa.me/919156953895?text=${text}`, '_blank');
      
      e.target.reset();
      toast.success("Message sent successfully! Opening WhatsApp...");
    } catch (error) {
      console.error(error);
      toast.error("Error sending message: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-12 sm:py-16 md:py-18 lg:py-20 bg-[#FAF9F5] relative border-b border-black/5 px-4 sm:px-6 md:px-8 lg:px-12 w-full"
    >
      <div className="container mx-auto px-0 max-w-7xl relative z-10">
        
        {/* Informational Section (Contact Page Only) */}
        {isContactPage && (
          <div className="mb-10 sm:mb-12 bg-white border border-black/8 rounded-[6px] p-6 md:p-8 lg:p-10 text-left relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column */}
              <div className="lg:col-span-5 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#063925]/10 text-[#063925] font-['Inter'] font-semibold tracking-wider uppercase text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                  Direct Consultation
                </div>
                <h2 className="text-2xl md:text-3xl font-['Manrope'] font-semibold leading-tight text-[#1A3326] tracking-tight">
                  Connect with Advait Academy in Nagpur
                </h2>
                <p className="text-[#4A6356] text-xs sm:text-sm font-['Inter'] font-normal leading-relaxed">
                  Whether you are planning to join an upcoming offline batch, explore our curriculum, or schedule a counseling session with Satish Bobade, our team is at your service.
                </p>
              </div>

              {/* Right Column: 3 Contact Pillars */}
              <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-black/8 lg:pl-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-4 bg-[#FAF9F5] rounded-[4px] border border-black/8">
                    <div className="w-8 h-8 rounded-[2px] bg-[#063925]/10 flex items-center justify-center text-[#063925] mb-2.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h4 className="font-['Manrope'] font-semibold text-xs sm:text-sm text-[#1A3326] mb-1">Admissions Desk</h4>
                    <p className="text-[11px] font-['Inter'] text-[#4A6356] leading-relaxed">Inquire regarding batch timings, curriculum, and registration.</p>
                  </div>

                  <div className="p-4 bg-[#FAF9F5] rounded-[4px] border border-black/8">
                    <div className="w-8 h-8 rounded-[2px] bg-[#063925]/10 flex items-center justify-center text-[#063925] mb-2.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="font-['Manrope'] font-semibold text-xs sm:text-sm text-[#1A3326] mb-1">Mentorship Audit</h4>
                    <p className="text-[11px] font-['Inter'] text-[#4A6356] leading-relaxed">Schedule a one-on-one portfolio review or trade counseling.</p>
                  </div>

                  <div className="p-4 bg-[#FAF9F5] rounded-[4px] border border-black/8">
                    <div className="w-8 h-8 rounded-[2px] bg-[#063925]/10 flex items-center justify-center text-[#063925] mb-2.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h4 className="font-['Manrope'] font-semibold text-xs sm:text-sm text-[#1A3326] mb-1">Campus Visit</h4>
                    <p className="text-[11px] font-['Inter'] text-[#4A6356] leading-relaxed">Visit our live trading facility on Besa-Pipla Road daily.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header Block: Eyebrow + Heading + Description */}
        <div className="max-w-3xl text-left mb-8 sm:mb-10 lg:mb-12">
          {/* Eyebrow: ADMISSIONS & ENQUIRIES with subtle gold line reveal */}
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
              ADMISSIONS &amp; ENQUIRIES
            </span>
          </div>

          {/* Heading: Your Next Step Starts Here. (550ms fade-up) */}
          <motion.h2 
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.55, delay: 0.08, ease: easeOut }}
            className="text-[30px] sm:text-[36px] md:text-[40px] lg:text-[44px] font-semibold text-[#1A3326] leading-[1.16] tracking-tight text-left"
            style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
          >
            Your Next Step <span className="text-[#D4AF37]">Starts Here.</span>
          </motion.h2>

          {/* Description */}
          <motion.p 
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.45, delay: 0.14, ease: easeOut }}
            className="text-[14.5px] sm:text-[15.5px] text-[#4A6356] font-normal leading-relaxed max-w-2xl mt-2.5 sm:mt-3 text-left"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
          >
            Have questions about stock market courses in Nagpur? Connect with ASMA for course details, batch information and admissions.
          </motion.p>
        </div>

        {/* Split Contact Layout: Desktop 40% Forest Green Panel / 60% White Enquiry Form */}
        <div className="flex flex-col lg:flex-row items-stretch gap-6 sm:gap-8 lg:gap-8 xl:gap-10">
          
          {/* Left Column (40%): Dark Forest-Green Contact Information Panel */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
            className="w-full lg:w-[40%] bg-[#063925] text-white rounded-[6px] p-6 sm:p-8 lg:p-8 xl:p-9 flex flex-col justify-between border border-[#0B2117]/30 shadow-sm relative overflow-hidden"
          >
            <div className="space-y-5 sm:space-y-6">
              <div>
                <span 
                  className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37] block mb-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  DIRECT ADMISSIONS DESK
                </span>
                <h3 
                  className="text-[20px] sm:text-[22px] lg:text-[24px] font-semibold text-white leading-tight tracking-tight mb-2"
                  style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                >
                  Visit or Speak With Us Directly
                </h3>
                <p 
                  className="text-[13px] sm:text-[13.5px] text-white/80 font-normal leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Our senior mentors and admissions desk in Nagpur are available 7 days a week to assist with admissions, curriculum details and batch timings.
                </p>
              </div>

              {/* Clean Minimal Icon + Text Rows with Subtle Dividers */}
              <div className="divide-y divide-white/10 pt-1 border-t border-white/10">
                
                {/* Phone Row */}
                <a
                  href="tel:+919156953895"
                  className="py-3.5 sm:py-4 flex items-start gap-3.5 group transition-colors block text-left"
                >
                  <svg className="w-4.5 h-4.5 text-[#D4AF37] shrink-0 mt-0.5 group-hover:scale-105 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/55 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Admissions Helpline
                    </div>
                    <div className="text-[15px] sm:text-[16px] font-semibold text-white group-hover:text-[#D4AF37] transition-colors leading-snug mt-0.5" style={{ fontFamily: "'Manrope', sans-serif" }}>
                      +91 91569 53895
                    </div>
                    <div className="text-[12px] text-white/70 mt-0.5 font-normal">
                      Alt: +91 095528 55333 • 08:00 AM – 10:00 PM Daily
                    </div>
                  </div>
                </a>

                {/* Campus Address Row */}
                <a
                  href="https://maps.google.com/?q=Advait+Share+Market+Academy,+Plot+28,+Oshian+SuperCity+3,+Besa-Pipla+Rd,+Nagpur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 sm:py-4 flex items-start gap-3.5 group transition-colors block text-left"
                >
                  <svg className="w-4.5 h-4.5 text-[#D4AF37] shrink-0 mt-0.5 group-hover:scale-105 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/55 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Nagpur Academy Campus
                    </div>
                    <div className="text-[14px] sm:text-[14.5px] font-semibold text-white group-hover:text-[#D4AF37] transition-colors leading-snug mt-0.5" style={{ fontFamily: "'Manrope', sans-serif" }}>
                      Plot 28, Oshian SuperCity 3, Besa - Pipla Road
                    </div>
                    <div className="text-[12px] text-white/70 mt-0.5 leading-relaxed font-normal">
                      Opposite Atharva Nagari 6, Nagpur, Maharashtra 440034
                    </div>
                  </div>
                </a>

                {/* Email Row */}
                <a
                  href="mailto:advaithsharemarketacademy@gmail.com"
                  className="py-3.5 sm:py-4 flex items-start gap-3.5 group transition-colors block text-left"
                >
                  <svg className="w-4.5 h-4.5 text-[#D4AF37] shrink-0 mt-0.5 group-hover:scale-105 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/55 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Official Email
                    </div>
                    <div className="text-[13px] sm:text-[13.5px] font-medium text-white group-hover:text-[#D4AF37] transition-colors break-all mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      advaithsharemarketacademy@gmail.com
                    </div>
                  </div>
                </a>

              </div>
            </div>

            {/* Clean Understated Timing Information (No decorative status dot) */}
            <div className="pt-4 mt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-white/70">
              <span className="font-medium text-white/80">
                Admissions Open All 7 Days
              </span>
              <span className="text-white/60 text-[11.5px]">
                08:00 AM – 10:00 PM
              </span>
            </div>
          </motion.div>

          {/* Right Column (60%): Clean White Enquiry Form */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.5, delay: 0.16, ease: easeOut }}
            className="w-full lg:w-[60%] bg-white rounded-[6px] border border-black/8 p-6 sm:p-8 lg:p-8 xl:p-9 shadow-sm flex flex-col justify-between"
          >
            <div>
              <h3 
                className="text-[20px] sm:text-[22px] lg:text-[23px] font-semibold text-[#1A3326] mb-1.5"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
              >
                Send an Admission Inquiry
              </h3>
              <p 
                className="text-[13px] sm:text-[13.5px] text-[#4A6356] font-normal leading-relaxed mb-5 sm:mb-6"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Fill in your details below and our counselors will get in touch with complete syllabus, batch options and fee structure.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-['Inter'] font-semibold uppercase tracking-wider text-[#1A3326]">
                      First Name <span className="text-[#EA4335]">*</span>
                    </label>
                    <input
                      name="fname"
                      type="text"
                      required
                      className="w-full bg-[#FAF9F5] border border-black/10 focus:border-[#063925] focus:bg-white rounded-[4px] px-3.5 py-2.5 text-xs sm:text-sm text-[#1A3326] outline-none transition-colors"
                      placeholder="e.g. Rahul"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-['Inter'] font-semibold uppercase tracking-wider text-[#1A3326]">
                      Last Name <span className="text-[#EA4335]">*</span>
                    </label>
                    <input
                      name="lname"
                      type="text"
                      required
                      className="w-full bg-[#FAF9F5] border border-black/10 focus:border-[#063925] focus:bg-white rounded-[4px] px-3.5 py-2.5 text-xs sm:text-sm text-[#1A3326] outline-none transition-colors"
                      placeholder="e.g. Sharma"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-['Inter'] font-semibold uppercase tracking-wider text-[#1A3326]">
                      Email Address <span className="text-[#EA4335]">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full bg-[#FAF9F5] border border-black/10 focus:border-[#063925] focus:bg-white rounded-[4px] px-3.5 py-2.5 text-xs sm:text-sm text-[#1A3326] outline-none transition-colors"
                      placeholder="rahul@example.com"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-['Inter'] font-semibold uppercase tracking-wider text-[#1A3326]">
                      Phone Number <span className="text-[#EA4335]">*</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      className="w-full bg-[#FAF9F5] border border-black/10 focus:border-[#063925] focus:bg-white rounded-[4px] px-3.5 py-2.5 text-xs sm:text-sm text-[#1A3326] outline-none transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Query */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-['Inter'] font-semibold uppercase tracking-wider text-[#1A3326]">
                    Interested Course or Query <span className="text-[#EA4335]">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="3"
                    className="w-full bg-[#FAF9F5] border border-black/10 focus:border-[#063925] focus:bg-white rounded-[4px] px-3.5 py-2.5 text-xs sm:text-sm text-[#1A3326] outline-none transition-colors resize-none"
                    placeholder="Which course are you interested in, and do you prefer online or offline classroom batches?"
                  ></textarea>
                </div>

                {/* Submit Button with subtle 200ms transition */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 bg-[#063925] hover:bg-[#0B2117] text-white rounded-[4px] font-['Inter'] font-semibold uppercase tracking-wider text-xs transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                    isSubmitting ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  <span>{isSubmitting ? 'Submitting Inquiry...' : 'Submit Admission Inquiry'}</span>
                  {!isSubmitting && (
                    <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

        </div>

        {/* Embedded Campus Map */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={vp}
          transition={{ duration: 0.5, delay: 0.22, ease: easeOut }}
          className="mt-8 sm:mt-10 lg:mt-12 rounded-[6px] overflow-hidden border border-black/8 shadow-sm bg-white"
        >
          <div className="px-4 sm:px-6 py-3 bg-white border-b border-black/8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1A3326]" style={{ fontFamily: "'Manrope', sans-serif" }}>
              <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Academy Campus • Besa - Pipla Road, Nagpur</span>
            </div>
            <a
              href="https://maps.google.com/?q=Advait+Share+Market+Academy,+Plot+28,+Oshian+SuperCity+3,+Besa-Pipla+Rd,+Nagpur"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#063925] hover:text-[#D4AF37] transition-colors underline underline-offset-2 shrink-0 self-start sm:self-auto"
            >
              Get Directions on Google Maps →
            </a>
          </div>
          <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96 bg-[#F2F5F3]">
            <iframe 
              src="https://maps.google.com/maps?q=Advait+Share+Market+Academy,+Plot+28,+Oshian+SuperCity+3,+Besa-Pipla+Rd,+Nagpur&t=m&z=15&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Advait Stock Market Academy Location"
            ></iframe>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ContactSection;