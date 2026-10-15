import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-white px-4 py-24">
      <SEO
        title="404: Page Not Found | ASMA Nagpur"
        description="The page you are looking for does not exist or has been moved."
        noindex={true}
        path="/404"
      />
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center px-4 py-2 rounded-[4px] bg-[#063925]/10 text-[#063925] font-['Inter'] font-semibold text-xs tracking-wider uppercase border border-[#063925]/20">
          Error 404 &bull; Resource Not Found
        </div>
        <h1 className="text-3xl md:text-4xl font-['Manrope'] font-semibold text-[#1A3326] tracking-tight">
          Page Not Available
        </h1>
        <p className="text-[#4A6356] text-sm font-['Inter'] leading-relaxed">
          The link you followed may be outdated, or the page may have been relocated. You can navigate back to the homepage or explore our stock market courses.
        </p>
        <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#063925] hover:bg-[#0B2117] text-white font-['Inter'] font-semibold text-xs uppercase tracking-wider rounded-[4px] transition-colors shadow-sm"
          >
            Return to Homepage
          </Link>
          <Link
            to="/courses"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#F2F5F3] hover:bg-white text-[#1A3326] hover:text-[#063925] font-['Inter'] font-semibold text-xs uppercase tracking-wider rounded-[4px] border border-[#0B2117]/10 transition-colors shadow-sm"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
