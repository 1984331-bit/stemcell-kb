const { chromium } = require('C:/Users/YSJ/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('https://1984331-bit.github.io/stemcell-kb/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const counts = await page.evaluate(() => {
    try { return { msc: ALL_DATA.length, cart: CART_DATA.length, gt: GT_DATA.length, total: ALL_DATA.length + CART_DATA.length + GT_DATA.length }; }
    catch (e) { return { err: e.message }; }
  });
  console.log('三库条数:', JSON.stringify(counts));
  console.log('JS错误数:', errors.length, errors.length ? errors.join(' | ').slice(0,200) : '');
  await browser.close();
})();
