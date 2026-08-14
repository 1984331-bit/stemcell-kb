// 快照 index.html 板块数组：条数 + 标题清单（用于去重比对）
const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');

const arrNames = [
  'REGULATIONS','PRODUCTS','ALL_PICKS_ISSUES','ORIGINAL_ARTICLES','REPRINT_ARTICLES',
  'EXPERT_VIEWS','LEARNING_PATH','LEARNING_COURSES','CONFERENCE_EVENTS','INDUSTRY_BOOKS',
  'CLINICAL_PROGRESS','FRONTIER_RESEARCH','INDUSTRY_NEWS','INDUSTRY_REPORTS','LOCAL_POLICY','FUNDING_TRENDS'
];

const ctx = {};
vm.createContext(ctx);

function findArrayEnd(src, start) {
  // start 指向 '[' 的位置，返回配对 ']' 的索引（感知字符串）
  let depth = 0, i = start;
  let inStr = null;
  while (i < src.length) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') { i += 2; continue; }
      if (c === inStr) inStr = null;
      i++; continue;
    }
    if (c === "'" || c === '"') { inStr = c; i++; continue; }
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  throw new Error('unbalanced array at ' + start);
}

const out = {};
for (const name of arrNames) {
  const re = new RegExp('(?:const|var)\\s+' + name + '\\s*=\\s*\\[');
  const m = re.exec(html);
  if (!m) { out[name] = { found: false }; continue; }
  const start = html.indexOf('[', m.index);
  const end = findArrayEnd(html, start);
  const code = html.slice(m.index, end + 1) + '\n;globalThis.__snap = ' + name + ';';
  try {
    vm.runInContext(code, ctx, { timeout: 5000 });
    const arr = ctx.__snap;
    const titles = arr.map((it, i) => (it && (it.title || it.name || it.cat || it.tag || '?')).slice(0, 60));
    out[name] = { found: true, length: arr.length, titles };
  } catch (e) {
    out[name] = { found: true, error: e.message };
  }
}

fs.writeFileSync('_snap_0814.json', JSON.stringify(out, null, 1), 'utf8');
for (const name of Object.keys(out)) {
  const v = out[name];
  if (!v.found) { console.log(name, ': NOT FOUND'); continue; }
  if (v.error) { console.log(name, ': ERROR', v.error); continue; }
  console.log(name, ':', v.length);
  v.titles.forEach((t, i) => console.log('   ', i, t));
}
