"use client";
import { useEffect, useRef, useState } from "react";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import {
  PlaudSdk,
  type PlaudScanDevice,
  type PlaudFile,
} from "@/lib/plaudSdk";
import { transcribeExportedFile } from "@/lib/transcribe";
import useSWR from "swr";

const PLAUD_DOMAIN = "platform-us.plaud.ai";
const USER_ID = "jackmu";

export default function Home() {
  const [devices, setDevices] = useState<PlaudScanDevice[]>([]);
  const [files, setFiles] = useState<PlaudFile[]>([]);
  const [status, setStatus] = useState("idle");
  const [connected, setConnected] = useState(false);
  const [recording, setRecording] = useState<string | null>(null);
  const [exportInfo, setExportInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playback, setPlayback] = useState<{ sessionId: number; src: string } | null>(
    null,
  );
  const [transcribeStatus, setTranscribeStatus] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const initedRef = useRef(false);

  // Mint the per-user JWT the SDK needs for its handshake.
  const { data } = useSWR("api/user-token", async () => {
    const tokenRes = await fetch(`${window.location.origin}/api/user-token`, {
      method: "POST",
      body: JSON.stringify({ user_id: USER_ID }),
    });
    const { access_token } = await tokenRes.json();
    return { access_token: access_token as string };
  });

  // Wire the native SDK's delegate events to React state. Native-only.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const handles: PluginListenerHandle[] = [];
    (async () => {
      handles.push(
        await PlaudSdk.addListener("scanResult", ({ devices }) => {
          setDevices((prev) => {
            const map = new Map(prev.map((d) => [d.serialNumber, d]));
            for (const d of devices) map.set(d.serialNumber, d);
            return [...map.values()];
          });
        }),
        await PlaudSdk.addListener("scanTimeout", ({ reason }) =>
          setStatus(
            reason === "bluetoothNotPoweredOn"
              ? "Bluetooth is off or permission was denied"
              : "scan timed out",
          ),
        ),
        await PlaudSdk.addListener("connectState", ({ connected, failed }) => {
          console.log("[Plaud] connectState", { connected, failed });
          setStatus(connected ? "connected" : failed ? "connection failed" : "disconnected");
          setConnected(connected);
          // Once connected, pull the on-device recording list.
          if (connected) PlaudSdk.getFileList({ startSessionId: 0 }).catch(() => {});
        }),
        await PlaudSdk.addListener("penState", (s) =>
          setStatus(`pen state ${s.state} (key ${s.keyState})`),
        ),
        await PlaudSdk.addListener("fileList", ({ files }) => {
          console.log("[Plaud] fileList", files);
          setFiles(files);
        }),
        await PlaudSdk.addListener("exportProgress", (p) => {
          console.log("[Plaud] exportProgress", p);
          setExportInfo(`session ${p.sessionId}: ${p.progress}% ${p.message}`);
        }),
        // Recording is driven by the physical device, not the app. Surface the
        // start/stop/pause/resume events so they're visible, and refresh the file
        // list once a recording stops so the new file shows up to export.
        await PlaudSdk.addListener("recordStart", (r) => {
          console.log("[Plaud] recordStart", r);
          setRecording(`recording session ${r.sessionId} (scene ${r.scene})`);
        }),
        await PlaudSdk.addListener("recordStop", (r) => {
          console.log("[Plaud] recordStop", r);
          setRecording(
            `stopped session ${r.sessionId} · ${(r.fileSize / 1024).toFixed(0)} KB` +
              (r.fileExist ? "" : " (no file)"),
          );
          // A fresh recording won't be in the list fetched at connect — refresh it.
          PlaudSdk.getFileList({ startSessionId: 0 }).catch(() => {});
        }),
        await PlaudSdk.addListener("recordPause", (r) => {
          console.log("[Plaud] recordPause", r);
          setRecording(`paused session ${r.sessionId}`);
        }),
        await PlaudSdk.addListener("recordResume", (r) => {
          console.log("[Plaud] recordResume", r);
          setRecording(`recording session ${r.sessionId} (resumed)`);
        }),
        await PlaudSdk.addListener("depair", ({ status }) => {
          console.log("[Plaud] depair", status);
          setStatus(`depaired (status ${status})`);
          setConnected(false);
          setFiles([]);
        }),
      );
    })();
    return () => {
      handles.forEach((h) => h.remove());
    };
  }, []);

  const ensureNative = () => {
    if (!Capacitor.isNativePlatform()) {
      setError("Native Plaud SDK is only available inside the iOS app shell.");
      return false;
    }
    return true;
  };

  const handleScan = async () => {
    setError(null);
    if (!ensureNative()) return;
    const token = data?.access_token;
    if (!token) {
      setError("User token not ready yet — try again in a moment.");
      return;
    }
    try {
      if (!initedRef.current) {
        setStatus("initializing SDK…");
        await PlaudSdk.initSDK({
          userAccessToken: token,
          customDomain: PLAUD_DOMAIN,
          userId: USER_ID,
        });
        initedRef.current = true;
      }
      setStatus("scanning…");
      await PlaudSdk.startScan();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  };

  const handleConnect = async (d: PlaudScanDevice) => {
    setError(null);
    if (!ensureNative()) return;
    try {
      setStatus(`connecting to ${d.name || d.serialNumber}…`);
      await PlaudSdk.stopScan();
      await PlaudSdk.connectBleDevice({ uuid: d.uuid, serialNumber: d.serialNumber });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDepair = async () => {
    setError(null);
    if (!ensureNative()) return;
    if (!window.confirm("Unpair this device and clear local pairing state?")) return;
    try {
      setStatus("depairing…");
      await PlaudSdk.depair({ clear: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleExport = async (f: PlaudFile) => {
    setError(null);
    setExportInfo(`session ${f.sessionId}: starting…`);
    setTranscribeStatus(null);
    setTranscript(null);
    console.log("[Plaud] exportAudio →", f.sessionId);
    try {
      const { outputPath } = await PlaudSdk.exportAudio({
        sessionId: f.sessionId,
        format: "mp3",
      });
      console.log("[Plaud] exportAudio done", f.sessionId, outputPath);
      setExportInfo(`session ${f.sessionId}: saved → ${outputPath}`);
      const src = Capacitor.convertFileSrc(outputPath);
      setPlayback({ sessionId: f.sessionId, src });
      await handleTranscribe(src);
    } catch (err) {
      console.error("[Plaud] exportAudio failed", f.sessionId, err);
      setError(err instanceof Error ? err.message : String(err));
      setExportInfo(null);
    }
  };

  // Upload the just-exported mp3 to Plaud's storage and run it through transcription.
  const handleTranscribe = async (fileSrc: string) => {
    const token = data?.access_token;
    if (!token) {
      setError("User token not ready — can't transcribe yet.");
      return;
    }
    try {
      const task = await transcribeExportedFile(fileSrc, "mp3", token, (p) => {
        setTranscribeStatus(
          p.phase === "uploading"
            ? `uploading to Plaud… ${p.percent ?? 0}%`
            : p.phase === "finalizing"
              ? "finalizing upload…"
              : p.phase === "submitting"
                ? "submitting for transcription…"
                : `transcribing… (${p.status})`,
        );
      });
      setTranscribeStatus("transcription complete");
      setTranscript(task.data.text ?? null);
    } catch (err) {
      console.error("[Plaud] transcription failed", err);
      setError(err instanceof Error ? err.message : String(err));
      setTranscribeStatus(null);
    }
  };

  const handleRefreshFiles = async () => {
    setError(null);
    if (!ensureNative()) return;
    try {
      console.log("[Plaud] getFileList refresh");
      await PlaudSdk.getFileList({ startSessionId: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center gap-3 bg-zinc-50 p-6 font-sans text-black">
      <h1 className="text-lg font-semibold">Plaud PWA Demo</h1>

      <div className="flex gap-2">
        <button
          onClick={handleScan}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white active:bg-blue-700"
        >
          Init &amp; Scan
        </button>
        <button
          onClick={handleDepair}
          className="rounded-lg border border-red-300 px-4 py-2 text-red-600 active:bg-red-50"
        >
          Unpair
        </button>
      </div>

      <div className="text-sm text-zinc-600">status: {status}</div>
      {recording && (
        <div className="max-w-xs text-center text-sm font-medium text-emerald-600">
          ● {recording}
        </div>
      )}
      {error && <div className="max-w-xs text-center text-sm text-red-600">{error}</div>}

      {/* Discovered devices — tap to connect. */}
      {devices.length > 0 && (
        <section className="mt-2 flex w-full max-w-sm flex-col gap-1">
          <h2 className="text-xs font-semibold uppercase text-zinc-400">Devices</h2>
          {devices.map((d) => (
            <button
              key={d.serialNumber || d.uuid}
              onClick={() => handleConnect(d)}
              className="flex justify-between rounded border border-zinc-200 bg-white px-3 py-2 text-left text-sm active:bg-zinc-100"
            >
              <span>{d.name || d.serialNumber || d.uuid}</span>
              <span className="text-zinc-400">{d.rssi} dBm</span>
            </button>
          ))}
        </section>
      )}

      {/* Recordings on the connected device — tap to export/decode. */}
      {connected && (
        <section className="mt-2 flex w-full max-w-sm flex-col gap-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase text-zinc-400">Recordings</h2>
            <button
              onClick={handleRefreshFiles}
              className="text-xs text-blue-600 active:text-blue-800"
            >
              Refresh
            </button>
          </div>
          {files.length === 0 && (
            <div className="text-xs text-zinc-400">
              no recordings yet — record on the device, then Refresh
            </div>
          )}
          {files.map((f) => (
            <button
              key={f.sessionId}
              onClick={() => handleExport(f)}
              className="flex justify-between rounded border border-zinc-200 bg-white px-3 py-2 text-left text-sm active:bg-zinc-100"
            >
              <span>#{f.sessionId}</span>
              <span className="text-zinc-400">
                {f.duration}s · {(f.size / 1024).toFixed(0)} KB
              </span>
            </button>
          ))}
        </section>
      )}

      {exportInfo && (
        <div className="mt-2 max-w-sm break-all text-center text-xs text-zinc-500">
          {exportInfo}
        </div>
      )}

      <div className="mt-4 text-xs text-zinc-400">
        token: {data?.access_token ? "ready" : "loading…"}
      </div>

      {/* Playback modal — shown once a recording has finished exporting. */}
      {playback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">
                Session #{playback.sessionId}
              </h2>
              <button
                onClick={() => setPlayback(null)}
                className="text-sm text-zinc-400 active:text-zinc-600"
              >
                Close
              </button>
            </div>
            <audio className="w-full" src={playback.src} controls autoPlay />
            {transcribeStatus && (
              <div className="mt-3 text-xs text-zinc-500">{transcribeStatus}</div>
            )}
            {transcript && (
              <div className="mt-2 max-h-40 overflow-y-auto rounded border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-700">
                {transcript}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
