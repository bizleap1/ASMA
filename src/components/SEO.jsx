import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, url, image, schema }) => {
  const siteTitle = 'Advait Share Market Academy - #1 Stock Market Training in Nagpur';
  const defaultTitle = 'ASMA Nagpur | Advait Stock Market & Trading Academy Nagpur';
  const fullTitle = title === 'Home' ? 'ASMA Nagpur | Advait Stock Market & Trading Academy Nagpur' : title ? `${title} | ${siteTitle}` : defaultTitle;
  const defaultDesc = 'Master the stock market with Advait Stock Market Academy (ASMA) in Nagpur. We offer premium trading courses on technical analysis, options trading, and financial freedom in India. Best trading classes in Nagpur.';
  const metaDesc = description || defaultDesc;
  const defaultKeywords = 'asma nagpur, trading nagpur, ASMA Nagpur, best stock market academy, best stock market academy in nagpur, Advait Stock Market Academy, stock market academy nagpur, best share market classes in nagpur, trading courses nagpur, options trading, technical analysis, stock market India, learn trading';
  const metaKeywords = keywords || defaultKeywords;
  const defaultImage = 'https://raw.githubusercontent.com/bizleap1/ASMA/main/public/logo-dark.png';
  const metaImage = image || defaultImage;
  const canonicalUrl = url || 'https://www.asmaonline.in';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDesc} />
      <meta property="twitter:image" content={metaImage} />

      {/* Schema Markup */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
