const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  // Skip welcome by setting localStorage before page load
  await page.addInitScript(() => {
    localStorage.setItem('msc_kb_skip_welcome', '1');
  });

  console.log('Opening OpenCGT page...');
  await page.goto('http://localhost:8899/index.html#opencgt', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  // Scroll to the 3D sphere area
  console.log('Scrolling to 3D canvas...');
  await page.evaluate(() => {
    const canvas = document.getElementById('opencgt3DCanvas');
    if (canvas) canvas.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(3000); // Wait for Three.js to render

  // Screenshot
  await page.screenshot({ path: 'screenshots/opencgt-3d-sphere.png', fullPage: false });
  console.log('Done: opencgt-3d-sphere.png');

  // Capture AI dataset section
  await page.goto('http://localhost:8899/index.html#home', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const el = document.querySelector('.ai-cases-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/ai-dataset-updated.png', fullPage: false });
  console.log('Done: ai-dataset-updated.png');

  await browser.close();
  console.log('All screenshots complete.');
})();
