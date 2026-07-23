const { chromium } = require('C:\\Users\\YSJ\\.workbuddy\\binaries\\node\\workspace\\node_modules\\playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2
  });

  // Skip welcome modal
  await context.addInitScript(() => {
    try { localStorage.setItem('msc_kb_skip_welcome', '1'); } catch(e) {}
    try { localStorage.setItem('userRole', 'researcher'); } catch(e) {}
  });

  const page = await context.newPage();
  const baseURL = 'http://localhost:8899';
  const outDir = 'C:\\Users\\YSJ\\WorkBuddy\\Claw\\stemcell-kb\\screenshots\\';

  const sections = [
    { name: 'regulations-viewport', hash: '#reg', label: '监管政策' },
    { name: 'products-viewport', hash: '#prod', label: '获批产品' },
    { name: 'picks-viewport', hash: '#picks', label: '编辑精选' },
    { name: 'institutions-viewport', hash: '#inst', label: '备案机构' },
    { name: 'news-viewport', hash: '#news', label: '行业资讯' },
    { name: 'intro-viewport', hash: '#intro', label: '认识细胞治疗' },
  ];

  for (const sec of sections) {
    console.log(`Capturing ${sec.label} (${sec.hash})...`);
    await page.goto(baseURL + '/' + sec.hash, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: outDir + sec.name + '.png', fullPage: false });
    console.log(`  Done: ${sec.name}.png`);
  }

  // Also capture a literature search result (click first system)
  console.log('Capturing literature search result...');
  await page.goto(baseURL + '/#lit', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  // Click first system category
  const sysCard = await page.locator('.sys-card').first();
  if (sysCard) {
    await sysCard.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: outDir + 'literature-search-result.png', fullPage: false });
    console.log('  Done: literature-search-result.png');
  }

  // Mobile home page
  console.log('Capturing mobile home...');
  const mContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  await mContext.addInitScript(() => {
    try { localStorage.setItem('msc_kb_skip_welcome', '1'); } catch(e) {}
    try { localStorage.setItem('userRole', 'researcher'); } catch(e) {}
  });
  const mPage = await mContext.newPage();
  await mPage.goto(baseURL + '/#hub', { waitUntil: 'networkidle', timeout: 30000 });
  await mPage.waitForTimeout(3000);
  await mPage.screenshot({ path: outDir + 'home-mobile.png', fullPage: false });
  console.log('  Done: home-mobile.png');

  // Mobile literature
  await mPage.goto(baseURL + '/#lit', { waitUntil: 'networkidle', timeout: 30000 });
  await mPage.waitForTimeout(3000);
  await mPage.screenshot({ path: outDir + 'literature-mobile.png', fullPage: false });
  console.log('  Done: literature-mobile.png');

  await browser.close();
  console.log('\nAll screenshots completed!');
})();
