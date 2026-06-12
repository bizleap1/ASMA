import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({ title, description, keywords, url, image, schema }) => {
  const siteTitle = 'Advait Share Market Academy - #1 Stock Market Training in Nagpur';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDesc = 'Learn stock market trading, technical analysis, and fundamental analysis from experts. Central India\'s most trusted share market academy.';
  const metaDesc = description || defaultDesc;
  const defaultImage = 'https://advaitacademy.in/og-image.jpg';
  const metaImage = image || defaultImage;
  const canonicalUrl = url || 'https://advaitacademy.in';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDesc} />
      {keywords && <meta name="keywords" content={keywords} />}

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
