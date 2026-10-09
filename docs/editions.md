# Editions

Party Penguin is built in two editions from the same source. The edition is picked at build time (Vite mode), not at runtime: the teen build doesn't hide adult content, it never contains it.

| | **Teen** (app stores) | **Full** (website) |
| :--- | :--- | :--- |
| Audience | 13+ | 18+ |
| Build | `npm run build:teen` → `dist-teen/` | `npm run build` → `dist/` |
| Dev server | `npm run dev:teen` | `npm run dev` |
| Penalties | 🧊 ice cubes: hold one in your bare hand and count to 10 | sips, drinks, shots |
| Spiciness slider | 0–3 | 0–6 |
| Modes | all except Spicy and Bar; "Pre-Game" is called "Warm-Up" | all |
| First screen | house rules (ice cube safety) | 18+ warning (drink responsibly) |

Both editions are free, with no ads, subscriptions, accounts or network calls, and every pack unlocked. That is the pitch against the subscription-based competition (Picolo and co. charge about $3–10 a week for their spicy packs), and the app says so on the first screen and in the settings (`free_forever`).

Why two builds instead of one app with an 18+ switch or downloadable packs: the store rating has to cover everything a user can reach, including unlocked or downloaded content. A drinking game ends up at PEGI/USK 18 and Apple 18+, and Apple rejects "drinking games" as a category (guideline 4.3(b)). Background: [reports/Party game app store ratings.md](../reports/Party%20game%20app%20store%20ratings.md).

## How it works

- `src/logic/edition.js` holds the rules (pure functions, also used by the tests and the dist scan).
- `scripts/edition-plugin.js` rewrites `src/logic/challenges.js` and the locale files during the build:
  - **Cards:** a card is in the teen edition if its spiciness is ≤ 2, or ≤ 3 with `teen: true` or a teen text, and it isn't in the `hot`/`bar` packs. `teen: false` always leaves it out. `teen: '...'` replaces the English text.
  - **Strings:** `<key>_teen` replaces `<key>` (cards: `c_1_teen`, UI: `result_drink_teen`). Strings of left-out cards are dropped. The full build drops all `_teen` keys.
- `__EDITION__` (`'teen'` or `'full'`) is defined for the few code paths that differ: hidden modes and the slider cap (`modes.js`), roasts, name suggestions (`names.json`: `everyone` vs. `adult`), choice detection in `GameScreen`.
- Unit tests (`tests/unit/edition.test.js`) check every language of the teen edition for alcohol vocabulary (`scripts/alcohol-words.js`), the spiciness cap and that every visible mode still has cards. `scripts/check-teen.js` (part of `npm run check`) scans the built `dist-teen` for alcohol words, full-edition cards and name puns, and leftover `_teen` keys. `tests/e2e/teen.spec.js` plays the real teen build.

## Adding content

- **A card up to spiciness 2 that mentions drinking:** add `teen: '<same card, ice cube instead of drink>'` and `<id>_teen` to every `src/locales/challenges/<lang>.json`. Or `teen: false` if it only works with alcohol.
- **Any other card:** decide whether it's fine for 13-year-olds. Spiciness ≤ 2 is in by default; use `teen: false` to keep it out, `teen: true` to let a level-3 card in.
- **A UI string that mentions drinking:** add `<key>_teen` to every `src/locales/<lang>.json`.
- Penalty wording for teens: "takes an ice cube", "gives out 2 ice cubes", "or take an ice cube" (the `or take` makes it a swipe card in `GameScreen`).

## Store release (teen)

`npm run cap:sync` builds the teen edition into the native projects (Capacitor `webDir` is `dist-teen`). See [native-builds.md](native-builds.md).

Content rating questionnaire (IARC on Google Play, Apple's age rating): answer from what the teen build actually contains. No alcohol, drugs or tobacco; no sexual content; mild suggestive themes (vote cards like "Who is the best kisser?", truth questions about crushes); crude humour; no gambling; no user-generated content shared with others (custom cards and secrets stay on the device); no ads, purchases or data collection. Expect roughly PEGI 12 / USK 12 / Apple 13+, but only the questionnaire decides. Set the Play target audience to 13–15, 16–17 and 18+ (not under 13: that triggers the Families policy).

Keep store screenshots, icon and texts free of alcohol (Apple requires 4+-safe metadata) and don't call it a drinking game.

### Store listing draft

**Title:** Party Penguin – Party Games

**Short description (Play, ≤ 80 characters):** Free party games for groups. No ads, no subscription, every pack unlocked.

**Description:**

> Tired of party apps that lock the fun behind a weekly subscription? Party Penguin is free. Not "free trial", not "free with ads": every pack, every minigame, forever. No account, no tracking, works offline.
>
> Pass the phone and play:
> • Never Have I Ever, Would You Rather, Most Likely, Truth or Dare, Paranoia, Taboo
> • Minigames: Bomb, Spy, Charades (Heads Up style), Fake Artist, Secrets, Dark Tales
> • Icebreaker, Warm-Up, Princess Treatment, Christmas, New Year, Beach and Halloween packs
> • Spiciness slider from "innocent" to "spicy"
> • Your own custom cards, finger chooser, scoreboard
> • 10 languages
>
> Penalties? Grab some ice cubes. 🧊 Lose a round, hold an ice cube until you've counted to ten. No ice around? Play for points.
>
> No ads, no in-app purchases, no data collection.

**German:**

> Keine Lust auf Party-Apps, die den Spaß hinter einem Wochen-Abo verstecken? Party Penguin ist gratis. Nicht „gratis testen", nicht „gratis mit Werbung": alle Pakete, alle Minispiele, für immer. Kein Konto, kein Tracking, funktioniert offline.
>
> Handy weitergeben und loslegen:
> • Ich hab noch nie, Würdest du eher, Wer würde am ehesten, Wahrheit oder Pflicht, Paranoia, Tabu
> • Minispiele: Bombe, Spion, Scharade, Fake Artist, Geheimnisse, Dark Tales
> • Pakete für Kennenlernen, Aufwärmen, Weihnachten, Silvester, Strand und Halloween
> • Schärferegler von „unschuldig" bis „scharf"
> • Eigene Karten, Finger-Auswahl, Punktestand
> • 10 Sprachen
>
> Strafen? Eiswürfel bereitstellen. 🧊 Runde verloren: Eiswürfel in die Hand und bis zehn zählen. Kein Eis da? Einfach um Punkte spielen.
>
> Keine Werbung, keine In-App-Käufe, keine Datensammlung.

## Website release (full)

`npm run build` and upload `dist/` as a static site (it is a PWA and works offline). Before going live:

- **18+ gate:** the warning screen (`Disclaimer.jsx`) asks for confirmation once per device.
- **Impressum:** Austrian law (ECG/MedienG) requires a legal notice on the website.
- **German visitors (JMStV):** label the site for 18+ with an age-de.xml file / meta tag ([age-label.de](https://www.age-label.de)). Keep the spiciest cards suggestive, not explicit: explicit content would need real age verification.
- Not legal advice; check with someone who knows Austrian/German youth protection law before launch.
