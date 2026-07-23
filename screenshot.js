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
  
  // 打开页面，点击“进入网站”按钮以进入主内容
  console.log('0. Opening landing page and entering main site...');
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.locator('text=进入网站').first().click();
  await page.waitForTimeout(2500);
  
  // 1. 首页首屏（视口截图）
  console.log('1. Capturing home viewport...');
  await page.screenshot({ path: outDir + 'home-viewport.png', fullPage: false });
  console.log('   Done: home-viewport.png');
  
  // 2. 首页全页长截图
  console.log('2. Capturing home page (full page)...');
  await page.screenshot({ path: outDir + 'home-fullpage.png', fullPage: true });
  console.log('   Done: home-fullpage.png');
  
  // 3. AI看板区域 — 滚动到ai-dash-section
  console.log('3. Capturing AI dashboard section...');
  await page.evaluate(() => {
    const el = document.getElementById('ai-dash-section') || document.querySelector('.ai-dash-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: outDir + 'ai-dashboard.png', fullPage: false });
  console.log('   Done: ai-dashboard.png');
  
  // 4. 文献库页 — 通过底部导航栏切换到文献库
  console.log('4. Capturing literature page...');
  await page.locator('[data-section="literature"]').first().click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: outDir + 'literature-viewport.png', fullPage: false });
  console.log('   Done: literature-viewport.png');
  await page.screenshot({ path: outDir + 'literature-fullpage.png', fullPage: true });
  console.log('   Done: literature-fullpage.png');
  
  // 5. 关于我们页
  console.log('5. Capturing team page...');
  await page.locator('[data-section="team"]').first().click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: outDir + 'team-fullpage.png', fullPage: true });
  console.log('   Done: team-fullpage.png');
  
  await browser.close();
  console.log('\nAll screenshots completed!');
})();
