/* 2026-08-16 本地 Playwright 验证：0 错误 + 刷新 + 返回键 */
const { chromium } = require('C:/Users/YSJ/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });

  // 1. 打开首页
  await page.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const slides = await page.$$eval('.wh-slide', els => els.length);
  const bodyText = await page.evaluate(() => document.body.innerText);
  const carouselOk = bodyText.indexOf('石药体内CAR-T SYS6042') >= 0;
  console.log('轮播 .wh-slide 数量: ' + slides + ' | 石药SYS6042轮播: ' + carouselOk);

  // 2. news 页 clinical tab 新增条目渲染
  await page.evaluate(() => switchSection('news'));
  await page.waitForTimeout(1200);
  await page.evaluate(() => switchNewsTab('clinical'));
  await page.waitForTimeout(1000);
  let newsText = await page.evaluate(() => document.body.innerText);
  const s1 = newsText.indexOf('石药集团体内CAR-T SYS6042') >= 0;
  const s2 = newsText.indexOf('CASGEVY上半年销售额') >= 0;
  const s3 = newsText.indexOf('BRG01') >= 0;
  console.log('clinical tab: SYS6042=' + s1 + ' CASGEVY=' + s2 + ' BRG01=' + s3);
  // 其他 tab 抽查
  await page.evaluate(() => switchNewsTab('industry'));
  await page.waitForTimeout(800);
  newsText = await page.evaluate(() => document.body.innerText);
  console.log('industry tab 医保初审: ' + (newsText.indexOf('基本医保目录初步形式审查') >= 0) + ' | 石药×阿斯利康合资: ' + (newsText.indexOf('石药集团与阿斯利康成立合资公司') >= 0));
  await page.evaluate(() => switchNewsTab('funding'));
  await page.waitForTimeout(800);
  newsText = await page.evaluate(() => document.body.innerText);
  console.log('funding tab 虹信B轮: ' + (newsText.indexOf('虹信生物完成数亿元B轮融资') >= 0));
  await page.evaluate(() => switchNewsTab('report'));
  await page.waitForTimeout(800);
  newsText = await page.evaluate(() => document.body.innerText);
  console.log('report tab 中关村联盟: ' + (newsText.indexOf('中关村新兴科技服务业产业联盟') >= 0));
  await page.evaluate(() => switchNewsTab('policy'));
  await page.waitForTimeout(800);
  newsText = await page.evaluate(() => document.body.innerText);
  console.log('policy tab 福州: ' + (newsText.indexOf('福州') >= 0));

  // 3. 刷新验证（当前在 policy tab）
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  let afterReload = await page.evaluate(() => document.body.innerText);
  console.log('刷新后(按URL hash恢复): currentSection=' + await page.evaluate(() => currentSection) + ' | 页面渲染=' + (afterReload.length > 1000));

  // 4. 返回键验证（干净 page 会话）
  const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors2 = [];
  page2.on('pageerror', e => errors2.push('PAGEERROR: ' + e.message));
  page2.on('console', msg => { if (msg.type() === 'error') errors2.push('CONSOLE: ' + msg.text()); });
  await page2.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
  await page2.waitForTimeout(1200);
  // products → news
  await page2.evaluate(() => switchSection('products'));
  await page2.waitForTimeout(1000);
  const sec1 = await page2.evaluate(() => currentSection);
  await page2.evaluate(() => switchSection('news'));
  await page2.waitForTimeout(1000);
  const sec2 = await page2.evaluate(() => currentSection);
  // 返回键 ×2
  await page2.goBack();
  await page2.waitForTimeout(1200);
  const back1 = await page2.evaluate(() => currentSection);
  await page2.goBack();
  await page2.waitForTimeout(1200);
  const back2 = await page2.evaluate(() => currentSection);
  const backOk = back1 === 'products' && back2 === 'hub';
  console.log('返回键: products→' + sec2 + ' →back1=' + back1 + ' →back2=' + back2 + ' | ' + (backOk ? 'OK' : 'FAIL'));
  const backBody = await page2.evaluate(() => document.body.innerText);
  console.log('返回后 hub 渲染正常: ' + (backBody.length > 1000 && backBody.indexOf('基础数据库入口') >= 0));

  await browser.close();
  const allErrors = errors.concat(errors2);
  console.log('=== JS 错误数: ' + allErrors.length + ' ===');
  allErrors.forEach(e => console.log(e));
  const pass = allErrors.length === 0 && slides === 7 && carouselOk && s1 && s2 && s3;
  console.log(pass ? '=== 本地验证通过 ===' : '=== 本地验证失败 ===');
  process.exit(pass ? 0 : 1);
})();
