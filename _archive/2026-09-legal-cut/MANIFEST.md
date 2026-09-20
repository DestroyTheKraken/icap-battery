# Legal cut archive — 2026-09

Retired no-permission / publisher-restricted materials moved out of the live tree so they cannot be imported by accident. **Do not delete until you review.** Live code must never import from `_archive/`.

| Old path | New path | Why moved | What replaced it in live code |
| --- | --- | --- | --- |
| `src/lib/cap/hexaco-items.ts` (HEXACO-PI-R 100 stems) | `hexaco-pir/hexaco-items.ts` | Publisher item text requires permission | New `src/lib/cap/hexaco-items.ts` — 60 IPIP public-domain items |
| `src/lib/cap/archive.ts` (college norms) | `hexaco-pir/archive-norms.ts` | Norms belong to HEXACO-PI-R materials | Session means only; no borrowed norms |
| `artifacts/cap/hexaco-descriptives.pdf` | `hexaco-pir/hexaco-descriptives.pdf` | Publisher descriptives | Not used |
| `src/lib/cap/icar-items.ts` (LN.*/VR.* banks) | `icar-official/icar-items.ts` | Official ICAR stems | New original SP.*/VB.* + generative MX.*/RT.* |
| `artifacts/cap/icar-*.pdf` | `icar-official/` | Official ICAR keys/items PDFs | Not used |
| `artifacts/cap/matrix_reasoning.zip` | `icar-official/matrix_reasoning.zip` | Official matrix pack | Local matrix generator in `figurals.tsx` / `cube.ts` |
| `artifacts/cap/aospan.psy` | `psytoolkit/aospan.psy` | PsyToolkit script | React `aospan-task.tsx` |
| `artifacts/cap/flanker_arrows.psy` | `psytoolkit/flanker_arrows.psy` | PsyToolkit script | React `flanker-task.tsx` |
| `artifacts/cap/dccs.psy` | `psytoolkit/dccs.psy` | PsyToolkit script | React `dccs-task.tsx` |

## Live replacements (do not archive)

- IPIP 60-item six-factor inventory in `src/lib/cap/hexaco-items.ts`
- Original cognition banks in `src/lib/cap/icar-items.ts` (`SERIES_ITEMS`, `VERBAL_ITEMS`, `MATRIX_ITEMS`, `ROTATION_ITEMS`)
- Citations/copyright notes rewritten in `src/lib/cap/citations.ts`
- Instrument titles/durations in `src/lib/cap/instruments.ts`
