const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');

// Parse REGULATIONS with bracket matching and report exact tail
const re = new RegExp('(?:const|var)\\s+REGULATIONS\\s*=\\s*\\[');
const m = s.match(re);
const start = s.indexOf('[', m.index);
let d = 0, end = -1;
for (let i = start; i < s.length; i++) {
  if (s[i] === '[') d++;
  else if (s[i] === ']') { d--; if (d === 0) { end = i; break; } }
}
console.log('array start=' + start + ' end=' + end);
// show tail chars around end
console.log('TAIL (end-200..end+20):');
console.log(s.slice(end - 200, end + 20));
// try eval
try {
  const arr = eval(s.slice(start, end + 1).replace(/\[\s*\]/g, '[]'));
  console.log('EVAL OK, count=' + arr.length);
  console.log('last 4 titles:');
  arr.slice(-4).forEach(x => console.log('  ' + String(x.category || '') + ' | ' + String(x.title).slice(0, 60)));
} catch (e) {
  console.log('EVAL ERROR: ' + e.message);
  // try to find where string breaks: scan for suspicious quote counts per line in the array
  const body = s.slice(start, end + 1);
  const lines = body.split('\n');
  let inStr = false;
  lines.forEach((ln, i) => {
    // count single quotes (rough)
    const q = (ln.match(/'/g) || []).length;
    if (q % 2 === 1) console.log('  odd quote count line ' + (i + 1) + ' (len ' + ln.length + '): ' + ln.slice(0, 80));
  });
}
