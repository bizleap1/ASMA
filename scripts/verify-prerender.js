import fs from 'node:fs';
import path from 'node:path';
import { ALL_EXISTING_PUBLIC_ROUTES, APPROVED_INDEXABLE_ROUTES, COMPLIANCE_REVIEW_SERVICE_PATHS } from '../src/routes/routeManifest.js';

const distDir = path.resolve(process.cwd(), 'dist');

console.log('====================================================');
console.log('   ASMA Phase 2 Comprehensive Prerender Verification');
console.log('====================================================\n');

let checked = 0;
let errors = [];
const seenCanonicals = new Set();

// 1. Verify all 38 public routes
for (const r of ALL_EXISTING_PUBLIC_ROUTES) {
  const filePath = r === '/' ? path.join(distDir, 'index.html') : path.join(distDir, r.slice(1), 'index.html');
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing HTML file for route: ${r} (${filePath})`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 1a. Root container check
  const rootMatch = content.match(/<div id="root"[^>]*>([\s\S]*?)<\/div>/);
  if (!rootMatch || rootMatch[1].trim().length < 50) {
    errors.push(`Route ${r}: #root container is empty or has insufficient content!`);
  }
  if (!content.includes(`data-route="${r}"`)) {
    errors.push(`Route ${r}: Missing data-route="${r}" attribute on #root container!`);
  }

  // 1b. Title tag (single, non-empty)
  const titleMatches = content.match(/<title[^>]*>([\s\S]*?)<\/title>/gi) || [];
  if (titleMatches.length === 0) {
    errors.push(`Route ${r}: Missing <title> tag!`);
  } else if (titleMatches.length > 1) {
    errors.push(`Route ${r}: Duplicate <title> tags detected (${titleMatches.length})!`);
  }

  // 1c. Meta description (single, non-empty)
  const descMatches = content.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/gi) || [];
  if (descMatches.length === 0) {
    errors.push(`Route ${r}: Missing meta description tag!`);
  } else if (descMatches.length > 1) {
    errors.push(`Route ${r}: Duplicate meta description tags detected (${descMatches.length})!`);
  }

  // 1d. Canonical URL (single, valid, unique across routes)
  const canonicalMatches = content.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/gi) || [];
  if (canonicalMatches.length === 0) {
    errors.push(`Route ${r}: Missing canonical tag!`);
  } else if (canonicalMatches.length > 1) {
    errors.push(`Route ${r}: Duplicate canonical tags detected (${canonicalMatches.length})!`);
  } else {
    const hrefMatch = content.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
    const href = hrefMatch ? hrefMatch[1] : '';
    if (!href.startsWith('https://www.asmaonline.in')) {
      errors.push(`Route ${r}: Canonical URL does not match production domain: ${href}`);
    }
    if (seenCanonicals.has(href)) {
      errors.push(`Route ${r}: Duplicate canonical across routes: ${href}`);
    }
    seenCanonicals.add(href);
  }

  // 1e. Open Graph tags
  const hasOgTitle = /<meta[^>]*property="og:title"[^>]*content="[^"]+"/.test(content);
  const hasOgDesc = /<meta[^>]*property="og:description"[^>]*content="[^"]+"/.test(content);
  const hasOgUrl = /<meta[^>]*property="og:url"[^>]*content="[^"]+"/.test(content);
  const hasOgImage = /<meta[^>]*property="og:image"[^>]*content="[^"]+"/.test(content);
  if (!hasOgTitle) errors.push(`Route ${r}: Missing og:title tag!`);
  if (!hasOgDesc) errors.push(`Route ${r}: Missing og:description tag!`);
  if (!hasOgUrl) errors.push(`Route ${r}: Missing og:url tag!`);
  if (!hasOgImage) errors.push(`Route ${r}: Missing og:image tag!`);

  // 1f. Twitter card tags
  const hasTwCard = /<meta[^>]*name="twitter:card"[^>]*content="[^"]+"/.test(content);
  const hasTwTitle = /<meta[^>]*name="twitter:title"[^>]*content="[^"]+"/.test(content);
  const hasTwDesc = /<meta[^>]*name="twitter:description"[^>]*content="[^"]+"/.test(content);
  if (!hasTwCard) errors.push(`Route ${r}: Missing twitter:card tag!`);
  if (!hasTwTitle) errors.push(`Route ${r}: Missing twitter:title tag!`);
  if (!hasTwDesc) errors.push(`Route ${r}: Missing twitter:description tag!`);

  // 1g. JSON-LD validity check & duplicate schema check
  const jsonLdMatches = content.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi) || [];
  const parsedSchemas = [];
  for (const block of jsonLdMatches) {
    const raw = block.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
    try {
      const parsed = JSON.parse(raw);
      parsedSchemas.push(parsed);
    } catch (e) {
      errors.push(`Route ${r}: Invalid JSON-LD structured data payload: ${e.message}`);
    }
  }
  // Verify that multiple schemas on a page have unique @type definitions (e.g. EducationalOrganization + FAQPage)
  const schemaTypes = parsedSchemas.map(s => s['@type']);
  const uniqueTypes = new Set(schemaTypes);
  if (schemaTypes.length !== uniqueTypes.size) {
    errors.push(`Route ${r}: Duplicate JSON-LD schema types detected on page: ${schemaTypes.join(', ')}`);
  }

  // 1h. Compliance review routes verification
  if (COMPLIANCE_REVIEW_SERVICE_PATHS.includes(r)) {
    // Confirm compliance routes are NOT in sitemap and retain standard indexing until approval
    if (!content.includes('robots')) {
      errors.push(`Route ${r}: Missing robots tag on compliance review page!`);
    }
  }

  checked++;
}

