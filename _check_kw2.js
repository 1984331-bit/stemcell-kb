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
const names = ['LOCAL_POLICY', 'FUNDING_TRENDS', 'INDUSTRY_REPORTS', 'PRODUCTS', 'CONFERENCE_EVENTS', 'EXPERT_VIEWS', 'INDUSTRY_BOOKS', 'LEARNING_COURSES', 'CLINICAL_PROGRESS', 'INDUSTRY_NEWS', 'FRONTIER_RESEARCH'];
const kws = ['北京', '虹信', 'Obsidian', '英维科', '先锐', '帕金森', '胃癌', 'Claudin', '高质量发展', '促进细胞'];
names.forEach(n => {
  const arr = getArr(n);
  if (!arr) { console.log(n + ': NOT FOUND'); return; }
  console.log('=== ' + n + ' count=' + arr.length + ' ===');
  kws.forEach(k => {
    const hits = arr.filter(x => String(x.title || '').includes(k) || String(x.name || '').includes(k) || String(x.desc || '').includes(k));
    if (hits.length) hits.forEach(h => console.log('  [' + k + '] ' + String(h.title || h.name || '').slice(0, 60)));
  });
});
