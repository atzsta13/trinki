# Backlog

Known problems and improvement ideas, roughly by priority. Each item says *where* to look. Remove an item when it is done.

## Content & product

1. **Minigame word lists are English only.** Spy words, Fake Artist categories, Bomb categories/prompts and Charades words are hard-coded English arrays in `src/components/Games/*.jsx`. Translating them means moving them into the locale files.
2. **Translation quality.** All 10 languages are complete (enforced by `tests/unit/content.test.js`); non-English texts were machine-written and deserve a native speaker's pass.

## Code simplicity

3. **Large components.** `Card.jsx` and `GameScreen.jsx` (~250 lines each) are the biggest files. If they grow, split per card type / move the game-over screen and rules sheet into their own files.
4. **English card text lives in JS, translations in JSON.** Fine for now; if content grows a lot, consider moving the English text into `locales/challenges/en.json` too.

## Performance

5. **Bundle.** The start bundle is ~100 KB gzip, mostly React. Budget is enforced by `npm run size`; lower `BUDGET_KB` in `scripts/check-size.js` to lock in gains.
6. **Measure on a real device.** All measurements so far are from headless Chromium with CPU throttling; GPU costs (shadows, gradients, confetti) are only visible on a real low-end phone. Use a release build.

## Native

7. **Android/iOS projects are not in the repo.** Icons/splash screens for the native apps must be generated after `npx cap add android` (e.g. with `@capacitor/assets`); the source icon is `public/assets/icon-512.png`.
