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
// exact per-char dump
const frag = body.slice(0, 60);
let out = '';
for (let i = 0; i < frag.length; i++) {
  const cp = frag.codePointAt(i);
  out += i + ':' + (cp > 32 && cp < 127 ? frag[i] : 'U+' + cp.toString(16)) + ' ';
}
console.log(out);
// incremental compile
let good = 0;
for (let n = 1; n <= 60; n++) {
  try { new vm.Script('x = ' + frag.slice(0, n)); good = n; }
  catch (e) { console.log('FAIL at n=' + n + ' (char idx ' + (n - 1) + ' = U+' + frag.codePointAt(n - 1).toString(16) + ' ' + JSON.stringify(frag[n - 1]) + '): ' + e.message); break; }
}
console.log('last good n=' + good);
