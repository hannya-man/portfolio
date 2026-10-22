const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = __dirname;
const EDGE = process.env.BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const [mode = 'preview', outDir = path.join(__dirname, 'out'), countArg = '60', ...rest] = process.argv.slice(2);
const extraQuery = rest.join('&');
const lgWidth = Number(process.env.LG || 1100);
const smWidth = Number(process.env.SM || 560);
const quality = Number(process.env.Q || 0.8);
const smQuality = Number(process.env.SMQ || 0.7);
const sceneFile = process.env.SCENE || 'scene.html';
const prefix = process.env.PREFIX || 'infinity';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(5199, '127.0.0.1', r));
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.setViewport({ width: 800, height: 500 });
  await page.goto(`http://127.0.0.1:5199/${sceneFile}?w=1600&h=1000&${extraQuery}`, { waitUntil: 'load' });
  await page.waitForFunction('window.ready === true', { timeout: 300000 }).catch(() => {});
  if (errors.length) console.log('page errors:', errors);
  const stats = await page.evaluate(() => (window.stats ? window.stats() : null));
  if (stats) console.log('stats', JSON.stringify(stats));
  fs.mkdirSync(outDir, { recursive: true });

  if (mode === 'preview') {
    if (process.env.CROP) await page.evaluate((c) => window.setCrop(c, 1600), JSON.parse(process.env.CROP));
    const bounds = [];
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const { large } = await page.evaluate((t) => window.renderFrame(t, { format: 'image/png' }), t);
      fs.writeFileSync(path.join(outDir, `preview_${t}.png`), Buffer.from(large.split(',')[1], 'base64'));
      bounds.push({ t, ...(await page.evaluate(() => window.contentBounds())) });
    }
    console.log(JSON.stringify(bounds));
  } else {
    const samples = [];
    for (let i = 0; i <= 20; i++) {
      await page.evaluate((t) => window.renderFrame(t, { format: 'image/png' }), i / 20);
      samples.push(await page.evaluate(() => window.contentBounds()));
    }
    const pad = 0.035;
    const u = samples.reduce((a, b) => ({ minX: Math.min(a.minX, b.minX), maxX: Math.max(a.maxX, b.maxX), minY: Math.min(a.minY, b.minY), maxY: Math.max(a.maxY, b.maxY) }));
    const padX = Math.round((u.maxX - u.minX) * pad), padY = Math.round((u.maxY - u.minY) * pad);
    const crop = { x: Math.max(0, u.minX - padX), y: Math.max(0, u.minY - padY) };
    crop.w = Math.min(1600, u.maxX + padX) - crop.x;
    crop.h = Math.min(1000, u.maxY + padY) - crop.y;
    const touches = { left: u.minX <= 1, right: u.maxX >= 1598, top: u.minY <= 1, bottom: u.maxY >= 998 };
    const outSize = await page.evaluate((crop, w) => window.setCrop(crop, w), crop, lgWidth);
    console.log('crop', JSON.stringify(crop), 'touches edge', JSON.stringify(touches), 'output', JSON.stringify(outSize));
    const count = Number(countArg);
    const sizes = { lg: 0, sm: 0 };
    fs.mkdirSync(path.join(outDir, 'lg'), { recursive: true });
    fs.mkdirSync(path.join(outDir, 'sm'), { recursive: true });
    const started = Date.now();
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const { large, small } = await page.evaluate((t, q, sw, sq) => window.renderFrame(t, { quality: q, smallWidth: sw, smallQuality: sq }), t, quality, smWidth, smQuality);
      const name = `${prefix}_${String(i).padStart(3, '0')}.webp`;
      const lg = Buffer.from(large.split(',')[1], 'base64');
      const sm = Buffer.from(small.split(',')[1], 'base64');
      fs.writeFileSync(path.join(outDir, 'lg', name), lg);
      fs.writeFileSync(path.join(outDir, 'sm', name), sm);
      sizes.lg += lg.length;
      sizes.sm += sm.length;
    }
    console.log(`rendered ${count} frames in ${Math.round((Date.now() - started) / 1000)}s | lg ${Math.round(sizes.lg / 1024)} KB | sm ${Math.round(sizes.sm / 1024)} KB`);
  }
  await browser.close();
  server.close();
})().catch((e) => { console.error(e); process.exit(1); });
