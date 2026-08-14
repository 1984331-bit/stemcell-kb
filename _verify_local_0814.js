// L1 2026-08-14 本地 Playwright 验证 v4：刷新与返回键分离验证
const path = require('C:/Users/YSJ/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
(async () => {
  const browser = await path.chromium.launch();
  const errors = [];

  // ===== 会话 A：加载 + 渲染 + 刷新 =====
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  const url = 'http://127.0.0.1:8765/index.html';
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  console.log('A1 首页 slides:', await page.evaluate(() => document.querySelectorAll('.wh-slide').length), '| 错误:', errors.length);

  await page.evaluate(() => switchSection('news'));
  await page.waitForTimeout(1200);
  await page.evaluate(() => switchNewsTab('clinical'));
  await page.waitForTimeout(1000);
  const cpTitles = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.news-card .nc-title')).map(x => x.innerText));
  console.log('A2 临床 tab 卡数:', cpTitles.length, '| RXIM002:', cpTitles.some(t => t.includes('RXIM002')), '| 错误:', errors.length);

  await page.evaluate(() => switchNewsTab('policy'));
  await page.waitForTimeout(1000);
  const lpText = await page.evaluate(() => document.body.innerText);
  console.log('A3 policy tab 北京新政:', lpText.includes('北京发布') && lpText.includes('细胞与基因治疗领域高质量发展'), '| 错误:', errors.length);

  // 刷新（URL 带 hash #news/policy，刷新后应恢复 news policy）
  await page.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  const afterReload = await page.evaluate(() => ({
    section: currentSection, hasNews: !!document.querySelector('.news-tabs') || document.body.innerText.includes('地方政策'),
    hasBj: document.body.innerText.includes('北京发布')
  }));
  console.log('A4 刷新后 section:', afterReload.section, '| 北京新政仍在:', afterReload.hasBj, '| 错误:', errors.length);
  await page.close();

  // ===== 会话 B：返回键（干净栈）=====
  const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page2.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page2.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page2.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page2.waitForTimeout(2500);

  await page2.evaluate(() => switchSection('products'));
  await page2.waitForTimeout(1200);
  await page2.evaluate(() => switchSection('news'));
  await page2.waitForTimeout(1200);
  console.log('B1 pushState 栈: hub→products→news, 当前:', await page2.evaluate(() => currentSection), '| 错误:', errors.length);

  await page2.goBack({ waitUntil: 'networkidle' }).catch(() => {});
  await page2.waitForTimeout(2000);
  const back1 = await page2.evaluate(() => ({ section: currentSection, hasProd: document.body.innerText.includes('获批产品') }));
  console.log('B2 返回1:', back1.section, '| 产品页渲染:', back1.hasProd, '| 错误:', errors.length);

  await page2.goBack({ waitUntil: 'networkidle' }).catch(() => {});
  await page2.waitForTimeout(2000);
  const back2 = await page2.evaluate(() => ({ section: currentSection, slides: document.querySelectorAll('.wh-slide').length }));
  console.log('B3 返回2:', back2.section, '| slides:', back2.slides, '| 错误:', errors.length);
  await page2.close();

  await browser.close();
  const pass = errors.length === 0 && back1.section === 'products' && back2.section === 'hub' && back2.slides === 7;
  console.log(pass ? '=== 本地验证 PASS ===' : '=== 本地验证 FAIL ===');
  process.exit(pass ? 0 : 1);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
