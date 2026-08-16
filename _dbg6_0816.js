const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf-8');
function extractArrayText(name) {
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
  return html.slice(m.index + m[0].length - 1, i + 1);
}
const t = extractArrayText('EXPERT_VIEWS');
try {
  vm.runInNewContext(t, {});
  console.log('OK');
} catch (e) {
  console.log('错误: ' + e.message);
  console.log('stack: ' + e.stack);
}
