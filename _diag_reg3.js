const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const re = new RegExp('(?:const|var)\\s+REGULATIONS\\s*=\\s*\\[');
const m = s.match(re);
const start = s.indexOf('[', m.index);
let d = 0, end = -1;
for (let i = start; i < s.length; i++) {
  if (s[i] === '[') d++;
  else if (s[i] === ']') { d--; if (d === 0) { end = i; break; } }
}
const body = s.slice(start, end + 1);

// split into items by top-level commas: scan char by char tracking depth and strings
function splitTopLevel(text) {
  const items = [];
  let depth = 0, cur = '', inStr = false, strCh = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      cur += c;
      if (c === '\\') { i++; cur += text[i]; continue; }
      if (c === strCh) inStr = false;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { inStr = true; strCh = c; cur += c; continue; }
    if (c === '{' || c === '[') { depth++; cur += c; continue; }
    if (c === '}' || c === ']') { depth--; cur += c; continue; }
    if (c === ',' && depth === 0) { items.push(cur); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) items.push(cur);
  return items;
}

const items = splitTopLevel(body.slice(1, -1)); // strip [ and ]
console.log('top-level items: ' + items.length);
// test each item's balance
items.forEach((it, i) => {
  let d2 = 0, ok = true;
  let inStr2 = false, strCh2 = '';
  for (let j = 0; j < it.length; j++) {
    const c = it[j];
    if (inStr2) {
      if (c === '\\') { j++; continue; }
      if (c === strCh2) inStr2 = false;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { inStr2 = true; strCh2 = c; continue; }
    if (c === '{') d2++;
    else if (c === '}') d2--;
  }
  if (d2 !== 0 || inStr2) {
    ok = false;
    console.log('ITEM ' + i + ' UNBALANCED (depth ' + d2 + ', inStr ' + inStr2 + '): ' + it.slice(0, 120));
  }
  if (i === items.length - 1) console.log('last item ok=' + ok);
});
