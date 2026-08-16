// 从 index.html 提取板块数组并更新 site_arrays/*.json 快照
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
  const startIdx = m.index + m[0].indexOf('[');
  let depth = 0, k = startIdx;
  while (k < src.length) {
    if (src[k] === '[') depth++;
    else if (src[k] === ']') { depth--; if (depth === 0) break; }
    k++;
  }
  const arrSrc = src.slice(startIdx, k + 1);
  try {
    const arr = vm.runInContext(arrSrc, sandbox, {timeout: 5000});
    fs.writeFileSync('C:/Users/YSJ/WorkBuddy/细胞与基因治疗知识库/site_arrays/' + n + '.json', JSON.stringify(arr, null, 1), 'utf-8');
    console.log(n, arr.length);
  } catch (e) {
    console.log(n, 'PARSE ERROR:', e.message.slice(0, 80));
  }
}
