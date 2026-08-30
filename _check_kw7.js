const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
function getArr(name) {
  const re = new RegExp('(?:const|var)\\s+' + name + '\\s*=\\s*\\[');
  const m = s.match(re);
  if (!m) return null;
  const start = s.indexOf('[', m.index);
  let d = 0, end = -1;
  for (let i = start; i < s.length; i++) {
    if (s[i] === '[') d++;
    else if (s[i] === ']') { d--; if (d === 0) { end = i; break; } }
  }
  return eval(s.slice(start, end + 1).replace(/\[\s*\]/g, '[]'));
}
const ft = getArr('FUNDING_TRENDS');
console.log('FUNDING_TRENDS 含易慕峰/递表:');
ft.forEach(x => { const t = String(x.title || ''); if (t.includes('易慕峰') || t.includes('递表') || t.includes('港交所')) console.log('  ' + t.slice(0, 80)); });
const conf = getArr('CONFERENCE_EVENTS');
console.log('CONFERENCE 含 CPHI/深圳:');
conf.forEach(x => { const t = String(x.title || ''); if (t.includes('CPHI') || t.includes('深圳')) console.log('  ' + t.slice(0, 80)); });
const courses = getArr('LEARNING_COURSES');
console.log('LEARNING_COURSES 含 血液病医院/血研所/广东省医学会/ISCT/实训:');
courses.forEach(x => { const t = String(x.title || ''); if (t.includes('血液病医院') || t.includes('血研所') || t.includes('广东省医学会') || t.includes('ISCT') || t.includes('实训')) console.log('  ' + t.slice(0, 80)); });
