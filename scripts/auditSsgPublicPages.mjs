import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const publicRoutes = ['/', '/learn', '/tools', '/moon', '/news', '/community', '/privacy'];
const excludedRoutes = ['/widget', '/community-admin', '/community-remove', '/404'];
const outputDirectory = resolve('dist/ssg');
const canonicalOrigin = 'https://13calendar.pages.dev';
const routeStructuredDataTypes = {
  '/': ['WebSite', 'WebApplication'],
  '/learn': ['Article'],
  '/tools': ['WebApplication'],
  '/moon': ['Article'],
  '/news': ['CollectionPage'],
  '/community': ['CollectionPage'],
  '/privacy': ['WebPage'],
};

function routeFile(route) {
  return resolve(outputDirectory, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const sitemap = await readFile('public/sitemap.xml', 'utf8');
const sitemapRoutes = [...sitemap.matchAll(/<loc>https:\/\/13calendar\.pages\.dev(\/[^<]*)<\/loc>/gu)].map(
  ([, route]) => route,
);

assert(
  JSON.stringify(sitemapRoutes) === JSON.stringify(publicRoutes),
  `O sitemap precisa conter exatamente as rotas SSG: ${publicRoutes.join(', ')}.`,
);

const pageTitles = new Set();
const pageDescriptions = new Set();

for (const route of publicRoutes) {
  const html = await readFile(routeFile(route), 'utf8');
  const canonical = `${canonicalOrigin}${route}`;
  const titles = [...html.matchAll(/<title>([^<]+)<\/title>/gu)].map(([, title]) => title.trim());
  const descriptions = [
    ...html.matchAll(/<meta name="description" content="([^"]+)"[^>]*>/gu),
  ].map(([, description]) => description.trim());
  const structuredData = [
    ...html.matchAll(
      /<script[^>]+type=(?:"application\/ld\+json"|application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gu,
    ),
  ]
    .map(([, content]) => content)
    .join('\n');

  assert(/<div id=(?:"q-app"|q-app)[ >]/u.test(html), `${route}: HTML Vue renderizado não encontrado.`);
  assert(/<h1[\s>]/u.test(html), `${route}: título visível (h1) não encontrado.`);
  assert(titles.length === 1, `${route}: deve existir exatamente um elemento title.`);
  assert(descriptions.length === 1, `${route}: deve existir exatamente uma descrição.`);
  assert(html.includes(`<link rel="canonical" href="${canonical}"`), `${route}: canonical ausente.`);
  assert(html.includes('property="og:title"'), `${route}: Open Graph title ausente.`);
  assert(html.includes('name="twitter:title"'), `${route}: Twitter title ausente.`);
  assert(structuredData, `${route}: JSON-LD ausente.`);

  for (const type of routeStructuredDataTypes[route]) {
    assert(structuredData.includes(`"${type}"`), `${route}: JSON-LD ${type} ausente.`);
  }

  pageTitles.add(titles[0]);
  pageDescriptions.add(descriptions[0]);
}

assert(pageTitles.size === publicRoutes.length, 'Cada rota SSG precisa ter um title exclusivo.');
assert(
  pageDescriptions.size === publicRoutes.length,
  'Cada rota SSG precisa ter uma descrição exclusiva.',
);

for (const route of excludedRoutes) {
  try {
    await access(routeFile(route));
    throw new Error(`${route}: rota não indexável foi gerada pelo SSG.`);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log(`SSG auditado: ${publicRoutes.length} páginas públicas renderizadas com metadados.`);
