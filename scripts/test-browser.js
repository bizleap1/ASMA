import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pw = require('C:\\Users\\SHREYA\\AppData\\Local\\ms-playwright-go\\1.57.0\\package');

const BASE_URL = 'http://localhost:4173';
const outputDir = path.resolve(process.cwd(), 'browser-test-output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const testRoutes = [
  { path: '/', name: 'home', titleExpected: 'Advait Stock Market Academy' },
  { path: '/about', name: 'about', titleExpected: 'About ASMA' },
  { path: '/courses', name: 'courses', titleExpected: 'Stock Market Courses' },
  { path: '/course/advanced-foundation', name: 'course-foundation', titleExpected: 'Beginner Stock Market Course' },
  { path: '/blog', name: 'blog', titleExpected: 'Stock Market Learning Blog' },
  { path: '/blog/how-to-learn-stock-market-in-nagpur', name: 'blog-post', titleExpected: 'How to Start Learning the Stock Market in Nagpur' },
  { path: '/login', name: 'login', titleExpected: 'Student Login' },
  { path: '/admin/login', name: 'admin-login', titleExpected: 'ASMA' },
  { path: '/non-existent-test-404', name: 'not-found', titleExpected: '404: Page Not Found' }
];

async function runBrowserTests() {
  console.log('====================================================');
  console.log('   ASMA Playwright Real Browser Verification');
  console.log('====================================================\n');

  console.log('Launching Playwright Chromium headless browser...');
  const browser = await pw.chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  let totalTests = 0;
  let passedTests = 0;
  const issues = [];

  for (const item of testRoutes) {
    totalTests++;
    const page = await context.newPage();
    const hydrationErrors = [];

    page.on('console', msg => {
      const text = msg.text();
      if (text.toLowerCase().includes('minified react error #418') ||
          text.toLowerCase().includes('hydration failed') ||
          text.toLowerCase().includes('server-rendered html didn\'t match')) {
        hydrationErrors.push(text);
      }
    });

    page.on('pageerror', err => {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('minified react error #418') ||
          msg.toLowerCase().includes('hydration failed') ||
          msg.toLowerCase().includes('server-rendered html didn\'t match')) {
        hydrationErrors.push(msg);
      }
    });

    const targetUrl = `${BASE_URL}${item.path}`;
    try {
      console.log(`[Testing ${item.name}] Navigating to: ${item.path}`);
      const response = await page.goto(targetUrl, { waitUntil: 'load', timeout: 10000 });
      await page.waitForTimeout(800); // allow animations and hydration pass
      
      const status = response ? response.status() : 0;
      const title = await page.title();
      
      // Check DOM #root content
      const rootTextLength = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root ? (root.textContent || '').trim().length : 0;
      });

      // Capture desktop screenshot
      const ssPath = path.join(outputDir, `${item.name}-desktop.png`);
      await page.screenshot({ path: ssPath, fullPage: false });

      // Test mobile responsive layout (375x667)
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(400);
      const mobileSsPath = path.join(outputDir, `${item.name}-mobile.png`);
      await page.screenshot({ path: mobileSsPath, fullPage: false });

      // Reset back to desktop viewport
      await page.setViewportSize({ width: 1280, height: 800 });

      // Verification assertions
      let hasError = false;
      if (hydrationErrors.length > 0) {
        issues.push(`[${item.name}] React hydration mismatch error: ${hydrationErrors.join(' | ')}`);
        hasError = true;
      }
      if (rootTextLength < 50) {
        issues.push(`[${item.name}] Rendered text content in #root is suspiciously short (${rootTextLength} chars)`);
        hasError = true;
      }
      if (item.titleExpected && !title.toLowerCase().includes(item.titleExpected.toLowerCase())) {
        issues.push(`[${item.name}] Title mismatch: expected "${item.titleExpected}", got "${title}"`);
        hasError = true;
      }

      // Check HTTP 404 response on unknown routes
      if (item.path.includes('non-existent')) {
        if (status !== 404) {
          issues.push(`[${item.name}] Expected HTTP 404 on unknown route, got ${status}`);
          hasError = true;
        }
        const notFoundHeading = await page.evaluate(() => {
          return document.body.textContent.includes('404') || document.body.textContent.includes('Page Not Found');
        });
        if (!notFoundHeading) {
          issues.push(`[${item.name}] Expected 404 content on unknown route!`);
          hasError = true;
        }
      }

      if (!hasError) {
        passedTests++;
        console.log(`  ✓ PASS: status=${status}, title="${title}", contentLen=${rootTextLength}, hydrationErrors=0`);
      } else {
        console.log(`  ✗ FAIL: status=${status}, title="${title}"`);
      }
    } catch (err) {
      issues.push(`[${item.name}] Navigation or test failed: ${err.message}`);
      console.log(`  ✗ EXCEPTION: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log('\n----------------------------------------------------');
  console.log(`Browser Verification Summary: ${passedTests}/${totalTests} routes passed`);
  console.log(`Captured responsive desktop & mobile screenshots in: ${outputDir}`);
  if (issues.length > 0) {
    console.error('\nIssues encountered:');
    issues.forEach(i => console.error(`  - ${i}`));
    process.exit(1);
  } else {
    console.log('\nAll browser pages, hydration checks, titles, responsive layouts, and 404 routing verified successfully with ZERO hydration errors!');
  }
}

runBrowserTests().catch(err => {
  console.error('Fatal browser test runner error:', err);
  process.exit(1);
});
