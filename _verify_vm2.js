const fs = require('fs');
const vm = require('vm');
const s = fs.readFileSync('index.html', 'utf8');

// extract single inline script block (the only one without src)
const tags = [...s.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)];
const scripts = tags.map(m => m[1]);
console.log('inline script blocks: ' + scripts.length);

// compile all
let ok = true;
scripts.forEach((sc, i) => {
  try { new vm.Script(sc, { filename: 'block' + i }); } catch (e) { ok = false; console.log('SCRIPT ' + i + ' COMPILE ERROR: ' + e.message); }
});
console.log('compile: ' + (ok ? 'ALL OK' : 'FAIL'));

// run and read array lengths inside context
const sandbox = {
  console, setTimeout, clearTimeout, setInterval, clearInterval,
  window: {}, document: { getElementById: () => null, querySelectorAll: () => [], createElement: () => ({ style: {} }), addEventListener: () => {}, querySelector: () => null, body: { appendChild: () => {} } },
  location: { href: '', search: '' }, history: {}, navigator: { userAgent: 'test' }, alert: () => {}, requestAnimationFrame: () => {},
  localStorage: { getItem: () => null, setItem: () => {} }, sessionStorage: { getItem: () => null, setItem: () => {} },
  Image: function () {}, Event: function () {}, CustomEvent: function () {}, fetch: () => new Promise(() => {}),
  WebSocket: function () {}, MutationObserver: function () {}
};
sandbox.window = sandbox;
const ctx = vm.createContext(sandbox);
try {
  for (let i = 0; i < scripts.length; i++) vm.runInContext(scripts[i], ctx, { filename: 'block' + i });
  console.log('run: OK');
} catch (e) {
  console.log('run error (may be expected for DOM-dependent code): ' + e.message);
}

const names = ['REGULATIONS', 'CLINICAL_PROGRESS', 'INDUSTRY_NEWS', 'FRONTIER_RESEARCH', 'FUNDING_TRENDS', 'INDUSTRY_REPORTS', 'LOCAL_POLICY', 'PRODUCTS', 'CONFERENCE_EVENTS', 'EXPERT_VIEWS', 'INDUSTRY_BOOKS', 'LEARNING_COURSES', 'REPRINT_ARTICLES', 'ALL_PICKS_ISSUES', 'ORIGINAL_ARTICLES', 'LEARNING_PATH'];
const expr = names.map(n => `try{__r.push(['${n}', typeof ${n}!=='undefined' ? ${n}.length : 'undef'])}catch(e){__r.push(['${n}','ERR'])}`).join(';');
try {
  const result = vm.runInContext('(function(){ var __r=[]; ' + expr + '; return __r; })()', ctx);
  console.log('\n=== 数组条数 ===');
  result.forEach(([n, c]) => console.log('  ' + n + ': ' + c));
} catch (e) {
  console.log('length read error: ' + e.message);
}
