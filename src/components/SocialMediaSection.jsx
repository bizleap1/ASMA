import React, { useState, useEffect } from 'react';

const TypewriterText = ({ words }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    let timeout;
    
    if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        // short pause before typing next word
        timeout = setTimeout(() => {}, 200); 
      } else {
        timeout = setTimeout(() => {
          setCurrentText(word.substring(0, currentText.length - 1));
        }, 50); // deleting speed
      }
    } else {
      if (currentText === word) {
        // pause before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2500); 
      } else {
        timeout = setTimeout(() => {
          setCurrentText(word.substring(0, currentText.length + 1));
        }, 120); // typing speed
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className="text-[#d4af37] inline-block min-w-[140px]">
      {currentText}
      <span className="animate-[pulse_1s_infinite] ml-1 font-light opacity-70">|</span>
    </span>
  );
};

// Video Modal Component
const VideoModal = ({ media, onClose }) => {
  if (!media) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl z-10 animate-[fadeIn_0.3s_ease-out]">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 md:top-4 md:-right-16 text-white hover:text-[#d4af37] transition-colors z-20 bg-black/50 md:bg-transparent rounded-full p-2"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="relative pt-[56.25%] w-full"> {/* 16:9 Aspect Ratio */}
          {media.type === 'youtube' ? (
            <iframe 
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${media.id}?autoplay=1`} 
              title={media.title}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          ) : (
            <iframe 
              className="absolute inset-0 w-full h-full"
              src={`https://www.instagram.com/reel/${media.id}/embed`} 
              title={media.title}
              frameBorder="0" 
              scrolling="no"
              allowTransparency="true"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

// Sample Data (Replace with real data later)
const featuredMedia = [
  {
    type: 'youtube',
    id: 'NpEaa2P7qZI', // Placeholder ID
    title: 'Stock Market Basics',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
    tag: 'TUTORIAL'
  },
  {
    type: 'instagram',
    id: 'C_123456789', // Placeholder ID
    title: 'Live Trade Breakdown',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop',
    tag: 'REEL'
  },
  {
    type: 'youtube',
    id: 'NpEaa2P7qZI', // Placeholder ID
    title: 'Understanding Price Action',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
    tag: 'ANALYSIS'
  }
];

const PhoneMockup = ({ type }) => {
  return (
    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-[75%] bg-[#0f1419] rounded-t-[2.5rem] border-[6px] border-black shadow-2xl flex flex-col overflow-hidden">
      {/* Dynamic Island / Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[35%] h-5 bg-black rounded-full z-20"></div>
      
      {/* Screen Content */}
      <div className="w-full h-full pt-10 px-4 relative flex flex-col items-center">
        {type === 'instagram' && (
           <div className="w-full flex flex-col items-center mt-2">
             <div className="w-full flex justify-between items-center mb-4 px-2">
               <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
               <span className="text-white text-xs font-bold">asma_stockmarket</span>
               <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
             </div>
             <div className="flex gap-6 items-center w-full px-2 mb-4">
               <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px] shrink-0">
                 <div className="w-full h-full rounded-full bg-black border-2 border-black bg-[url('/logo.png')] bg-cover bg-center"></div>
               </div>
               <div className="flex-1 flex justify-between text-white text-center">
                 <div><strong className="block text-sm font-bold">32</strong><span className="text-[10px] text-gray-300">posts</span></div>
                 <div><strong className="block text-sm font-bold">135</strong><span className="text-[10px] text-gray-300">followers</span></div>
                 <div><strong className="block text-sm font-bold">73</strong><span className="text-[10px] text-gray-300">following</span></div>
               </div>
             </div>
             <div className="w-full text-white text-[10px] px-2 mb-2 leading-tight text-left">
               <strong className="block mb-0.5">Advait Stock Market Academy | Satish Bobade</strong>
               <span className="text-gray-300">ASMA | Stock Market Academy<br/>Live Trading & Practical Training<br/>Offline + Online Courses</span>
             </div>
             <div className="w-full bg-[#363636] rounded-md h-8 mt-1 flex justify-center items-center text-white text-xs font-bold">
               Following 
             </div>
           </div>
        )}

        {type === 'youtube' && (
           <div className="w-full flex flex-col mt-2 space-y-4">
             <div className="w-full h-24 bg-gray-800 rounded-lg relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 bg-[url('/hero_analysis_bg.webp')] bg-cover opacity-50"></div>
                 <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white z-10"><svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6V4z" /></svg></div>
             </div>
             <div className="flex items-center gap-3 w-full">
               <div className="w-10 h-10 rounded-full bg-white shrink-0 bg-[url('/logo.png')] bg-cover bg-center"></div>
               <div className="flex-1">
                 <div className="text-white text-[11px] font-bold leading-tight mb-1">advait share market academy</div>
                 <div className="text-gray-400 text-[9px]">@advaitsharemarketacademy-x5p • 2 subscribers</div>
               </div>
             </div>
             <div className="w-full flex gap-2">
               <div className="flex-1 bg-white text-black text-xs font-bold rounded-full py-1.5 text-center">Subscribe</div>
               <div className="flex-1 bg-[#272727] text-white text-xs font-bold rounded-full py-1.5 text-center">Videos</div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

const SocialMediaSection = () => {
  const [activeMedia, setActiveMedia] = useState(null);

  return (
    <section className="py-12 md:py-20 bg-gray-50 flex flex-col items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[#d4af37] font-bold uppercase tracking-[0.2em] text-xs md:text-sm mb-3">VIDEO</p>
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-display font-black text-text-primary leading-tight">
            Learn Stock Market Basics Watch Our Video On<br />
            <TypewriterText words={['YouTube', 'Instagram']} /> Today Now
          </h2>
        </div>

        {/* 2 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto mb-16 md:mb-24">
          
          {/* Instagram Card */}
          <div className="bg-[#166534] rounded-[2rem] pt-10 px-6 flex flex-col items-center text-center overflow-hidden h-[450px] relative shadow-xl border border-[#166534]/20 group">
            <h3 className="text-white/90 font-bold uppercase tracking-widest text-xs md:text-sm mb-2 drop-shadow-sm">INSTAGRAM</h3>
            <p className="text-white font-black text-3xl md:text-4xl mb-8 drop-shadow-md">32 POSTS</p>
            <a href="https://instagram.com/asma_stockmarket" target="_blank" rel="noopener noreferrer" className="bg-[#d4af37] text-[#166534] font-black uppercase tracking-widest text-sm px-12 py-4 rounded-full hover:bg-white transition-all z-10 hover:-translate-y-1 shadow-lg">
              FOLLOW
            </a>
            <div className="group-hover:translate-y-4 transition-transform duration-500 ease-out absolute bottom-0 w-full h-[75%] flex justify-center">
              <PhoneMockup type="instagram" />
            </div>
          </div>

          {/* YouTube Card */}
          <div className="bg-[#166534] rounded-[2rem] pt-10 px-6 flex flex-col items-center text-center overflow-hidden h-[450px] relative shadow-xl border border-[#166534]/20 group">
            <h3 className="text-white/90 font-bold uppercase tracking-widest text-xs md:text-sm mb-2 drop-shadow-sm">YOUTUBE</h3>
            <p className="text-white font-black text-3xl md:text-4xl mb-8 drop-shadow-md">22 VIDEOS</p>
            <a href="https://youtube.com/@advaitsharemarketacademy-x5p" target="_blank" rel="noopener noreferrer" className="bg-[#d4af37] text-[#166534] font-black uppercase tracking-widest text-sm px-12 py-4 rounded-full hover:bg-white transition-all z-10 hover:-translate-y-1 shadow-lg">
              SUBSCRIBE
            </a>
            <div className="group-hover:translate-y-4 transition-transform duration-500 ease-out absolute bottom-0 w-full h-[75%] flex justify-center">
              <PhoneMockup type="youtube" />
            </div>
          </div>
        </div>

        {/* Featured Video Gallery */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-text-primary">Featured Content</h3>
            <div className="h-0.5 flex-1 bg-gray-200 ml-6 hidden md:block"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredMedia.map((media, idx) => (
              <div 
                key={idx}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
                onClick={() => setActiveMedia(media)}
              >
                {/* Thumbnail Image */}
                <div className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
                  <img src={media.thumbnail} alt={media.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#166534] shadow-lg group-hover:scale-110 group-hover:bg-[#d4af37] transition-all duration-300">
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4l12 6-12 6V4z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Platform Icon Badge */}
                  <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5">
                    {media.type === 'youtube' ? (
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/></svg>
                    ) : (
                      <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.20 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 border border-gray-100 border-t-0 rounded-b-2xl">
                  <div className="text-[10px] font-bold text-[#d4af37] tracking-widest mb-1">{media.tag}</div>
                  <h4 className="text-text-primary font-bold text-sm leading-tight line-clamp-2">{media.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      
      {/* Video Modal Render */}
      <VideoModal media={activeMedia} onClose={() => setActiveMedia(null)} />
    </section>
  );
};

export default SocialMediaSection;
