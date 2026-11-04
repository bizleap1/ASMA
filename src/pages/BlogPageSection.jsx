import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { blogPosts } from '../blogData';
import AnimatedSection from '../components/AnimatedSection';

// Helper to extract all searchable content from an article for deep keyword search
const getPostSearchContent = (post) => {
  let bodyText = '';
  if (Array.isArray(post.content)) {
    for (const block of post.content) {
      if (block.text) bodyText += ' ' + block.text;
      if (Array.isArray(block.items)) bodyText += ' ' + block.items.join(' ');
    }
  }
  const authorText = post.author?.name ? ` ${post.author.name} ${post.author.role || ''}` : '';
  const tagsText = Array.isArray(post.tags) ? ` ${post.tags.join(' ')}` : '';

  return {
    title: (post.title || '').toLowerCase(),
    category: (post.category || '').toLowerCase(),
    excerpt: (post.excerpt || '').toLowerCase(),
    body: (bodyText + authorText + tagsText).toLowerCase(),
    full: `${post.title || ''} ${post.category || ''} ${post.excerpt || ''} ${bodyText} ${authorText} ${tagsText}`.toLowerCase()
  };
};

const BlogPageSection = () => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const shouldReduceMotion = useReducedMotion();

  // 250ms debounce for natural typing responsiveness
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleClearSearch = () => {
    setSearchInput('');
    setDebouncedQuery('');
  };

  const categories = [
    'All',
    'Trading',
    'Investing',
    'Technical Analysis',
    'Fundamental Analysis',
    'Risk Management'
  ];

  // Authentic editorial kicker for clean hierarchy
  const getCategoryKicker = (post) => {
    if (post.id === 'new-stock-market-batch-starting-after-diwali-nagpur') return 'Upcoming Batch';
    if (post.id === 'why-attend-free-demo-classes-stock-market-nagpur') return 'Free Demo Class';
    if (post.id === 'psychology-of-disciplined-trading-asma-podcast-insights') return 'Podcast Insights';
    if (post.id === 'education-first-predictions-never-asma') return 'Market Philosophy';
    if (post.id === 'live-market-training-stock-market-nagpur') return 'Live Training';
    if (post.id === 'how-to-learn-stock-market-in-nagpur') return 'Beginner Roadmap';
    if (post.id === 'demystifying-futures-and-options') return 'Derivatives & F&O';
    if (post.id === 'about-advait-stock-market-academy') return 'Academy Overview';
    return post.category;
  };

  // Accurate category taxonomy mapping
  const matchesCategory = (post, cat) => {
    if (cat === 'All') return true;
    if (cat === 'Trading') {
      return post.category === 'Trading' || post.category === 'Training' || post.category === 'Trading Psychology';
    }
    if (cat === 'Investing') {
      return post.category === 'Investing';
    }
    if (cat === 'Technical Analysis') {
      return post.category === 'Technical Analysis';
    }
    if (cat === 'Fundamental Analysis') {
      return post.category === 'Fundamental Analysis';
    }
    if (cat === 'Risk Management') {
      return post.category === 'Risk Management';
    }
    return post.category.toLowerCase().includes(cat.toLowerCase());
  };

  // Deep search matching across titles, excerpts, categories, and full article body text
  const filteredPosts = useMemo(() => {
    const rawQuery = debouncedQuery.trim().toLowerCase();
    
    // First, filter by the selected category tab
    const categoryMatched = blogPosts.filter((post) => matchesCategory(post, selectedCategory));

    if (!rawQuery) {
      return categoryMatched;
    }

    // Split search query by whitespace to support multi-word queries
    const queryWords = rawQuery.split(/\s+/).filter(Boolean);

    const scored = [];
    for (const post of categoryMatched) {
      const data = getPostSearchContent(post);

      // Check if all search words exist somewhere in the article's full searchable text
      const allWordsMatch = queryWords.every((word) => data.full.includes(word));

      if (allWordsMatch) {
        let score = 0;
        // Priority 1: Exact query matches in title
        if (data.title.includes(rawQuery)) score += 100;
        // Priority 2: Exact query matches in category
        if (data.category.includes(rawQuery)) score += 50;
        // Priority 3: Exact query matches in excerpt
        if (data.excerpt.includes(rawQuery)) score += 30;
        
        // Granular word scores
        for (const word of queryWords) {
          if (data.title.includes(word)) score += 20;
          if (data.category.includes(word)) score += 15;
          if (data.excerpt.includes(word)) score += 10;
          if (data.body.includes(word)) score += 5;
        }

        scored.push({ post, score });
      }
    }

    // Sort by relevance score descending with stable fallback
    scored.sort((a, b) => b.score - a.score);
    return scored.map((item) => item.post);
  }, [debouncedQuery, selectedCategory]);

  const isSearching = debouncedQuery.trim().length > 0;

  // Featured Lead Story: Only showcase when browsing normally (not searching)
  const featuredId = 'education-first-predictions-never-asma';
  const showFeaturedLead = !isSearching && filteredPosts.some((p) => p.id === featuredId);

  const featuredPost = showFeaturedLead
    ? filteredPosts.find((p) => p.id === featuredId)
    : null;

  const gridPosts = featuredPost
    ? filteredPosts.filter((p) => p.id !== featuredId)
    : filteredPosts;

  const easeOut = [0.16, 1, 0.3, 1];

  // Subtle 200ms fade transition without bouncy keystroke entrance
  const storyVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.1 }
    }
  };

  return (
    <AnimatedSection className="pt-2 sm:pt-4 pb-20 sm:pb-24 bg-[#FAF9F6] relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl">
        
        {/* SECTION 02: EDITORIAL DESK INDEX & SEARCH BAR */}
        <div className="border-b border-[#063925]/15 mb-10 sm:mb-12 lg:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 md:gap-8">
            
            {/* Category Tabs: On mobile (top), On desktop (left) */}
            <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar order-1 -mb-[1px] w-full md:w-auto">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`pb-3 text-xs sm:text-[13px] font-['Inter'] tracking-wide transition-colors whitespace-nowrap shrink-0 cursor-pointer relative ${
                      isActive
                        ? 'text-[#063925] font-semibold'
                        : 'text-[#4A6356] hover:text-[#1A3326] font-normal'
                    }`}
                  >
                    <span>{cat}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeDeskTab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#063925]"
                        transition={{ duration: 0.22, ease: easeOut }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Box: Full width below categories on mobile, neatly aligned right on desktop */}
            <div className="relative w-full md:w-64 lg:w-72 order-2 shrink-0 pb-3 md:pb-2">
              <span className="absolute inset-y-0 left-0 pl-3 sm:pl-2.5 flex items-center pointer-events-none text-[#4A6356]/70 pb-3 md:pb-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-8 sm:pl-8 pr-8 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-0 bg-transparent rounded-[2px] border border-[#063925]/20 focus:border-[#063925] focus:bg-white focus:outline-none text-[13px] sm:text-xs text-[#1A3326] placeholder-[#4A6356]/60 transition-colors font-['Inter']"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#4A6356] hover:text-[#063925] transition-colors cursor-pointer pb-3 md:pb-2"
                  aria-label="Clear search"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* SECTION 03: LEAD EDITORIAL STORY (Shown when browsing, hidden during keyword search) */}
        {featuredPost && (
          <div className="mb-14 sm:mb-16 lg:mb-20 pb-12 sm:pb-16 border-b border-[#063925]/15">
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center group">
              {/* Featured Image (~55% on desktop) */}
              <div className="lg:col-span-7">
                <Link to={`/blog/${featuredPost.id}`} className="block relative aspect-[16/10] overflow-hidden rounded-[2px] bg-[#063925]/5 border border-[#063925]/10">
                  <img
                    loading="lazy"
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500"
                  />
                </Link>
              </div>

              {/* Featured Editorial Content (~45% on desktop) */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                {/* Kicker + Reading Time */}
                <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                  <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#063925] font-['Inter']">
                    {getCategoryKicker(featuredPost)}
                  </span>
                  <span className="text-[#063925]/30 text-xs">·</span>
                  <span className="text-[12px] text-[#4A6356] font-['Inter'] font-normal">
                    {featuredPost.readTime}
                  </span>
                </div>

                {/* Headline */}
                <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-[#1A3326] font-['Manrope'] mb-3 sm:mb-4 leading-[1.18] group-hover:text-[#063925] transition-colors">
                  <Link to={`/blog/${featuredPost.id}`}>{featuredPost.title}</Link>
                </h2>

                {/* Excerpt */}
                <p className="text-[#4A6356] text-sm sm:text-[15px] font-normal font-['Inter'] leading-relaxed mb-5 sm:mb-6">
                  {featuredPost.excerpt}
                </p>

                {/* Editorial Read Link */}
                <div>
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-[#063925] hover:text-[#D4AF37] transition-colors font-['Inter'] group/link"
                  >
                    <span>Read Article</span>
                    <span className="ml-1.5 transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* SECTION 04: EDITORIAL DISPATCHES / SEARCH RESULTS */}
        <div>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8 sm:mb-10 pb-3 border-b border-[#063925]/10">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1A3326] font-['Manrope'] tracking-tight">
              {isSearching
                ? `Results for "${debouncedQuery.trim()}"`
                : featuredPost 
                  ? 'Latest Articles & Commentary' 
                  : selectedCategory === 'All' 
                    ? 'All Articles' 
                    : `${selectedCategory} Articles`}
            </h2>
            <span className="text-xs text-[#4A6356] font-['Inter']">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          {/* Grid or Empty State */}
          {gridPosts.length > 0 ? (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 sm:gap-x-10 lg:gap-x-12 gap-y-10 sm:gap-y-12 mb-14 sm:mb-16 lg:mb-20"
            >
              <AnimatePresence mode="popLayout">
                {gridPosts.map((post) => (
                  <motion.article
                    key={post.id}
                    layout="position"
                    variants={storyVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="group flex flex-col justify-between pb-8 sm:pb-10 border-b border-[#063925]/12 transition-all duration-200"
                  >
                    <div>
                      {/* Clean 16:9 Editorial Image */}
                      <Link 
                        to={`/blog/${post.id}`} 
                        className="block relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-[2px] bg-[#063925]/5 border border-[#063925]/10 mb-4 sm:mb-5"
                      >
                        <img
                          loading="lazy"
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.018]"
                        />
                      </Link>

                      {/* Editorial Kicker + Meta */}
                      <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
                        <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#063925] font-['Inter']">
                          {getCategoryKicker(post)}
                        </span>
                        <span className="text-[#063925]/30 text-xs">·</span>
                        <span className="text-[11.5px] text-[#4A6356] font-['Inter'] font-normal">
                          {post.readTime}
                        </span>
                      </div>

                      {/* Editorial Title */}
                      <h3 className="text-[18px] sm:text-[19px] lg:text-[20px] font-semibold text-[#1A3326] font-['Manrope'] mb-2.5 leading-[1.3] group-hover:text-[#063925] transition-colors line-clamp-2">
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="text-[#4A6356] text-[13px] sm:text-[13.5px] font-['Inter'] font-normal leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Editorial Read Link */}
                    <div className="pt-2 flex items-center justify-between">
                      <Link
                        to={`/blog/${post.id}`}
                        className="inline-flex items-center text-[11.5px] font-semibold tracking-wider uppercase text-[#063925] hover:text-[#D4AF37] transition-colors font-['Inter'] group/link"
                      >
                        <span>Read Article</span>
                        <span className="ml-1.5 transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20 bg-transparent rounded-[2px] border border-[#063925]/15 p-6 sm:p-8 max-w-md mx-auto mb-14 sm:mb-16">
              <h3 className="text-lg font-semibold font-['Manrope'] text-[#1A3326] mb-2">
                No articles found
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6356] font-['Inter'] mb-5 leading-relaxed">
                No articles found. Try a different keyword.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleClearSearch();
                  setSelectedCategory('All');
                }}
                className="px-5 py-2 bg-[#063925] text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] hover:bg-[#0B2117] transition-colors font-['Inter'] cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* SECTION 05: RESTRAINED INSTITUTIONAL ACADEMY NOTE */}
        <div className="bg-[#063925] text-white rounded-[2px] p-6 sm:p-8 lg:p-10 border-l-4 border-[#D4AF37] relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-[1px] bg-[#D4AF37]" />
                <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#D4AF37] font-['Inter']">
                  PRACTICAL LEARNING
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-[25px] font-semibold text-white font-['Manrope'] leading-tight mb-2">
                Take Your Learning Beyond the Articles.
              </h2>
              <p className="text-white/80 text-xs sm:text-[13.5px] font-['Inter'] font-normal leading-relaxed">
                Join structured classroom sessions in Nagpur with live-market chart observation, disciplined risk management, and post-course mentorship.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2f] text-[#063925] text-xs font-semibold tracking-wider uppercase rounded-[2px] transition-colors font-['Inter'] shrink-0 text-center font-medium"
            >
              Explore Training Programs →
            </Link>
          </div>
        </div>

      </div>
    </AnimatedSection>
  );
};

export default BlogPageSection;