const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const m = s.match(/var highlights\s*=\s*\[/);
const start = s.indexOf('[', m.index);
let d = 0, end = -1;
for (let i = start; i < s.length; i++) {
  if (s[i] === '[') d++;
  else if (s[i] === ']') { d--; if (d === 0) { end = i; break; } }
}
const arr = eval(s.slice(start, end + 1).replace(/\[\s*\]/g, '[]'));
console.log(JSON.stringify(arr[6], null, 1));
console.log('\n=== raw text of item 6 ===');
// find the raw text: locate the 7th { after start
let idx = start;
const positions = [];
for (let i = start; i <= end; i++) {
  if (s[i] === '{') positions.push(i);
  if (positions.length === 7) break;
}
// find end of item 6 (before item 7 or closing ])
const itemStart = positions[6];
// find matching close brace
let depth = 0, itemEnd = -1;
for (let i = itemStart; i <= end; i++) {
  if (s[i] === '{') depth++;
  else if (s[i] === '}') { depth--; if (depth === 0) { itemEnd = i; break; } }
}
console.log(s.slice(itemStart, itemEnd + 1));
