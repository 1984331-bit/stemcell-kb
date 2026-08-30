/* 2026-08-30 L1 板块新增 Playwright 验证：渲染 + 刷新 + 返回键 */
const { chromium } = require('C:/Users/YSJ/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
const BASE = 'http://127.0.0.1:8765/index.html';
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

  // === 1. 首页 ===
  console.log('\n=== 1. 首页渲染与轮播 ===');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const hlCount = await page.evaluate(() => document.querySelectorAll('.wh-slide').length);
  check('首页轮播 .wh-slide 数量=' + hlCount + '（期望7）', hlCount === 7);
  let body = await page.evaluate(() => document.body.innerText);
  check('轮播含 RA CAR-T 标题', body.indexOf('全球首个CAR-T治疗类风湿关节炎临床结果登') >= 0);
  check('首页零 JS 错误', errors.length === 0);

  // === 2. news 页：CLINICAL_PROGRESS（切 clinical tab）===
  console.log('\n=== 2. news 页 CLINICAL_PROGRESS ===');
  await page.evaluate(() => switchSection('news'));
  await page.waitForTimeout(1200);
  await page.evaluate(() => { try { switchNewsTab('clinical'); } catch (e) {} });
  await page.waitForTimeout(1000);
  body = await page.evaluate(() => document.body.innerText);
  check('CLINICAL_PROGRESS 含 RA CAR-T 临床突破', body.indexOf('全球首个CAR-T治疗类风湿关节炎临床试验结果发表于Nature Medicine') >= 0);

  // === 3. news 页 FUNDING_TRENDS（funding tab）===
  console.log('\n=== 3. news 页 FUNDING_TRENDS ===');
  await page.evaluate(() => { try { switchNewsTab('funding'); } catch (e) {} });
  await page.waitForTimeout(1000);
  body = await page.evaluate(() => document.body.innerText);
  check('FUNDING_TRENDS 含易慕峰递表', body.indexOf('易慕峰生物再次递表港交所') >= 0);

  // === 4. originals 页 EXPERT_VIEWS ===
  console.log('\n=== 4. originals 页 EXPERT_VIEWS ===');
  await page.evaluate(() => switchSection('originals'));
  await page.waitForTimeout(1200);
  await page.evaluate(() => { try { switchOriginalTab('experts'); } catch (e) {} });
  await page.waitForTimeout(1000);
  body = await page.evaluate(() => document.body.innerText);
  check('EXPERT_VIEWS 含魏于全新观点', body.indexOf('基因治疗研发整体已居全球第二') >= 0);

  // === 5. books 页 CONFERENCE_EVENTS + INDUSTRY_BOOKS ===
  console.log('\n=== 5. books 页 CONFERENCE_EVENTS + INDUSTRY_BOOKS ===');
  await page.evaluate(() => switchSection('books'));
  await page.waitForTimeout(1200);
  await page.evaluate(() => { try { switchBookTab('conferences'); } catch (e) {} });
  await page.waitForTimeout(1000);
  body = await page.evaluate(() => document.body.innerText);
  check('CONFERENCE_EVENTS 含 CPHI CGT 论坛', body.indexOf('2026CPHI') >= 0 || body.indexOf('CGT药物开发实例与策略论坛') >= 0);
  await page.evaluate(() => { try { switchBookTab('books'); } catch (e) {} });
  await page.waitForTimeout(1000);
  body = await page.evaluate(() => document.body.innerText);
  check('INDUSTRY_BOOKS 含 Nonclinical Evaluation', body.indexOf('Nonclinical Evaluation Studies of Cellular and Gene Therapy') >= 0);
  check('INDUSTRY_BOOKS 含 Gene and Cell Therapies', body.indexOf('Gene and Cell Therapies: Principles of Pharmaceutical Development') >= 0);

  // === 6. REGULATIONS 板块 ===
  console.log('\n=== 6. REGULATIONS ===');
  await page.evaluate(() => switchSection('regulations'));
  await page.waitForTimeout(1200);
  body = await page.evaluate(() => document.body.innerText);
  check('REGULATIONS 含 Claudin18.2 共识', body.indexOf('Claudin18.2靶点CAR-T治疗晚期胃癌的临床应用专家共识') >= 0);
  check('REGULATIONS 含帕金森指南', body.indexOf('中国帕金森病治疗指南（第五版）') >= 0);

  // === 7. 刷新验证 ===
  console.log('\n=== 7. 刷新验证 ===');
  await page.evaluate(() => switchSection('hub'));
  await page.waitForTimeout(800);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => switchSection('hub'));
  await page.waitForTimeout(1000);
  body = await page.evaluate(() => document.body.innerText);
  const hlAfter = await page.evaluate(() => document.querySelectorAll('.wh-slide').length);
  check('刷新后轮播仍 7 条', hlAfter === 7);
  check('刷新后零 JS 错误', errors.length === 0);
  check('刷新后 hub 页正常渲染', body.indexOf('本周热点') >= 0 || body.indexOf('共创') >= 0);

  // === 8. 返回键验证 ===
  console.log('\n=== 8. 返回键验证 ===');
  await page.evaluate(() => switchSection('products'));
  await page.waitForTimeout(1000);
  body = await page.evaluate(() => document.body.innerText);
  check('products 子页正常', body.indexOf('获批') >= 0 || body.indexOf('产品') >= 0);
  await page.goBack();
  await page.waitForTimeout(1500);
  await page.evaluate(() => switchSection('hub'));
  await page.waitForTimeout(1000);
  body = await page.evaluate(() => document.body.innerText);
  const hlBack = await page.evaluate(() => document.querySelectorAll('.wh-slide').length);
  check('返回后轮播正常（' + hlBack + '条）', hlBack === 7);
  check('返回后零 JS 错误', errors.length === 0);

  await browser.close();
  console.log('\n========== 结果汇总 ==========');
  console.log('通过 ' + pass + ' 项 / 失败 ' + fails.length + ' 项');
  console.log('JS 错误总数: ' + errors.length);
  errors.slice(0, 10).forEach(e => console.log('  ' + e));
  fails.forEach(f => console.log('  ❌ ' + f));
  console.log(fails.length === 0 && errors.length === 0 ? '=== 本地验证全部通过 ===' : '=== 本地验证失败 ===');
  process.exit(fails.length === 0 && errors.length === 0 ? 0 : 1);
})();
