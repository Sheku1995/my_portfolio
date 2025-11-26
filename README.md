# Sheku Alpha Kamara - Portfolio

This repository contains a personal portfolio website that showcases projects, skills, and contact details.

Development
1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Build for production: `npm run build`

Notes
- The site uses Bootstrap, AOS, and Bootstrap Icons via CDN.
- We use Vite + Sass for local development and building.
 - There is a legacy `portfolio.css` (kept for reference). The site now uses `src/styles/main.scss`.
 - To optimize images (create WebP/AVIF), run `npm run optimize-images`. This requires `sharp`.
 - If `sharp` fails to install (esp. on Windows), fallback copies are available with `npm run optimize-images:fallback`, which copies existing images into `images/optimized/` so the <picture> tags do not 404.
