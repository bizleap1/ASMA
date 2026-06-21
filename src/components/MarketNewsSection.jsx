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
import AnimatedSection from './AnimatedSection';

const MarketNewsSection = () => {
  const [news, setNews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        // Appending a timestamp to the ET URL to force rss2json to bypass its 1-hour cache and fetch live news
        const timestamp = Date.now();
        const etRssUrl = encodeURIComponent(`https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms?nocache=${timestamp}`);
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${etRssUrl}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'ok' && data.items && data.items.length > 0) {
          const parsedNews = data.items.slice(0, 6).map((item, index) => {
            // Get image from enclosure or fallback
            let image = item.enclosure?.link || item.thumbnail;
            if (!image) {
              const fallbackImages = [
                "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=600&auto=format&fit=crop"
              ];
              image = fallbackImages[index % fallbackImages.length];
            }

            // Format date
            let formattedDate = item.pubDate;
            try {
              formattedDate = new Date(item.pubDate.replace(' ', 'T')).toLocaleDateString('en-IN', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });
            } catch (e) {
              // fallback to raw if date parse fails
            }

            // Clean description (remove HTML)
            let desc = item.description || "";
            desc = desc.replace(/<[^>]*>?/gm, '').trim();

            return {
              title: item.title,
              link: item.link,
              pubDate: formattedDate,
              description: desc.substring(0, 120) + '...',
              image: image
            };
          });

          setNews(parsedNews);
        } else {
          throw new Error("Failed to load ET news");
        }
      } catch (err) {
        console.error("Failed to fetch ET news:", err);
        // Fallback static data if fetch fails
        setNews([
          { title: "Market hits record high as IT stocks rally", link: "https://economictimes.indiatimes.com/markets", pubDate: "Today", description: "Indian benchmarks scaled new all-time highs driven by strong buying in IT and banking heavyweights.", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop" },
          { title: "FIIs remain net buyers for the 5th consecutive session", link: "https://economictimes.indiatimes.com/markets", pubDate: "Today", description: "Foreign institutional investors continued their buying spree, adding Rs 2,500 crore to Indian equities.", image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=600&auto=format&fit=crop" },
          { title: "RBI keeps repo rate unchanged at 6.5%", link: "https://economictimes.indiatimes.com/markets", pubDate: "Yesterday", description: "The Monetary Policy Committee decided to maintain status quo on key interest rates.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <AnimatedSection className="py-16 bg-bg-secondary/5 relative">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-primary/10 text-accent-primary font-bold tracking-widest uppercase text-xs mb-4">Latest Updates</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-text-primary leading-tight font-bold">Economic Times <br className="hidden md:block" /> Market News</h2>
          </div>
          <a href="https://economictimes.indiatimes.com/markets" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-primary font-bold hover:gap-4 transition-all uppercase tracking-widest text-sm">
            View All on ET
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-3xl h-[400px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, idx) => (
              <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col h-full border border-text-primary/5">
                <div className="h-48 relative overflow-hidden shrink-0">
                  <img src={item.image} alt="news" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-wider bg-accent-primary/80 backdrop-blur px-2 py-1 rounded">{item.pubDate}</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors line-clamp-3">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{item.description}</p>
                  <div className="text-accent-primary text-sm font-bold flex items-center gap-2 mt-auto">
                    Read Article <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
};

export default MarketNewsSection;