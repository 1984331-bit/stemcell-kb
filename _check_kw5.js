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
const exp = getArr('EXPERT_VIEWS');
console.log('=== EXPERT_VIEWS 魏于全/葛均波/裴端卿/鞠振宇 现有条目 ===');
exp.forEach(x => {
  const t = String(x.name || '') + ' ' + String(x.title || '');
  if (t.includes('魏于全') || t.includes('葛均波') || t.includes('裴端卿') || t.includes('鞠振宇')) {
    console.log(JSON.stringify(x).slice(0, 300));
    console.log('---');
  }
});
const conf = getArr('CONFERENCE_EVENTS');
console.log('=== CONFERENCE_EVENTS 含 CPHI/CGLTS 条目 ===');
conf.forEach(x => {
  const t = String(x.title || '');
  if (t.includes('CPHI') || t.includes('CGLTS') || t.includes('苏州')) console.log(JSON.stringify(x).slice(0, 250) + '\n---');
});
