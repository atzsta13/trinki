// Fails when the teen build (dist-teen, the 13+ store edition) contains anything it must not:
// alcohol words or drink emoji in any language, cards or name puns of the full edition, or leftover `_teen` keys.
// The unit tests check the content; this checks that the build actually applied the edition.
import fs from 'node:fs';
import path from 'node:path';
import { parseAst } from 'vite';
import { challenges } from '../src/logic/challenges.js';
import { isTeenCard, nonTeenKeys } from '../src/logic/edition.js';
import { alcoholPattern } from './alcohol-words.js';
import names from '../src/logic/names.json' with { type: 'json' };

// Usage: node scripts/check-teen.js [dist-teen]. Pointing it at dist (the full edition) must fail.
const dist = path.resolve(import.meta.dirname, '..', process.argv[2] || 'dist-teen');
const files = fs.readdirSync(dist, { recursive: true }).filter(f => /\.(js|html|json)$/.test(f));

// Every string literal, template text and property name in a JS chunk (identifiers and regexes don't count).
const collect = (node, strings, keys) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(n => collect(n, strings, keys));
    if (node.type === 'Literal' && typeof node.value === 'string') strings.push(node.value);
    if (node.type === 'TemplateElement') strings.push(node.value.cooked ?? node.value.raw);
    if (node.type === 'Property' && !node.computed) keys.push(String(node.key.name ?? node.key.value));
    for (const [field, child] of Object.entries(node)) if (field !== 'parent') collect(child, strings, keys);
};

// i18n keys like `mode_shots` and CSS classes like `toast` are names, not text.
const NAME = /^[a-z0-9]+(?:_[a-z0-9]+)+$|^toast$/;
const dropped = nonTeenKeys(challenges);
const adultIds = new Set(challenges.filter(c => !isTeenCard(c)).map(c => c.id));

const problems = [];
for (const file of files) {
    const code = fs.readFileSync(path.join(dist, file), 'utf8');
    // Locale chunks are named after their language; everything else is English.
    const alcohol = alcoholPattern(path.basename(file).match(/^([a-z]{2})-/)?.[1] ?? 'en');
    const strings = [];
    const keys = [];
    if (file.endsWith('.js')) collect(parseAst(code), strings, keys);
    else strings.push(code);

    for (const text of strings) {
        if (NAME.test(text)) continue;
        const match = text.match(alcohol);
        if (match) problems.push(`${file}: alcohol "${match[0]}" in ${JSON.stringify(text.slice(0, 80))}`);
        if (adultIds.has(text)) problems.push(`${file}: full-edition card "${text}"`);
        const name = names.adult.find(n => text.includes(n));
        if (name) problems.push(`${file}: full-edition name suggestion "${name}"`);
    }
    for (const key of keys) {
        if (dropped.has(key)) problems.push(`${file}: full-edition string "${key}"`);
        if (key.endsWith('_teen')) problems.push(`${file}: leftover key "${key}"`);
    }
}
const all = files.map(f => fs.readFileSync(path.join(dist, f), 'utf8')).join('\n');
if (!all.includes('take an ice cube')) problems.push('no teen card text found – was this built with --mode teen?');

if (problems.length) {
    console.error(`Teen build check failed (${problems.length}):\n  ${problems.join('\n  ')}`);
    process.exit(1);
}
console.log(`Teen build OK: ${files.length} files, no alcohol, no full-edition content.`);
