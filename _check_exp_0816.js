const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf-8');
function extractArray(name) {
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
  const arrText = html.slice(m.index + m[0].length - 1, i + 1);
  try { return vm.runInNewContext(arrText, {}); } catch (e) { return { __err__: e.message }; }
}
const arr = extractArray('EXPERT_VIEWS');
arr.forEach(function(x, idx) {
  const n = x.name || '';
  if (n.indexOf('院士') >= 0 || n.indexOf('陈竺') >= 0 || n.indexOf('王存玉') >= 0 || n.indexOf('程涛') >= 0) {
    console.log('#' + idx + ' name=' + n);
    console.log('  quote=' + String(x.quote || '').slice(0, 150));
    console.log('  source=' + (x.source || ''));
    console.log('---');
  }
});
