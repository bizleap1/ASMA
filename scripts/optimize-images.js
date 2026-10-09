import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

sharp.cache(false);

async function optimizeImages() {
  console.log('====================================================');
  console.log('   ASMA Image Optimization (WebP & Compression)');
  console.log('====================================================\n');

  let totalBefore = 0;
  let totalAfter = 0;

  // 1. Optimize oversized assets in src/assets
  const assetsToConvert = [
    { src: 'src/assets/ANU00469.JPG', dest: 'src/assets/ANU00469.webp', maxWidth: 1920 },
    { src: 'src/assets/ANU00455.JPG', dest: 'src/assets/ANU00455.webp', maxWidth: 1920 }
  ];

  for (const item of assetsToConvert) {
    if (fs.existsSync(item.src)) {
      const statsBefore = fs.statSync(item.src);
      totalBefore += statsBefore.size;

      console.log(`Processing: ${item.src} (${(statsBefore.size / 1024 / 1024).toFixed(2)} MB)...`);
      await sharp(item.src)
        .resize({ width: item.maxWidth, withoutEnlargement: true })
        .webp({ quality: 85, effort: 6 })
        .toFile(item.dest);

      const statsAfter = fs.statSync(item.dest);
      totalAfter += statsAfter.size;
      console.log(`  -> Generated: ${item.dest} (${(statsAfter.size / 1024).toFixed(1)} KB) [Savings: ${(100 - (statsAfter.size / statsBefore.size * 100)).toFixed(1)}%]`);
    }
  }

  // 2. Optimize public/founder.jpg and create public/founder.webp
  const founderSrc = 'public/founder.jpg';
  if (fs.existsSync(founderSrc)) {
    const statsBefore = fs.statSync(founderSrc);
    totalBefore += statsBefore.size;
    console.log(`\nProcessing: ${founderSrc} (${(statsBefore.size / 1024 / 1024).toFixed(2)} MB)...`);

    const inputBuffer = fs.readFileSync(founderSrc);
    await sharp(inputBuffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toFile('public/founder.webp');

    const statsAfter = fs.statSync('public/founder.webp');
    totalAfter += statsAfter.size;
    console.log(`  -> Generated: public/founder.webp (${(statsAfter.size / 1024).toFixed(1)} KB)`);
  }

  // 3. Optimize public/Home photos to WebP
  const homeDir = path.resolve('public/Home');
  if (fs.existsSync(homeDir)) {
    const homeFiles = fs.readdirSync(homeDir);
    for (const f of homeFiles) {
      const ext = path.extname(f).toLowerCase();
      if ((ext === '.png' || ext === '.jpg' || ext === '.jpeg') && !f.endsWith('.webp')) {
        const filePath = path.join(homeDir, f);
        const stats = fs.statSync(filePath);
        // Optimize if file > 50KB and doesn't already have a webp
        if (stats.size > 50 * 1024) {
          const baseName = path.basename(f, ext);
          const webpPath = path.join(homeDir, `${baseName}.webp`);
          if (!fs.existsSync(webpPath)) {
            console.log(`Optimizing: public/Home/${f} (${(stats.size / 1024).toFixed(1)} KB)...`);
            totalBefore += stats.size;

            await sharp(filePath)
              .resize({ width: 1600, withoutEnlargement: true })
              .webp({ quality: 85, effort: 5 })
              .toFile(webpPath);

            const webpStats = fs.statSync(webpPath);
            totalAfter += webpStats.size;
            console.log(`  -> Created public/Home/${baseName}.webp (${(webpStats.size / 1024).toFixed(1)} KB)`);
          }
        }
      }
    }
  }

  // 4. Optimize additional oversized public images
  const additionalPublicImages = [
    { src: 'public/updates_poster.png', dest: 'public/updates_poster.webp', maxWidth: 1200 },
    { src: 'public/updates_poster_revamped.png', dest: 'public/updates_poster_revamped.webp', maxWidth: 1200 },
    { src: 'public/asma-philosophy.jpeg', dest: 'public/asma-philosophy.webp', maxWidth: 1200 },
    { src: 'public/hero_analysis_bg.png', dest: 'public/hero_analysis_bg.webp', maxWidth: 1920 },
    { src: 'public/live-market-training.jpeg', dest: 'public/live-market-training.webp', maxWidth: 1200 },
    { src: 'public/beginner-roadmap.jpeg', dest: 'public/beginner-roadmap.webp', maxWidth: 1200 },
    { src: 'public/1-percent-rule.jpeg', dest: 'public/1-percent-rule.webp', maxWidth: 1200 },
    { src: 'public/prof.master program.png', dest: 'public/prof.master program.webp', maxWidth: 1200 },
    { src: 'public/advanced foundtation course.png', dest: 'public/advanced foundtation course.webp', maxWidth: 1200 },
    { src: 'public/e80ee201-5e4e-4806-b5bc-9434216dc4d4.png', dest: 'public/e80ee201-5e4e-4806-b5bc-9434216dc4d4.webp', maxWidth: 1200 }
  ];

  for (const item of additionalPublicImages) {
    if (fs.existsSync(item.src) && !fs.existsSync(item.dest)) {
      const stats = fs.statSync(item.src);
      totalBefore += stats.size;
      console.log(`Optimizing: ${item.src} (${(stats.size / 1024).toFixed(1)} KB)...`);
      await sharp(item.src)
        .resize({ width: item.maxWidth, withoutEnlargement: true })
        .webp({ quality: 85, effort: 5 })
        .toFile(item.dest);
      const webpStats = fs.statSync(item.dest);
      totalAfter += webpStats.size;
      console.log(`  -> Created: ${item.dest} (${(webpStats.size / 1024).toFixed(1)} KB)`);
    }
  }

  console.log('\n----------------------------------------------------');
  console.log(`Total Before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total After:  ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total Bandwidth Saved: ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB (${(100 - (totalAfter / totalBefore * 100)).toFixed(1)}% reduction)`);
  console.log('====================================================\n');
}

optimizeImages().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
