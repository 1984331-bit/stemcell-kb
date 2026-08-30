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
const b = Buffer.from(body.slice(0, 150));
for (let i = 0; i < b.length; i++) {
  const c = b[i];
  if (c < 32 && c !== 10 && c !== 13 && c !== 9) console.log('CTRL-' + c + ' at ' + i);
}
console.log('hex first 50:');
console.log(b.toString('hex', 0, 50));
console.log('json first 100:');
console.log(JSON.stringify(body.slice(0, 100)));
