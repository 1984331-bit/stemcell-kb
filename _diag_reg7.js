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
// test small pieces
const tests = [
  'x = [\n\n  {category:1}]',
  'x = [{a:1}]',
  'x = [\n  {a:1}\n]'
];
tests.forEach(t => {
  try { new vm.Script(t); console.log('OK  : ' + t); }
  catch (e) { console.log('FAIL: ' + t + ' -> ' + e.message); }
});
// test actual first 500 chars
const first = body.slice(0, 500);
try { new vm.Script('x = ' + first); console.log('first 500 OK'); }
catch (e) { console.log('first 500 FAIL: ' + e.message); }
// show raw bytes of the first ~200 chars after [
console.log('\nRAW (after [):');
console.log(JSON.stringify(body.slice(0, 220)));
