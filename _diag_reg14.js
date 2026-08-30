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
const lines = body.split('\n');
let acc = '';
let found = -1;
for (let i = 0; i < lines.length; i++) {
  acc += lines[i] + '\n';
  try {
    new vm.Script('x = ' + acc);
  } catch (e) {
    if (!e.message.includes('end of input') && !e.message.includes('Unexpected end')) {
      found = i;
      console.log('REAL SYNTAX ERROR at line ' + (i + 1) + ': ' + e.message);
      console.log('  line: ' + lines[i].slice(0, 160));
      if (i > 0) console.log('  prev: ' + lines[i - 1].slice(0, 160));
      if (i + 1 < lines.length) console.log('  next: ' + lines[i + 1].slice(0, 160));
      break;
    }
  }
}
if (found < 0) console.log('no real syntax error (all end-of-input) in ' + lines.length + ' lines');
