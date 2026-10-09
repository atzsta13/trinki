// Fails the build when the JS/CSS needed for the first screen grows beyond the budget.
// Raise the budget only on purpose – every KB is parse time on a cheap phone.
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = 115; // gzip, everything index.html loads up front

// Usage: node scripts/check-size.js [dist | dist-teen]
const dist = path.resolve(import.meta.dirname, '..', process.argv[2] || 'dist');
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const files = [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+\.(?:js|css))"/g)].map(m => m[1]);

let total = 0;
for (const file of files) {
    const kb = gzipSync(fs.readFileSync(path.join(dist, file))).length / 1024;
    total += kb;
    console.log(`${kb.toFixed(1).padStart(7)} KB  ${file}`);
}
console.log(`${total.toFixed(1).padStart(7)} KB  total of ${path.basename(dist)} (budget ${BUDGET_KB} KB gzip)`);

if (total > BUDGET_KB) {
    console.error(`\nStart bundle is ${(total - BUDGET_KB).toFixed(1)} KB over budget.`);
    process.exit(1);
}
