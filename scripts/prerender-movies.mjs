import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const shouldPrerender = process.env.ENABLE_SEO_PRERENDER === 'true';
const host = '127.0.0.1';
const port = Number(process.env.PRERENDER_PORT || 4173);
const siteUrl = process.env.PRERENDER_SITE_URL || `http://${host}:${port}`;
const apiBaseUrl = (process.env.PRERENDER_API_BASE_URL || process.env.VITE_API_BASE_URL || 'https://api.vibesfilm.com').replace(/\/$/, '');
const sitemapUrls = [
  process.env.PRERENDER_MOVIE_SITEMAP_URL || `${apiBaseUrl}/sitemap/movies.xml`,
  process.env.PRERENDER_LANDING_SITEMAP_URL || `${apiBaseUrl}/sitemap/movie-landings.xml`,
];
const movieLimit = Number(process.env.PRERENDER_MOVIES_LIMIT || 0);

const contentTypeByExt = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

function normalizeRoute(routeOrUrl) {
  const url = routeOrUrl.startsWith('http')
    ? new URL(routeOrUrl).pathname
    : routeOrUrl;

  return url.replace(/\/+$/, '') || '/';
}

function getOutputFilePath(routePath) {
  const cleanPath = routePath.replace(/^\/+/, '');
  return path.join(distDir, cleanPath, 'index.html');
}

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function serveStatic(req, res) {
  const requestUrl = new URL(req.url || '/', siteUrl);
  const pathname = decodeURIComponent(requestUrl.pathname);
  let targetPath = path.join(distDir, pathname);

  if (await fileExists(targetPath)) {
    const targetStat = await stat(targetPath);
    if (targetStat.isDirectory()) {
      targetPath = path.join(targetPath, 'index.html');
    }
  } else {
    targetPath = path.join(distDir, 'index.html');
  }

  try {
    const body = await readFile(targetPath);
    const ext = path.extname(targetPath);
    res.writeHead(200, {
      'Content-Type': contentTypeByExt.get(ext) || 'application/octet-stream',
    });
    res.end(body);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Not found: ${pathname}\n${String(error)}`);
  }
}

async function getMovieRoutes() {
  const routeSet = new Set();

  for (const sitemapUrl of sitemapUrls) {
    const response = await fetch(sitemapUrl);

    if (!response.ok) {
      throw new Error(`Falha ao buscar sitemap de filmes: ${response.status} ${response.statusText} (${sitemapUrl})`);
    }

    const xml = await response.text();
    const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());

    matches
      .map((loc) => normalizeRoute(loc))
      .filter((route) => route.startsWith('/filme/') || route.startsWith('/onde-assistir/'))
      .forEach((route) => routeSet.add(route));
  }

  const routes = Array.from(routeSet);

  if (movieLimit > 0) {
    return routes.slice(0, movieLimit);
  }

  return routes;
}

async function prerenderRoute(page, routePath) {
  const url = `${siteUrl}${routePath}`;
  console.log(`Prerenderizando ${routePath}`);

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(
    () => document.body.getAttribute('data-movie-page-loaded') === 'true',
    undefined,
    { timeout: 30000 }
  );

  const html = await page.content();
  const outputPath = getOutputFilePath(routePath);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf-8');
}

async function main() {
  if (!shouldPrerender) {
    console.log('SEO prerender desabilitado. Pulando prerenderizacao.');
    return;
  }

  if (!(await fileExists(path.join(distDir, 'index.html')))) {
    throw new Error('Build não encontrado em dist/. Rode `npm run build` antes do prerender.');
  }

  const routes = await getMovieRoutes();

  if (routes.length === 0) {
    console.log('Nenhuma rota /filme encontrada no sitemap. Nada para prerenderizar.');
    return;
  }

  console.log(`Encontradas ${routes.length} rotas de filme/landing para prerenderização.`);

  const server = createServer((req, res) => {
    void serveStatic(req, res);
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    for (const routePath of routes) {
      await prerenderRoute(page, routePath);
    }
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  console.log('Prerenderização de filmes e landing pages concluída.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
