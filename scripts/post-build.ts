import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const CONSTANTS_PATH = path.resolve(__dirname, '../src/constants.ts');

const getRoutes = () => {
  const content = fs.readFileSync(CONSTANTS_PATH, 'utf-8');
  
  const serviceIds = [...content.matchAll(/id:\s*'([^']+)'/g)]
    .map(m => m[1])
    .filter(id => {
      const index = content.indexOf(id);
      const servicesStart = content.indexOf('SERVICES = [');
      const suburbsStart = content.indexOf('SUBURBS = [');
      return index > servicesStart && index < suburbsStart;
    });
    
  const suburbIds = [...content.matchAll(/id:\s*'([^']+)'/g)]
    .map(m => m[1])
    .filter(id => content.indexOf(id) > content.indexOf('SUBURBS = ['));

  return [
    'admin',
    'emergency-gps',
    'gallery',
    'suburbs',
    ...serviceIds.map(id => `service/${id}`),
    ...suburbIds.map(id => `suburb/${id}`)
  ];
};

const run = () => {
  console.log('Starting post-build SEO generation...');
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error('Dist directory not found. Run build first.');
    return;
  }

  const routes = getRoutes();
  const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');

  // 1. Create individual HTML pages (copies of index.html)
  routes.forEach(route => {
    const routeDir = path.join(DIST_DIR, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtml);
    console.log(`Generated: ${route}/index.html`);
  });

  // 2. Generate sitemap.xml
  const baseUrl = 'https://towtrucksbrisbane.com.au';
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>
  ${routes.map(route => `  <url><loc>${baseUrl}/${route}</loc><priority>0.8</priority></url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
  console.log('Generated: sitemap.xml');

  // 3. Generate robots.txt
  const robots = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;

  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robots);
  console.log('Generated: robots.txt');

  console.log('Post-build generation complete.');
};

run();
