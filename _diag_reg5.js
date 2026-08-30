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
try {
  new vm.Script('x = ' + body);
  console.log('COMPILE OK');
} catch (e) {
  console.log('COMPILE ERROR: ' + e.message);
  const mm = e.stack.match(/\[stdin\]:(\d+):(\d+)/) || e.stack.match(/evalmachine\.<anonymous>:(\d+):(\d+)/);
  if (mm) {
    const ln = parseInt(mm[1]), col = parseInt(mm[2]);
    const lines = body.split('\n');
    console.log('line ' + ln + ' col ' + col);
    const ctxLine = lines[ln - 1] || '';
    console.log('content: ...' + ctxLine.slice(Math.max(0, col - 100), col + 80));
    if (ln > 1) console.log('prev: ...' + (lines[ln - 2] || '').slice(-120));
    if (ln < lines.length) console.log('next: ' + (lines[ln] || '').slice(0, 80));
  }
}
