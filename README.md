# Plaud Embedded's Capacitor Wrapper

This wrapper helps you convert **web apps to iOS** that implement [Plaud Embedded](https://docs.plaud.ai/plaud-embedded) to integrate with Plaud devices.

## How to use

### Step 0: Install the skill from this repo

The Skill has context on the Plaud Embedded Wrapper to help you implement this 
wrapper for your web app.

```bash
npx skills add jackmuva/plaud-embedded-capacitor-wrapper
```

### Step 1: Setup Capacitor

Start by installing Capacitor in your js project

```bash
npm i @capacitor/core @capacitor/ios @capacitor-community/bluetooth-le
npm i -D @capacitor/cli
```

Then initialize Capacitor to setup your Capactior configs

```bash
npx cap init
```

Lastly add ios to your capacitor project and sync your web app

```bash
npx cap add ios
npx cap sync ios
```


### Step 2: Copy PlaudPlugin files

1. Copy the `ios/PlaudPlugin/` framework and paste into the `ios/` directory.

2. Copy the `ios/App/App/MainViewController.swift` into your `ios/App/App` directory to register the PlaudPlugin

3. Lastly, in your `capacitor.config.json` file located in `ios/App/App`, make sure you have the server url set to your web app's URL

```json
{
	"appId": "ai.plaud.pwademo",
	"appName": "Plaud PWA Demo",
	"webDir": "public",
	"server": {
		"url": "https://pwa-demo-plaud.vercel.app",
		"cleartext": false
	},
	"packageClassList": [
		"BluetoothLe"
	]
}
```

### Step 3: Use the Plaud SDK in your Web App

Capacitor acts as a bridge between your web app and iOS's native features. The Plaud Plugin uses Capacitor as the bridge to serialize data between your web app and iOS native functionality like BLE.

In your web app code, import `PlaudSdk` and `PluginListenerHandle` to use the Plaud SDK in your web app

```typescript
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import {
  PlaudSdk,
  readExportedFile,
  type PlaudScanDevice,
  type PlaudFile,
} from "@/lib/plaud-sdk";

const handleConnect = async (d: PlaudScanDevice) => {
    setError(null);
    if (!ensureNative()) return;
    try {
      setStatus(`connecting to ${d.name || d.serialNumber}…`);
      await PlaudSdk.stopScan();
      setScanning(false);
      await PlaudSdk.connectBleDevice({ uuid: d.uuid, serialNumber: d.serialNumber });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };
```

## How the Capacitor Wrapper Works

The Capacitor Wrapper wraps your web app in a Capacitor native shell that serves your web app's URL in a webkit view (WKWebView). The wrapper includes a bridge where native Swift code can be called via Javascript.

Calling the PlaudSdk pushes data through the Capacitor bridge to the native swift code. Callbacks push data from native features to the Capacitor bridge to the Capacitor JS plugin via event listeners.

```
┌──────────────────────────────────────────┐
│           Web App (JavaScript)           │
│               PlaudSdk                   │
└──────────────────▲───────────────────────┘
                   │
            Capacitor Bridge
          (JavaScript ↔ IPC)
                   │
┌──────────────────▼───────────────────────┐
│       PlaudPlugin (Swift/Native)         │
│    BLE, Files, iOS APIs, Events          │
└──────────────────────────────────────────┘
```
