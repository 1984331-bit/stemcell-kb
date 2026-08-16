const fs = require('fs');
function extract(text, name) {
  const re = new RegExp('(?:const|var|let)\\s+' + name + '\\s*=\\s*\\[', '');
  const m = text.match(re);
  if (!m) return null;
  let i = m.index + m[0].length - 1;
  let depth = 0, inStr = null;
  for (; i < text.length; i++) {
    const c = text[i];
    if (inStr) { if (c === '\\') { i++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) break; }
  }
  return text.slice(m.index, i + 1);
}
const oldT = fs.readFileSync('index.html.bak_0816_before_insert', 'utf-8');
const newT = fs.readFileSync('index.html', 'utf-8');
const oe = extract(oldT, 'EXPERT_VIEWS');
const ne = extract(newT, 'EXPERT_VIEWS');
for (let i = 0; i < 60; i++) {
  const a = oe[i], b = ne[i];
  if (a !== b) {
    console.log('位置 ' + i + ': 旧=' + JSON.stringify(a) + ' (' + a.charCodeAt(0) + ') 新=' + JSON.stringify(b) + ' (' + b.charCodeAt(0) + ')');
  }
}
console.log('旧前 80: ' + JSON.stringify(oe.slice(0, 80)));
console.log('新前 80: ' + JSON.stringify(ne.slice(0, 80)));
