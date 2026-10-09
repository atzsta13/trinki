import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const SUPPORTED_LANGUAGES = ['en', 'de', 'es', 'fr', 'it', 'pt', 'nl', 'pl', 'tr', 'sv'];

// Each locale is its own chunk, so only the active language (plus the English fallback) is downloaded and parsed.
const loaders = {
    translation: import.meta.glob('./locales/*.json', { import: 'default' }),
    challenges: import.meta.glob('./locales/challenges/*.json', { import: 'default' })
};

const lazyLocaleBackend = {
    type: 'backend',
    read(language, namespace, callback) {
        const path = namespace === 'challenges' ? `./locales/challenges/${language}.json` : `./locales/${language}.json`;
        const load = loaders[namespace]?.[path];
        if (!load) {
            callback(null, {});
            return;
        }
        load().then(data => callback(null, data), error => callback(error, null));
    }
};

export const i18nReady = i18n
    .use(lazyLocaleBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        ns: ['translation', 'challenges'],
        defaultNS: 'translation',
        // Some UI strings (Secrets, Dark Tales) live in the challenges namespace.
        fallbackNS: 'challenges',
        fallbackLng: 'en',
        supportedLngs: SUPPORTED_LANGUAGES,
        nonExplicitSupportedLngs: true,
        load: 'languageOnly',
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false
        }
    });

export default i18n;
