const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf-8');
function extractArray(name) {
  const re = new RegExp('(?:const|var|let)\\s+' + name + '\\s*=\\s*\\[', '');
  const m = html.match(re);
  if (!m) return { err: 'not found' };
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
  try {
    const arr = vm.runInNewContext(arrText, {});
    return { ok: true, len: arr.length, head: arrText.slice(0, 120), tail: arrText.slice(-180) };
  } catch (e) {
    // 尝试定位错误：二分定位
    return { err: e.message, head: arrText.slice(0, 120), tail: arrText.slice(-250), len: arrText.length };
  }
}
['EXPERT_VIEWS','CLINICAL_PROGRESS','FUNDING_TRENDS'].forEach(function(n) {
  const r = extractArray(n);
  console.log('===== ' + n + ' =====');
  console.log(JSON.stringify(r, null, 1).slice(0, 1500));
});
