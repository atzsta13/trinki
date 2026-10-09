# Backlog

Known problems and improvement ideas, roughly by priority. Each item says *where* to look. Remove an item when it is done.

## Content & product

1. **Modes without cards.** `newFriends`, `bar`, `warmUp`, `newYear` and `beach` can be selected but have no cards (see `MODES_WITHOUT_CONTENT` in `tests/unit/content.test.js`). Selecting only those does nothing. Either write cards (`src/logic/challenges.js`) or remove the modes (`src/logic/modes.js`, `MODE_PACKS` in `src/logic/deck.js`).
2. **Card translations.** German covers 97/146 cards; es/fr/it only 8; nl/pl/pt/sv/tr none (they fall back to English). Translations go into `src/locales/challenges/<lang>.json` keyed by card id.
3. **UI translations.** German has 91/101 UI strings, the other languages ~33/101 (rest falls back to English).
4. **Hard-coded English UI text.** Several components bypass i18n: card type labels and reflex/precision/paranoia texts in `Card.jsx`, Bomb/Charades/Spy/Fake Artist screens, `FingerChooser`, `Disclaimer`, "PARTY MVP" and the streak toast in `GameScreen.jsx`.
5. **Card titles show raw types** ("statement", "standard", "charade") – `TYPE_LABELS` in `Card.jsx` only covers a few types; should be translated labels.
6. **Swipe semantics are invisible.** On choice cards (truth/dare/"… or drink") swipe right = done, swipe left = penalty, tap does nothing. There is no on-screen hint.
7. **Hold-to-reveal in Spy / Fake Artist.** The "next" button only shows while the reveal circle is held, which needs two fingers on touch screens.
8. **Name.** `capacitor.config.json` still says `appName: "Party Penguin"`; the app and docs say Trinki (mascot is a raccoon 🦝). Decide and make consistent.

## Code simplicity

9. **Inline styles.** ~300 `style={{…}}` blocks in `src/components`. Moving repeated ones (overlays, round icon buttons, section headings, minigame layouts) into a few CSS classes in `index.css` would cut a lot of lines and make the look consistent.
10. **Large components.** `GameScreen.jsx` and `Card.jsx` (~500 lines each) mix layout and logic. Possible splits: game-over screen and active-rules sheet into their own files; one small component per interactive card type.
11. **English card text lives in JS, translations in JSON.** Fine for now; if content grows a lot, consider moving the English text into `locales/challenges/en.json` too.

## Performance

12. **Bundle.** React (~230 KB) and motion (~130 KB) dominate the start bundle. `Reorder` (player drag-sort in `SetupScreen`) is the main reason the full motion bundle is needed; replacing it would allow `LazyMotion` + `m` components.
13. **Measure on a real device.** All measurements so far are from headless Chromium with CPU throttling; GPU costs (shadows, gradients, confetti) are only visible on a real low-end phone. Use a release build.

## Native

14. **Android/iOS projects are not in the repo.** Icons/splash screens for the native apps must be generated after `npx cap add android` (e.g. with `@capacitor/assets`); the source icon is `public/assets/icon-512.png`.
