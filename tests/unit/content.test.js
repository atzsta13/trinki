// Sanity checks for the card catalogue, modes and locales.
// They catch the typical mistakes when content is added by hand (or by an LLM).
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { challenges } from '../../src/logic/challenges';
import { MODE_PACKS } from '../../src/logic/deck';
import { MODES, PARTY_MODES, SOCIAL_MODES, SEASONAL_MODES, DEFAULT_MODES } from '../../src/logic/modes';

const CARD_TYPES = [
    // plain cards
    'statement', 'standard', 'virus', 'vote', 'charade', 'neverHaveIEver', 'wouldYouRather', 'taboo', 'paranoia', 'truth', 'dare',
    // interactive cards (Card.jsx)
    'reflex', 'precision', 'shake',
    // minigames (GameScreen.jsx MINIGAMES)
    'bomb', 'spy', 'charades', 'fakeArtist', 'secrets', 'darkTales'
];

// Modes that are selectable but have no cards yet. Remove an entry once cards exist.
const MODES_WITHOUT_CONTENT = ['newFriends', 'bar', 'warmUp', 'newYear', 'beach'];

const LOCALES_DIR = path.resolve(import.meta.dirname, '../../src/locales');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, file), 'utf8'));
const LANGUAGES = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));

describe('challenges', () => {
    it('have unique ids', () => {
        const ids = challenges.map(c => c.id);
        expect(ids.length).toBe(new Set(ids).size);
    });

    it.each(challenges)('$id is well-formed', (card) => {
        expect(CARD_TYPES).toContain(card.type);
        expect(card.packs.length).toBeGreaterThan(0);
        expect(card.spiciness).toBeGreaterThanOrEqual(0);
        expect(card.spiciness).toBeLessThanOrEqual(6);
        // Every card needs English text, or a translation key that resolves in en.
        const hasText = Boolean(card.text || card.question || card.word || card.translationKey);
        expect(hasText).toBe(true);
    });

    it('taboo cards list forbidden words', () => {
        challenges.filter(c => c.type === 'taboo').forEach(c => expect(c.forbidden?.length).toBeGreaterThan(0));
    });
});

describe('modes', () => {
    const allModes = [...PARTY_MODES, ...SOCIAL_MODES, ...SEASONAL_MODES];

    it('every selectable mode maps to content packs', () => {
        allModes.forEach(mode => expect(MODE_PACKS[mode.id], mode.id).toBeDefined());
    });

    it('every mode has cards (except the known gaps)', () => {
        const empty = allModes
            .map(m => m.id)
            .filter(id => !challenges.some(c => c.packs.some(p => MODE_PACKS[id].includes(p))));
        expect(empty.sort()).toEqual([...MODES_WITHOUT_CONTENT].sort());
    });

    it('default modes are all party modes', () => {
        expect(DEFAULT_MODES).toEqual(PARTY_MODES.map(m => m.id));
        expect(Object.keys(MODES).length).toBeGreaterThan(0);
    });
});

describe('locales', () => {
    const en = readJson('en.json');
    const enChallenges = readJson('challenges/en.json');
    const cardKeys = new Set(challenges.flatMap(c => {
        const key = c.translationKey || c.id;
        return c.type === 'darkTales' ? [`${key}_title`, `${key}_story`, `${key}_solution`] : [key];
    }));

    it.each(LANGUAGES)('%s UI strings only use keys that exist in English', (lang) => {
        const unknown = Object.keys(readJson(`${lang}.json`)).filter(k => !(k in en));
        expect(unknown).toEqual([]);
    });

    it.each(LANGUAGES)('%s card translations only use known card ids or UI keys', (lang) => {
        const unknown = Object.keys(readJson(`challenges/${lang}.json`))
            .filter(k => !cardKeys.has(k) && !(k in enChallenges) && !(k in en));
        expect(unknown).toEqual([]);
    });

    it('placeholders in translations match the English source', () => {
        const placeholders = (s) => (s.match(/\{\{\w+\}\}/g) || []).sort().join();
        const englishText = Object.fromEntries(challenges.map(c => [c.translationKey || c.id, c.text || c.question || '']));
        LANGUAGES.forEach(lang => {
            Object.entries(readJson(`challenges/${lang}.json`)).forEach(([key, value]) => {
                const source = enChallenges[key] ?? englishText[key];
                if (source) expect(placeholders(value), `${lang}:${key}`).toBe(placeholders(source));
            });
        });
    });
});
