import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import de from './locales/de.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';
import tr from './locales/tr.json';
import sv from './locales/sv.json';

import challenges_en from './locales/challenges/en.json';
import challenges_de from './locales/challenges/de.json';
import challenges_es from './locales/challenges/es.json';
import challenges_fr from './locales/challenges/fr.json';
import challenges_it from './locales/challenges/it.json';
import challenges_pt from './locales/challenges/pt.json';
import challenges_nl from './locales/challenges/nl.json';
import challenges_pl from './locales/challenges/pl.json';
import challenges_tr from './locales/challenges/tr.json';
import challenges_sv from './locales/challenges/sv.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en, challenges: challenges_en },
            de: { translation: de, challenges: challenges_de },
            es: { translation: es, challenges: challenges_es },
            fr: { translation: fr, challenges: challenges_fr },
            it: { translation: it, challenges: challenges_it },
            pt: { translation: pt, challenges: challenges_pt },
            nl: { translation: nl, challenges: challenges_nl },
            pl: { translation: pl, challenges: challenges_pl },
            tr: { translation: tr, challenges: challenges_tr },
            sv: { translation: sv, challenges: challenges_sv }
        },
        fallbackLng: 'en',
        // Some UI strings (Secrets, Dark Tales) live in the challenges namespace.
        fallbackNS: 'challenges',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
