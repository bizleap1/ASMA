import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const distSsrDir = path.resolve(rootDir, 'dist-ssr');

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function prerender() {
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Error: dist/index.html does not exist. Run vite build first.');
    process.exit(1);
  }

  const ssrEntryPath = path.join(distSsrDir, 'entry-server.js');
  if (!fs.existsSync(ssrEntryPath)) {
    console.error('Error: dist-ssr/entry-server.js does not exist. Run vite build --ssr first.');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf8');
  const { render, getMetadata, ALL_EXISTING_PUBLIC_ROUTES } = await import(`file://${ssrEntryPath.replace(/\\/g, '/')}`);

  const routesToPrerender = [
    ...ALL_EXISTING_PUBLIC_ROUTES,
    '/404'
  ];

  console.log(`\nStarting static prerendering for ${routesToPrerender.length} routes...`);
  let successCount = 0;

  for (const route of routesToPrerender) {
    try {
      const { html } = render(route);
      const meta = getMetadata(route);

      let pageHtml = template;

      // 1. Replace fallback title
      pageHtml = pageHtml.replace(
        /<title>[\s\S]*?<\/title>/i,
        `<title data-rh="true">${escapeHtml(meta.title)}</title>`
      );

      // 2. Replace fallback description
      pageHtml = pageHtml.replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="description" content="${escapeHtml(meta.description)}" data-rh="true" />`
      );

      // 3. Replace fallback keywords
      pageHtml = pageHtml.replace(
        /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i,
        meta.keywords ? `<meta name="keywords" content="${escapeHtml(meta.keywords)}" data-rh="true" />` : ''
      );

      // 4. Inject head SEO tags before </head>
      const headTags = [
        `    <link rel="canonical" href="${meta.canonical}" data-rh="true" />`,
        `    <meta name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow'}" data-rh="true" />`,
        `    <meta property="og:title" content="${escapeHtml(meta.title)}" data-rh="true" />`,
        `    <meta property="og:description" content="${escapeHtml(meta.description)}" data-rh="true" />`,
        `    <meta property="og:url" content="${meta.canonical}" data-rh="true" />`,
        `    <meta property="og:type" content="${meta.type || 'website'}" data-rh="true" />`,
        `    <meta property="og:image" content="${meta.image || 'https://www.asmaonline.in/logo-dark.png'}" data-rh="true" />`,
        `    <meta property="og:site_name" content="Advait Stock Market Academy" data-rh="true" />`,
        `    <meta name="twitter:card" content="summary_large_image" data-rh="true" />`,
        `    <meta name="twitter:title" content="${escapeHtml(meta.title)}" data-rh="true" />`,
        `    <meta name="twitter:description" content="${escapeHtml(meta.description)}" data-rh="true" />`,
        `    <meta name="twitter:image" content="${meta.image || 'https://www.asmaonline.in/logo-dark.png'}" data-rh="true" />`,
        meta.schema ? `    <script type="application/ld+json" data-rh="true">${JSON.stringify(meta.schema)}</script>` : ''
      ].filter(Boolean).join('\n');

      // Extract hoisted resource preloads from SSR html and place them in <head> where they belong
      const preloadMatches = html.match(/<link rel="preload"[^>]*\/?>/gi) || [];
      let cleanHtml = html.replace(/<link rel="preload"[^>]*\/?>/gi, '');

      // Strip any stray head tags from body/root markup
      cleanHtml = cleanHtml
        .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
        .replace(/<meta[^>]*\/?>/gi, '')
        .replace(/<link[^>]*rel="canonical"[^>]*\/?>/gi, '');

      const preloadsStr = preloadMatches.map(p => `    ${p}`).join('\n');

      const allHeadTags = [preloadsStr, headTags].filter(Boolean).join('\n');
      pageHtml = pageHtml.replace('</head>', `${allHeadTags}\n  </head>`);

      // 5. Inject rendered HTML into #root with route identifier for safe hydration matching
      pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root" data-route="${route}">${cleanHtml}</div>`);

      // 6. Write to destination file
      let destFile;
      if (route === '/') {
        destFile = path.join(distDir, 'index.html');
      } else if (route === '/404') {
        destFile = path.join(distDir, '404.html');
      } else {
        const routePath = route.startsWith('/') ? route.slice(1) : route;
        destFile = path.join(distDir, routePath, 'index.html');
        // Also write direct .html for instant Vercel cleanUrls resolution
        const directFile = path.join(distDir, `${routePath}.html`);
        fs.mkdirSync(path.dirname(directFile), { recursive: true });
        fs.writeFileSync(directFile, pageHtml, 'utf8');
      }

      fs.mkdirSync(path.dirname(destFile), { recursive: true });
      fs.writeFileSync(destFile, pageHtml, 'utf8');
      successCount++;
    } catch (err) {
      console.error(`Error prerendering route "${route}":`, err);
    }
  }

  // Clean up SSR build artifact
  try {
    fs.rmSync(distSsrDir, { recursive: true, force: true });
  } catch (e) {
    // ignore
  }

  console.log(`Prerendering completed: ${successCount} of ${routesToPrerender.length} static HTML files generated successfully.\n`);
}

prerender();
