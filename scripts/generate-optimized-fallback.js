const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const outDir = path.join(baseDir, 'images', 'optimized');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const copies = [
  { src: 'WE.png', dest: 'WE-1200.png' },
  { src: 'WE.png', dest: 'WE-800.png' },
  { src: 'BC.png', dest: 'BC-1200.png' },
  { src: 'BC.png', dest: 'BC-800.png' },
  { src: 'to-do-list.png', dest: 'to-do-list-1200.png' },
  { src: 'to-do-list.png', dest: 'to-do-list-800.png' },
  { src: 'CT.png', dest: 'CT-1200.png' },
  { src: 'CT.png', dest: 'CT-800.png' },
  { src: path.join('images','g1.jpg'), dest: 'g1-1200.jpg' },
  { src: path.join('images','g1.jpg'), dest: 'g1-400.jpg' }
];

copies.forEach(c => {
  const srcPath = path.join(baseDir, c.src);
  const destPath = path.join(outDir, c.dest);
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcPath} -> ${destPath}`);
  } catch (err) {
    console.warn(`Could not copy ${srcPath} -> ${destPath}: ${err.message}`);
  }
});

console.log('Fallback copy complete.');
// Also create a fallback favicon by copying images/g1.jpg to ./favicon.png
try {
  const favSrc = path.join(baseDir, 'images', 'g1.jpg');
  const favDest = path.join(baseDir, 'favicon.png');
  if (fs.existsSync(favSrc)) fs.copyFileSync(favSrc, favDest);
  console.log('Copied fallback favicon to ./favicon.png');
} catch (err) {
  console.warn('Could not create fallback favicon:', err.message);
}
