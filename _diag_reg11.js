const vm = require('vm');
const tests = [
  "x = [{category:'技术指南', title:'FDA'}]",
  "x = [{category:'a', title:'b'}]",
  "x = [\r\n\r\n  {category:'技术指南', title:'FDA'}]",
  "x = [\n\n  {category:'技术指南', title:'FDA'}]",
  "x = [  {category:'技术指南', title:'FDA'}]",
  "var y = [{category:'技术指南'}]",
  "[{category:'技术指南'}]",
  "x = [{技术指南:'x'}]"
];
tests.forEach(t => {
  try { new vm.Script(t); console.log('OK  : ' + JSON.stringify(t)); }
  catch (e) { console.log('FAIL: ' + JSON.stringify(t) + ' -> ' + e.message); }
});
