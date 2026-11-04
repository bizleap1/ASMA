import { Link } from 'react-router-dom';

const NotificationScroller = () => {
  const updates = [
    { text: <span>New Batch Starting After Diwali! <Link to="/courses#latest-updates" className="underline text-[#D4AF37] font-bold hover:text-white transition-colors ml-1">Enroll Now!</Link></span>, icon: <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { text: "Master Technical Analysis & Options Trading with Advait Academy.", icon: <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg> },
    { text: "Lifetime Mentorship & Practical Live-Market Training.", icon: <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  ];

  // Repeat for continuous scroll effect without gap
  const repeatedUpdates = [...updates, ...updates, ...updates, ...updates, ...updates, ...updates];

  return (
    <div className="bg-[#0B2117] text-white overflow-hidden flex items-center border-b border-white/10 relative z-30 h-8 md:h-9">
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0B2117] font-black px-3 md:px-4 h-full uppercase tracking-wider text-[11px] md:text-xs whitespace-nowrap z-10 shadow-[2px_0_10px_rgba(0,0,0,0.25)] shrink-0 flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 mr-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
        Latest Updates
      </div>
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        {/* Soft edge gradient fades */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0B2117] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0B2117] to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee whitespace-nowrap w-max pl-4">
          {repeatedUpdates.map((update, index) => (
            <span key={index} className="mx-6 md:mx-8 font-medium text-xs md:text-sm tracking-wide flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
              {update.icon}
              {update.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationScroller;