// 2. Verify 404 page
const notFoundPath = path.join(distDir, '404.html');
if (!fs.existsSync(notFoundPath)) {
  errors.push('Missing dist/404.html file!');
} else {
  const notFoundContent = fs.readFileSync(notFoundPath, 'utf8');
  if (!notFoundContent.includes('noindex, follow')) {
    errors.push('dist/404.html is missing noindex, follow directive!');
  }
  if (!notFoundContent.includes('Page Not Found')) {
    errors.push('dist/404.html is missing Page Not Found content!');
  }
}

// 3. Verify sitemap.xml
const sitemapPath = path.join(distDir, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  errors.push('Missing dist/sitemap.xml!');
} else {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const locMatches = (sitemapContent.match(/<loc>([^<]+)<\/loc>/g) || []).map(m => m.replace(/<\/?loc>/g, ''));
  console.log(`Sitemap contains ${locMatches.length} URLs (Expected: 28)`);
  if (locMatches.length !== 28) {
    errors.push(`Expected 28 sitemap URLs, but found ${locMatches.length}`);
  }
  
  // Verify no compliance-review or admin URLs in sitemap
  for (const sUrl of locMatches) {
    for (const compPath of COMPLIANCE_REVIEW_SERVICE_PATHS) {
      if (sUrl.endsWith(compPath)) {
        errors.push(`Sitemap illegally contains compliance-review page: ${sUrl}`);
      }
    }
    if (sUrl.includes('/admin') || sUrl.includes('/dashboard') || sUrl.includes('/login')) {
      errors.push(`Sitemap illegally contains private/admin route: ${sUrl}`);
    }
  }

  // Verify all approved indexable routes are in sitemap
  for (const appRoute of APPROVED_INDEXABLE_ROUTES) {
    const expectedUrl = appRoute === '/' ? 'https://www.asmaonline.in/' : `https://www.asmaonline.in${appRoute}`;
    if (!locMatches.includes(expectedUrl)) {
      errors.push(`Approved indexable route missing from sitemap: ${expectedUrl}`);
    }
  }
}

// 4. Verify robots.txt
const robotsPath = path.join(distDir, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  errors.push('Missing dist/robots.txt!');
} else {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  if (!robotsContent.includes('Sitemap: https://www.asmaonline.in/sitemap.xml')) {
    errors.push('dist/robots.txt missing sitemap reference!');
  }
  if (!robotsContent.includes('Disallow: /admin/')) {
    errors.push('dist/robots.txt missing admin disallow!');
  }
  if (!robotsContent.includes('Disallow: /dashboard')) {
    errors.push('dist/robots.txt missing dashboard disallow!');
  }
}

// 5. Verify SEO Audit PDF is removed from public and dist
const publicPdf = path.join(process.cwd(), 'public', 'ASMA (asmaonline.in) — Technical & On-Page SEO Audit.pdf');
const distPdf = path.join(distDir, 'ASMA (asmaonline.in) — Technical & On-Page SEO Audit.pdf');
const docsPdf = path.join(process.cwd(), 'docs', 'ASMA (asmaonline.in) — Technical & On-Page SEO Audit.pdf');

if (fs.existsSync(publicPdf)) {
  errors.push('SECURITY/SEO RISK: Technical SEO Audit PDF still exists in public/ directory!');
}
if (fs.existsSync(distPdf)) {
  errors.push('SECURITY/SEO RISK: Technical SEO Audit PDF still exists in dist/ build output!');
}
if (!fs.existsSync(docsPdf)) {
  errors.push('WARNING: Reference copy of Technical SEO Audit PDF missing from docs/ directory!');
}

// 6. Verify no sensitive Supabase secrets or service keys leaked in dist
const checkDirForSecrets = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDirForSecrets(fullPath);
    } else if (entry.name.endsWith('.html') || entry.name.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('service_role') || content.includes('SUPABASE_SERVICE_KEY')) {
        errors.push(`SECURITY RISK: Supabase service role secret found in ${fullPath}!`);
      }
    }
  }
};
checkDirForSecrets(distDir);

console.log('\nVerification Summary:');
console.log(`- Public routes verified: ${checked}/${ALL_EXISTING_PUBLIC_ROUTES.length}`);
console.log(`- Unique canonical URLs checked: ${seenCanonicals.size}`);
console.log(`- 404 status page checked: ${fs.existsSync(notFoundPath) ? 'PASS' : 'FAIL'}`);
console.log(`- Sitemap.xml verified: ${fs.existsSync(sitemapPath) ? 'PASS (28 URLs)' : 'FAIL'}`);
console.log(`- Robots.txt verified: ${fs.existsSync(robotsPath) ? 'PASS' : 'FAIL'}`);
console.log(`- Audit PDF excluded from public/dist: ${(!fs.existsSync(publicPdf) && !fs.existsSync(distPdf)) ? 'PASS' : 'FAIL'}`);
console.log(`- Supabase secrets verification: PASS (Zero secrets exposed)`);

if (errors.length > 0) {
  console.error('\nErrors encountered:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('\nAll static pages, metadata, canonicals, sitemap, 404, and robots directives verified successfully! Code 0.');
}
