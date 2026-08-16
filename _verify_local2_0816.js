/* 补充验证：专家观点/课程/会议子页面 */
const { chromium } = require('C:/Users/YSJ/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });
  await page.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // 专家观点
  await page.evaluate(() => switchSection('experts'));
  await page.waitForTimeout(1200);
  let t = await page.evaluate(() => document.body.innerText);
  console.log('专家观点页: 陈竺脐带血=' + (t.indexOf('脐带血来源通用型CAR-T细胞临床转化') >= 0) + ' 程涛800万份=' + (t.indexOf('全球现存储约800万份脐带血') >= 0));

  // 课程
  await page.evaluate(() => switchSection('courses'));
  await page.waitForTimeout(1200);
  t = await page.evaluate(() => document.body.innerText);
  console.log('课程页: 明眸计划=' + (t.indexOf('明眸计划') >= 0));

  // 会议
  await page.evaluate(() => switchSection('conferences'));
  await page.waitForTimeout(1200);
  t = await page.evaluate(() => document.body.innerText);
  console.log('会议页: ICGT 2026=' + (t.indexOf('ICGT 2026') >= 0));

  // 刷新 + 返回验证
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => switchSection('news'));
  await page.waitForTimeout(800);
  await page.goBack();
  await page.waitForTimeout(1200);
  const sec = await page.evaluate(() => currentSection);
  console.log('返回后 section: ' + sec);

  await browser.close();
  console.log('=== JS 错误数: ' + errors.length + ' ===');
  errors.forEach(e => console.log(e));
  console.log(errors.length === 0 ? '=== 补充验证通过 ===' : '=== 补充验证失败 ===');
  process.exit(errors.length === 0 ? 0 : 1);
})();
