/**
 * ASMA Centralized Route Manifest & Compliance Registry
 * Single Source of Truth for Sitemap, Crawl Rules, and Metadata Mapping.
 * 
 * Verified against React Router (src/App.jsx), blog posts (src/blogData.js),
 * and services (src/data.jsx).
 */

// 1. Core Hub & Legal Pages (10 URLs)
export const CORE_PAGES = [
  '/',
  '/about',
  '/courses',
  '/services',
  '/analysis',
  '/gallery',
  '/blog',
  '/contact',
  '/privacy',
  '/terms'
];

// 2. Flagship Course Pages (2 URLs)
export const COURSE_PAGES = [
  '/course/advanced-foundation',
  '/course/professional-master-program'
];

// 3. Core Stock Market Education & Training Services (5 URLs)
// Fully verified as educational programs matching ASMA core curriculum.
export const CORE_TRAINING_SERVICES = [
  '/service/share-market-training',
  '/service/psychological-training',
  '/service/derivatives-trading',
  '/service/algo-trading',
  '/service/commodity-currency'
];

// 4. Educational Blog Guides (11 URLs)
// Verified from src/blogData.js
export const BLOG_PAGES = [
  '/blog/education-first-predictions-never-asma',
  '/blog/live-market-training-stock-market-nagpur',
  '/blog/how-to-learn-stock-market-in-nagpur',
  '/blog/1-percent-risk-rule-stock-market-trading',
  '/blog/understanding-candlestick-patterns',
  '/blog/risk-management-strategies-intraday',
  '/blog/long-term-investing-vs-speculation',
  '/blog/demystifying-futures-and-options',
  '/blog/top-financial-ratios-fundamental-analysis',
  '/blog/psychology-of-successful-trading',
  '/blog/about-advait-stock-market-academy'
];

// 5. Services Flagged for SEBI / IRDAI Compliance Review (10 URLs)
// NOTE: As instructed in the SEO Audit, financial advisory (SEBI RIA/PMS)
// and insurance products (IRDAI) require licensing verification before
// official search engine indexing approval.
export const COMPLIANCE_REVIEW_SERVICES = [
  // Financial Advisory / Portfolio Management (4 URLs - requires SEBI registration verification)
  { path: '/service/stock-investment', category: 'Investment', requiresRegistration: 'SEBI RIA/RA' },
  { path: '/service/mutual-fund-investment', category: 'Investment', requiresRegistration: 'AMFI ARN' },
  { path: '/service/portfolio-management', category: 'Investment', requiresRegistration: 'SEBI PMS' },
  { path: '/service/financial-planning', category: 'Investment', requiresRegistration: 'SEBI RIA' },

  // Insurance Products (6 URLs - requires IRDAI intermediary license verification)
  { path: '/service/health-insurance', category: 'Insurance', requiresRegistration: 'IRDAI' },
  { path: '/service/term-insurance', category: 'Insurance', requiresRegistration: 'IRDAI' },
  { path: '/service/motor-insurance', category: 'Insurance', requiresRegistration: 'IRDAI' },
  { path: '/service/life-insurance', category: 'Insurance', requiresRegistration: 'IRDAI' },
  { path: '/service/travel-insurance', category: 'Insurance', requiresRegistration: 'IRDAI' },
  { path: '/service/property-insurance', category: 'Insurance', requiresRegistration: 'IRDAI' }
];

export const COMPLIANCE_REVIEW_SERVICE_PATHS = COMPLIANCE_REVIEW_SERVICES.map(s => s.path);

// All 15 service routes present in the codebase
export const ALL_SERVICE_PATHS = [
  ...CORE_TRAINING_SERVICES,
  ...COMPLIANCE_REVIEW_SERVICE_PATHS
];

/**
 * APPROVED_INDEXABLE_ROUTES
 * Verified clean pages approved for search engine sitemap and indexation.
 * Excludes compliance-review insurance/advisory pages until client confirms registrations.
 * Total count: 10 Core + 2 Courses + 5 Training Services + 11 Blogs = 28 URLs.
 */
export const APPROVED_INDEXABLE_ROUTES = [
  ...CORE_PAGES,
  ...COURSE_PAGES,
  ...CORE_TRAINING_SERVICES,
  ...BLOG_PAGES
];

/**
 * ALL_EXISTING_PUBLIC_ROUTES (Total: 38 URLs)
 * Used when full site crawl is needed across all 38 valid React Router URLs.
 */
export const ALL_EXISTING_PUBLIC_ROUTES = [
  ...CORE_PAGES,
  ...COURSE_PAGES,
  ...ALL_SERVICE_PATHS,
  ...BLOG_PAGES
];

// Private / Authenticated routes that must be excluded from sitemaps
export const EXCLUDED_FROM_SITEMAP = [
  '/login',
  '/dashboard',
  '/admin',
  '/admin/*',
  '/admin/login',
  '/admin/courses',
  '/admin/notes',
  '/admin/access-requests',
  '/admin/enrollments',
  '/admin/visitors'
];
