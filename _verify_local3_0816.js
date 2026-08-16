/* 补充验证 v2：originals 页各 tab */
const { chromium } = require('C:/Users/YSJ/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });
  await page.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => switchSection('originals'));
  await page.waitForTimeout(1200);

  // experts tab
  const tabs = await page.evaluate(() => typeof switchOriginalTab !== 'undefined');
  console.log('switchOriginalTab 存在: ' + tabs);
  await page.evaluate(() => { try { switchOriginalTab('experts'); } catch(e) {} });
  await page.waitForTimeout(1000);
  let t = await page.evaluate(() => document.body.innerText);
  console.log('experts tab: 陈竺脐带血=' + (t.indexOf('脐带血来源通用型CAR-T细胞临床转化') >= 0) + ' 程涛800万份=' + (t.indexOf('全球现存储约800万份脐带血') >= 0));

  // 会议/课程 tab 名探测
  const origTabs = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.report-tab').forEach(el => out.push(el.textContent.trim() + '|' + (el.id || el.dataset.tab || '')));
    return out;
  });
  console.log('originals 页 tabs: ' + JSON.stringify(origTabs));
  await browser.close();
  console.log('JS 错误数: ' + errors.length);
  errors.forEach(e => console.log(e));
  process.exit(errors.length === 0 ? 0 : 1);
})();
