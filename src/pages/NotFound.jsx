import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-bg-primary px-4 py-20">
      <SEO
        title="404: Page Not Found | ASMA Nagpur"
        description="The page you are looking for does not exist or has been moved."
        noindex={true}
        path="/404"
      />
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-primary/10 text-accent-primary font-bold text-3xl font-display border border-accent-primary/20">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">
          Page Not Found
        </h1>
        <p className="text-text-secondary text-base leading-relaxed">
          The link you followed may be broken, or the page may have been removed. Explore our stock market courses or return home.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-accent-primary hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Return to Homepage
          </Link>
          <Link
            to="/courses"
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-gray-50 text-text-primary font-bold text-xs uppercase tracking-widest rounded-xl border border-black/10 transition-all shadow-sm"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
