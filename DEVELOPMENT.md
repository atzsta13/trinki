# Party Penguin - Build Instructions (Android & iOS)

Trinki is a cross-platform web application wrapped with **Capacitor**. It shares the same codebase for Web, Android, and iOS.

## 1. Universal Setup (Do this first)

1.  **Install Node.js** (if you haven't already).
2.  **Sync the project**:
    ```bash
    npm install
    npm run build
    npx cap sync
    ```
    *This compiles your React code and copies it to the `android/` and `ios/` folders.*

## 2. Generate Android APK

## Requirements

- **Node.js**: v18+ (v20+ Recommended for latest Vite)
- **Java Development Kit (JDK)**: v17+ (Required for AGP 8.7+)
- **Android Studio**: Ladybug or later (SDK 35 support)
- **Android SDK**: API Level 35 (Android 15)

## Tech Stack (Latest)

- **React**: v18.3+ / v19
- **Vite**: v5.4+ (Legacy Node support) / v6+
- **Capacitor**: v6+
- **Framer Motion**: v11+
- **Android Gradle Plugin**: 8.7.0
- **Gradle**: 8.10.2

1.  **Open in Android Studio**:
    ```bash
    npx cap open android
    ```
2.  **Build**:
    - Build > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
    - Locate the `app-debug.apk` in `android/app/build/outputs/apk/debug/`.
3.  **Install**: Transfer the APK to your Android device and open it.

## 3. Generate iOS App

*Requirements: Mac with **Xcode** installed.*

1.  **Open in Xcode**:
    ```bash
    npx cap open ios
    ```
2.  **Setup Signing**:
    - Click on the "App" project in the left sidebar.
    - Go to **Signing & Capabilities**.
    - Select your Apple ID Team (Personal Team is fine for testing).
3.  **Run**:
    - Plug in your iPhone.
    - Select your device from the top bar.
    - Click the **Play** (Run) button.

## Making Changes
After editing any `.jsx` or `.css` files:
1. `npm run build`
2. `npx cap sync`
3. Rerun/Rebuild in Android Studio or Xcode.
