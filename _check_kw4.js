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
const names = ['EXPERT_VIEWS', 'CONFERENCE_EVENTS', 'INDUSTRY_REPORTS', 'REPRINT_ARTICLES', 'INDUSTRY_BOOKS', 'LEARNING_COURSES'];
const kws = ['魏于全', '葛均波', '裴端卿', '鞠振宇', '陈志国', '舒易来', '王皓毅', '曲光', '珠海', '医药生物技术大会', '精准医学发展论坛', 'CBI', 'CPHI', '腾冲', '2026全球医疗峰会'];
names.forEach(n => {
  const arr = getArr(n);
  if (!arr) { console.log(n + ': NOT FOUND'); return; }
  console.log('=== ' + n + ' count=' + arr.length + ' ===');
  kws.forEach(k => {
    const hits = arr.filter(x => {
      const t = String(x.title || '') + ' ' + String(x.name || '') + ' ' + String(x.desc || '') + ' ' + String(x.source || '');
      return t.includes(k);
    });
    if (hits.length) hits.forEach(h => console.log('  [' + k + '] ' + String(h.title || h.name || '').slice(0, 75)));
  });
});
