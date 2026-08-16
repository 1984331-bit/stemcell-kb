const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf-8');
function extractArray(name) {
  const re = new RegExp('(?:const|var|let)\\s+' + name + '\\s*=\\s*\\[', '');
  const m = html.match(re);
  if (!m) return null;
  let i = m.index + m[0].length - 1;
  let depth = 0, inStr = null;
  for (; i < html.length; i++) {
    const c = html[i];
    if (inStr) { if (c === '\\') { i++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) break; }
  }
  const arrText = html.slice(m.index + m[0].length - 1, i + 1);
  try { return { arr: vm.runInNewContext(arrText, {}), text: arrText }; }
  catch (e) { return { err: e.message, text: arrText }; }
}
const boards = ['REGULATIONS','PRODUCTS','ALL_PICKS_ISSUES','ORIGINAL_ARTICLES','REPRINT_ARTICLES','EXPERT_VIEWS','LEARNING_PATH','LEARNING_COURSES','CONFERENCE_EVENTS','INDUSTRY_BOOKS','FUNDING_TRENDS','INDUSTRY_REPORTS','CLINICAL_PROGRESS','FRONTIER_RESEARCH','INDUSTRY_NEWS','LOCAL_POLICY'];
let allOk = true;
const counts = {};
for (const name of boards) {
  const r = extractArray(name);
  if (r.err) { console.log('[FAIL] ' + name + ': ' + r.err); allOk = false; continue; }
  counts[name] = r.arr.length;
}
console.log('数组条数: ' + JSON.stringify(counts));
// 校验新增条目存在
const check = ['石药集团体内CAR-T SYS6042','CASGEVY上半年销售额','BRG01','基本医保目录初步形式审查','虹信生物完成数亿元B轮','陈竺','程涛','福州','中关村新兴科技','ICGT 2026','明眸计划','SYS6042获SLE临床许可'];
for (const kw of check) {
  let found = false;
  for (const name of boards) {
    const r = extractArray(name);
    if (!r.err && r.arr.some(function(x){ return JSON.stringify(x).indexOf(kw) >= 0; })) { found = true; break; }
  }
  console.log((found ? '[OK] ' : '[MISS] ') + kw);
  if (!found) allOk = false;
}
console.log(allOk ? '=== 全部校验通过 ===' : '=== 有失败项 ===');
