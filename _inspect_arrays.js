const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
// highlights
const mh = s.match(/var highlights\s*=\s*\[/);
if (mh) {
  const start = s.indexOf('[', mh.index);
  let d = 0, end = -1;
  for (let i = start; i < s.length; i++) {
    if (s[i] === '[') d++;
    else if (s[i] === ']') { d--; if (d === 0) { end = i; break; } }
  }
  const arr = eval(s.slice(start, end + 1).replace(/\[\s*\]/g, '[]'));
  console.log('HIGHLIGHTS count=' + arr.length);
  arr.forEach((x, i) => console.log('  ' + i + ': ' + JSON.stringify(x).slice(0, 140)));
} else console.log('highlights NOT FOUND');
// find array end positions for insertion targets
['REGULATIONS', 'CLINICAL_PROGRESS', 'EXPERT_VIEWS', 'CONFERENCE_EVENTS', 'FUNDING_TRENDS', 'INDUSTRY_BOOKS', 'LEARNING_COURSES', 'REPRINT_ARTICLES'].forEach(n => {
  const re = new RegExp('(?:const|var)\\s+' + n + '\\s*=\\s*\\[');
  const m = s.match(re);
  if (!m) { console.log(n + ': NOT FOUND'); return; }
  const start = s.indexOf('[', m.index);
  let d = 0, end = -1;
  for (let i = start; i < s.length; i++) {
    if (s[i] === '[') d++;
    else if (s[i] === ']') { d--; if (d === 0) { end = i; break; } }
  }
  const tail = s.slice(end - 120, end + 80);
  console.log('=== ' + n + ' end at ' + end + ' ===');
  console.log(tail.replace(/\n/g, '\\n'));
  console.log('');
});
