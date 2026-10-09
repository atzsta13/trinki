// Vite plugin that builds one edition (see src/logic/edition.js): it rewrites the card catalogue and the
// UI/card locale files at build time, so the teen bundle contains no adult cards or strings at all.
import { teenCards, fullCards, nonTeenKeys, teenStrings, fullStrings } from '../src/logic/edition.js';

const CATALOGUE = new URL('../src/logic/challenges.js', import.meta.url);
const CHALLENGES = /\/src\/logic\/challenges\.js$/;
const STRINGS = /\/src\/locales\/(?:challenges\/)?[a-z]+\.json$/;

// Cache-busted, so the dev server picks up edits to the catalogue.
const loadChallenges = async () => (await import(`${CATALOGUE.href}?t=${Date.now()}`)).challenges;

export default function editionPlugin(edition) {
    const teen = edition === 'teen';
    let dropped = new Set();

    return {
        name: 'party-penguin-edition',
        enforce: 'pre',
        async buildStart() {
            if (teen) dropped = nonTeenKeys(await loadChallenges());
        },
        async transform(code, id) {
            const file = id.split('?')[0];
            if (CHALLENGES.test(file)) {
                const challenges = await loadChallenges();
                if (teen) dropped = nonTeenKeys(challenges);
                const cards = teen ? teenCards(challenges) : fullCards(challenges);
                return { code: `export const challenges = ${JSON.stringify(cards)};`, map: null };
            }
            if (STRINGS.test(file)) {
                const strings = JSON.parse(code);
                return { code: JSON.stringify(teen ? teenStrings(strings, dropped) : fullStrings(strings)), map: null };
            }
        }
    };
}
