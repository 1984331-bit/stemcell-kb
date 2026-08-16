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
const arr = extractArray('INDUSTRY_NEWS');
arr.filter(function(x){ return JSON.stringify(x).indexOf('医保') >= 0; }).forEach(function(x){ console.log(JSON.stringify(x, null, 1).slice(0, 900)); console.log('---'); });
