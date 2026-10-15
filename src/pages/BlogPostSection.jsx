import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { blogPosts } from '../blogData';
import SEO from '../components/SEO';

const BlogPostSection = () => {
  const { id } = useParams();
  const shouldReduceMotion = useReducedMotion();
  const post = blogPosts.find((p) => p.id === id);

  // Fallback for missing article
  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 py-28 text-center max-w-xl">
        <SEO title="Article Not Found | ASMA" noindex={true} path={`/blog/${id || ''}`} />
        <h1 className="text-2xl sm:text-3xl font-['Manrope'] font-semibold text-[#1A3326] mb-3">
          Article Not Found
        </h1>
        <p className="text-[#4A6356] text-sm font-['Inter'] mb-6">
          The requested article does not exist or has been relocated.
        </p>
        <Link
          to="/blog"
          className="px-6 py-2.5 bg-[#063925] text-white rounded-[2px] font-['Inter'] font-semibold uppercase tracking-wider text-xs hover:bg-[#0B2117] transition-colors inline-block"
        >
          Return to Blog
        </Link>
      </div>
    );
  }

  // Related articles: prioritize matching category first, then other authentic posts (exactly 3)
  const relatedPosts = useMemo(() => {
    const sameCategory = blogPosts.filter((p) => p.id !== post.id && p.category === post.category);
    const otherPosts = blogPosts.filter((p) => p.id !== post.id && p.category !== post.category);
    return [...sameCategory, ...otherPosts].slice(0, 3);
  }, [post.id, post.category]);

  // Extract headings for Table of Contents (only for long articles with 4+ sections)
  const headings = useMemo(() => {
    return post.content
      .filter((block) => block.type === 'heading')
      .map((block, idx) => ({
        text: block.text,
        slug: `section-${idx + 1}`
      }));
  }, [post.content]);

  // Helper for inline markdown formatting (bold terms)
  const renderFormattedText = (text) => {
    if (!text.includes('**')) return text;
    const parts = text.split('**');
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="font-semibold text-[#1A3326]">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const easeOut = [0.16, 1, 0.3, 1];
  let headingCounter = 0;

  return (
    <article className="min-h-screen bg-[#FAF9F6] relative">
      <SEO
        title={`${post.title} | ASMA`}
        description={post.excerpt}
        path={`/blog/${post.id}`}
        image={post.image}
        type="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "image": post.image?.startsWith('http') ? post.image : `https://www.asmaonline.in${post.image}`,
          "author": {
            "@type": "Person",
            "name": post.author?.name || "ASMA Academy",
            "jobTitle": post.author?.role || "Trainer"
          },
          "publisher": {
            "@type": "EducationalOrganization",
            "name": "Advait Stock Market Academy",
            "url": "https://www.asmaonline.in",
            "founder": {
              "@type": "Person",
              "name": "Satish Bobade",
              "jobTitle": "Founder"
            }
          }
        }}
      />

      {/* SECTION 01: EDITORIAL ARTICLE HEADER */}
      <header className="pt-[110px] sm:pt-[130px] md:pt-[145px] lg:pt-[165px] pb-5 sm:pb-6 w-full">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8">
          {/* Subtle "Back to Articles" Link */}
          <div className="mb-5 sm:mb-6">
            <Link
              to="/blog"
              className="inline-flex items-center text-xs font-['Inter'] font-semibold tracking-wider uppercase text-[#063925] hover:text-[#D4AF37] transition-colors group/back"
            >
              <span className="mr-1.5 transition-transform duration-200 group-hover/back:-translate-x-1">←</span>
              <span>Back to Articles</span>
            </Link>
          </div>

          {/* Category, Read Time & Optional Author */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: easeOut }}
            className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-3 text-xs font-['Inter']"
          >
            <span className="text-[11px] sm:text-[11.5px] font-semibold tracking-[0.16em] uppercase text-[#063925]">
              {post.category}
            </span>
            <span className="text-[#063925]/30">·</span>
            <span className="text-[#4A6356] font-normal">
              {post.readTime}
            </span>
            {post.author?.name && (
              <>
                <span className="text-[#063925]/30">·</span>
                <span className="text-[#1A3326] font-medium">
                  By {post.author.name}
                  {post.author.role ? ` (${post.author.role})` : ''}
                </span>
              </>
            )}
          </motion.div>

          {/* Article H1 (Refined to 48–54px desktop max, 30–34px mobile) */}
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="text-[30px] sm:text-[34px] md:text-[40px] lg:text-[46px] xl:text-[50px] font-semibold text-[#1A3326] font-['Manrope'] leading-[1.18] tracking-tight max-w-4xl"
          >
            {post.title}
          </motion.h1>
        </div>
      </header>

      {/* SECTION 02: ARTICLE COVER (Original authentic photograph, no AI overlays) */}
      <section className="w-full mb-8 sm:mb-12 lg:mb-14">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[540px] overflow-hidden rounded-[2px] bg-[#063925]/5 border border-[#063925]/10"
          >
            <img
              loading="eager"
              fetchPriority="high"
              decoding="async"
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* SECTION 03: ARTICLE READING EXPERIENCE (Narrow 740-780px column, comfortable 1.7 line-height) */}
      <section className="w-full mb-14 sm:mb-18">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 md:px-8">
          
          {/* COMPACT BORDER-LIGHT EDITORIAL TOC (Only when article has 4+ sections) */}
          {headings.length >= 4 && (
            <div className="my-7 sm:my-8 border-y border-[#063925]/12 py-3 sm:py-3.5">
              {/* Desktop compact 2-column index (No giant white box, no decorative bullet dots) */}
              <nav aria-label="Table of Contents" className="hidden md:block">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#063925] font-['Inter'] flex items-center gap-2">
                    <span className="w-2 h-[1px] bg-[#D4AF37]" />
                    <span>On This Page</span>
                  </span>
                  <span className="text-[11px] text-[#4A6356]/70 font-['Inter']">
                    {headings.length} sections
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[13px] text-[#4A6356] font-['Inter']">
                  {headings.map((h, i) => (
                    <a
                      key={h.slug}
                      href={`#${h.slug}`}
                      className="hover:text-[#063925] transition-colors leading-snug py-0.5 flex items-baseline gap-2 group truncate"
                    >
                      <span className="text-[10.5px] font-mono text-[#D4AF37] shrink-0">
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      <span className="group-hover:underline underline-offset-2 truncate">
                        {h.text}
                      </span>
                    </a>
                  ))}
                </div>
              </nav>

              {/* Mobile compact collapsible index */}
              <details className="md:hidden group/toc">
                <summary className="flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-[#063925] font-['Inter'] cursor-pointer list-none py-0.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-[1px] bg-[#D4AF37]" />
                    <span>On This Page ({headings.length})</span>
                  </span>
                  <span className="text-xs transition-transform duration-200 group-open/toc:rotate-180 text-[#4A6356]">
                    ↓
                  </span>
                </summary>
                <div className="pt-2 pb-1 space-y-1 text-xs text-[#4A6356] font-['Inter']">
                  {headings.map((h, i) => (
                    <a
                      key={h.slug}
                      href={`#${h.slug}`}
                      className="flex items-baseline gap-2 py-0.5 hover:text-[#063925] transition-colors"
                    >
                      <span className="text-[10px] font-mono text-[#D4AF37] shrink-0">
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      <span className="truncate">{h.text}</span>
                    </a>
                  ))}
                </div>
              </details>
            </div>
          )}

          {/* Main Article Body Blocks (Rendered without scroll-blocking paragraph animations) */}
          <div>
            {post.content.map((block, idx) => {
              if (block.type === 'paragraph') {
                return (
                  <p
                    key={idx}
                    className="text-[#2C3E35] text-[16px] sm:text-[16.5px] md:text-[17px] lg:text-[17.5px] font-['Inter'] font-normal leading-[1.7] mb-5"
                  >
                    {renderFormattedText(block.text)}
                  </p>
                );
              }

              if (block.type === 'heading') {
                headingCounter++;
                const slug = `section-${headingCounter}`;
                return (
                  <h2
                    key={idx}
                    id={slug}
                    className="scroll-mt-24 sm:scroll-mt-28 text-[21px] sm:text-[23px] md:text-[25px] font-semibold text-[#063925] font-['Manrope'] mt-8 sm:mt-10 mb-3 leading-snug tracking-tight"
                  >
                    {block.text}
                  </h2>
                );
              }

              if (block.type === 'blockquote') {
                return (
                  <blockquote
                    key={idx}
                    className="border-l-2 border-[#D4AF37] pl-4 sm:pl-5 my-6 sm:my-7 text-[17px] sm:text-[18px] text-[#1A3326] font-['Inter'] italic font-normal leading-[1.65] bg-transparent"
                  >
                    “{block.text.replace(/^["“]|["”]$/g, '')}”
                  </blockquote>
                );
              }

              if (block.type === 'list') {
                return (
                  <ul key={idx} className="space-y-2.5 my-5 pl-1 sm:pl-2">
                    {block.items.map((item, itemIdx) => {
                      const parts = item.split('**');
                      return (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-2.5 text-[#2C3E35] text-[15.5px] sm:text-[16.5px] font-['Inter'] leading-[1.7]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#063925] mt-2.5 shrink-0" />
                          <div>
                            {parts.map((part, partIdx) =>
                              partIdx % 2 === 1 ? (
                                <strong key={partIdx} className="font-semibold text-[#1A3326]">
                                  {part}
                                </strong>
                              ) : (
                                part
                              )
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              return null;
            })}
          </div>

          {/* Article Footer Divider */}
          <div className="pt-8 sm:pt-10 mt-8 sm:mt-10 border-t border-[#063925]/12 flex items-center justify-between">
            <Link
              to="/blog"
              className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-[#063925] hover:text-[#D4AF37] transition-colors font-['Inter'] group/back"
            >
              <span className="mr-1.5 transition-transform duration-200 group-hover/back:-translate-x-1">←</span>
              <span>Back to All Articles</span>
            </Link>
            <span className="text-xs text-[#4A6356] font-['Inter']">
              ASMA Financial Journal
            </span>
          </div>

        </div>
      </section>

      {/* SECTION 04: RELATED ARTICLES (Compact 3-column editorial preview with clean excerpts & baseline alignment) */}
      {relatedPosts.length > 0 && (
        <motion.section
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: easeOut }}
          className="w-full mb-14 sm:mb-18"
        >
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8">
            {/* Section Header */}
            <div className="flex items-center justify-between pb-3.5 mb-8 sm:mb-10 border-b border-[#063925]/12">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-[1.5px] bg-[#D4AF37]" />
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1A3326] font-['Manrope'] tracking-tight">
                  Related Articles
                </h2>
              </div>
              <Link
                to="/blog"
                className="text-xs font-semibold tracking-wider uppercase text-[#063925] hover:text-[#D4AF37] transition-colors font-['Inter']"
              >
                All Articles →
              </Link>
            </div>

            {/* 3-Column Editorial Grid (items-stretch ensures equal card heights & bottom CTA alignment) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {relatedPosts.map((related) => (
                <article
                  key={related.id}
                  className="group flex flex-col justify-between pb-6 md:pb-0 border-b md:border-b-0 border-[#063925]/10 h-full"
                >
                  <div className="flex flex-col flex-grow">
                    {/* Clean 16:9 Image */}
                    <Link
                      to={`/blog/${related.id}`}
                      className="block relative aspect-[16/10] overflow-hidden rounded-[2px] bg-[#063925]/5 border border-[#063925]/10 mb-3.5"
                    >
                      <img
                        loading="lazy"
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </Link>

                    {/* Kicker + Read Time */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#063925] font-['Inter']">
                        {related.category}
                      </span>
                      <span className="text-[#063925]/30 text-xs">·</span>
                      <span className="text-[11px] text-[#4A6356] font-['Inter']">
                        {related.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[16px] sm:text-[16.5px] font-semibold text-[#1A3326] font-['Manrope'] leading-snug group-hover:text-[#063925] transition-colors line-clamp-2 mb-2.5">
                      <Link to={`/blog/${related.id}`}>{related.title}</Link>
                    </h3>

                    {/* Excerpt (Line-clamp-3 ensures complete natural sentences without mid-word cutoffs) */}
                    <p className="text-[#4A6356] text-[12.5px] sm:text-[13px] font-['Inter'] leading-[1.6] line-clamp-3 mb-4 flex-grow">
                      {related.excerpt}
                    </p>
                  </div>

                  {/* Read Link pinned to baseline */}
                  <div className="pt-2 border-t border-[#063925]/10 mt-auto">
                    <Link
                      to={`/blog/${related.id}`}
                      className="inline-flex items-center text-[11px] font-semibold tracking-wider uppercase text-[#063925] hover:text-[#D4AF37] transition-colors font-['Inter'] group/link"
                    >
                      <span>Read Article</span>
                      <span className="ml-1 transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* SECTION 05: FINAL COURSES CTA (Compact forest-green editorial strip) */}
      <section className="w-full pb-16 sm:pb-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-[#063925] text-white rounded-[2px] p-6 sm:p-8 lg:p-10 border-l-4 border-[#D4AF37] relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
              <div className="max-w-2xl">
                <span className="text-[10.5px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-[#D4AF37] font-['Inter'] block mb-1.5">
                  ACADEMY PROGRAMS
                </span>
                <h2 className="text-xl sm:text-2xl md:text-[25px] font-semibold text-white font-['Manrope'] leading-tight mb-2">
                  Continue Learning with ASMA.
                </h2>
                <p className="text-white/80 text-xs sm:text-[13.5px] font-['Inter'] font-normal leading-relaxed">
                  Explore practical stock market training programs designed to build market understanding.
                </p>
              </div>

              <Link
                to="/courses"
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2f] text-[#063925] text-xs font-semibold tracking-wider uppercase rounded-[2px] transition-colors font-['Inter'] shrink-0 text-center font-medium"
              >
                Explore Courses →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </article>
  );
};

export default BlogPostSection;