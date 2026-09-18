# iCAP Battery (UI)

Browser MVP for the **iCAP** career-discovery battery: Cognition, Affect, Process, and Interest instruments in one sitting, with a local profile export.

This repository is the **UI application only**. Research source PDFs, scoring-key archives, and any personal test results live outside this tree and must not be committed here.

## What it includes

| Arm | Instrument | Notes |
|-----|------------|--------|
| Affect | HEXACO-PI-R 100 | Self-report; no right answers |
| Cognition | ICAR-60 | Series, verbal, matrix, 3D rotation (matrix/die figures are local analogues) |
| Process | Automated O-Span, Flanker, DCCS | Timing / dual-task protocols as cited in-app |
| Interest | O\*NET Interest Profiler Short Form | Public-domain RIASEC activities |

Session state stays in the browser (`localStorage`). Nothing is uploaded unless you later add auth/API features.

## Disclaimer

iCAP is a career-discovery aid, not a clinical or hiring diagnosis. Instrument copyrights and redistribution terms are summarized on the in-app Sources page — review them before any public deployment.

## License / instruments

Application code in this repo is for private development unless a LICENSE file is added. Individual instruments remain under their publishers’ terms (HEXACO, ICAR, PsyToolkit experiments, O\*NET, etc.).
