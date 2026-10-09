// Fails when the teen build (dist-teen, the 13+ store edition) contains anything it must not:
// alcohol words in any language, cards or name puns of the full edition, or leftover `_teen` keys.
// The unit tests check the content; this checks that the build actually applied the edition.
import fs from 'node:fs';
import path from 'node:path';
import { challenges } from '../src/logic/challenges.js';
import { nonTeenKeys } from '../src/logic/edition.js';
import { alcoholPattern } from './alcohol-words.js';
import names from '../src/logic/names.json' with { type: 'json' };

const assets = path.resolve(import.meta.dirname, '../dist-teen/assets');
const chunks = fs.readdirSync(assets).filter(f => f.endsWith('.js')).map(f => [f, fs.readFileSync(path.join(assets, f), 'utf8')]);
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// String literals only, so identifiers like `drinkCount` and regexes in the game logic don't count.
const STRING = /`(?:[^`\\]|\\.)*`|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g;

// i18n keys like `mode_shots` are names, not text; so is the CSS class of the streak toast.
const KEY = /^.[a-z0-9]+(?:_[a-z0-9]+)+.$|^.toast.$/;

const problems = [];
for (const [file, code] of chunks) {
    // Locale chunks are named after their language; everything else is English game code.
    // (Emoji are only checked in texts: the code still names the hidden Bar mode's 🍻.)
    const lang = file.match(/^([a-z]{2})-/)?.[1];
    const alcohol = alcoholPattern(lang ?? 'en', { emoji: Boolean(lang) });
    for (const [literal] of code.matchAll(STRING)) {
        if (KEY.test(literal)) continue;
        const match = literal.match(alcohol);
        if (match) problems.push(`${file}: alcohol word "${match[0]}" in ${literal.slice(0, 80)}`);
    }
    if (/\w_teen\b/.test(code)) problems.push(`${file}: leftover _teen key`);
    for (const name of names.adult) {
        if (code.includes(name)) problems.push(`${file}: full-edition name suggestion "${name}"`);
    }
    for (const key of nonTeenKeys(challenges)) {
        // As an object key (`nhie_3:` / `"1010_3":`) or as a card id (`nhie_3`).
        if (new RegExp(`(?<![\\w$])(?:["'\`]?${escape(key)}["'\`]?:|\`${escape(key)}\`)`).test(code)) {
            problems.push(`${file}: full-edition card "${key}"`);
        }
    }
}
if (!chunks.some(([, code]) => code.includes('take an ice cube'))) problems.push('no teen card text found – was this built with --mode teen?');

if (problems.length) {
    console.error(`Teen build check failed:\n  ${problems.join('\n  ')}`);
    process.exit(1);
}
console.log(`Teen build OK: ${chunks.length} chunks, no alcohol, no full-edition cards.`);
