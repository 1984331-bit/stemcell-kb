// L1 2026-08-14 线上 Playwright 验证：三库条数 + 新增渲染 + 刷新 + 返回键
const path = require('C:/Users/YSJ/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
(async () => {
  const browser = await path.chromium.launch();
  const errors = [];
  const url = 'https://70afc6c5ebb54a71b370d6a25d9147e0.app.workbuddy.link/index.html';

  // ===== 会话 A：加载 + 三库 + 新增渲染 =====
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3000);

  console.log('A1 首页 slides:', await page.evaluate(() => document.querySelectorAll('.wh-slide').length), '| 错误:', errors.length);

  // 三库条数
  const counts = await page.evaluate(() => ({
    msc: (typeof ALL_DATA !== 'undefined') ? ALL_DATA.length : -1,
    cart: (typeof CART_DATA !== 'undefined') ? CART_DATA.length : -1,
    gt: (typeof GT_DATA !== 'undefined') ? GT_DATA.length : -1
  }));
  console.log('A2 三库条数 MSC/CART/GT:', counts.msc, counts.cart, counts.gt, '(期望 1035/1092/1104)');

  // news clinical（RXIM002）
  await page.evaluate(() => switchSection('news'));
  await page.waitForTimeout(1500);
  await page.evaluate(() => switchNewsTab('clinical'));
  await page.waitForTimeout(1200);
  const cpTitles = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.news-card .nc-title')).map(x => x.innerText));
  console.log('A3 临床 tab 卡数:', cpTitles.length, '| RXIM002:', cpTitles.some(t => t.includes('RXIM002')), '| 错误:', errors.length);

  // policy tab（北京新政）
  await page.evaluate(() => switchNewsTab('policy'));
  await page.waitForTimeout(1200);
  const lpText = await page.evaluate(() => document.body.innerText);
  console.log('A4 policy 北京新政:', lpText.includes('北京发布') && lpText.includes('细胞与基因治疗领域高质量发展'), '| 错误:', errors.length);

  // 刷新
  await page.reload({ waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(2500);
  console.log('A5 刷新后 section:', await page.evaluate(() => currentSection), '| 错误:', errors.length);
  await page.close();

  // ===== 会话 B：返回键（干净栈）=====
  const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page2.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page2.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page2.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page2.waitForTimeout(3000);

  await page2.evaluate(() => switchSection('products'));
  await page2.waitForTimeout(1500);
  await page2.evaluate(() => switchSection('news'));
  await page2.waitForTimeout(1500);
  await page2.goBack({ waitUntil: 'networkidle' }).catch(() => {});
  await page2.waitForTimeout(2000);
  const back1 = await page2.evaluate(() => ({ section: currentSection, hasProd: document.body.innerText.includes('获批产品') }));
  console.log('B1 返回1:', back1.section, '| 产品页渲染:', back1.hasProd, '| 错误:', errors.length);

  await page2.goBack({ waitUntil: 'networkidle' }).catch(() => {});
  await page2.waitForTimeout(2000);
  const back2 = await page2.evaluate(() => ({ section: currentSection, slides: document.querySelectorAll('.wh-slide').length }));
  console.log('B2 返回2:', back2.section, '| slides:', back2.slides, '| 错误:', errors.length);
  await page2.close();

  await browser.close();
  const pass = errors.length === 0 && counts.msc === 1035 && counts.cart === 1092 && counts.gt === 1104
    && back1.section === 'products' && back2.section === 'hub' && back2.slides === 7;
  console.log(pass ? '=== 线上验证 PASS ===' : '=== 线上验证 FAIL ===');
  process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
