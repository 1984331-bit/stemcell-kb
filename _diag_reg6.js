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
console.log('body length: ' + body.length);
// binary search: find the minimal prefix that fails to compile
function tryCompile(txt) {
  try { new vm.Script('x = ' + txt); return true; } catch (e) { return false; }
}
let lo = 0, hi = body.length;
// find first failing prefix
let failAt = -1;
for (let step = 100000; step >= 1; step = Math.floor(step / 2)) {
  if (lo + step < hi && tryCompile(body.slice(0, lo + step))) { lo += step; }
}
// lo is largest good prefix (roughly)
console.log('largest good prefix ends near char ' + lo);
console.log('window:');
console.log(body.slice(Math.max(0, lo - 150), lo + 250));
