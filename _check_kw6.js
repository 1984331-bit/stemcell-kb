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
const books = getArr('INDUSTRY_BOOKS');
console.log('=== INDUSTRY_BOOKS 全部 ===');
books.forEach(x => console.log(String(x.title || '').slice(0, 80) + ' | ' + String(x.isbn || '') + ' | ' + String(x.date || '')));
const reps = getArr('INDUSTRY_REPORTS');
console.log('\n=== INDUSTRY_REPORTS 含沙利文/基因疗法/干细胞 蓝皮书 ===');
reps.forEach(x => {
  const t = String(x.title || '');
  if (t.includes('沙利文') || t.includes('蓝皮书') || t.includes('基因疗法')) console.log(String(x.title).slice(0, 80) + ' | ' + String(x.date || ''));
});
