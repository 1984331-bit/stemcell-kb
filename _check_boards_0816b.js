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
const boards = ['REGULATIONS','CLINICAL_PROGRESS','INDUSTRY_NEWS','FRONTIER_RESEARCH','LOCAL_POLICY','FUNDING_TRENDS','INDUSTRY_REPORTS','CONFERENCE_EVENTS','EXPERT_VIEWS','LEARNING_COURSES','INDUSTRY_BOOKS'];
const keywords = ['医保','纳基奥仑赛','瑞基奥仑赛','雷尼基奥仑赛','普基奥仑赛','舒瑞基奥仑赛','石药','SYS6042','阿斯利康','合资','SYS6063','LB2501','LCAR-AIO','JW-c','商保','预申报','体内CAR'];
for (const name of boards) {
  const arr = extractArray(name);
  if (!arr || arr.__err__) { console.log('[' + name + '] err'); continue; }
  for (const kw of keywords) {
    const found = arr.filter(function(x){ return JSON.stringify(x).indexOf(kw) >= 0; });
    if (found.length > 0) {
      const titles = found.map(function(x){ var t = x.title || x.name || ''; return String(t).slice(0,50); }).join(' | ');
      console.log('[' + name + '] "' + kw + '" -> ' + found.length + ': ' + titles);
    }
  }
}
