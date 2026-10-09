# Trinki – Build Instructions (Web, Android & iOS)

Trinki is a React web app wrapped with **Capacitor**. Web, Android and iOS share the same codebase.

## Tech Stack

| Part | Version |
| :--- | :--- |
| React (+ React Compiler for automatic memoization) | 19.3 |
| Vite (Rolldown bundler) | 8 |
| Motion (animations, swipe gestures) | 14 |
| i18next / react-i18next (locales lazy-loaded per language) | 26 / 17 |
| Capacitor (core, android, ios, haptics) | 8 |
| ESLint (+ react-hooks / React Compiler rules) | 10 |

## Requirements

- **Node.js** 22.12+
- **Android:** Android Studio (latest stable), **JDK 21**, Android SDK **API 36** (min SDK 24, AGP 8.13, Gradle 8.14)
- **iOS:** a Mac with the latest Xcode

## 1. Setup

```bash
npm install
npm run dev        # local dev server
npm run lint       # ESLint incl. React Compiler rules
npm run build      # production build into dist/
```

The `android/` and `ios/` folders are generated and not committed. Create them once:

```bash
npm run build
npx cap add android
npx cap add ios
```

If you already have an `android/`/`ios/` folder from Capacitor 6, the easiest path is to delete it and re-create it with the commands above (or follow the official Capacitor 7 and 8 upgrade guides).

## 2. Android APK

```bash
npm run cap:sync
npx cap open android
```

In Android Studio: **Build > Build Bundle(s) / APK(s) > Build APK(s)**. The APK lands in `android/app/build/outputs/apk/debug/`. For store releases build a signed **App Bundle** in release mode, it is significantly faster than a debug build.

## 3. iOS App

```bash
npm run cap:sync
npx cap open ios
```

In Xcode: select the "App" project → **Signing & Capabilities** → choose your team, plug in your iPhone and press **Run**.

## Making Changes

After editing any source file run `npm run cap:sync` and rebuild in Android Studio or Xcode.

## Performance Notes

The app targets slow Android devices as well, so keep these in mind:

- **No `backdrop-filter`/blur.** It is the most expensive effect on low-end GPUs. Use semi-opaque backgrounds instead.
- **Animate only `transform` and `opacity`.** These run on the compositor; animating backgrounds, sizes or shadows repaints every frame.
- **Keep heavy screens lazy.** Minigames and locales are split into their own chunks.
- **Keep the React Compiler happy.** `npm run lint` reports code it can't optimize (e.g. `Math.random()` during render, setState inside effects, reading refs during render).
