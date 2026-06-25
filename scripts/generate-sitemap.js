import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const publicDir = resolve(__dirname, '../public');

const siteUrl = 'https://www.caedoai.com';

const urls = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/work', changefreq: 'weekly', priority: 0.9 },
  { url: '/contact', changefreq: 'monthly', priority: 0.9 },
  { url: '/packages', changefreq: 'monthly', priority: 0.8 },
  { url: '/llms.txt', changefreq: 'monthly', priority: 0.5 },
];

async function generateSitemap() {
  try {
    const stream = createWriteStream(resolve(publicDir, 'sitemap.xml'));
    const sitemap = new SitemapStream({ hostname: siteUrl });

    sitemap.pipe(stream);

    urls.forEach(({ url, changefreq, priority }) => {
      sitemap.write({
        url,
        changefreq,
        priority,
        lastmod: new Date().toISOString().split('T')[0],
      });
    });

    sitemap.end();

    await streamToPromise(sitemap);
    console.log('✓ Sitemap generated successfully at public/sitemap.xml');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
