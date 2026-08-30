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
let inStr = false;
let firstInvalid = -1;
for (let i = 0; i < lines.length; i++) {
  acc += lines[i] + '\n';
  try {
    new vm.Script('x = ' + acc);
  } catch (e) {
    if (e.message.includes('Invalid')) {
      firstInvalid = i;
      console.log('FIRST INVALID at line ' + (i + 1));
      console.log('line content: ' + lines[i].slice(0, 150));
      if (i > 0) console.log('prev line   : ' + lines[i - 1].slice(0, 150));
      if (i < lines.length - 1) console.log('next line   : ' + lines[i + 1].slice(0, 150));
      break;
    }
  }
}
if (firstInvalid < 0) console.log('no Invalid found in ' + lines.length + ' lines');
