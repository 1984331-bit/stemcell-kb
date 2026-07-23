const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1200 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    localStorage.setItem('msc_kb_skip_welcome', '1');
  });

  await page.goto('http://localhost:8899/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Close welcome overlay if shown
  await page.evaluate(() => {
    const overlay = document.getElementById('welcomeOverlay');
    if (overlay) {
      overlay.classList.remove('show');
      overlay.style.display = 'none';
    }
  });

  // Navigate to AI dashboard via switchSection (parseHash doesn't handle #ai yet)
  await page.evaluate(() => { switchSection('ai'); });
  await page.waitForTimeout(2500);

  // Scroll to AI dataset section
  await page.evaluate(() => {
    const el = document.querySelector('.ai-cases-section');
    if (el) {
      const rect = el.getBoundingClientRect();
      window.scrollTo({ top: rect.top + window.scrollY - 80, behavior: 'instant' });
    }
  });
  await page.waitForTimeout(1500);

  const clip = await page.evaluate(() => {
    const el = document.querySelector('.ai-cases-section');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: Math.max(rect.x, 0), y: Math.max(rect.y, 0), width: Math.min(rect.width, 1280), height: Math.min(rect.height, 1100) };
  });

  if (clip) {
    await page.screenshot({ path: 'screenshots/ai-dataset-clipped.png', clip });
    console.log('Done: ai-dataset-clipped.png');
  } else {
    console.log('AI cases section not found');
  }

  await browser.close();
})();
