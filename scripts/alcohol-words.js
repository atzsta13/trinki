// Alcohol vocabulary per language, for checking that the teen edition (13+) never mentions drinking.
// Whole words only (letters around a match don't count), case-insensitive. `\p{L}*` marks a word stem.
// Used by tests/unit/edition.test.js (content) and scripts/check-teen.js (the built bundle).
const WORDS = {
    en: ['drink\\p{L}*', 'drunk\\p{L}*', 'sips?', 'sipping', 'shots?', 'beers?', 'wines?', 'vodka', 'alcohol\\p{L}*', 'cocktails?', 'champagne', 'booze', 'tequila', 'cheers', 'toasts?', 'hangover', 'blackout', 'tipsy'],
    de: ['\\p{L}*trink\\p{L}*', '\\p{L}*getränk\\p{L}*', 'getrunken', 'schlucks?', 'shots?', 'bier\\p{L}*', '\\p{L}*bier', '\\p{L}*wein', 'weins?', 'wodka', 'alkohol\\p{L}*', 'cocktails?', 'sekt', 'champagner', 'prost', 'betrunken\\p{L}*', 'besoffen\\p{L}*', 'sauf\\p{L}*', 'anstoßen'],
    es: ['beb(?:e|es|en|er|éis|ed|o|a|as|an|ida|idas|iendo)', 'trago\\p{L}*', 'chupito\\p{L}*', 'cerveza\\p{L}*', 'vinos?', 'vodka', 'alcohol\\p{L}*', 'c[oó]ctel\\p{L}*', 'champ[aá]n', 'borrach\\p{L}*', 'brind\\p{L}*'],
    fr: ['boit', 'boivent', 'boire', 'buvez', 'gorgées?', 'shots?', 'bières?', 'vins?', 'vodka', 'alcool\\p{L}*', 'cocktails?', 'champagne', 'ivres?', 'trinqu\\p{L}*'],
    it: ['bev\\p{L}*', 'sors[oi]', 'shots?', 'birr\\p{L}*', 'vin[oi]', 'vodka', 'alcol\\p{L}*', 'cocktail', 'champagne', 'ubriac\\p{L}*', 'brindi\\p{L}*', 'cin cin'],
    pt: ['beb(?:e|es|em|er|a|am|o|ida|idas|endo)', 'goles?', 'shots?', 'cerveja\\p{L}*', 'vinho\\p{L}*', 'vodka', '[áa]lcool', 'coquetel\\p{L}*', 'champanhe', 'b[êe]bad\\p{L}*', 'brind\\p{L}*'],
    nl: ['\\p{L}*drink\\p{L}*', 'drank\\p{L}*', 'dronken', 'slok\\p{L}*', 'shots?', 'bier\\p{L}*', '\\p{L}*bier', 'wijn\\p{L}*', 'wodka', 'alcohol\\p{L}*', 'cocktails?', 'champagne', 'proost'],
    pl: ['pij\\p{L}*', 'wypij\\p{L}*', 'pić', 'wypić', 'łyk\\p{L}*', 'shot\\p{L}*', 'piw\\p{L}*', 'wino', 'winem', 'wódk\\p{L}*', 'alkohol\\p{L}*', 'koktajl\\p{L}*', 'szampan\\p{L}*'],
    tr: ['içki\\p{L}*', 'iç', 'içer', 'içsin', 'içsinler', 'içmek', 'içmeli', 'içiyor', 'yudum\\p{L}*', 'shot\\p{L}*', 'bira', 'bira(?:lar|yı|ya|da|dan|nın|sı)\\p{L}*', 'şarap\\p{L}*', 'votka\\p{L}*', 'alkol\\p{L}*', 'kokteyl\\p{L}*', 'şampanya\\p{L}*', 'sarhoş\\p{L}*', 'şerefe'],
    sv: ['drick\\p{L}*', 'drack', 'druck\\p{L}*', '\\p{L}*dryck\\p{L}*', 'klunk\\p{L}*', 'shots?', 'öl\\p{L}{0,3}', 'vin', 'vinet', 'viner', 'vodka', 'alkohol\\p{L}*', 'cocktails?', 'champagne', 'berusad\\p{L}*', 'skål']
};

const EMOJI = ['🍺', '🍻', '🍷', '🍸', '🍹', '🥂', '🍾', '🥃'];

const wordPattern = (words) => `(?<!\\p{L})(?:${words.join('|')})(?!\\p{L})`;

/** Matches the alcohol vocabulary of `lang` and, unless `emoji` is false, drink emoji. */
export const alcoholPattern = (lang, { emoji = true } = {}) => new RegExp(
    [wordPattern(WORDS[lang]), ...(emoji ? EMOJI : [])].join('|'),
    'iu'
);

export const ALCOHOL_LANGUAGES = Object.keys(WORDS);
