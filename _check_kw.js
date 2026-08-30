const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
function getArr(name) {
  const re = new RegExp('const\\s+' + name + '\\s*=\\s*\\[');
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
const reg = getArr('REGULATIONS');
if (!reg) { console.log('REG NOT FOUND'); process.exit(0); }
const kws = ['Claudin', 'claudin', '帕金森', '胃癌', 'FACT-JACIE', 'Potency', '先锐', '外泌体', '备案'];
kws.forEach(k => {
  const hits = reg.filter(x => String(x.title).includes(k) || String(x.title || '').toLowerCase().includes(k.toLowerCase()));
  console.log('KW[' + k + '] ->', hits.length, hits.map(x => String(x.title).slice(0, 55)).join(' || '));
});
