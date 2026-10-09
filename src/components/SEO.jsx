import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.asmaonline.in';
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo-dark.png`;

const SEO = ({
  title,
  description,
  keywords,
  url,
  path,
  image,
  type = 'website',
  noindex = false,
  schema
}) => {
  // 1. Dynamic Canonical URL Resolution
  let canonicalUrl = url;
  if (!canonicalUrl) {
    const cleanPath = path ? (path === '/' ? '' : path.replace(/\/$/, '')) : '';
    canonicalUrl = `${SITE_URL}${cleanPath}`;
  }

  // 2. Clean Title Resolution (≤ 60 chars target)
  let fullTitle = title;
  if (!title || title === 'Home') {
    fullTitle = 'Stock Market Classes in Nagpur | Advait Stock Market Academy';
  } else if (!title.includes('ASMA') && !title.includes('Advait')) {
    fullTitle = `${title} | ASMA Nagpur`;
  }

  // 3. Meta Description (≤ 155 chars target)
  const defaultDesc = 'Learn stock market trading and technical analysis in Nagpur with Advait Stock Market Academy (ASMA). Live market training, beginner to advanced courses.';
  const metaDesc = description || defaultDesc;

  // 4. Social Image Resolution
  const metaImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : DEFAULT_OG_IMAGE;

  // On client-side navigation, dynamically synchronize page JSON-LD schema into head
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    let scriptTag = document.querySelector('script[data-schema-page="true"]');
    if (!schema) {
      if (scriptTag) scriptTag.remove();
      return;
    }
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.setAttribute('data-schema-page', 'true');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema);
  }, [schema]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDesc} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content="Advait Stock Market Academy" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;
