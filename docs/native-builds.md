# Native builds (Android & iOS)

The web app is wrapped with Capacitor 8. The `android/` and `ios/` folders are generated and **not committed**. The stores get the **teen edition** (13+, `dist-teen/`); see [editions.md](editions.md).

## Requirements

- Node.js 22.12+
- Android: Android Studio (latest stable), JDK 21, Android SDK API 36 (min SDK 24)
- iOS: a Mac with the latest Xcode

## First time

```bash
npm install
npm run build:teen
npx cap add android   # and/or: npx cap add ios
```

An old `android/` folder from Capacitor 6 should be deleted and re-created this way.

## Build & run

```bash
npm run cap:sync      # teen build + copy into android/ and ios/
npx cap open android  # or: npx cap open ios
```

- **Android:** Build > Build Bundle(s) / APK(s). Test performance with a **release** build; debug builds are much slower. Store releases need a signed App Bundle.
- **iOS:** select the "App" project → Signing & Capabilities → choose a team → Run on a device.

Re-run `npm run cap:sync` after every web change.
