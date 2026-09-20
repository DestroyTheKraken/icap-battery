# iCAP Battery (UI)

Browser MVP for the **iCAP** career-discovery battery: Interest, Cognition, Affect, and Process in one sitting, with a local profile export.

This repository is the **UI application only**. Retired research PDFs and publisher item banks live under `_archive/` and must not be imported by live code.

## What it includes

| Arm | Instrument | Notes |
|-----|------------|--------|
| Affect | IPIP six-factor (60) | Public-domain IPIP items representing HEXACO constructs |
| Cognition | iCAP problem-solving set (60) | Original series, verbal, matrix, cube rotation |
| Process | Operation span, arrow flanker, DCCS | Published methods; original software/stimuli |
| Interest | O\*NET Interest Profiler Short Form | Public-domain RIASEC activities |

Session state stays in the browser (`localStorage`). Nothing is uploaded unless you later add auth/API features.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:8080`).

Useful scripts:

- `npm run build` — production build
- `npm run typecheck` — TypeScript
- `npm test` — unit tests (includes die-rotation uniqueness)

## Privacy

- Do **not** commit personal test scores, names, tax/health documents, or photos of real people.
- Export markdown may include a name you type at download time; that file stays on the machine that downloads it.

## Disclaimer

iCAP is a career-discovery aid, not a clinical or hiring diagnosis. Legal names and credits are on the in-app Sources page.

## Testing notes

Sprint coach/export notes: [`docs/testing/SPRINT-TEST-REPORT-2026-09.md`](docs/testing/SPRINT-TEST-REPORT-2026-09.md).
