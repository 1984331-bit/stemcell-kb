const fs = require('fs');
const file = 'index.html';
let s = fs.readFileSync(file, 'utf8');

const oldItem = `{type:'clinical', tag:'FDA IND', text:'<div style="font-size:20px;font-weight:700;line-height:1.35;margin-bottom:6px;">西比曼双靶点CAR-T C-CAR039获FDA临床许可</div><div style="font-size:13px;opacity:0.92;font-weight:400;">CD20/CD19双特异性CAR-T · 治疗复发/难治大B细胞淋巴瘤 · 中国关键II期进行中</div>', action:'switchSection(\\'news\\')', bg:'url(https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80)'}`;

const newItem = `{type:'clinical', tag:'Nature Medicine', text:'<div style="font-size:20px;font-weight:700;line-height:1.35;margin-bottom:6px;">全球首个CAR-T治疗类风湿关节炎临床结果登《Nature Medicine》</div><div style="font-size:13px;opacity:0.92;font-weight:400;">6例重度难治性RA全部改善 · 3例停药缓解 · 免疫重置里程碑</div>', action:'switchSection(\\'news\\')', bg:'url(https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80)'}`;

if (!s.includes(oldItem)) {
  console.log('ERROR: old item NOT found');
  process.exit(1);
}
s = s.replace(oldItem, newItem);
fs.writeFileSync(file, s);
console.log('highlights replaced OK');

// verify
const m = s.match(/var highlights\s*=\s*\[/);
const start = s.indexOf('[', m.index);
let d = 0, end = -1;
for (let i = start; i < s.length; i++) {
  if (s[i] === '[') d++;
  else if (s[i] === ']') { d--; if (d === 0) { end = i; break; } }
}
const arr = eval(s.slice(start, end + 1).replace(/\[\s*\]/g, '[]'));
console.log('highlights after: ' + arr.length);
arr.forEach((x, i) => {
  const t = x.text || '';
  const title = t.match(/<div[^>]*>([^<]+)</);
  console.log('  ' + i + ': ' + (title ? title[1] : '?'));
});
