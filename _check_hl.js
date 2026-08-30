const fs = require('fs');
const file = 'index.html';
let s = fs.readFileSync(file, 'utf8');

// find highlights array
const m = s.match(/var highlights\s*=\s*\[/);
const start = s.indexOf('[', m.index);
let d = 0, end = -1;
for (let i = start; i < s.length; i++) {
  if (s[i] === '[') d++;
  else if (s[i] === ']') { d--; if (d === 0) { end = i; break; } }
}
const arrText = s.slice(start, end + 1);
const arr = eval(arrText.replace(/\[\s*\]/g, '[]'));
console.log('highlights before: ' + arr.length);
arr.forEach((x, i) => {
  const t = x.text || '';
  const title = t.match(/<div[^>]*>([^<]+)</);
  console.log('  ' + i + ': ' + (title ? title[1] : JSON.stringify(x).slice(0, 60)));
});
