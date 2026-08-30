/* 2026-08-30 线上验证：CloudStudio 部署后 JS 零错误 + 新增内容可见 + 刷新/返回 */
const { chromium } = require('C:/Users/YSJ/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
const BASE = 'https://70afc6c5ebb54a71b370d6a25d9147e0.app.codebuddy.work/';
const fails = [];
let pass = 0;
function check(name, ok) {
  if (ok) { pass++; console.log('  ✅ ' + name); }
  else { fails.push(name); console.log('  ❌ ' + name); }
}
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });

  console.log('\n=== 1. 线上首页 ===');
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  const hlCount = await page.evaluate(() => document.querySelectorAll('.wh-slide').length);
  check('轮播 .wh-slide=' + hlCount + '（期望7）', hlCount === 7);
  let body = await page.evaluate(() => document.body.innerText);
  check('轮播含 RA CAR-T', body.indexOf('全球首个CAR-T治疗类风湿关节炎临床结果登') >= 0);
  check('首页零 JS 错误', errors.length === 0);

  console.log('\n=== 2. news 页新增 ===');
  await page.evaluate(() => switchSection('news'));
  await page.waitForTimeout(1200);
  await page.evaluate(() => { try { switchNewsTab('clinical'); } catch (e) {} });
  await page.waitForTimeout(1000);
  body = await page.evaluate(() => document.body.innerText);
  check('CLINICAL_PROGRESS 含 RA CAR-T', body.indexOf('全球首个CAR-T治疗类风湿关节炎临床试验结果发表于Nature Medicine') >= 0);
  await page.evaluate(() => { try { switchNewsTab('funding'); } catch (e) {} });
  await page.waitForTimeout(1000);
  body = await page.evaluate(() => document.body.innerText);
  check('FUNDING_TRENDS 含易慕峰递表', body.indexOf('易慕峰生物再次递表港交所') >= 0);

  console.log('\n=== 3. 专家/书籍/监管新增 ===');
  await page.evaluate(() => switchSection('originals'));
  await page.waitForTimeout(1200);
  await page.evaluate(() => { try { switchOriginalTab('experts'); } catch (e) {} });
  await page.waitForTimeout(1000);
  body = await page.evaluate(() => document.body.innerText);
  check('EXPERT_VIEWS 含魏于全', body.indexOf('基因治疗研发整体已居全球第二') >= 0);
  await page.evaluate(() => switchSection('regulations'));
  await page.waitForTimeout(1200);
  body = await page.evaluate(() => document.body.innerText);
  check('REGULATIONS 含 Claudin18.2', body.indexOf('Claudin18.2靶点CAR-T治疗晚期胃癌的临床应用专家共识') >= 0);
  check('REGULATIONS 含帕金森指南', body.indexOf('中国帕金森病治疗指南（第五版）') >= 0);

  console.log('\n=== 4. 刷新验证 ===');
  await page.evaluate(() => switchSection('hub'));
  await page.waitForTimeout(800);
  await page.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  const hlAfter = await page.evaluate(() => document.querySelectorAll('.wh-slide').length);
  check('刷新后轮播=' + hlAfter + '（期望7）', hlAfter === 7);
  check('刷新后零 JS 错误', errors.length === 0);

  console.log('\n=== 5. 返回键验证 ===');
  await page.evaluate(() => switchSection('products'));
  await page.waitForTimeout(1000);
  await page.goBack();
  await page.waitForTimeout(2000);
  const hlBack = await page.evaluate(() => document.querySelectorAll('.wh-slide').length);
  check('返回后轮播=' + hlBack + '（期望7）', hlBack === 7);
  check('返回后零 JS 错误', errors.length === 0);

  await browser.close();
  console.log('\n========== 线上验证汇总 ==========');
  console.log('通过 ' + pass + ' / 失败 ' + fails.length + '，JS 错误 ' + errors.length);
  errors.slice(0, 10).forEach(e => console.log('  ' + e));
  console.log(fails.length === 0 && errors.length === 0 ? '=== 线上验证全部通过 ===' : '=== 线上验证失败 ===');
  process.exit(fails.length === 0 && errors.length === 0 ? 0 : 1);
})();
