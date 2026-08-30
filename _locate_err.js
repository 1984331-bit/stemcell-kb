const fs = require('fs');
const vm = require('vm');
const s = fs.readFileSync('index.html', 'utf8');

// find all script tags
const tags = [...s.matchAll(/<script[^>]*>/g)].map(m => ({ idx: m.index, tag: m[0] }));
console.log('script open tags: ' + tags.length);
tags.forEach((t, i) => console.log('  ' + i + ' @' + t.idx + ': ' + t.tag.slice(0, 60)));

// Extract script content between first <script> and last </script>
const firstOpen = tags[0].idx;
const closeIdx = s.lastIndexOf('</script>');
console.log('first open @' + firstOpen + ', last close @' + closeIdx);
const body = s.slice(firstOpen, closeIdx);
// remove the opening <script...> tag
const content = body.slice(body.indexOf('>') + 1);
console.log('content length: ' + content.length);

try {
  new vm.Script(content);
  console.log('COMPILE OK');
} catch (e) {
  console.log('COMPILE ERROR: ' + e.message);
  // find line context
  const lines = content.split('\n');
  const lineMatch = e.stack.match(/evalmachine\.<anonymous>:(\d+)/);
  if (lineMatch) {
    const ln = parseInt(lineMatch[1]);
    for (let i = Math.max(0, ln - 3); i < Math.min(lines.length, ln + 2); i++) {
      console.log((i + 1) + ': ' + lines[i].slice(0, 150));
    }
  }
}
