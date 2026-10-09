import React from 'react';
import { useLocation } from 'react-router-dom';
import SEO from './SEO';

const PageWrapper = ({ children, backHash, seoTitle, seoDesc, seoKeywords, noindex = false, schema }) => {
  const location = useLocation();

  return (
    <main className="flex-grow pt-0 pb-12 min-h-screen relative bg-bg-secondary/5">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        path={location.pathname}
        noindex={noindex}
        schema={schema}
      />
      {children}
    </main>
  );
};

export default PageWrapper;