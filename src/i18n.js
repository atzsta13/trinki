// Tiny i18n: one flat key → string map per language, English as fallback, {{var}} interpolation.
// UI strings live in locales/<lang>.json, card translations in locales/challenges/<lang>.json (keyed by card id).
import { useSyncExternalStore } from 'react';
import { STORAGE_PREFIX } from './logic/storage';

export const SUPPORTED_LANGUAGES = ['en', 'de', 'es', 'fr', 'it', 'pt', 'nl', 'pl', 'tr', 'sv'];

// Each locale is its own chunk, so only English + the active language are downloaded.
const uiFiles = import.meta.glob('./locales/*.json', { import: 'default' });
const cardFiles = import.meta.glob('./locales/challenges/*.json', { import: 'default' });

const loadLanguage = async (lang) => {
    const [ui, cards] = await Promise.all([
        uiFiles[`./locales/${lang}.json`]?.() ?? {},
        cardFiles[`./locales/challenges/${lang}.json`]?.() ?? {}
    ]);
    return { ...cards, ...ui };
};

const makeTranslator = (strings) => (key, vars) => {
    const template = strings[key] ?? vars?.defaultValue ?? key;
    return vars ? template.replace(/\{\{(\w+)\}\}/g, (match, name) => vars[name] ?? match) : template;
};

let english = {};
let language = 'en';
// A new function per language, so memoized components re-render when the language changes.
let translate = makeTranslator({});
const listeners = new Set();

export const getLanguage = () => language;

export const setLanguage = async (lang) => {
    const strings = lang === 'en' ? english : { ...english, ...await loadLanguage(lang) };
    language = lang;
    translate = makeTranslator(strings);
    document.documentElement.lang = lang;
    listeners.forEach(listener => listener());
};

const detectLanguage = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}settings`) || '{}').language;
        if (SUPPORTED_LANGUAGES.includes(saved)) return saved;
    } catch {
        // ignore broken storage
    }
    const browser = navigator.language?.slice(0, 2);
    return SUPPORTED_LANGUAGES.includes(browser) ? browser : 'en';
};

export const initI18n = async () => {
    english = await loadLanguage('en');
    await setLanguage(detectLanguage());
};

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

/** Returns `t(key, vars?)` for the current language and re-renders when it changes. */
export const useT = () => useSyncExternalStore(subscribe, () => translate);
