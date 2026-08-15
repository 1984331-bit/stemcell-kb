// 2026-08-15 本地 Playwright 验证：零错误 + 刷新 + 返回键
const { chromium } = require('C:/Users/YSJ/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');

(async () => {
  const browser = await chromium.launch();
  const results = [];
  const kw = ['ZVS101e', '济元基因', '京东方', '项鹏', 'Obsidian', '中国细胞治疗', '脐带间充质', '类器官技术培训班'];

  // ===== 会话1：首页零错误 + 轮播 =====
  const page1 = await browser.newPage();
  const errors1 = [];
  page1.on('pageerror', e => errors1.push('pageerror: ' + e.message));
  page1.on('console', m => { if (m.type() === 'error') errors1.push('console: ' + m.text()); });
  await page1.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
  await page1.waitForTimeout(2000);

  const slides = await page1.locator('.wh-slide').count();
  const hubText = await page1.evaluate(() => document.body.innerText);
  results.push(['首页轮播 .wh-slide 数量', slides + '', slides === 7 ? 'PASS' : 'FAIL']);
  results.push(['首页轮播含 ZVS101e', String(hubText.includes('ZVS101e')), hubText.includes('ZVS101e') ? 'PASS' : 'FAIL']);

  // ===== 会话2：news 页 clinical tab 检查新增条目 + 刷新 =====
  const page2 = await browser.newPage();
  const errors2 = [];
  page2.on('pageerror', e => errors2.push('pageerror: ' + e.message));
  page2.on('console', m => { if (m.type() === 'error') errors2.push('console: ' + m.text()); });
  await page2.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
  await page2.waitForTimeout(1500);
  // 切到 news，再切 clinical tab
  await page2.evaluate(() => { try { switchSection('news'); } catch (e) {} });
  await page2.waitForTimeout(1200);
  await page2.evaluate(() => { try { switchNewsTab('clinical'); } catch (e) {} });
  await page2.waitForTimeout(1500);
  let newsText = await page2.evaluate(() => document.body.innerText);
  for (const k of ['ZVS101e', '济元基因', '京东方再生医学']) {
    results.push(['news clinical tab 含 ' + k, String(newsText.includes(k)), newsText.includes(k) ? 'PASS' : 'FAIL']);
  }
  // 刷新验证
  await page2.reload({ waitUntil: 'networkidle' });
  await page2.waitForTimeout(1500);
  await page2.evaluate(() => { try { switchSection('news'); } catch (e) {} });
  await page2.waitForTimeout(1000);
  await page2.evaluate(() => { try { switchNewsTab('clinical'); } catch (e) {} });
  await page2.waitForTimeout(1500);
  newsText = await page2.evaluate(() => document.body.innerText);
  results.push(['刷新后 clinical tab 含 ZVS101e', String(newsText.includes('ZVS101e')), newsText.includes('ZVS101e') ? 'PASS' : 'FAIL']);
  results.push(['会话2 JS 错误数', errors2.length + '', errors2.length === 0 ? 'PASS' : 'FAIL: ' + errors2.join(' | ').slice(0, 200)]);

  // ===== 会话3：返回键验证（干净会话）=====
  const page3 = await browser.newPage();
  const errors3 = [];
  page3.on('pageerror', e => errors3.push('pageerror: ' + e.message));
  page3.on('console', m => { if (m.type() === 'error') errors3.push('console: ' + m.text()); });
  await page3.goto('http://localhost:8765/index.html', { waitUntil: 'networkidle' });
  await page3.waitForTimeout(1500);
  await page3.evaluate(() => { try { switchSection('products'); } catch (e) {} });
  await page3.waitForTimeout(1200);
  await page3.evaluate(() => { try { switchSection('news'); } catch (e) {} });
  await page3.waitForTimeout(1200);
  // 返回（news → products）
  await page3.goBack();
  await page3.waitForTimeout(2000);
  let sec1 = await page3.evaluate(() => { try { return currentSection; } catch (e) { return 'ERR'; } });
  results.push(['返回键第1步 currentSection', sec1, sec1 === 'products' ? 'PASS' : 'FAIL: ' + sec1]);
  await page3.goBack();
  await page3.waitForTimeout(2000);
  let sec2 = await page3.evaluate(() => { try { return currentSection; } catch (e) { return 'ERR'; } });
  results.push(['返回键第2步 currentSection', sec2, sec2 === 'hub' || sec2 === '' ? 'PASS' : 'FAIL: ' + sec2]);
  const slidesAfter = await page3.locator('.wh-slide').count();
  results.push(['返回 hub 后轮播数量', slidesAfter + '', slidesAfter === 7 ? 'PASS' : 'FAIL: ' + slidesAfter]);
  results.push(['会话3 JS 错误数', errors3.length + '', errors3.length === 0 ? 'PASS' : 'FAIL: ' + errors3.join(' | ').slice(0, 200)]);

  // ===== 会话1 收尾 =====
  results.push(['会话1 JS 错误数', errors1.length + '', errors1.length === 0 ? 'PASS' : 'FAIL: ' + errors1.join(' | ').slice(0, 200)]);

  console.log('===== 2026-08-15 本地 Playwright 验证结果 =====');
  let allPass = true;
  for (const [name, val, st] of results) {
    console.log((st.startsWith('PASS') ? '✅ ' : '❌ ') + name + ' => ' + val + ' [' + st + ']');
    if (!st.startsWith('PASS')) allPass = false;
  }
  console.log('===== 总体: ' + (allPass ? '全部通过 ✅' : '存在失败 ❌') + ' =====');
  await browser.close();
  process.exit(allPass ? 0 : 1);
})();
