/* 2026-08-16 线上验证：GitHub Pages + CloudStudio */
const { chromium } = require('C:/Users/YSJ/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
const SITES = [
  { name: 'GitHub Pages', url: 'https://1984331-bit.github.io/stemcell-kb/' },
  { name: 'CloudStudio', url: 'https://70afc6c5ebb54a71b370d6a25d9147e0.app.workbuddy.link/' }
];
(async () => {
  const browser = await chromium.launch();
  for (const site of SITES) {
    console.log('===== ' + site.name + ' =====');
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });
    try {
      await page.goto(site.url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(2500);
      // 三库条数（hub 卡片显示动态计数）
      const slides = await page.$$eval('.wh-slide', els => els.length);
      const bodyText = await page.evaluate(() => document.body.innerText);
      const carouselOk = bodyText.indexOf('石药体内CAR-T SYS6042') >= 0;
      // 文献条数
      const m = bodyText.match(/(\d+)\s*篇\s*·\s*MSC\/CAR-T\/基因治疗三库/);
      const counts = await page.evaluate(() => {
        const t = document.body.innerText;
        const mm = t.match(/([\d,]+)篇 · MSC\/CAR-T\/基因治疗三库/);
        return mm ? mm[1] : 'N/A';
      });
      console.log('轮播: ' + slides + ' | SYS6042轮播: ' + carouselOk + ' | 文献三库: ' + counts);
      // news clinical tab
      await page.evaluate(() => switchSection('news'));
      await page.waitForTimeout(1200);
      await page.evaluate(() => switchNewsTab('clinical'));
      await page.waitForTimeout(1000);
      let t = await page.evaluate(() => document.body.innerText);
      console.log('clinical: SYS6042=' + (t.indexOf('石药集团体内CAR-T SYS6042') >= 0) + ' CASGEVY=' + (t.indexOf('CASGEVY上半年销售额') >= 0));
      await page.evaluate(() => switchNewsTab('funding'));
      await page.waitForTimeout(800);
      t = await page.evaluate(() => document.body.innerText);
      console.log('funding: 虹信=' + (t.indexOf('虹信生物完成数亿元B轮融资') >= 0));
      // 刷新
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      const sec = await page.evaluate(() => currentSection);
      console.log('刷新后 currentSection: ' + sec);
      // 返回键（干净会话）
      const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      const errors2 = [];
      page2.on('pageerror', e => errors2.push(e.message));
      await page2.goto(site.url, { waitUntil: 'networkidle', timeout: 60000 });
      await page2.waitForTimeout(2000);
      await page2.evaluate(() => switchSection('products'));
      await page2.waitForTimeout(1000);
      await page2.evaluate(() => switchSection('news'));
      await page2.waitForTimeout(1000);
      await page2.goBack();
      await page2.waitForTimeout(1500);
      const b1 = await page2.evaluate(() => currentSection);
      await page2.goBack();
      await page2.waitForTimeout(1500);
      const b2 = await page2.evaluate(() => currentSection);
      console.log('返回键: back1=' + b1 + ' back2=' + b2 + ' | ' + ((b1 === 'products' && b2 === 'hub') ? 'OK' : 'FAIL'));
      await page2.close();
      console.log('JS 错误数: ' + errors.length);
      errors.forEach(e => console.log(e));
      console.log(errors.length === 0 ? '>>> ' + site.name + ' 验证通过 <<<' : '>>> ' + site.name + ' 验证失败 <<<');
    } catch (e) {
      console.log('访问失败: ' + e.message.slice(0, 200));
    }
    await page.close();
  }
  await browser.close();
})();
