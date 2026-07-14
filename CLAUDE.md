# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

A Next.js PWA that talks to Plaud recording hardware over Bluetooth. iOS has no Web
Bluetooth, so the app is wrapped in a Capacitor native shell that loads the live Vercel
deployment in a `WKWebView` and exposes Plaud's precompiled iOS SDK to the web layer via a
custom Capacitor plugin. **Read `README.md` before making architectural changes** — it is
the authoritative, detailed description of the whole bridge (why the native shell exists,
how the three vendor xcframeworks are packaged, the non-obvious manual plugin-registration
step, and the full JS↔native call chain). Do not duplicate its contents here; this file
only adds what the README doesn't cover.

## Commands

```bash
npm run dev      # start Next.js dev server
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint
```

There is no test suite. To test native/Bluetooth behavior:

```bash
npx cap sync ios     # after any web/plugin/config change
npx cap open ios     # opens Xcode — build/run on a physical iPhone (frameworks are arm64 device-only, no Simulator)
```

`capacitor.config.ts` points the iOS shell at the deployed Vercel URL, not local bundled
assets — **web changes must be deployed to Vercel before they're visible on device.**
Swift changes (the plugin, `MainViewController`) require an Xcode rebuild; a web deploy
alone won't pick them up.

## Architecture

- `app/page.tsx` — the entire demo flow: mint a per-user JWT → `initSDK` → `startScan` →
  `connectBleDevice` → `getFileList` → `exportAudio`, plus a confirm-guarded `depair`
  (unpair) action.
- `lib/plaudSdk.ts` — typed wrapper around `registerPlugin<PlaudSdkPlugin>("PlaudSdk")`.
  Outside the Capacitor iOS shell these calls reject with "not implemented" — guard
  native-only calls with `Capacitor.isNativePlatform()`.
- `lib/plaud.ts` + `app/api/user-token/route.ts` — server-side two-step OAuth token mint
  (partner token via `PLAUD_CLIENT_ID`/`PLAUD_SECRET_KEY`, then per-user token). Requires
  the Node.js runtime (uses `Buffer`).
- `ios/PlaudPlugin/` — local SwiftPM package bridging the vendor SDK to the WebView.
  `Sources/PlaudPlugin/PlaudSdkPlugin.swift` is the `CAPPlugin`/`CAPBridgedPlugin` bridge
  class; `Frameworks/*.xcframework` are the three precompiled Plaud SDKs
  (`PlaudDeviceBasicSDK`, `PlaudBleSDK`, `PlaudWiFiSDK`).
- `ios/App/App/MainViewController.swift` — manually registers the local `PlaudSdk` plugin
  instance in `capacitorDidLoad()`, since Capacitor 8 only auto-registers npm-installed
  plugins, not local SwiftPM packages.
- `ios-sdk-reference.md` — generated reference for the vendor SDK; it can drift, so verify
  real signatures against the `.swiftinterface` files under each `*.framework/Modules/`
  when adding plugin methods.

## Extending the native plugin

When adding a Plaud device feature, mirror the existing pattern end to end: add the
`CAPPluginMethod`/`@objc func` in `PlaudSdkPlugin.swift`, forward any SDK delegate
callbacks via `notifyListeners`, and add the matching method/listener types in
`lib/plaudSdk.ts`. Changing or adding plugin methods changes the native binary — it needs
an Xcode rebuild and redeploy to a physical device, not just a Vercel deploy.

## Notes

- `ios/**/.build/` is build output; ignore it unless specifically debugging a native build
  failure.
- Never commit `.env` (holds `PLAUD_CLIENT_ID`/`PLAUD_SECRET_KEY`).
