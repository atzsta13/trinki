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
const MODES_WITHOUT_CONTENT = [];

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
    const placeholders = (s) => (s.match(/\{\{\w+\}\}/g) || []).sort().join();

    // Every text a player can see on a card. Minigame cards only start the minigame, their text is never shown.
    const MINIGAME_ONLY = ['bomb', 'spy', 'charades', 'fakeArtist'];
    const cardSource = Object.fromEntries(challenges.flatMap(c => {
        const key = c.translationKey || c.id;
        if (c.type === 'darkTales') return ['_title', '_story', '_solution'].map(s => [key + s, enChallenges[key + s]]);
        if (c.type === 'taboo') return [[key, c.word], [`${key}_forbidden`, c.forbidden.join(', ')]];
        if (MINIGAME_ONLY.includes(c.type) && !c.duration) return [];
        return [[key, c.text || c.question || enChallenges[key]]];
    }));

    it('every card has English source text', () => {
        const missing = Object.entries(cardSource).filter(([, text]) => !text).map(([key]) => key);
        expect(missing).toEqual([]);
    });

    it('every t() key used in the code exists in English', () => {
        const srcDir = path.resolve(import.meta.dirname, '../../src');
        const code = fs.readdirSync(srcDir, { recursive: true })
            .filter(f => /\.jsx?$/.test(f))
            .map(f => fs.readFileSync(path.join(srcDir, f), 'utf8'))
            .join('\n');
        const used = new Set([
            ...[...code.matchAll(/\bt\(\s*'(\w+)'/g)].map(m => m[1]),
            ...Object.values(MODES).filter(m => !m.labelFallback).map(m => m.label)
        ]);
        expect([...used].filter(k => !(k in en))).toEqual([]);
    });

    // Every language is complete: a missing string would silently show English.
    it.each(LANGUAGES)('%s has every UI string, and no unknown ones', (lang) => {
        const strings = readJson(`${lang}.json`);
        expect(Object.keys(en).filter(k => !(k in strings)), 'missing').toEqual([]);
        expect(Object.keys(strings).filter(k => !(k in en)), 'unknown').toEqual([]);
    });

    it.each(LANGUAGES.filter(l => l !== 'en'))('%s translates every card, and nothing else', (lang) => {
        const cards = readJson(`challenges/${lang}.json`);
        expect(Object.keys(cardSource).filter(k => !(k in cards)), 'missing').toEqual([]);
        expect(Object.keys(cards).filter(k => !(k in cardSource)), 'unknown').toEqual([]);
    });

    it.each(LANGUAGES)('%s keeps the {{placeholders}} of the English source', (lang) => {
        const ui = readJson(`${lang}.json`);
        const cards = readJson(`challenges/${lang}.json`);
        Object.entries(ui).forEach(([key, value]) => expect(placeholders(value), key).toBe(placeholders(en[key])));
        Object.entries(cards).forEach(([key, value]) => expect(placeholders(value), key).toBe(placeholders(cardSource[key] || '')));
    });
});
