const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.addInitScript(() => {
    localStorage.setItem('msc_kb_skip_welcome', '1');
  });

  console.log('Opening OpenCGT page...');
  await page.goto('http://localhost:8899/index.html#opencgt', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  const threeLoaded = await page.evaluate(() => typeof window.THREE !== 'undefined');
  console.log('THREE loaded:', threeLoaded);

  const canvasExists = await page.evaluate(() => {
    const c = document.getElementById('opencgt3DCanvas');
    return { exists: !!c, width: c ? c.clientWidth : 0, height: c ? c.clientHeight : 0, html: c ? c.innerHTML.slice(0, 200) : null };
  });
  console.log('Canvas:', canvasExists);

  await page.evaluate(() => {
    const canvas = document.getElementById('opencgt3DCanvas');
    if (canvas) canvas.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'screenshots/opencgt-3d-sphere.png', fullPage: false });
  console.log('Done: opencgt-3d-sphere.png');

  await browser.close();
})();
