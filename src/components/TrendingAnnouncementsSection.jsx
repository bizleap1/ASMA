import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { defaultAcademyPosters } from '../admin/AdminCoursePoster';

const TrendingAnnouncementsSection = ({ id = 'latest-updates', className = '', onOpenAdmission = null }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState('Advanced Foundation');

  // Managed Course Posters from Admin / Supabase
  const [managedPosters, setManagedPosters] = useState([]);
  const [postersLoaded, setPostersLoaded] = useState(false);
  const [activePosterIndex, setActivePosterIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchPosters = async () => {
      try {
        let { data, error } = await supabase
          .from('course_posters')
          .select('*')
          .eq('status', 'published')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error && error.message && error.message.includes('schema cache')) {
          const retryRes = await supabase
            .from('course_posters')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false });
          data = retryRes.data;
          error = retryRes.error;
        }

        if (!error && data && data.length > 0 && isMounted) {
          setManagedPosters(data);
        } else if (isMounted) {
          // Check local fallback
          const stored = typeof window !== 'undefined' ? localStorage.getItem('asma_course_posters') : null;
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              const active = parsed.filter((p) => p.status === 'published' && p.is_active !== false);
              setManagedPosters(active.length > 0 ? active : defaultAcademyPosters);
            } catch (_) {
              setManagedPosters(defaultAcademyPosters);
            }
          } else {
            setManagedPosters(defaultAcademyPosters);
          }
        }
      } catch (err) {
        console.warn('Error fetching course posters:', err);
        if (isMounted) setManagedPosters(defaultAcademyPosters);
      } finally {
        if (isMounted) setPostersLoaded(true);
      }
    };

    fetchPosters();
    return () => {
      isMounted = false;
    };
  }, []);

  const easeOut = [0.16, 1, 0.3, 1];

  const handleAdmissionSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const course = formData.get('course') || selectedCourseForModal;
    const text = `Hi Advait Academy! I would like to enquire about admission for ${course}.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`;
    window.open(`https://wa.me/919156953895?text=${encodeURIComponent(text)}`, '_blank');
    setIsAdmissionOpen(false);
  };

  if (!postersLoaded || managedPosters.length === 0) {
    return null;
  }

  const currentPoster = managedPosters[activePosterIndex] || managedPosters[0];
  const posterFeatures = currentPoster.features || [
    'Practical Market Learning',
    'Live Market Exposure',
    'Beginner to Advanced',
    'Guidance by Experienced Mentors'
  ];

  return (
    <section
      id={id}
      className={`pt-8 sm:pt-10 md:pt-12 pb-12 sm:pb-14 md:pb-16 bg-[#FAF9F6] border-b border-[#0B2117]/10 w-full px-4 md:px-8 lg:px-12 ${className}`}
    >
      <div className="container mx-auto px-1 md:px-0 w-full max-w-7xl">
        {/* Header & Tab Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 text-left">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-4 h-[1.5px] bg-[#D4AF37]" />
              <span
                className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ACADEMY ANNOUNCEMENTS
              </span>
            </div>
            <h2
              className="text-[24px] sm:text-[28px] md:text-[34px] font-semibold text-[#1A3326] tracking-tight leading-snug"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              What's Trending <span className="text-[#D4AF37]">Now.</span>
            </h2>
          </div>

          {/* Announcement Selector Tabs (Shown if multiple posters are active) */}
          {managedPosters.length > 1 && (
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-[4px] border border-[#0B2117]/10 self-start md:self-auto flex-nowrap overflow-x-auto max-w-full no-scrollbar">
              {managedPosters.map((poster, idx) => (
                <button
                  key={poster.id || idx}
                  onClick={() => setActivePosterIndex(idx)}
                  className={`px-3 sm:px-4 py-1.5 text-xs font-['Inter'] font-semibold rounded-[3px] transition-colors duration-200 cursor-pointer shrink-0 whitespace-nowrap ${
                    activePosterIndex === idx
                      ? 'bg-[#063925] text-white shadow-xs'
                      : 'text-[#4A6356] hover:text-[#1A3326]'
                  }`}
                >
                  {poster.tab_label || poster.badge || poster.title || `Announcement ${idx + 1}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Feature Card with smooth 250ms crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPoster.id || activePosterIndex}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="bg-white rounded-[6px] border border-[#0B2117]/10 p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(11,33,23,0.05)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center text-left">
              {/* Left / Info (7 Cols) */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-[3px] bg-[#063925]/10 text-[#063925] font-['Inter'] font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap shrink-0">
                    {currentPoster.tag || 'NEW BATCH ANNOUNCEMENT'}
                  </span>
                  {currentPoster.date_label && (
                    <span className="px-2.5 py-1 rounded-[3px] bg-[#FAF9F6] border border-[#0B2117]/10 text-[#063925] font-['Inter'] font-semibold text-xs whitespace-nowrap shrink-0">
                      {currentPoster.date_label}
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-[3px] bg-[#D4AF37]/15 text-[#8C6D1F] font-['Inter'] font-semibold text-xs whitespace-nowrap shrink-0">
                    {currentPoster.badge || 'Admissions Open Now'}
                  </span>
                </div>

                <h3
                  className="text-[22px] sm:text-[26px] md:text-[30px] font-semibold text-[#1A3326] tracking-tight leading-snug"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {currentPoster.title || 'New Stock Market Batch'}
                </h3>

                {currentPoster.description && (
                  <p
                    className="text-[14.5px] sm:text-[15.5px] text-[#4A6356] font-normal leading-[1.7]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {currentPoster.description}
                  </p>
                )}

                {/* Features List */}
                <div className="space-y-2 pt-1 border-t border-[#0B2117]/10">
                  {posterFeatures.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-[13px] font-['Inter'] text-[#1A3326]">
                      <span className="w-4 h-4 rounded-full bg-[#063925]/10 flex items-center justify-center text-[#063925] font-bold text-[10px] shrink-0">
                        ✓
                      </span>
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {currentPoster.cta_link ? (
                    <a
                      href={currentPoster.cta_link}
                      target={currentPoster.cta_link.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#063925] hover:bg-[#0B2117] text-white text-xs font-['Inter'] font-semibold uppercase tracking-wider rounded-[4px] shadow-sm transition-colors duration-200 cursor-pointer min-h-[46px]"
                    >
                      <span>{currentPoster.cta_text || 'Enroll Now'}</span>
                      <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        const courseName = currentPoster.title || 'Advanced Foundation';
                        if (onOpenAdmission) {
                          onOpenAdmission(courseName);
                        } else {
                          setSelectedCourseForModal(courseName);
                          setIsAdmissionOpen(true);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#063925] hover:bg-[#0B2117] text-white text-xs font-['Inter'] font-semibold uppercase tracking-wider rounded-[4px] shadow-sm transition-colors duration-200 cursor-pointer min-h-[46px]"
                    >
                      <span>{currentPoster.cta_text || 'Enroll Now'}</span>
                      <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )}

                  <a
                    href="tel:+919156953895"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-[#0B2117]/15 hover:border-[#063925] text-[#063925] text-xs font-['Inter'] font-semibold uppercase tracking-wider rounded-[4px] transition-colors duration-200 min-h-[46px]"
                  >
                    <span>Call +91 91569 53895</span>
                  </a>
                </div>
              </div>

              {/* Right / Visual Poster (5 Cols) */}
              <div className="lg:col-span-5 flex justify-center">
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.55, ease: easeOut }}
                  className="relative w-full max-w-[340px] rounded-[6px] overflow-hidden border border-[#0B2117]/10 shadow-[0_6px_24px_rgba(11,33,23,0.08)] bg-[#0B2117]"
                >
                  <img
                    src={currentPoster.image_url || currentPoster.poster}
                    alt={currentPoster.title || 'Promotional Poster'}
                    className="w-full h-auto object-contain block"
                    loading="eager"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Admission Enquiry Modal */}
      {isAdmissionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-[6px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-[#0B2117]/10 text-left">
            <button
              onClick={() => setIsAdmissionOpen(false)}
              className="absolute top-4 right-4 text-[#4A6356] hover:text-[#1A3326] text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-[#063925]" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#063925] font-['Inter']">
                Admissions Desk
              </span>
            </div>

            <h3
              className="text-xl sm:text-2xl font-semibold text-[#1A3326] tracking-tight mb-2"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Enquire About Admissions
            </h3>
            <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter'] mb-6">
              Share your details and our senior mentor will connect with you via WhatsApp to assist with course details, batch schedules, and fee options.
            </p>

            <form onSubmit={handleAdmissionSubmit} className="space-y-4">
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

              <div>
                <label className="block text-xs font-['Inter'] font-semibold text-[#1A3326] uppercase tracking-wider mb-1.5">
                  Interested Program
                </label>
                <select
                  name="course"
                  defaultValue={selectedCourseForModal}
                  className="w-full px-4 py-2.5 rounded-[4px] border border-[#0B2117]/20 bg-[#FAF9F6] focus:bg-white focus:border-[#063925] outline-none text-sm font-['Inter'] text-[#1A3326] transition-colors"
                >
                  <option value="Advanced Foundation">Advanced Foundation (Approx. 2 Months)</option>
                  <option value="Professional Master Program">Professional Master Program (Approx. 4 Months)</option>
                  <option value="New Stock Market Batch">New Stock Market Batch (Online/Offline)</option>
                  <option value="Free Demo Class Enquiry">Free Demo Class Enquiry</option>
                  <option value="General Course Enquiry">General Course Counseling</option>
                </select>
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
                Send Enquiry to Admissions on WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default TrendingAnnouncementsSection;
