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
try {
  eval(body.replace(/\[\s*\]/g, '[]'));
  console.log('EVAL OK');
} catch (e) {
  console.log('EVAL ERROR: ' + e.message);
  // V8 stack gives position relative to eval string
  const mm = e.stack.match(/<anonymous>:(\d+):(\d+)/);
  if (mm) {
    const ln = parseInt(mm[1]), col = parseInt(mm[2]);
    const lines = body.split('\n');
    console.log('at line ' + ln + ' col ' + col);
    for (let i = Math.max(0, ln - 2); i < Math.min(lines.length, ln + 2); i++) {
      console.log('L' + (i + 1) + ': ' + lines[i].slice(Math.max(0, col - 80), col + 60));
    }
  }
}
// count quotes per line to find unclosed strings
const lines = body.split('\n');
console.log('\n--- lines with odd single-quote counts ---');
let strOpen = false;
lines.forEach((ln, i) => {
  // simple state machine counting quotes outside of escaped context
  let q = 0;
  for (let j = 0; j < ln.length; j++) {
    if (ln[j] === '\\') { j++; continue; }
    if (ln[j] === "'") q++;
  }
  if (q % 2 === 1) console.log('L' + (i + 1) + ' odd quotes (' + q + '): ' + ln.slice(0, 100));
});
