// Two editions are built from the same source (see vite.config.js and docs/editions.md):
// - 'full': the 18+ party game with drinking cards and spiciness 0–6 (website).
// - 'teen': the 13+ store edition. Penalties are ice cubes instead of drinks, spiciness is capped,
//   adult-only modes are hidden.
// The teen build doesn't hide adult content, it never contains it: at build time the edition plugin
// rewrites challenges.js and the locale files with the functions below. They are pure (no `__EDITION__`),
// so the build, the unit tests and the dist scan all use exactly the same rules.

/** Highest spiciness level a teen deck can reach (the slider stops here). */
export const TEEN_MAX_SPICINESS = 3;
/** Cards above this level are only in the teen edition if they opt in with `teen: true` or a teen text. */
const TEEN_SAFE_SPICINESS = 2;
/** Modes (and their content packs) that only exist in the full edition. */
export const TEEN_HIDDEN_MODES = ['closeFriends', 'bar'];
const TEEN_HIDDEN_PACKS = ['hot', 'bar'];
/** UI strings the teen edition can't show (labels of hidden modes and slider levels), left out of its bundle. */
const TEEN_HIDDEN_STRINGS = ['mode_shots', 'mode_bar', 'spicy_4', 'spicy_5', 'spicy_6'];

const TEEN_SUFFIX = '_teen';

export const isTeenCard = (card) => {
    if (card.teen === false || card.spiciness > TEEN_MAX_SPICINESS) return false;
    if (card.packs.some(p => TEEN_HIDDEN_PACKS.includes(p))) return false;
    return card.teen !== undefined || card.spiciness <= TEEN_SAFE_SPICINESS;
};

const withoutTeenField = (card) => {
    const copy = { ...card };
    delete copy.teen;
    return copy;
};

/** The cards of the teen edition: only teen cards, with their teen text swapped in. */
export const teenCards = (challenges) => challenges.filter(isTeenCard).map(card => {
    const copy = withoutTeenField(card);
    if (typeof card.teen === 'string') copy[card.question ? 'question' : 'text'] = card.teen;
    return copy;
});

export const fullCards = (challenges) => challenges.map(withoutTeenField);

/** Every translation key a card can use (see the locale gotchas in AGENTS.md). */
export const cardKeys = (card) => {
    const key = card.translationKey || card.id;
    return [key, `${key}_forbidden`, `${key}_title`, `${key}_story`, `${key}_solution`];
};

/** Translation keys that are not in the teen edition: its left-out cards and hidden UI strings. */
export const nonTeenKeys = (challenges) => new Set([...challenges.filter(c => !isTeenCard(c)).flatMap(cardKeys), ...TEEN_HIDDEN_STRINGS]);

/**
 * Teen strings: `<key>_teen` replaces `<key>`, then all `_teen` keys and the keys in `dropped` are removed.
 * The same mechanism serves UI strings (e.g. `result_drink_teen`) and card translations (`c_1_teen`).
 */
export const teenStrings = (strings, dropped = new Set()) => {
    const result = {};
    for (const [key, value] of Object.entries(strings)) {
        if (key.endsWith(TEEN_SUFFIX) || dropped.has(key)) continue;
        result[key] = strings[key + TEEN_SUFFIX] ?? value;
    }
    return result;
};

export const fullStrings = (strings) => Object.fromEntries(Object.entries(strings).filter(([key]) => !key.endsWith(TEEN_SUFFIX)));
