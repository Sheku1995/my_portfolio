const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToOptimize = [
  'BC.png',
  'WE.png',
  'to-do-list.png',
  'CT.png',
  'g1.jpg'
];

const srcDir = path.join(__dirname, '..');
const outDir = path.join(srcDir, 'images', 'optimized');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

(async function optimize() {
  try {
    for (const file of imagesToOptimize) {
      const srcPath = path.join(srcDir, file);
      const baseName = path.parse(file).name;
      if (!fs.existsSync(srcPath)) {
        console.warn(`Source image not found: ${srcPath} (skipping)`);
        continue;
      }
      console.log(`Optimizing ${file}`);

      // Generate WebP at different sizes
      await sharp(srcPath).resize({ width: 1200 }).webp({ quality: 80 }).toFile(path.join(outDir, `${baseName}-1200.webp`));
      await sharp(srcPath).resize({ width: 800 }).webp({ quality: 80 }).toFile(path.join(outDir, `${baseName}-800.webp`));
      await sharp(srcPath).resize({ width: 400 }).webp({ quality: 75 }).toFile(path.join(outDir, `${baseName}-400.webp`));

      // Generate AVIF for supported browsers (smaller)
      await sharp(srcPath).resize({ width: 1200 }).avif({ quality: 55 }).toFile(path.join(outDir, `${baseName}-1200.avif`));
      await sharp(srcPath).resize({ width: 800 }).avif({ quality: 55 }).toFile(path.join(outDir, `${baseName}-800.avif`));

      // Also generate a compressed PNG or JPG fallback for older browsers
      const ext = path.extname(file).toLowerCase();
      if (ext === '.png') {
        await sharp(srcPath).resize({ width: 1200 }).png({ quality: 80, compressionLevel: 9 }).toFile(path.join(outDir, `${baseName}-1200.png`));
      } else {
        await sharp(srcPath).resize({ width: 1200 }).jpeg({ quality: 80 }).toFile(path.join(outDir, `${baseName}-1200.jpg`));
      }
    }
    console.log('Image optimization complete. Optimized images in images/optimized');
  } catch (err) {
    console.error('Error optimizing images', err);
  }
})();
