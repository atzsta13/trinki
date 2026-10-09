# AGENTS.md

Guide for AI coding agents (and humans) working on **Party Penguin**. Read this first; it is kept short on purpose.

## What this is

Party Penguin is an offline party/drinking card game for groups ("pass the phone"). Players are entered in seating order, the app deals cards ("Alex, drink if…", votes, truth or dare, taboo) and a few minigames (Bomb, Spy, Charades, Fake Artist, Secrets, Dark Tales). It is a React web app, shipped to Android/iOS via Capacitor.

Product rules that affect code and content:
- 100 % free, no ads, no accounts, no network calls, no tracking. Everything runs offline; state lives in `localStorage`.
- Rated 17+ (alcohol references are allowed). Spicy content is gated by the spiciness slider (0–6).
- **Target device: a cheap, current Android phone.** Performance beats visual flourish (see *Performance rules*).
- Keep the code small and simple. Don't add dependencies, abstractions or files unless they clearly pay for themselves.

## Commands

```bash
npm install
npm run dev        # dev server
npm run check      # ~10 s: lint (0 warnings) + unit tests + build + bundle-size budget. Run after every change.
npm run test:e2e   # ~30 s: Playwright on the production build (needs `npm run build` first)
npm run verify     # check + e2e — what CI runs on every PR
npm run cap:sync   # build + copy into the native projects
```

E2E needs Chromium: `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_PATH` to an installed one.
Native builds (Android/iOS): see [docs/native-builds.md](docs/native-builds.md). `android/` and `ios/` are generated and not committed.

## Verification pipeline

| Layer | Where | Catches |
| :--- | :--- | :--- |
| ESLint + React Compiler rules | `eslint.config.js` | undefined vars, hook misuse, code the compiler can't optimize |
| Unit tests | `tests/unit/` | broken cards, modes without packs, missing/unknown i18n keys, wrong placeholders, deck logic |
| Size budget | `scripts/check-size.js` | start bundle > 115 KB gzip |
| E2E | `tests/e2e/game.spec.js` | crashes, console errors, stuck cards, minigames without exit, raw i18n keys on screen, German UI |
| CI | `.github/workflows/ci.yml` | runs `check` + e2e on every PR and push to main; traces uploaded on failure |

