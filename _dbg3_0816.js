const fs = require('fs');
const vm = require('vm');
function testFile(path) {
  const html = fs.readFileSync(path, 'utf-8');
  const name = 'EXPERT_VIEWS';
  const re = new RegExp('(?:const|var|let)\\s+' + name + '\\s*=\\s*\\[', '');
  const m = html.match(re);
  if (!m) return 'not found';
  let i = m.index + m[0].length - 1;
  let depth = 0, inStr = null;
  for (; i < html.length; i++) {
    const c = html[i];
    if (inStr) { if (c === '\\') { i++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) break; }
  }
  const arrText = html.slice(m.index + m[0].length - 1, i + 1);
  try { vm.runInNewContext(arrText, {}); return 'OK, len=' + arrText.length; }
  catch (e) { return 'ERR: ' + e.message; }
}
console.log('备份: ' + testFile('index.html.bak_0816_before_insert'));
console.log('当前: ' + testFile('index.html'));
