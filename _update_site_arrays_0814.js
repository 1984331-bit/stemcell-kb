// 更新 site_arrays/*.json 板块快照（从 index.html 解析）
const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const arrNames = ['LOCAL_POLICY','CLINICAL_PROGRESS','EXPERT_VIEWS','CONFERENCE_EVENTS','INDUSTRY_REPORTS','INDUSTRY_BOOKS','LEARNING_COURSES','INDUSTRY_NEWS','REGULATIONS','PRODUCTS','FUNDING_TRENDS','FRONTIER_RESEARCH','REPRINT_ARTICLES','ORIGINAL_ARTICLES','ALL_PICKS_ISSUES','LEARNING_PATH'];
const ctx = {}; vm.createContext(ctx);
function findArrayEnd(src, start) {
  let depth = 0, i = start, inStr = null;
  while (i < src.length) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') { i += 2; continue; }
      if (c === inStr) inStr = null;
      i++; continue;
    }
    if (c === "'" || c === '"') { inStr = c; i++; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) return i; }
    i++;
  }
  throw new Error('unbalanced ' + start);
}
const outDir = 'C:/Users/YSJ/WorkBuddy/细胞与基因治疗知识库/site_arrays/';
let ok = 0;
for (const name of arrNames) {
  const re = new RegExp('(?:const|var)\\s+' + name + '\\s*=\\s*\\[');
  const m = re.exec(html);
  if (!m) { console.log(name, ': NOT FOUND'); continue; }
  const start = html.indexOf('[', m.index);
  const end = findArrayEnd(html, start);
  const code = html.slice(m.index, end + 1) + '\n;globalThis.__s = ' + name + ';';
  try {
    vm.runInContext(code, ctx, { timeout: 5000 });
    const arr = ctx.__s;
    fs.writeFileSync(outDir + name + '.json', JSON.stringify(arr, null, 1), 'utf8');
    console.log(name, ': ' + arr.length + ' 条已更新');
    ok++;
  } catch (e) { console.log(name, ': ERROR', e.message); }
}
console.log('更新完成', ok + '/' + arrNames.length);
