const fs = require('fs');
const vm = require('vm');
const s = fs.readFileSync('index.html', 'utf8');
const openEnd = s.indexOf('>', 284749) + 1;
const lastClose = s.lastIndexOf('</script>');
const content = s.slice(openEnd, lastClose);
const lines = content.split('\n');

// locate error with position
try {
  new vm.Script(content);
  console.log('COMPILE OK');
} catch (e) {
  console.log('COMPILE ERROR: ' + e.message);
  const m = e.stack.match(/evalmachine\.<anonymous>:(\d+)/);
  const ln = m ? parseInt(m[1]) : 63253;
  console.log('relative line: ' + ln);
  for (let i = Math.max(0, ln - 5); i < Math.min(lines.length, ln + 4); i++) {
    console.log((i + 1) + ': ' + lines[i].slice(0, 130));
  }
  // also compute absolute file line
  const preContent = s.slice(0, openEnd);
  const preLines = preContent.split('\n');
  console.log('absolute file line ~' + (preLines.length + ln));
}