E2E tests wait on `data-card` (the dealt card's `instanceId` on the game screen) instead of timeouts — keep that attribute. When you fix a bug, add the test that would have caught it. Never weaken or skip a test to get green.

## Stack

React 19 + **React Compiler** (no manual `useMemo`/`useCallback`/`memo` needed) · Vite 8 · Capacitor 8 (+ `@capacitor/haptics`) · plain JavaScript (JSX), no TypeScript · one plain CSS file (`src/index.css`).

Deliberately **no** animation library (CSS keyframes + a small pointer-event swipe), **no** i18n library (`src/i18n.js`, ~60 lines), no state library, no router. Runtime dependencies are React, Capacitor and two font packages — keep it that way unless there's a strong reason.

## Code map

```
src/
  main.jsx               entry: fonts, CSS, waits for i18n, renders <App>
  App.jsx                disclaimer gate + screen switch by gameState (setup | playing | finished | chooser)
  i18n.js                tiny i18n: useT() hook, English fallback, {{var}} interpolation, lazy-loaded locales
  index.css              all styles: tokens (CSS variables), layout/text helpers, components, animations
  logic/
    GameContext.jsx      the single app state (players, settings, deck, current card) + persistence
    deck.js              getDeck(): picks cards for the selected modes, spiciness filter, player assignment
    challenges.js        the card catalogue (English text) — documented schema at the top
    modes.js             selectable modes shown on the setup screen
    names.json           random player-name suggestions (🎲 button)
    roasts.js            random penguin one-liners under cards
    storage.js           localStorage key prefix + one-time migration from the old app name
    sound.js             synthesized sounds (Web Audio, no audio files)
    haptics.js           vibration via Capacitor Haptics
    confetti.js          canvas confetti / emoji bursts
    useShake.js          shake detection for "shake" cards
  components/
    Screens/             SetupScreen, GameScreen (+ SwipeCard, game over, active rules), FingerChooser, Disclaimer
    Shared/              Card (renders every non-minigame card type), Button, SettingsModal, CustomCardInput
    Games/               one file per minigame; lazy-loaded; props: { card, onNext }. PassAndReveal = shared "pass the phone, tap to see your secret" step
  locales/
    <lang>.json          UI strings
    challenges/<lang>.json  card translations keyed by card id
    words/<lang>.json    minigame word lists (shared categories for Spy/Fake Artist, bomb topics, panic prompts, charades)
tests/unit/              Vitest: content.test.js (cards/modes/locales), deck.test.js
tests/e2e/               Playwright: game.spec.js
scripts/check-size.js    start-bundle size budget
public/                  icons, web manifest, privacy.html (store privacy policy)
```

## How the game works (data flow)

1. **Setup** (`SetupScreen`): players (order = seating order, ▲ moves a player up), spiciness 0–6, selected mode ids.
2. `launchGame(modes)` → `getDeck()` builds 50 cards:
   mode ids → `MODE_PACKS` (deck.js) → cards whose `packs` match → spiciness filter (`max(0, level-3) ≤ card ≤ level`) → custom cards always added → prefer cards not in the play history → each card gets `instanceId`, `args` (`p1`, `p2`, `p_left`, `p_right`, `p_opposite`) and `targetPlayerId`.
3. **GameScreen** shows `currentCard`:
   - `card.type` in `MINIGAMES` → render that minigame; it calls `onNext()` when done or skipped.
   - otherwise `<Card>` inside `<SwipeCard>`. Tap = next card. "Choice" cards (truth/dare or text with "… or drink") are swiped: right = done, left = penalty → `points` added to the target player's score.
4. `nextCard()` refills the deck when empty. Virus cards are also collected as "active rules".
5. **Game over** shows the scoreboard; "Play again" relaunches with the same modes and resets scores.

Persistence (`localStorage`, prefix `partypenguin_` from `logic/storage.js`): `players`, `settings`, `played_cards` (last 500 ids), `custom_cards`, `disclaimer_accepted`, `skipped_names`. Data saved under the old name (`trinki_*`) is migrated once on startup. The language is part of `trinki_settings`.

## Common tasks

**Add a card:** append to `src/logic/challenges.js` with a new unique `id`, a valid `type`, `packs`, `spiciness`, English `text`. Add its translation to **every** `src/locales/challenges/<lang>.json` under the same id (keep `{{p1}}`-style placeholders identical) — the tests fail if a language is missing a card. Run `npm run test`.

**Add a mode:** add it to `MODES` and a list (`PARTY_MODES`/`SOCIAL_MODES`/`SEASONAL_MODES`) in `modes.js`, map its `id` in `MODE_PACKS` (deck.js), add cards with that pack, add the label key to `locales/en.json` (+ `de.json`).

**Add a minigame:** create `components/Games/XGame.jsx` taking `{ card, onNext }` and always offering a skip/next button; register it in `MINIGAMES` (GameScreen.jsx); add a card with `type: 'x'`; add `'x'` to `CARD_TYPES` in `tests/unit/content.test.js`.

**Add a UI string:** use `t('key')` and add the key to **every** `locales/<lang>.json` (English is the source of truth). The tests enforce that all 10 languages are complete.

**Add a language:** add `locales/<lang>.json`, `locales/challenges/<lang>.json` and `locales/words/<lang>.json`, add it to `SUPPORTED_LANGUAGES` (i18n.js), `LANGUAGES` (SettingsModal.jsx) and `TTS_LOCALES` (GameScreen.jsx).

## Conventions

- Function components + hooks only. One component per file; small helpers may live in the same file.
- Follow the React Compiler rules that `npm run lint` enforces: no `Math.random()`/`Date.now()` during render, no reading/writing `ref.current` during render, no `setState` directly inside effects; put side effects in event handlers or effects, never inside state updater functions.
- State lives in `GameContext`; components keep only local UI state.
- Styling: use the classes in `index.css` (layout helpers like `screen`, `stack`, `row`, text helpers like `muted`, `big`, `accent`). Inline `style` only for values computed at runtime (e.g. finger position).
- Translations: `const t = useT();` then `t('key')` / `t('key', { name })`; word lists via `t.words`. Keys must be string literals so the tests can check them.
- English is the source language for content. All 10 languages are complete for UI and cards, and must stay that way.
- Keep comments for the *why*, not the *what*. Match the surrounding style (4-space indent in `src/`, single quotes).

## Performance rules (low-end Android)

- No `backdrop-filter`/blur, no animated `background-position`, no `transition: all`. Animate only `transform` and `opacity`.
- Don't re-render at high frequency: timers render whole seconds; the card swipe moves the DOM element directly (no React state per pointer move).
- Keep heavy things lazy: minigames and locales are separate chunks. Don't import large libraries on the start path.
- Native bridge calls (haptics) are not free — no haptics on every pointer move.
- Check `npm run build` output for bundle size when adding a dependency.

## Gotchas

- `src/logic/challenges.js` (English cards) and `src/locales/challenges/*.json` (translations) are different things despite the name.
- UI strings (`locales/<lang>.json`) and card texts (`locales/challenges/<lang>.json`) are merged into one key space per language. Card keys: card id, `<id>_forbidden` for taboo words, `<key>_title/_story/_solution` for Dark Tales. English card text lives in `challenges.js` (except Secrets/Dark Tales, in `challenges/en.json`).
- Card `text` may contain `{{p1}}` etc. Translation happens in `Card`/`GameScreen` via `t(card.translationKey, { ...args, defaultValue: text })`.
- `instanceId` (not `id`) identifies a dealt card; React keys and the virus list use it.
- The React Compiler reads values used in event handlers *during render* (as memo dependencies). Derive them null-safely (`currentCard?.x`) — while leaving the game, GameScreen renders once more with `currentCard === null`.
- `__APP_VERSION__` is injected from `package.json` by Vite.
- There is no backend and there must not be one without an explicit decision (offline + privacy promise).

## Before you commit

`npm run check` must pass; for UI or game-flow changes run `npm run verify`.

Open problems and ideas: [docs/backlog.md](docs/backlog.md).
