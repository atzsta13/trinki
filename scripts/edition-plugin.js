// Vite plugin that builds one edition (see src/logic/edition.js): it rewrites the card catalogue and the
// UI/card locale files at build time, so the teen bundle contains no adult cards or strings at all.
import fs from 'node:fs';
import { teenCards, fullCards, nonTeenKeys, teenStrings, fullStrings } from '../src/logic/edition.js';

const CATALOGUE = new URL('../src/logic/challenges.js', import.meta.url);
const CHALLENGES = /\/src\/logic\/challenges\.js$/;
const STRINGS = /\/src\/locales\/(?:challenges\/)?[a-z]+\.json$/;

// Keyed by modification time: the dev server sees edits, and an unchanged catalogue is imported only once.
const loadChallenges = async () => (await import(`${CATALOGUE.href}?v=${fs.statSync(CATALOGUE).mtimeMs}`)).challenges;

export default function editionPlugin(edition) {
    const teen = edition === 'teen';

    return {
        name: 'party-penguin-edition',
        enforce: 'pre',
        // Dev server: the locales depend on the catalogue (left-out cards), so reload them when it changes.
        handleHotUpdate({ file, server }) {
            if (!CHALLENGES.test(file)) return;
            for (const mod of server.moduleGraph.idToModuleMap.values()) {
                if (STRINGS.test(mod.file ?? '')) server.moduleGraph.invalidateModule(mod);
            }
            server.ws.send({ type: 'full-reload' });
        },
        async transform(code, id) {
            const file = id.split('?')[0];
            if (CHALLENGES.test(file)) {
                const challenges = await loadChallenges();
                const cards = teen ? teenCards(challenges) : fullCards(challenges);
                return { code: `export const challenges = ${JSON.stringify(cards)};`, map: null };
            }
            if (STRINGS.test(file)) {
                const strings = JSON.parse(code);
                const result = teen ? teenStrings(strings, nonTeenKeys(await loadChallenges())) : fullStrings(strings);
                return { code: JSON.stringify(result), map: null };
            }
        }
    };
}
