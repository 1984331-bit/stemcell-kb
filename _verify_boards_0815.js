// 验证 index.html 各板块数组精确条数（Node vm 解析，板块数组是 JS 单引号字面量非 JSON）
const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('C:/Users/YSJ/WorkBuddy/Claw/stemcell-kb/index.html', 'utf-8');

const names = ['REGULATIONS','PRODUCTS','ALL_PICKS_ISSUES','ORIGINAL_ARTICLES','REPRINT_ARTICLES','EXPERT_VIEWS','LEARNING_PATH','LEARNING_COURSES','CONFERENCE_EVENTS','INDUSTRY_BOOKS','FUNDING_TRENDS','INDUSTRY_REPORTS','CLINICAL_PROGRESS','INDUSTRY_NEWS','FRONTIER_RESEARCH','LOCAL_POLICY'];
const sandbox = {};
vm.createContext(sandbox);
for (const n of names) {
  sandbox[n] = undefined;
  const m = src.match(new RegExp('(?:var|const|let)\\s+' + n + '\\s*=\\s*(\\[)'));
  if (!m) { console.log(n, 'NOT FOUND'); continue; }
  // 提取数组字面量源码
  const startIdx = m.index + m[0].indexOf('[');
  let depth = 0, k = startIdx;
  while (k < src.length) {
    if (src[k] === '[') depth++;
    else if (src[k] === ']') { depth--; if (depth === 0) break; }
    k++;
  }
  const arrSrc = src.slice(startIdx, k + 1);
  try {
    sandbox[n] = vm.runInContext(arrSrc, sandbox, {timeout: 5000});
    console.log(n, Array.isArray(sandbox[n]) ? sandbox[n].length : 'NOT ARRAY');
  } catch (e) {
    console.log(n, 'PARSE ERROR:', e.message.slice(0, 80));
  }
}
