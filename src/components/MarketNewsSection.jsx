import React, { useState, useEffect } from 'react';
import AnimatedSection from './AnimatedSection';

const MarketNewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const timestamp = Date.now();
        const etRssUrl = encodeURIComponent(`https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms?nocache=${timestamp}`);
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${etRssUrl}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'ok' && data.items && data.items.length > 0) {
          const parsedNews = data.items.slice(0, 6).map((item, index) => {
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

            let formattedDate = item.pubDate;
            try {
              formattedDate = new Date(item.pubDate.replace(' ', 'T')).toLocaleDateString('en-IN', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });
            } catch (e) {
              // fallback
            }

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
    <AnimatedSection className="pt-12 sm:pt-14 md:pt-16 pb-6 sm:pb-8 md:pb-10 bg-[#FAF9F6] relative">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#0B2117]/10 pb-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-5 h-[1.5px] bg-[#D4AF37] shrink-0" />
              <span
                className="text-[11.5px] sm:text-[12px] font-semibold tracking-[0.16em] uppercase text-[#063925]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                LIVE WIRE
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-['Manrope'] font-semibold text-[#1A3326] tracking-tight">
              Economic Times Market Intelligence
            </h2>
          </div>
          <a
            href="https://economictimes.indiatimes.com/markets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#063925] hover:text-[#D4AF37] font-['Inter'] font-semibold text-sm transition-colors uppercase tracking-wider"
          >
            Full Feed on ET
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-[4px] h-[360px] border border-[#0B2117]/10" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-[4px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-[#0B2117]/10 hover:border-[#D4AF37]"
              >
                <div className="h-44 relative overflow-hidden shrink-0 bg-[#0B2117]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white text-[11px] font-['Inter'] font-semibold uppercase tracking-wider bg-[#063925]/90 backdrop-blur-sm px-2.5 py-1 rounded-[4px] border border-white/20">
                    {item.pubDate}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-base font-['Manrope'] font-semibold text-[#1A3326] mb-3 group-hover:text-[#063925] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[#4A6356] text-xs font-['Inter'] font-normal leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {item.description}
                  </p>
                  <div className="text-[#063925] group-hover:text-[#D4AF37] text-xs font-['Inter'] font-semibold flex items-center gap-2 mt-auto uppercase tracking-wider transition-colors">
                    Read Story
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
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