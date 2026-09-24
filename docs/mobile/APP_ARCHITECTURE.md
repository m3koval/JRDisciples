# Junior Disciples App Architecture

## Product line

Junior Disciples is one product in one repository with two builds:

- **Web:** normal Next.js build for the public site.
- **iOS app:** `CAPACITOR_BUILD=1` static export bundled inside a Capacitor iOS shell.

The iOS app does **not** set Capacitor `server.url`, does not point a WebView at the live website, and opens with no network connection. iOS therefore treats it as its own installed app and bundle identifier for Screen Time and Downtime.

## Current app build

```bash
npm run app:sync
```

This command:

1. Produces a static Next.js export in `out/`.
2. Copies the export into the native iOS project.
3. Synchronizes Capacitor packages.
4. Runs `scripts/check-app-bundle.mjs` to verify representative offline routes and reject a remote `server.url` configuration.

The normal `npm run build` path remains server-capable and does not enable static-export settings.

## Content-update boundary

Apple's App Review Guideline 2.5.2 says apps may not download and execute code that introduces or changes app features. Therefore:

- **Allowed content packs:** versioned JSON, images, audio, video, and other non-executable lesson data interpreted by renderers already shipped in the reviewed app.
- **Requires an App Store release:** new JavaScript/React components, new game mechanics, executable bundles, native plugins, or other code that changes functionality.
- **Never use:** an over-the-air replacement of the compiled Next.js/JavaScript application bundle.

The planned update service must use a versioned manifest, schema validation, SHA-256 hashes, an atomic activate/rollback step, a bundled fallback catalog, and HTTPS from an allowlisted first-party origin. A failed or incomplete update must leave the last verified catalog active.

## Kids Category boundary

Apple's Kids Category rule 1.3 requires links out of the app, purchases, and other distractions to be behind a parental gate. The app build therefore renders current Bible.com and sermon sources as non-clickable source labels. The website keeps its normal source links.

The app must remain free of third-party advertising and child-identifying analytics. Local progress and language preferences stay on-device. Any future cloud account or sync feature requires a separate privacy review before implementation.

## Minimum-functionality posture

Guideline 4.2 requires an experience beyond a repackaged website. The app's proof points are:

- the complete learning library is bundled and usable offline;
- progress, lesson mastery, language, and game records are stored as app-local state;
- no browser chrome or remote website navigation;
- app-specific safe-area, link, splash, icon, and native-shell behavior;
- future content packs download as data, not executable code.

## Release prerequisites

Before TestFlight or App Store submission, the owner must confirm:

- final bundle identifier (currently provisional: `com.juniordisciples.app`);
- Apple Developer team and signing identity;
- App Store Connect app record, age band, Kids Category selection, privacy answers, support URL, and privacy-policy URL;
- final app icon, splash treatment, screenshots, subtitle, description, and review notes;
- a macOS/Xcode archive and real-device QA pass.

## Authoritative references

- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Capacitor iOS deployment: https://capacitorjs.com/docs/ios/deploying-to-app-store
