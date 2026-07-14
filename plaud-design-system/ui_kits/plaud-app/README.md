# Plaud App — UI Kit

High-fidelity recreation of the Plaud Note AI recording/transcription app. This is a cosmetic recreation — the components are mostly visual, with a few interactive click-throughs.

## What's here

- `index.html` — runs the app experience: recordings list → open a recording → tabs (Transcript, Summary, Ask AI)
- `components/` — JSX components, globally registered for use across scripts
  - `Shell.jsx` — app frame (sidebar + topbar + content)
  - `Sidebar.jsx` — nav with categories + live-rec indicator
  - `RecordingList.jsx` — library listing of recordings
  - `RecordingView.jsx` — detailed view with tabs
  - `Transcript.jsx` — speaker-labeled transcript view
  - `Summary.jsx` — AI summary cards
  - `AskAI.jsx` — chat-with-recording interface
  - `RecordBar.jsx` — bottom recording control (live waveform)
  - `Icons.jsx` — inline SVG icons (Lucide-style)

## Coverage

Core screens: Library / Recording detail (Transcript, Summary, Ask AI) / Record in progress.
Covers the primary app loop: **list → open → read → ask → record**.

## Caveats

- Codebase / Figma not provided — this is reconstructed from publicly-known Plaud product surfaces. **Please share the real codebase or Figma for pixel-accurate UI.**
- No marketing-web kit included yet — flag if you want one built.
