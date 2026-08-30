const fs = require('fs');
const vm = require('vm');
const s = fs.readFileSync('index.html', 'utf8');

// 1. extract all <script> blocks and compile
const scripts = [...s.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
console.log('script blocks: ' + scripts.length);
const sandbox = { window: {}, document: { getElementById: () => null, querySelectorAll: () => [], createElement: () => ({ style: {} }), addEventListener: () => {} }, console, setTimeout, clearTimeout, location: { href: '' }, history: {}, navigator: { userAgent: 'test' } };
sandbox.window = sandbox;
let ok = true;
for (let i = 0; i < scripts.length; i++) {
  try {
    new vm.Script(scripts[i], { filename: 'block' + i });
  } catch (e) {
    ok = false;
    console.log('SCRIPT ' + i + ' COMPILE ERROR: ' + e.message);
  }
}
console.log('all script blocks compile: ' + (ok ? 'OK' : 'FAIL'));

// 2. run in sandbox to collect arrays
const ctx = vm.createContext(sandbox);
for (let i = 0; i < scripts.length; i++) {
  try { vm.runInContext(scripts[i], ctx, { filename: 'block' + i }); } catch (e) { /* runtime errors in event handlers are ok, only capture arrays */ }
}
// arrays declared with var/const in script blocks become properties of context? No—top-level const/let don't. Use eval in context.
try {
  const names = ['REGULATIONS', 'CLINICAL_PROGRESS', 'INDUSTRY_NEWS', 'FRONTIER_RESEARCH', 'FUNDING_TRENDS', 'INDUSTRY_REPORTS', 'LOCAL_POLICY', 'PRODUCTS', 'CONFERENCE_EVENTS', 'EXPERT_VIEWS', 'INDUSTRY_BOOKS', 'LEARNING_COURSES', 'REPRINT_ARTICLES'];
  names.forEach(n => {
    try {
      const r = vm.runInContext('typeof ' + n + ' !== "undefined" ? ' + n + '.length : -1', ctx);
      console.log(n + ': ' + r);
    } catch (e) { console.log(n + ': ERR ' + e.message); }
  });
} catch (e) {
  console.log('array eval error: ' + e.message);
}
