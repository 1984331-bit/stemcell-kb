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
  eval(body);
  console.log('EVAL OK');
} catch (e) {
  console.log('EVAL ERROR: ' + e.message);
  console.log('FULL STACK:');
  console.log(e.stack);
}
// Alternative: eval with new Function to get position
try {
  new Function('return (' + body + ')');
  console.log('new Function OK');
} catch (e) {
  console.log('new Function ERROR: ' + e.message);
  console.log(e.stack.split('\n').slice(0, 8).join('\n'));
}
