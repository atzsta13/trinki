# Backlog

What is left. Everything here needs a person, a device or the native projects — the code base itself is complete.

1. **Native speaker review.** All 10 languages are complete (enforced by `tests/unit/content.test.js`), but the non-English texts were machine-written. Have a native speaker check `src/locales/**/<lang>.json`, especially card jokes and wordplay.
2. **Test on a real low-end Android phone** with a release build (see `docs/native-builds.md`). Headless Chromium can't show GPU costs (shadows, gradients, confetti).
3. **Store icon in high resolution.** `public/assets/icon-512.png` is upscaled from a ~340 px crop of the original artwork. Provide a 1024 px source and generate the native icons/splash screens after `npx cap add android` / `ios` (e.g. with `@capacitor/assets`).
4. **Store ratings for the teen edition.** Fill in the IARC (Google Play) and Apple age-rating questionnaires from the teen build before translating more content; adjust cards if the result is above 13+. Answers and listing draft: [editions.md](editions.md).
5. **Website for the full edition.** Hosting, Impressum, age-de label for German visitors ([editions.md](editions.md#website-release-full)).
6. **Native speaker check of the teen texts** (`*_teen` keys), same as item 1.
