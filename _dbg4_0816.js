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
console.log('旧 len:', oe.length, '新 len:', ne.length);
let firstDiff = -1;
for (let i = 0; i < Math.min(oe.length, ne.length); i++) {
  if (oe[i] !== ne[i]) { firstDiff = i; break; }
}
console.log('第一个差异位置:', firstDiff);
if (firstDiff >= 0) {
  console.log('旧:', JSON.stringify(oe.slice(firstDiff - 100, firstDiff + 150)));
  console.log('新:', JSON.stringify(ne.slice(firstDiff - 100, firstDiff + 150)));
}
// 找最后一个可解析的前缀（按完整条目分割）
console.log('=== 新数组尾部 500 字符 ===');
console.log(JSON.stringify(ne.slice(-500)));
