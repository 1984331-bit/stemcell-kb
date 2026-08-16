const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf-8');

function extractArray(name) {
  const re = new RegExp('(?:const|var|let)\\s+' + name + '\\s*=\\s*\\[', '');
  const m = html.match(re);
  if (!m) return null;
  let i = m.index + m[0].length - 1; // 指向 '['
  let depth = 0;
  let inStr = null;
  for (; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) break; }
  }
  const arrText = html.slice(m.index + m[0].length - 1, i + 1);
  try {
    const arr = vm.runInNewContext(arrText, {});
    return arr;
  } catch (e) {
    return { __parse_error__: e.message };
  }
}

const boardNames = ['REGULATIONS','PRODUCTS','ALL_PICKS_ISSUES','ORIGINAL_ARTICLES','REPRINT_ARTICLES','EXPERT_VIEWS','LEARNING_PATH','LEARNING_COURSES','CONFERENCE_EVENTS','INDUSTRY_BOOKS','FUNDING_TRENDS','INDUSTRY_REPORTS','CLINICAL_PROGRESS','FRONTIER_RESEARCH','INDUSTRY_NEWS','LOCAL_POLICY'];
const keywords = ['SYS6042','石药','体内CAR-T','JW-c-100','JW-c','药明巨诺','LCAR-AIO','传奇生物','in vivo','体内CAR','Obsidian','Galera','ZVS101e','RXIM002','北京','九条','CT1190B','通用型','项鹏','iPSC'];
const results = {};
for (const name of boardNames) {
  const arr = extractArray(name);
  if (arr === null) { console.log('[' + name + '] 未找到数组定义'); continue; }
  if (arr.__parse_error__) { console.log('[' + name + '] 解析失败: ' + arr.__parse_error__); continue; }
  results[name] = arr.length;
  for (const kw of keywords) {
    const found = arr.filter(function(x){ return JSON.stringify(x).indexOf(kw) >= 0; });
    if (found.length > 0) {
      const titles = found.map(function(x){ var t = x.title || x.name || x.cat || ''; return String(t).slice(0,55); }).join(' | ');
      console.log('[' + name + '] "' + kw + '" -> ' + found.length + ' 条: ' + titles);
    }
  }
}
console.log('数组条数: ' + JSON.stringify(results));
