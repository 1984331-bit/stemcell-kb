const fs = require('fs');
const vm = require('vm');
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
[100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 800, 1000, 1500, 2000, 3000, 5000, 8000, 10000].forEach(n => {
  try { new vm.Script('x = ' + body.slice(0, n)); console.log(n + ': OK'); }
  catch (e) { console.log(n + ': FAIL ' + e.message); }
});
