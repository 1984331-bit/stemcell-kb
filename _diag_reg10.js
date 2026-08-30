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
const frag = body.slice(0, 100);
// find first invalid token char by trying 1-char additions
for (let n = 1; n <= 100; n++) {
  try { new vm.Script('x = ' + frag.slice(0, n)); }
  catch (e) {
    if (e.message.includes('Invalid')) {
      const c = frag[n - 1];
      console.log('first invalid at index ' + (n - 1) + ' char=' + JSON.stringify(c) + ' codepoint=U+' + c.codePointAt(0).toString(16));
      console.log('context: ...' + frag.slice(Math.max(0, n - 20), n + 10));
      break;
    }
  }
}
// print all chars with codepoints 0-100
console.log('\nchar dump 0-100:');
for (let i = 0; i < Math.min(100, frag.length); i++) {
  const cp = frag.codePointAt(i);
  if (cp > 126 || cp < 32) {
    console.log('  idx ' + i + ': U+' + cp.toString(16) + ' ' + JSON.stringify(frag[i]));
  }
}
