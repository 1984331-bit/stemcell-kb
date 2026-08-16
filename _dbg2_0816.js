const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf-8');
function extractArrayText(name) {
  const re = new RegExp('(?:const|var|let)\\s+' + name + '\\s*=\\s*\\[', '');
  const m = html.match(re);
  if (!m) return null;
  let i = m.index + m[0].length - 1;
  let depth = 0, inStr = null;
  for (; i < html.length; i++) {
    const c = html[i];
    if (inStr) { if (c === '\\') { i++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) break; }
  }
  return html.slice(m.index + m[0].length - 1, i + 1);
}
const name = 'EXPERT_VIEWS';
const t = extractArrayText(name);
// 逐字符定位：尝试从不同起点截断 eval
// 策略：找最后一个成功解析的前缀
let okLen = -1;
let step = 500;
for (let len = step; len <= t.length; len += step) {
  try {
    vm.runInNewContext(t.slice(0, len) + ']', {});
    okLen = len;
  } catch (e) {}
}
console.log('最大可解析长度: ' + okLen + ' / ' + t.length);
// 在 okLen 附近打印内容
console.log('--- okLen 附近内容 ---');
console.log(t.slice(Math.max(0, okLen - 200), okLen + 300));
