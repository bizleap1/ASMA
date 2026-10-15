import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { toast } from '../utils/notification';
import { aboutContactFaqs } from '../data';
import ContactHero from '../components/ContactHero';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const easeOut = [0.16, 1, 0.3, 1];
  const vp = { once: true, amount: 0.1 };

  // Form submission: Saves to Supabase 'visitors' table and opens WhatsApp with pre-filled message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(e.target);
    const fname = formData.get('fname')?.toString().trim() || '';
    const lname = formData.get('lname')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const phone = formData.get('phone')?.toString().trim() || '';
    const message = formData.get('message')?.toString().trim() || '';

    if (!fname || !email || !phone) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('visitors').insert([
        {
          name: `${fname} ${lname}`.trim(),
          email,
          phone,
          message,
          status: 'new'
        }
      ]);

      if (error) throw error;

      // Prepare WhatsApp message
      const text = `Hi Advait Academy!%0A%0A*Name:* ${encodeURIComponent(`${fname} ${lname}`.trim())}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Email:* ${encodeURIComponent(email)}%0A*Message:* ${encodeURIComponent(message)}`;
      window.open(`https://wa.me/919156953895?text=${text}`, '_blank');

      e.target.reset();
      toast.success('Enquiry submitted successfully! Opening WhatsApp...');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Error submitting enquiry: ' + (error.message || 'Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A3326]">
      {/* SECTION 01: CONTACT HERO */}
      <ContactHero />

      {/* SECTION 02: CONTACT DETAILS + ENQUIRY FORM */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 xl:gap-16">
            
            {/* LEFT COLUMN (40%): Editorial Contact Information */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.4, ease: easeOut }}
              className="w-full lg:w-[40%] flex flex-col justify-between"
            >
              <div>
                {/* Section Header */}
                <div className="mb-6 sm:mb-7 text-left">
                  <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#063925] font-['Inter'] block mb-1.5">
                    Admissions Desk
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A3326] font-['Manrope'] tracking-tight mb-2">
                    Get in Touch.
                  </h2>
                  <p className="text-[14px] text-[#4A6356] font-['Inter'] font-normal leading-relaxed">
                    Connect directly with our admissions team and mentors in Nagpur for course guidance, batch timings, and campus visits.
                  </p>
                </div>

                {/* Contact Rows with Minimal Line Icons & Clean Dividers */}
                <div className="divide-y divide-[#063925]/10 border-t border-[#063925]/10">
                  
                  {/* Address Row */}
                  <a
                    href="https://maps.google.com/?q=Advait+Share+Market+Academy,+Plot+28,+Oshian+SuperCity+3,+Besa-Pipla+Rd,+Nagpur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 flex items-start gap-3 group transition-colors block text-left"
                  >
                    <svg className="w-4 h-4 text-[#063925]/80 shrink-0 mt-0.5 group-hover:text-[#D4AF37] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <span className="text-[10.5px] uppercase tracking-wider text-[#4A6356] font-medium font-['Inter'] block mb-0.5">
                        Visit the Academy
                      </span>
                      <div className="text-[14.5px] sm:text-[15px] font-semibold text-[#1A3326] group-hover:text-[#063925] transition-colors leading-snug font-['Manrope']">
                        Plot 28, Oshian SuperCity 3, Besa – Pipla Road
                      </div>
                      <div className="text-[12.5px] text-[#4A6356] mt-0.5 leading-relaxed font-['Inter']">
                        Opposite Atharva Nagari 6, Nagpur, Maharashtra 440034
                      </div>
                    </div>
                  </a>

                  {/* Phone Row */}
                  <a
                    href="tel:+919156953895"
                    className="py-4 flex items-start gap-3 group transition-colors block text-left"
                  >
                    <svg className="w-4 h-4 text-[#063925]/80 shrink-0 mt-0.5 group-hover:text-[#D4AF37] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <span className="text-[10.5px] uppercase tracking-wider text-[#4A6356] font-medium font-['Inter'] block mb-0.5">
                        Call Us Directly
                      </span>
                      <div className="text-[15px] sm:text-[16px] font-semibold text-[#1A3326] group-hover:text-[#063925] transition-colors leading-snug font-['Manrope']">
                        +91 91569 53895
                      </div>
                      <div className="text-[12px] text-[#4A6356] mt-0.5 font-['Inter']">
                        Alt: +91 095528 55333 • 08:00 AM – 10:00 PM Daily
                      </div>
                    </div>
                  </a>

                  {/* Email Row */}
                  <a
                    href="mailto:advaithsharemarketacademy@gmail.com"
                    className="py-4 flex items-start gap-3 group transition-colors block text-left"
                  >
                    <svg className="w-4 h-4 text-[#063925]/80 shrink-0 mt-0.5 group-hover:text-[#D4AF37] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <span className="text-[10.5px] uppercase tracking-wider text-[#4A6356] font-medium font-['Inter'] block mb-0.5">
                        Email Us
                      </span>
                      <div className="text-[13.5px] sm:text-[14px] font-medium text-[#1A3326] group-hover:text-[#063925] transition-colors break-all font-['Inter']">
                        advaithsharemarketacademy@gmail.com
                      </div>
                    </div>
                  </a>

                  {/* Working Hours */}
                  <div className="py-4 flex items-start gap-3 block text-left">
                    <svg className="w-4 h-4 text-[#063925]/80 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span className="text-[10.5px] uppercase tracking-wider text-[#4A6356] font-medium font-['Inter'] block mb-0.5">
                        Academy Working Hours
                      </span>
                      <div className="text-[14px] font-semibold text-[#1A3326] font-['Manrope']">
                        Monday – Sunday: 08:00 AM – 10:00 PM
                      </div>
                      <div className="text-[12px] text-[#4A6356] mt-0.5 font-['Inter']">
                        Admissions desk open 7 days a week
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Quick WhatsApp Action Box */}
              <div className="mt-5 pt-4 border-t border-[#063925]/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#1A3326] font-['Manrope'] block">
                    Prefer Instant Chat?
                  </span>
                  <span className="text-[12px] text-[#4A6356] font-['Inter']">
                    Reach us directly on WhatsApp
                  </span>
                </div>
                <a
                  href="https://wa.me/919156953895?text=Hi%20Advait%20Academy!%20I%20have%20an%20enquiry%20regarding%20your%20courses."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#063925]/5 hover:bg-[#063925] text-[#063925] hover:text-white rounded-[2px] border border-[#063925]/20 text-xs font-semibold tracking-wider uppercase transition-colors duration-200 font-['Inter'] shrink-0"
                >
                  WhatsApp Us →
                </a>
              </div>
            </motion.div>

            {/* RIGHT COLUMN (60%): Clean White Enquiry Form */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={vp}
              transition={{ duration: 0.45, delay: 0.08, ease: easeOut }}
              className="w-full lg:w-[60%] bg-white rounded-[2px] border border-[#063925]/12 p-6 sm:p-8"
            >
              <div className="mb-6 text-left">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#1A3326] font-['Manrope'] tracking-tight mb-1.5">
                  Send an Enquiry.
                </h3>
                <p className="text-[13px] sm:text-[13.5px] text-[#4A6356] font-['Inter'] leading-relaxed">
                  Fill in your details below and our counselors will get in touch with syllabus, batch options, and fee structure.
                </p>
              </div>

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
                      placeholder="e.g. Rahul"
                      className="w-full min-h-[46px] sm:min-h-[48px] px-3.5 py-2.5 bg-[#FAF9F6] border border-[#063925]/18 focus:border-[#063925] focus:bg-white rounded-[2px] text-xs sm:text-sm text-[#1A3326] placeholder-[#4A6356]/60 outline-none transition-colors duration-200 font-['Inter']"
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
                      placeholder="e.g. Sharma"
                      className="w-full min-h-[46px] sm:min-h-[48px] px-3.5 py-2.5 bg-[#FAF9F6] border border-[#063925]/18 focus:border-[#063925] focus:bg-white rounded-[2px] text-xs sm:text-sm text-[#1A3326] placeholder-[#4A6356]/60 outline-none transition-colors duration-200 font-['Inter']"
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
                      placeholder="rahul@example.com"
                      className="w-full min-h-[46px] sm:min-h-[48px] px-3.5 py-2.5 bg-[#FAF9F6] border border-[#063925]/18 focus:border-[#063925] focus:bg-white rounded-[2px] text-xs sm:text-sm text-[#1A3326] placeholder-[#4A6356]/60 outline-none transition-colors duration-200 font-['Inter']"
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
                      placeholder="+91 98765 43210"
                      className="w-full min-h-[46px] sm:min-h-[48px] px-3.5 py-2.5 bg-[#FAF9F6] border border-[#063925]/18 focus:border-[#063925] focus:bg-white rounded-[2px] text-xs sm:text-sm text-[#1A3326] placeholder-[#4A6356]/60 outline-none transition-colors duration-200 font-['Inter']"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-['Inter'] font-semibold uppercase tracking-wider text-[#1A3326]">
                    Interested Course or Query <span className="text-[#EA4335]">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="3"
                    placeholder="Which course are you interested in, and do you prefer offline classroom or online batches?"
                    className="w-full p-3.5 bg-[#FAF9F6] border border-[#063925]/18 focus:border-[#063925] focus:bg-white rounded-[2px] text-xs sm:text-sm text-[#1A3326] placeholder-[#4A6356]/60 outline-none transition-colors duration-200 resize-none font-['Inter'] leading-relaxed"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full min-h-[46px] sm:min-h-[48px] py-3 bg-[#063925] hover:bg-[#0B2117] text-white rounded-[2px] font-['Inter'] font-semibold uppercase tracking-wider text-xs transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    isSubmitting ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  <span>{isSubmitting ? 'Submitting Enquiry...' : 'Send Inquiry'}</span>
                  {!isSubmitting && (
                    <span className="text-[#D4AF37] font-bold">→</span>
                  )}
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 03: FIND OUR ACADEMY (Genuine Embedded Google Map) */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6 sm:mb-7 text-left">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#063925] font-['Inter'] block mb-1.5">
              Campus Location
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A3326] font-['Manrope'] tracking-tight mb-2">
              Visit Our Academy.
            </h2>
            <p className="text-[14px] text-[#4A6356] font-['Inter'] leading-relaxed max-w-2xl">
              Our training campus features multi-screen live market trading setups on Besa–Pipla Road, Nagpur.
            </p>
          </div>

          <div className="rounded-[2px] overflow-hidden border border-[#063925]/12 bg-white">
            {/* Top Bar with Address and Directions link */}
            <div className="px-4 sm:px-6 py-3 bg-[#FAF9F6] border-b border-[#063925]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="text-xs sm:text-sm font-semibold text-[#1A3326] font-['Manrope'] text-left">
                Advait Stock Market Academy • Plot 28, Oshian SuperCity 3, Besa–Pipla Road, Nagpur
              </div>
              <a
                href="https://maps.google.com/?q=Advait+Share+Market+Academy,+Plot+28,+Oshian+SuperCity+3,+Besa-Pipla+Rd,+Nagpur"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#063925] hover:text-[#D4AF37] transition-colors underline underline-offset-2 shrink-0 self-start sm:self-auto font-['Inter']"
              >
                Get Directions on Google Maps →
              </a>
            </div>

            {/* Embedded Responsive Iframe */}
            <div className="w-full h-72 sm:h-80 md:h-96 lg:h-[420px] bg-[#063925]/5">
              <iframe
                src="https://maps.google.com/maps?q=Advait+Share+Market+Academy,+Plot+28,+Oshian+SuperCity+3,+Besa-Pipla+Rd,+Nagpur&t=m&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Advait Stock Market Academy Nagpur Location"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04: FREQUENTLY ASKED QUESTIONS (Minimal Editorial Accordion) */}
      <section className="pt-4 sm:pt-6 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        <div className="container mx-auto max-w-4xl text-left">
          
          <div className="mb-6 sm:mb-8 text-left">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#063925] font-['Inter'] block mb-1.5">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A3326] font-['Manrope'] tracking-tight mb-2">
              Questions About Admissions & Visits.
            </h2>
            <p className="text-[14px] text-[#4A6356] font-['Inter'] leading-relaxed">
              Find answers regarding visiting our academy, course inquiries, counseling sessions, and offline batches in Nagpur.
            </p>
          </div>

          {/* Minimal Editorial Accordion */}
          <div className="divide-y divide-[#063925]/10 border-t border-b border-[#063925]/10">
            {aboutContactFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-4 sm:py-4.5">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    className="w-full text-left flex justify-between items-start gap-4 group cursor-pointer focus:outline-none select-none"
                  >
                    <h3 className="text-[15px] sm:text-[16px] md:text-[16.5px] font-semibold text-[#1A3326] group-hover:text-[#063925] transition-colors leading-snug font-['Manrope'] pr-2">
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

    </div>
  );
};

export default ContactPage;
