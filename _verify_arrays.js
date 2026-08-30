const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
function getArr(name) {
  const re = new RegExp('(?:const|var)\\s+' + name + '\\s*=\\s*\\[');
  const m = s.match(re);
  if (!m) return null;
  const start = s.indexOf('[', m.index);
  let d = 0, end = -1;
  for (let i = start; i < s.length; i++) {
    if (s[i] === '[') d++;
    else if (s[i] === ']') { d--; if (d === 0) { end = i; break; } }
  }
  if (end < 0) return { error: 'no end' };
  try {
    const arr = eval(s.slice(start, end + 1).replace(/\[\s*\]/g, '[]'));
    return { arr, start, end };
  } catch (e) {
    return { error: e.message, start, end };
  }
}
const names = ['REGULATIONS', 'CLINICAL_PROGRESS', 'INDUSTRY_NEWS', 'FRONTIER_RESEARCH', 'FUNDING_TRENDS', 'INDUSTRY_REPORTS', 'LOCAL_POLICY', 'PRODUCTS', 'CONFERENCE_EVENTS', 'EXPERT_VIEWS', 'INDUSTRY_BOOKS', 'LEARNING_COURSES', 'REPRINT_ARTICLES', 'ALL_PICKS_ISSUES', 'ORIGINAL_ARTICLES', 'LEARNING_PATH'];
console.log('=== 数组条数验证 ===');
let allOk = true;
names.forEach(n => {
  const r = getArr(n);
  if (!r) { console.log('  ' + n + ': NOT FOUND'); allOk = false; }
  else if (r.error) { console.log('  ' + n + ': EVAL ERROR ' + r.error); allOk = false; }
  else console.log('  ' + n + ': ' + r.arr.length + ' 条' + (r.arr.some(x => x === undefined || x === null) ? ' ⚠️含空洞' : ''));
});
console.log(allOk ? '\n全部数组解析成功' : '\n存在解析问题');
