const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const inputDir = path.join(__dirname, 'public', 'Home');
const outputDir = path.join(__dirname, 'public', 'Home', 'compressed');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const videos = ['ANUJ9212.MP4', 'ANUJ9239.MP4', 'ANUJ9246.MP4', 'ANUJ9259.MP4'];

async function compressVideo(file) {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`File not found: ${file}`);
      return resolve();
    }

    console.log(`Starting compression for ${file}...`);
    
    ffmpeg(inputPath)
      .outputOptions([
        '-c:v libx264',
        '-crf 28', // Higher CRF = more compression (lower quality, smaller file)
        '-preset fast', // Faster compression speed
        '-c:a aac',
        '-b:a 128k'
      ])
      .on('end', () => {
        console.log(`Compression finished for ${file}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error compressing ${file}: ${err.message}`);
        reject(err);
      })
      .save(outputPath);
  });
}

async function main() {
  console.log('Starting video compression...');
  for (const video of videos) {
    try {
      await compressVideo(video);
      // Replace original with compressed if successful
      const originalPath = path.join(inputDir, video);
      const compressedPath = path.join(outputDir, video);
      fs.copyFileSync(compressedPath, originalPath);
      console.log(`Replaced original ${video} with compressed version.`);
    } catch (e) {
      console.error(`Failed on ${video}`);
    }
  }
  console.log('All done!');
}

main();
