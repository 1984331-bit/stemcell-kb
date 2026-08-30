const fs = require('fs');
const vm = require('vm');
const s = fs.readFileSync('index.html', 'utf8');

// inline script block starting at 284749
const openIdx = 284749;
const openEnd = s.indexOf('>', openIdx) + 1;
// last closing </script>
const lastClose = s.lastIndexOf('</script>');
console.log('inline block: ' + openEnd + ' -> ' + lastClose);
const content = s.slice(openEnd, lastClose);
console.log('content length: ' + content.length);

try {
  new vm.Script(content);
  console.log('COMPILE OK');
} catch (e) {
  console.log('COMPILE ERROR: ' + e.message);
  const lines = content.split('\n');
  const lineMatch = e.stack.match(/evalmachine\.<anonymous>:(\d+)/);
  if (lineMatch) {
    const ln = parseInt(lineMatch[1]);
    for (let i = Math.max(0, ln - 4); i < Math.min(lines.length, ln + 3); i++) {
      console.log((i + 1) + ': ' + lines[i].slice(0, 200));
    }
  } else {
    console.log(e.stack.split('\n').slice(0, 4).join('\n'));
  }
}
