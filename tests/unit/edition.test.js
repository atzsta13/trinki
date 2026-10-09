// The teen edition (13+, app stores) must never contain alcohol or adult cards, in any language.
// These tests run the same build-time functions as the edition plugin over the raw content.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { challenges } from '../../src/logic/challenges';
import { MODE_PACKS } from '../../src/logic/deck';
import { PARTY_MODES, SOCIAL_MODES, SEASONAL_MODES } from '../../src/logic/modes';
import {
    TEEN_MAX_SPICINESS, TEEN_HIDDEN_MODES, isTeenCard, teenCards, fullCards, nonTeenKeys, teenStrings, fullStrings, cardKeys
} from '../../src/logic/edition';
import { alcoholPattern, ALCOHOL_LANGUAGES } from '../../scripts/alcohol-words';

const LOCALES_DIR = path.resolve(import.meta.dirname, '../../src/locales');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, file), 'utf8'));
const LANGUAGES = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));

const teen = teenCards(challenges);
const dropped = nonTeenKeys(challenges);
const teenKeys = new Set(teen.flatMap(cardKeys));
const cardText = (c) => [c.text, c.question, c.word, ...(c.forbidden || [])].filter(Boolean).join(' ');

describe('teen cards', () => {
    it('stay within the teen spiciness cap and outside the adult-only modes', () => {
        const hiddenPacks = TEEN_HIDDEN_MODES.flatMap(m => MODE_PACKS[m]).filter(p => !['roast', 'public'].includes(p));
        teen.forEach(c => {
            expect(c.spiciness, c.id).toBeLessThanOrEqual(TEEN_MAX_SPICINESS);
            expect(c.packs.filter(p => hiddenPacks.includes(p)), c.id).toEqual([]);
            expect(c).not.toHaveProperty('teen');
        });
    });

    it('have no alcohol in their English text', () => {
        const offending = teen.filter(c => alcoholPattern('en').test(cardText(c))).map(c => `${c.id}: ${cardText(c)}`);
        expect(offending).toEqual([]);
    });

    it('only use `teen` where it changes something', () => {
        // A teen text on a card that is left out anyway would be dead content.
        challenges.filter(c => typeof c.teen === 'string').forEach(c => expect(isTeenCard(c), c.id).toBe(true));
        // `teen: true` only makes sense above the default cap.
        challenges.filter(c => c.teen === true).forEach(c => expect(c.spiciness, c.id).toBeGreaterThan(2));
    });

    it('cover every mode the teen edition shows', () => {
        const modes = [...PARTY_MODES, ...SOCIAL_MODES, ...SEASONAL_MODES].filter(m => !TEEN_HIDDEN_MODES.includes(m.id));
        const empty = modes.filter(m => !teen.some(c => c.packs.some(p => MODE_PACKS[m.id].includes(p)))).map(m => m.id);
        expect(empty).toEqual([]);
    });

    it('leave the full edition untouched', () => {
        const full = fullCards(challenges);
        expect(full.map(c => c.id)).toEqual(challenges.map(c => c.id));
        full.forEach((c, i) => expect({ ...c, teen: challenges[i].teen }).toEqual(challenges[i]));
    });
});

describe('teen strings', () => {
    it('replace the base key and drop teen keys and adult cards', () => {
        const strings = { a: 'drink', a_teen: 'ice', b: 'same', gone: 'x', gone_forbidden: 'y' };
        expect(teenStrings(strings, new Set(['gone', 'gone_forbidden']))).toEqual({ a: 'ice', b: 'same' });
        expect(fullStrings(strings)).toEqual({ a: 'drink', b: 'same', gone: 'x', gone_forbidden: 'y' });
    });

    it('cover every language we check for alcohol', () => {
        expect([...LANGUAGES].sort()).toEqual([...ALCOHOL_LANGUAGES].sort());
    });

    it.each(LANGUAGES)('%s has no alcohol in the teen edition', (lang) => {
        const pattern = alcoholPattern(lang);
        const cards = teenStrings(readJson(`challenges/${lang}.json`), dropped);
        const ui = teenStrings(readJson(`${lang}.json`), dropped);
        const words = JSON.stringify(readJson(`words/${lang}.json`));
        const offending = [
            ...Object.entries(cards).filter(([key]) => teenKeys.has(key)),
            ...Object.entries(ui),
            ['words', words]
        ].filter(([, text]) => pattern.test(text)).map(([key, text]) => `${key}: ${text.match(pattern)[0]}`);
        expect(offending).toEqual([]);
    });

    it.each(LANGUAGES.filter(l => l !== 'en'))('%s teen card file has no adult cards left', (lang) => {
        const cards = teenStrings(readJson(`challenges/${lang}.json`), dropped);
        expect(Object.keys(cards).filter(key => dropped.has(key))).toEqual([]);
        expect(Object.keys(cards).filter(key => key.endsWith('_teen'))).toEqual([]);
    });
});
