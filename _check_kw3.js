const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
function getArr(name) {
  const re = new RegExp('(?:const|var)\\s+' + name + '\\s*=\\s*\\[');
  const m = s.match(re);
  if (!m) return null;
  const start = s.indexOf('[', m.index);
  let depth = 0, end = -1;
  for (let i = start; i < s.length; i++) {
    if (s[i] === '[') depth++;
    else if (s[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  return eval(s.slice(start, end + 1).replace(/\[\s*\]/g, '[]'));
}
const names = ['PRODUCTS', 'CLINICAL_PROGRESS', 'INDUSTRY_NEWS', 'FRONTIER_RESEARCH', 'CONFERENCE_EVENTS', 'EXPERT_VIEWS', 'INDUSTRY_REPORTS', 'INDUSTRY_BOOKS', 'LEARNING_COURSES', 'LOCAL_POLICY', 'FUNDING_TRENDS', 'REGULATIONS'];
const kws = ['Genglycos', 'GSDI', '糖原', 'Tudriqev', '溶瘤', 'Replimune', '类风湿', 'RA', 'Kyverna', 'miv', 'AbelZeta', 'C-CAR039', 'HiCM', 'HEAL-CHF', '科济', 'CT0596', 'CT1190', '泰国', '宋卡', '帕金森病治疗指南', 'Claudin18.2', '胃癌'];
names.forEach(n => {
  const arr = getArr(n);
  if (!arr) { console.log(n + ': NOT FOUND'); return; }
  console.log('=== ' + n + ' count=' + arr.length + ' ===');
  kws.forEach(k => {
    const hits = arr.filter(x => {
      const t = String(x.title || '') + ' ' + String(x.name || '') + ' ' + String(x.desc || '');
      return t.includes(k);
    });
    if (hits.length) hits.forEach(h => console.log('  [' + k + '] ' + String(h.title || h.name || '').slice(0, 70)));
  });
});
