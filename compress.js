import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dir = './public/Home';
const files = fs.readdirSync(dir);

async function compress() {
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      const inputPath = path.join(dir, file);
      const tempPath = path.join(dir, 'temp_' + file);
      
      try {
        let pipeline = sharp(inputPath).resize({ width: 1000, withoutEnlargement: true });
        
        if (ext === '.png') {
          pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
        } else {
          pipeline = pipeline.jpeg({ quality: 80, progressive: true });
        }
        
        await pipeline.toFile(tempPath);
        
        fs.unlinkSync(inputPath);
        fs.renameSync(tempPath, inputPath);
        console.log(`Compressed ${file}`);
      } catch (err) {
        console.error(`Error compressing ${file}:`, err);
      }
    }
  }
}

compress();
