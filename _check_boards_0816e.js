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
const boards = ['INDUSTRY_REPORTS','LOCAL_POLICY','FUNDING_TRENDS','INDUSTRY_BOOKS','LEARNING_COURSES'];
const keywords = ['360iResearch','360','中商','中关村新兴科技','中研普华','再生医学','福州','服务业扩大开放','榕台','厦门','中因','虹信','体内'];
for (const name of boards) {
  const arr = extractArray(name);
  if (!arr || arr.__err__) { console.log('[' + name + '] err'); continue; }
  for (const kw of keywords) {
    const found = arr.filter(function(x){ return JSON.stringify(x).indexOf(kw) >= 0; });
    if (found.length > 0) {
      const titles = found.map(function(x){ var t = x.title || x.name || ''; return String(t).slice(0,55); }).join(' | ');
      console.log('[' + name + '] "' + kw + '" -> ' + found.length + ': ' + titles);
    }
  }
}
