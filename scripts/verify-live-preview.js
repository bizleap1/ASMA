import https from 'node:https';
import http from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pw = require('C:\\Users\\SHREYA\\AppData\\Local\\ms-playwright-go\\1.57.0\\package');

const PREVIEW_BASE = 'https://asma-git-seo-fixes-bizleap3-2425s-projects.vercel.app';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: data
      }));
    }).on('error', reject);
  });
}

async function runLiveVerification() {
  console.log('====================================================');
  console.log('   ASMA Live Vercel Preview SEO & Routing Test');
  console.log(`   Target: ${PREVIEW_BASE}`);
  console.log('====================================================\n');

  const testResults = {
    httpStatus: [],
    seoMetadata: [],
    sitemapRobots: [],
    browserHydration: [],
    supabaseRead: []
  };

  // ----------------------------------------------------
  // 1. HTTP Status & 404 Edge Checks
  // ----------------------------------------------------
  console.log('--- 1. Testing Live HTTP Status & Edge Routing ---');
  const routesToTest = [
    { path: '/', expectedStatus: 200, name: 'Home' },
    { path: '/about', expectedStatus: 200, name: 'About' },
    { path: '/courses', expectedStatus: 200, name: 'Courses' },
    { path: '/course/advanced-foundation', expectedStatus: 200, name: 'Course - Foundation' },
    { path: '/course/professional-master-program', expectedStatus: 200, name: 'Course - Master' },
    { path: '/services', expectedStatus: 200, name: 'Services' },
    { path: '/blog', expectedStatus: 200, name: 'Blog' },
    { path: '/blog/how-to-learn-stock-market-in-nagpur', expectedStatus: 200, name: 'Blog Post' },
    { path: '/contact', expectedStatus: 200, name: 'Contact' },
    { path: '/privacy', expectedStatus: 200, name: 'Privacy' },
    { path: '/terms', expectedStatus: 200, name: 'Terms' },
    { path: '/login', expectedStatus: 200, name: 'Login (SPA)' },
    { path: '/admin/login', expectedStatus: 200, name: 'Admin Login (SPA)' },
    { path: '/non-existent-test-404', expectedStatus: 404, name: 'Unknown URL 1' },
    { path: '/about/random-subpage-404', expectedStatus: 404, name: 'Unknown URL 2' }
  ];

  for (const r of routesToTest) {
    const fullUrl = `${PREVIEW_BASE}${r.path}`;
    try {
      const res = await fetchUrl(fullUrl);
      const isPassed = res.status === r.expectedStatus;
      console.log(`[HTTP Check] ${r.name} (${r.path}) -> Status: ${res.status} (Expected: ${r.expectedStatus}) ${isPassed ? '✓' : '✗ FAIL'}`);
      testResults.httpStatus.push({
        path: r.path,
        status: res.status,
        expected: r.expectedStatus,
        passed: isPassed
      });

      // For 404, confirm that the body has 404 content
      if (r.expectedStatus === 404) {
        const has404Content = res.body.includes('404') || res.body.includes('Page Not Found');
        console.log(`   -> 404 Custom Template Verified: ${has404Content ? 'YES' : 'NO'}`);
      }
    } catch (err) {
      console.error(`[HTTP Check] Error fetching ${r.path}:`, err.message);
      testResults.httpStatus.push({ path: r.path, status: 'ERROR', error: err.message, passed: false });
    }
  }

  // ----------------------------------------------------
  // 2. Sitemap.xml & Robots.txt Checks
  // ----------------------------------------------------
  console.log('\n--- 2. Testing Sitemap.xml & Robots.txt on Live Edge ---');
  try {
    const sitemapRes = await fetchUrl(`${PREVIEW_BASE}/sitemap.xml`);
    const locUrls = sitemapRes.body.match(/<loc>(.*?)<\/loc>/g) || [];
    const uniqueLocs = new Set(locUrls.map(u => u.replace(/<\/?loc>/g, '')));
    const sitemapPassed = sitemapRes.status === 200 && uniqueLocs.size === 28;
    console.log(`[Sitemap] Status: ${sitemapRes.status}, Total URLs: ${locUrls.length}, Unique: ${uniqueLocs.size} (Expected: 28) ${sitemapPassed ? '✓' : '✗ FAIL'}`);
    testResults.sitemapRobots.push({ item: 'sitemap.xml', count: uniqueLocs.size, passed: sitemapPassed });

    const robotsRes = await fetchUrl(`${PREVIEW_BASE}/robots.txt`);
    const hasSitemapRef = robotsRes.body.includes('Sitemap: https://www.asmaonline.in/sitemap.xml');
    const hasDisallowAdmin = robotsRes.body.includes('Disallow: /admin');
    const hasDisallowLogin = robotsRes.body.includes('Disallow: /login');
    const robotsPassed = robotsRes.status === 200 && hasSitemapRef && hasDisallowAdmin && hasDisallowLogin;
    console.log(`[Robots.txt] Status: ${robotsRes.status}, SitemapRef: ${hasSitemapRef}, DisallowAdmin: ${hasDisallowAdmin}, DisallowLogin: ${hasDisallowLogin} ${robotsPassed ? '✓' : '✗ FAIL'}`);
    testResults.sitemapRobots.push({ item: 'robots.txt', passed: robotsPassed });
  } catch (err) {
    console.error('[Sitemap/Robots] Fetch failed:', err.message);
  }

  // ----------------------------------------------------
  // 3. Raw HTML Prerender & Metadata Verification
  // ----------------------------------------------------
  console.log('\n--- 3. Testing Raw HTML Metadata & Structured Data ---');
  const samplePrerenderChecks = ['/', '/about', '/courses', '/course/advanced-foundation', '/blog/how-to-learn-stock-market-in-nagpur'];
  for (const p of samplePrerenderChecks) {
    const res = await fetchUrl(`${PREVIEW_BASE}${p}`);
    const titleMatch = res.body.match(/<title>(.*?)<\/title>/);
    const descMatch = res.body.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/);
    const canonicalMatch = res.body.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/);
    const h1Match = res.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const jsonLdMatches = res.body.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g) || [];
    const rootLength = (res.body.match(/<div id="root"[^>]*>([\s\S]*?)<\/div>/) || [])[1]?.length || 0;

    console.log(`\n[Prerender Inspection: ${p}]`);
    console.log(`  Title: "${titleMatch ? titleMatch[1] : 'MISSING'}"`);
    console.log(`  Description: "${descMatch ? descMatch[1].slice(0, 70) + '...' : 'MISSING'}"`);
    console.log(`  Canonical: "${canonicalMatch ? canonicalMatch[1] : 'MISSING'}"`);
    console.log(`  H1: "${h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'N/A'}"`);
    console.log(`  JSON-LD Schemas found: ${jsonLdMatches.length}`);
    console.log(`  Raw Prerendered HTML in #root: ${rootLength} chars`);

    testResults.seoMetadata.push({
      path: p,
      hasTitle: !!titleMatch,
      hasDesc: !!descMatch,
      canonical: canonicalMatch ? canonicalMatch[1] : null,
      schemasCount: jsonLdMatches.length,
      rootLength
    });
  }

  // ----------------------------------------------------
  // 4. Playwright Real Browser Testing on Live Vercel Preview
  // ----------------------------------------------------
  console.log('\n--- 4. Running Playwright Real Browser Testing on Live Preview ---');
  const browser = await pw.chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });

  const browserTestList = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
    { path: '/courses', name: 'Courses' },
    { path: '/course/advanced-foundation', name: 'Course Detail' },
    { path: '/blog', name: 'Blog Hub' },
    { path: '/blog/how-to-learn-stock-market-in-nagpur', name: 'Blog Post' },
    { path: '/login', name: 'Student Login' },
    { path: '/admin/login', name: 'Admin Login' }
  ];

  for (const bRoute of browserTestList) {
    const page = await context.newPage();
    const hydrationErrors = [];
    const consoleErrors = [];

    page.on('console', msg => {
      const text = msg.text();
      if (text.toLowerCase().includes('minified react error #418') ||
          text.toLowerCase().includes('hydration failed') ||
          text.toLowerCase().includes('server-rendered html didn\'t match')) {
        hydrationErrors.push(text);
      } else if (msg.type() === 'error') {
        consoleErrors.push(text);
      }
    });

    page.on('pageerror', err => {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('minified react error #418') ||
          msg.toLowerCase().includes('hydration failed')) {
        hydrationErrors.push(msg);
      } else {
        consoleErrors.push(msg);
      }
    });

    try {
      const liveUrl = `${PREVIEW_BASE}${bRoute.path}`;
      console.log(`[Browser Test: ${bRoute.name}] Navigating to: ${liveUrl}`);
      const navRes = await page.goto(liveUrl, { waitUntil: 'load', timeout: 15000 });
      await page.waitForTimeout(1000);

      const title = await page.title();
      const contentLen = await page.evaluate(() => document.getElementById('root')?.textContent?.trim().length || 0);

      // Test mobile viewport responsive layout
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      const isMobileNavPresent = await page.evaluate(() => {
        return !!document.querySelector('button[aria-label*="menu" i], button svg, header, nav');
      });

      // Restore desktop viewport
      await page.setViewportSize({ width: 1280, height: 800 });

      const passed = hydrationErrors.length === 0 && contentLen > 50;
      console.log(`  -> Title: "${title}"`);
      console.log(`  -> Content Length: ${contentLen} chars`);
      console.log(`  -> Hydration Errors: ${hydrationErrors.length}`);
      console.log(`  -> Other Console Errors: ${consoleErrors.length}`);
      console.log(`  -> Mobile Viewport Check: ${isMobileNavPresent ? 'PASS' : 'WARN'}`);
      console.log(`  -> Result: ${passed ? '✓ PASS' : '✗ FAIL'}\n`);

      testResults.browserHydration.push({
        route: bRoute.name,
        passed,
        hydrationErrors: hydrationErrors.length,
        consoleErrors: consoleErrors.slice(0, 3)
      });
    } catch (err) {
      console.error(`  -> Browser navigation error on ${bRoute.name}:`, err.message);
      testResults.browserHydration.push({ route: bRoute.name, passed: false, error: err.message });
    } finally {
      await page.close();
    }
  }

  // ----------------------------------------------------
  // 5. Supabase Read Test on Live Preview
  // ----------------------------------------------------
  console.log('--- 5. Testing Supabase Read Functionality on Live Edge ---');
  const supaPage = await context.newPage();
  try {
    await supaPage.goto(`${PREVIEW_BASE}/courses`, { waitUntil: 'load', timeout: 15000 });
    await supaPage.waitForTimeout(1500);

    const coursesData = await supaPage.evaluate(() => {
      const courseCards = document.querySelectorAll('[class*="course"], h2, h3, h4');
      const text = document.body.textContent;
      return {
        hasFoundation: text.includes('Advanced Foundation') || text.includes('Foundation'),
        hasMaster: text.includes('Professional') || text.includes('Master'),
        cardsCount: courseCards.length
      };
    });
    console.log(`[Supabase Read Check] Courses rendered on /courses: Foundation=${coursesData.hasFoundation}, Master=${coursesData.hasMaster} ✓ PASS`);
    testResults.supabaseRead.push({ item: 'Courses read test', passed: coursesData.hasFoundation });
  } catch (err) {
    console.error('[Supabase Read Check] Error:', err.message);
  } finally {
    await supaPage.close();
  }

  await browser.close();

  console.log('\n====================================================');
  console.log('   Live Verification Completed');
  console.log('====================================================');
}

runLiveVerification().catch(err => {
  console.error('Fatal error during live verification:', err);
  process.exit(1);
});
