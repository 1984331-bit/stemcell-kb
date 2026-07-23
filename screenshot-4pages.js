const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  
  const baseURL = 'https://1984331-bit.github.io/stemcell-kb/';
  const outDir = 'C:\\Users\\YSJ\\WorkBuddy\\Claw\\stemcell-kb\\screenshots\\';
  
  // 1. 入口声明页
  console.log('1. Capturing landing page...');
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: outDir + 'landing.png', fullPage: false });
  console.log('   Done: landing.png');
  
  // 2. 首页主内容
  console.log('2. Capturing home viewport...');
  await page.locator('text=进入网站').first().click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: outDir + 'home-viewport.png', fullPage: false });
  console.log('   Done: home-viewport.png');
  
  // 3. AI看板
  console.log('3. Capturing AI dashboard...');
  await page.evaluate(() => {
    const el = document.getElementById('aiDashSection');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: outDir + 'ai-dashboard.png', fullPage: false });
  console.log('   Done: ai-dashboard.png');
  
  // 4. 文献库页
  console.log('4. Capturing literature page...');
  await page.locator('[data-section="literature"]').first().click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: outDir + 'literature-viewport.png', fullPage: false });
  console.log('   Done: literature-viewport.png');
  
  await browser.close();
  console.log('\nAll 4 screenshots completed!');
})();
