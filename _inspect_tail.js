const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
function getArr(name) {
  const re = new RegExp('(?:const|var)\\s+' + name + '\\s*=\\s*\\[');
  const m = s.match(re);
  if (!m) return null;
  const start = s.indexOf('[', m.index);
  let d = 0, end = -1;
  for (let i = start; i < s.length; i++) {
    if (s[i] === '[') d++;
    else if (s[i] === ']') { d--; if (d === 0) { end = i; break; } }
  }
  return { arr: eval(s.slice(start, end + 1).replace(/\[\s*\]/g, '[]')), start, end };
}
['REGULATIONS', 'CLINICAL_PROGRESS', 'EXPERT_VIEWS', 'CONFERENCE_EVENTS', 'FUNDING_TRENDS', 'INDUSTRY_BOOKS', 'LEARNING_COURSES', 'REPRINT_ARTICLES'].forEach(n => {
  const r = getArr(n);
  if (!r) { console.log(n + ': NOT FOUND'); return; }
  const last = r.arr[r.arr.length - 1];
  console.log('=== ' + n + ' 最后一条（end=' + r.end + '） ===');
  console.log(JSON.stringify(last, null, 1).slice(0, 800));
  console.log('---原始文本尾部---');
  console.log(s.slice(r.end - 260, r.end + 6).replace(/\n/g, '\\n'));
  console.log('\n');
});
