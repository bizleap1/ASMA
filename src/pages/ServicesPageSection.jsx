import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { blogPosts } from '../blogData';
import shubhangiImg from '../assets/shubhangi.png';
import krishnaImg from '../assets/krishna.png';
import vrushaliImg from '../assets/vrushali.png';
import { serviceData, courseDetails, baseCourses, additionalCourses, FREE_NOTES } from '../data';
import AnimatedSection from '../components/AnimatedSection';

const ServicesPageSection = () => {
  const [activeIdx, setActiveIdx] = React.useState(1);
  const [activeFilter, setActiveFilter] = React.useState('All');

  const allServices = serviceData.filter(s => s.category !== 'Insurance');
  const categories = ['All', ...new Set(allServices.map(s => s.category)), 'Insurance'];
  const filteredServices = activeFilter === 'All' ? allServices : allServices.filter(s => s.category === activeFilter);

  // Reset active index when filter changes if it's out of bounds
  React.useEffect(() => {
    if (activeIdx >= filteredServices.length) {
      setActiveIdx(0);
    }
  }, [activeFilter, activeIdx, filteredServices.length]);

  return (
    <AnimatedSection className="py-10 md:py-16 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 max-w-[1400px]">
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-secondary/10 text-accent-primary font-bold tracking-widest uppercase text-xs mb-4 md:mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
            What We Do
          </div>
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 lg:gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight">
                Exclusive Financial <span className="text-accent-primary">Solutions</span>
              </h2>
            </div>
            <div className="flex flex-col items-start lg:items-end max-w-sm text-left lg:text-right lg:pt-3">
              <p className="text-text-primary text-base md:text-lg max-w-md font-bold leading-relaxed md:text-right">
                At Advait Stock Market Academy, we offer comprehensive services to help you grow financially and stay protected.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-sm border whitespace-nowrap cursor-pointer ${activeFilter === category
                ? 'bg-text-primary text-white border-text-primary shadow-text-primary/20 hover:bg-accent-primary hover:border-accent-primary hover:shadow-accent-primary/20 hover:-translate-y-0.5'
                : 'bg-white text-text-secondary border-black/5 hover:border-accent-primary/50 hover:text-accent-primary hover:-translate-y-0.5'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredServices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredServices.map((service, idx) => (
              <div key={idx} className="relative rounded-[32px] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-text-primary/5 min-h-[350px] md:min-h-[420px]">
                <img loading="lazy" src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-accent-primary/20 backdrop-blur-md border border-accent-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                    <span className="text-accent-primary font-bold">{`0${idx + 1}`}</span>
                  </div>
                  
                  <div className="flex flex-col transform transition-all duration-500 translate-y-8 group-hover:translate-y-0">
                    <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-accent-primary transition-colors duration-500 leading-tight drop-shadow-lg">{service.title}</h3>
                    
                    <div className="overflow-hidden transition-all duration-500 max-h-0 opacity-0 group-hover:max-h-[80px] group-hover:opacity-100 group-hover:mt-2">
                      <Link to={`/service/${service.id}`} className="inline-flex items-center gap-2 px-6 py-2 bg-accent-primary text-text-primary text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white hover:-translate-y-1 transition-all shadow-[0_5px_15px_rgba(212,175,55,0.4)] w-fit mt-2">
                        Read More
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Insurance Orbit Section */}
        {(activeFilter === 'All' || activeFilter === 'Insurance') && (
          <div className={`${activeFilter === 'Insurance' ? 'mt-4 md:mt-8' : 'mt-12 md:mt-16'} mb-10 relative w-full overflow-hidden bg-gradient-to-br from-[#FAFAFA] to-[#F5F7F6] py-12 md:py-16 rounded-[40px] border border-text-primary/5 shadow-sm`}>
            {/* Mobile Layout (Vertical) */}
            <div className="lg:hidden px-6 flex flex-col gap-12">
              <div className="w-44 h-44 rounded-full bg-gradient-to-br from-[#1f8546] to-[#0f4523] mx-auto flex items-center justify-center shadow-[0_15px_40px_rgba(15,69,35,0.4)] relative border-[6px] border-white/20 backdrop-blur-sm">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)]"></div>
                <h2 className="text-3xl font-display font-black text-white drop-shadow-xl uppercase tracking-widest relative z-10">Insurance</h2>
              </div>

              <div className="flex flex-col gap-8 relative mt-6">
                <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-[#166534]/0 via-[#166534]/20 to-[#166534]/0"></div>
                {[
                  {
                    id: "health-insurance",
                    title: "Health Insurance",
                    desc: "Protect your health with plans from top insurers, offering medical coverage, hospitalization benefits and cashless treatment facilities nationwide.",
                    image: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=800",
                    num: "Part 01"
                  },
                  {
                    id: "term-insurance",
                    title: "Term Insurance",
                    desc: "Affordable term plans providing high life cover for a fixed period, ensuring your loved ones are financially protected in your absence.",
                    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
                    num: "Part 02"
                  },
                  {
                    id: "motor-insurance",
                    title: "Motor Insurance",
                    desc: "Get reliable motor insurance for bikes and cars, covering accidental damage, theft, third-party liability, and hassle-free claim processes.",
                    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800",
                    num: "Part 03"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col relative z-10 bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100/80">
                    <div className="flex gap-5 items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-white border-[3px] border-[#166534] p-1 shrink-0 shadow-md relative">
                        <img loading="lazy" src={item.image} alt={item.title} className="w-full h-full rounded-full object-cover" />
                      </div>
                      <div className="text-[#166534] font-bold tracking-[0.2em] uppercase text-xs bg-[#166534]/5 px-4 py-2 rounded-full border border-[#166534]/10">{item.num}</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-text-primary mb-3">{item.title}</h3>
                      <p className="text-text-secondary text-base leading-relaxed mb-4">{item.desc}</p>
                      <Link to={`/service/${item.id}`} className="inline-flex items-center gap-2 px-5 py-2 bg-[#166534] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-md w-fit">
                        Read More
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Layout (Curved Orbit) */}
            <div className="hidden lg:block relative w-full h-[850px] max-w-[1400px] mx-auto overflow-hidden">
              {/* Center Premium Green Circle */}
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
                <div className="w-[240px] h-[240px] rounded-full bg-gradient-to-br from-[#1f8546] to-[#0f4523] flex items-center justify-center shadow-2xl relative group cursor-pointer hover:scale-105 transition-all duration-700 border-[6px] border-white/20 backdrop-blur-md">
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
                  <h2 className="text-3xl font-display font-black text-white tracking-widest drop-shadow-xl uppercase relative z-10">Insurance</h2>
                </div>
              </div>

              {/* The Big Orbit Line - Dashed and softer */}
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border-[1.5px] border-dashed border-[#166534]/30 z-10 pointer-events-none"></div>

              {/* Item 1 */}
              <div className="absolute z-30 flex items-center group" style={{ left: 'calc(50% + 125px)', top: 'calc(50% - 216px)', transform: 'translate(-120px, -50%)' }}>
                <div className="w-[90px] text-right pr-4 shrink-0">
                  <span className="inline-block font-bold text-[#166534] text-[10px] tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all duration-500 group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534]">Part 01</span>
                </div>
                <div className="w-24 h-24 rounded-full bg-white border-[5px] border-white flex items-center justify-center shadow-lg relative z-10 shrink-0">
                  <img loading="lazy" src="https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Health" className="w-full h-full rounded-full object-cover shadow-inner" />
                  <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-[#166534]/30 group-hover:scale-110 transition-all duration-500 group-hover:border-[#166534]/60"></div>
                </div>
                <div className="ml-6 w-[280px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-md border border-white hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col items-start">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-[#166534] transition-colors duration-300">Health Insurance</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">Medical coverage and cashless treatment nationwide.</p>
                  <Link to="/service/health-insurance" className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#166534] text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-sm w-fit mt-auto">
                    Read More
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

              {/* Item 2 */}
              <div className="absolute z-30 flex items-center group" style={{ left: 'calc(50% + 250px)', top: '50%', transform: 'translate(-120px, -50%)' }}>
                <div className="w-[90px] text-right pr-4 shrink-0">
                  <span className="inline-block font-bold text-[#166534] text-[10px] tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all duration-500 group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534]">Part 02</span>
                </div>
                <div className="w-24 h-24 rounded-full bg-white border-[5px] border-white flex items-center justify-center shadow-lg relative z-10 shrink-0">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80" alt="Term" className="w-full h-full rounded-full object-cover shadow-inner" />
                  <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-[#166534]/30 group-hover:scale-110 transition-all duration-500 group-hover:border-[#166534]/60"></div>
                </div>
                <div className="ml-6 w-[280px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-md border border-white hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col items-start">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-[#166534] transition-colors duration-300">Term Insurance</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">High life cover for a fixed period ensuring financial protection.</p>
                  <Link to="/service/term-insurance" className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#166534] text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-sm w-fit mt-auto">
                    Read More
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

              {/* Item 3 */}
              <div className="absolute z-30 flex items-center group" style={{ left: 'calc(50% + 125px)', top: 'calc(50% + 216px)', transform: 'translate(-120px, -50%)' }}>
                <div className="w-[90px] text-right pr-4 shrink-0">
                  <span className="inline-block font-bold text-[#166534] text-[10px] tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all duration-500 group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534]">Part 03</span>
                </div>
                <div className="w-24 h-24 rounded-full bg-white border-[5px] border-white flex items-center justify-center shadow-lg relative z-10 shrink-0">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800" alt="Motor" className="w-full h-full rounded-full object-cover shadow-inner" />
                  <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-[#166534]/30 group-hover:scale-110 transition-all duration-500 group-hover:border-[#166534]/60"></div>
                </div>
                <div className="ml-6 w-[280px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-md border border-white hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col items-start">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-[#166534] transition-colors duration-300">Motor Insurance</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">Covering accidental damage and third-party liability.</p>
                  <Link to="/service/motor-insurance" className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#166534] text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-sm w-fit mt-auto">
                    Read More
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

              {/* Item 4 */}
              <div className="absolute z-30 flex flex-row-reverse items-center group" style={{ left: 'calc(50% - 125px)', top: 'calc(50% + 216px)', transform: 'translate(calc(-100% + 120px), -50%)' }}>
                <div className="w-[90px] text-left pl-4 shrink-0">
                  <span className="inline-block font-bold text-[#166534] text-[10px] tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all duration-500 group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534]">Part 04</span>
                </div>
                <div className="w-24 h-24 rounded-full bg-white border-[5px] border-white flex items-center justify-center shadow-lg relative z-10 shrink-0">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800" alt="Life" className="w-full h-full rounded-full object-cover shadow-inner" />
                  <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-[#166534]/30 group-hover:scale-110 transition-all duration-500 group-hover:border-[#166534]/60"></div>
                </div>
                <div className="mr-6 w-[280px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-md border border-white hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col items-start lg:items-end lg:text-right">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-[#166534] transition-colors duration-300">Life Insurance</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">Lifelong protection and wealth-building investment benefits.</p>
                  <Link to="/service/life-insurance" className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#166534] text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-sm w-fit mt-auto">
                    Read More
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

              {/* Item 5 */}
              <div className="absolute z-30 flex flex-row-reverse items-center group" style={{ left: 'calc(50% - 250px)', top: '50%', transform: 'translate(calc(-100% + 120px), -50%)' }}>
                <div className="w-[90px] text-left pl-4 shrink-0">
                  <span className="inline-block font-bold text-[#166534] text-[10px] tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all duration-500 group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534]">Part 05</span>
                </div>
                <div className="w-24 h-24 rounded-full bg-white border-[5px] border-white flex items-center justify-center shadow-lg relative z-10 shrink-0">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800" alt="Travel" className="w-full h-full rounded-full object-cover shadow-inner" />
                  <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-[#166534]/30 group-hover:scale-110 transition-all duration-500 group-hover:border-[#166534]/60"></div>
                </div>
                <div className="mr-6 w-[280px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-md border border-white hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col items-start lg:items-end lg:text-right">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-[#166534] transition-colors duration-300">Travel Insurance</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">Secure your trips against emergencies and baggage loss.</p>
                  <Link to="/service/travel-insurance" className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#166534] text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-sm w-fit mt-auto">
                    Read More
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

              {/* Item 6 */}
              <div className="absolute z-30 flex flex-row-reverse items-center group" style={{ left: 'calc(50% - 125px)', top: 'calc(50% - 216px)', transform: 'translate(calc(-100% + 120px), -50%)' }}>
                <div className="w-[90px] text-left pl-4 shrink-0">
                  <span className="inline-block font-bold text-[#166534] text-[10px] tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all duration-500 group-hover:bg-[#166534] group-hover:text-white group-hover:border-[#166534]">Part 06</span>
                </div>
                <div className="w-24 h-24 rounded-full bg-white border-[5px] border-white flex items-center justify-center shadow-lg relative z-10 shrink-0">
                  <img loading="lazy" src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800" alt="Property" className="w-full h-full rounded-full object-cover shadow-inner" />
                  <div className="absolute -inset-2.5 rounded-full border-[1.5px] border-[#166534]/30 group-hover:scale-110 transition-all duration-500 group-hover:border-[#166534]/60"></div>
                </div>
                <div className="mr-6 w-[280px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-md border border-white hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col items-start lg:items-end lg:text-right">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-[#166534] transition-colors duration-300">Property Insurance</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">Safeguard properties against fire, theft, and natural disasters.</p>
                  <Link to="/service/property-insurance" className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#166534] text-white text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#0f4523] hover:-translate-y-0.5 transition-all shadow-sm w-fit mt-auto">
                    Read More
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
};

export default ServicesPageSection;