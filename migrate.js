const fs = require('fs');
const path = require('path');

const routeMap = {
  howItWorks: { en: 'how-it-works', fr: 'comment-ca-marche' },
  pricing: { en: 'pricing', fr: 'tarifs' },
  blog: { en: 'blog', fr: 'blog' },
  dashboard: { en: 'dashboard', fr: 'dashboard' },
  legal: { en: 'legal', fr: 'mentions-legales' },
  privacy: { en: 'privacy', fr: 'confidentialite' },
  terms: { en: 'terms', fr: 'cgu' },
  contact: { en: 'contact', fr: 'contact' },
  roast: { en: 'roast', fr: 'roast' }
};

const appDir = path.join(__dirname, 'app');
const componentsPagesDir = path.join(__dirname, 'components', 'pages');
const langDir = path.join(appDir, '[lang]');

if (!fs.existsSync(componentsPagesDir)) fs.mkdirSync(componentsPagesDir, { recursive: true });
if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });

for (const [key, paths] of Object.entries(routeMap)) {
  const oldPath = path.join(appDir, paths.en);
  
  if (fs.existsSync(oldPath)) {
    // We move the entire old directory content to components/pages/ except page.tsx?
    // Actually, it's easier to just move the entire folder from app/ to components/pages/, 
    // and then create app/[lang]/[path]/page.tsx that re-exports it.
    // Wait, things like `app/blog/[slug]/page.tsx` must stay inside `app/[lang]/blog/[slug]/page.tsx`.
    // It's much simpler to just physically move the folder into `app/[lang]/` as the English folder,
    // and for French, create a folder that re-exports the page.
    
    // Better strategy: Move `app/pricing` -> `app/[lang]/pricing`.
    // Create `app/[lang]/tarifs/page.tsx` with: `export { default } from '../pricing/page';`
    const oldDir = path.join(appDir, paths.en);
    const newEnDir = path.join(langDir, paths.en);
    
    if (fs.existsSync(oldDir)) {
      console.log(`Moving ${oldDir} to ${newEnDir}`);
      fs.renameSync(oldDir, newEnDir);
    }
    
    if (paths.en !== paths.fr) {
      const newFrDir = path.join(langDir, paths.fr);
      if (!fs.existsSync(newFrDir)) fs.mkdirSync(newFrDir, { recursive: true });
      
      const pageStr = `export { default } from '../${paths.en}/page';\n`;
      fs.writeFileSync(path.join(newFrDir, 'page.tsx'), pageStr);
      console.log(`Created alias ${newFrDir}/page.tsx -> ../${paths.en}/page`);
    }
  }
}
