/** Slot on the viewed cube (which side of the die is showing where). */
export type FaceSlot = "U" | "D" | "F" | "B" | "L" | "R";

/**
 * Which mark sits on each slot, plus which neighboring slot that mark’s tip
 * points toward. Tip tracking is what lets a club’s tip rotate when the die turns
 * instead of staying glued “upright” in face UV.
 */
export type CubeFaces = {
  U: number;
  D: number;
  F: number;
  B: number;
  L: number;
  R: number;
  tipU: FaceSlot;
  tipD: FaceSlot;
  tipF: FaceSlot;
  tipB: FaceSlot;
  tipL: FaceSlot;
  tipR: FaceSlot;
};

/**
 * Six distinct face marks — one per side of the die.
 * Card-suit / game set stays readable when foreshortened on isometric faces.
 * Indices 1–6 map to these glyphs (never reuse a glyph on two faces of one cube).
 */
export const FACE_GLYPHS = ["♣️", "♦️", "♥️", "♠️", "♟️", "🎱"] as const;

export function faceGlyph(n: number): string {
  const i = ((Math.floor(n) - 1) % 6 + 6) % 6;
  return FACE_GLYPHS[i]!;
}

/**
 * Quarter-turns CW (0–3) in a face’s UV, looking from outside, so tip matches
 * the painted orientation. FaceMark uses this as SVG rotate(90 * twist).
 */
export function faceTwist(slot: "U" | "F" | "R", tip: FaceSlot): number {
  const table: Record<"U" | "F" | "R", Partial<Record<FaceSlot, number>>> = {
    // U: default tip toward B (−v in TOP UV)
    U: { B: 0, R: 1, F: 2, L: 3 },
    // F: default tip toward U (−v in FRONT UV)
    F: { U: 0, R: 1, D: 2, L: 3 },
    // R: default tip toward U (−v in RIGHT UV)
    R: { U: 0, B: 1, D: 2, F: 3 },
  };
  return table[slot][tip] ?? 0;
}

/** Canonical right-handed cube: 1 opposite 6, 2 opposite 5, 3 opposite 4. */
export const CANON: CubeFaces = {
  U: 1,
  D: 6,
  F: 2,
  B: 5,
  L: 4,
  R: 3,
  tipU: "B",
  tipD: "B",
  tipF: "U",
  tipB: "U",
  tipL: "U",
  tipR: "U",
};

/** Remap a tip-neighbor label after the cube body moves. */
function mapTip(tip: FaceSlot, move: Record<FaceSlot, FaceSlot>): FaceSlot {
  return move[tip];
}

/** 90° CW about Up (from above): sides R→F→L→B→R; U tip spins CW. */
export function rotY(c: CubeFaces): CubeFaces {
  const move: Record<FaceSlot, FaceSlot> = {
    U: "U",
    D: "D",
    F: "L",
    L: "B",
    B: "R",
    R: "F",
  };
  return {
    U: c.U,
    D: c.D,
    F: c.R,
    R: c.B,
    B: c.L,
    L: c.F,
    tipU: mapTip(c.tipU, move),
    tipD: mapTip(c.tipD, move),
    tipF: mapTip(c.tipR, move),
    tipR: mapTip(c.tipB, move),
    tipB: mapTip(c.tipL, move),
    tipL: mapTip(c.tipF, move),
  };
}

/** 90° about Right: U→F→D→B→U. */
export function rotX(c: CubeFaces): CubeFaces {
  const move: Record<FaceSlot, FaceSlot> = {
    U: "F",
    F: "D",
    D: "B",
    B: "U",
    L: "L",
    R: "R",
  };
  return {
    U: c.B,
    D: c.F,
    F: c.U,
    B: c.D,
    L: c.L,
    R: c.R,
    tipU: mapTip(c.tipB, move),
    tipD: mapTip(c.tipF, move),
    tipF: mapTip(c.tipU, move),
    tipB: mapTip(c.tipD, move),
    tipL: mapTip(c.tipL, move),
    tipR: mapTip(c.tipR, move),
  };
}

/** 90° about Front: U→R→D→L→U. */
export function rotZ(c: CubeFaces): CubeFaces {
  const move: Record<FaceSlot, FaceSlot> = {
    U: "R",
    R: "D",
    D: "L",
    L: "U",
    F: "F",
    B: "B",
  };
  return {
    F: c.F,
    B: c.B,
    U: c.L,
    R: c.U,
    D: c.R,
    L: c.D,
    tipF: mapTip(c.tipF, move),
    tipB: mapTip(c.tipB, move),
    tipU: mapTip(c.tipL, move),
    tipR: mapTip(c.tipU, move),
    tipD: mapTip(c.tipR, move),
    tipL: mapTip(c.tipD, move),
  };
}

export function mirrorLR(c: CubeFaces): CubeFaces {
  const flip = (s: FaceSlot): FaceSlot => (s === "L" ? "R" : s === "R" ? "L" : s);
  return {
    U: c.U,
    D: c.D,
    F: c.F,
    B: c.B,
    L: c.R,
    R: c.L,
    tipU: flip(c.tipU),
    tipD: flip(c.tipD),
    tipF: flip(c.tipF),
    tipB: flip(c.tipB),
    tipL: flip(c.tipR),
    tipR: flip(c.tipL),
  };
}

export function visKey(c: CubeFaces) {
  return `${c.U}:${c.F}:${c.R}`;
}

export function oppositesOk(c: CubeFaces) {
  return c.U + c.D === 7 && c.F + c.B === 7 && c.L + c.R === 7;
}

/** True when the three visible faces use three different marks. */
export function visibleMarksDistinct(c: CubeFaces): boolean {
  return new Set([c.U, c.F, c.R]).size === 3;
}

/** 24 orientations of a right-handed cube (6 faces up × 4 twists). */
export function allRightHanded(): CubeFaces[] {
  const tops: CubeFaces[] = [
    CANON,
    rotX(CANON),
    rotX(rotX(CANON)),
    rotX(rotX(rotX(CANON))),
    rotZ(CANON),
    rotZ(rotZ(rotZ(CANON))),
  ];
  const result: CubeFaces[] = [];
  for (const t of tops) {
    let x = t;
    for (let i = 0; i < 4; i++) {
      result.push(x);
      x = rotY(x);
    }
  }
  return result;
}

/** 24 left-handed (mirror) orientations — not reachable by rotating a RH cube. */
export function allLeftHanded(): CubeFaces[] {
  return allRightHanded().map(mirrorLR);
}

export function isRightHandedView(c: CubeFaces): boolean {
  const rh = new Set(allRightHanded().map(visKey));
  return rh.has(visKey(c));
}

/** Visible U/F/R triples that occur on some physical cube (RH or LH). */
function validVisibleKeys(): Set<string> {
  return new Set([...allRightHanded(), ...allLeftHanded()].map(visKey));
}

/**
 * Impossible U/F/R corners that still use three *different* face marks.
 * Duplicate-mark foils are banned — they look like broken dice and confuse takers.
 */
function distinctImpossibleTriples(): Array<[number, number, number]> {
  const valid = validVisibleKeys();
  const out: Array<[number, number, number]> = [];
  for (let u = 1; u <= 6; u++) {
    for (let f = 1; f <= 6; f++) {
      if (f === u) continue;
      for (let r = 1; r <= 6; r++) {
        if (r === u || r === f) continue;
        if (valid.has(`${u}:${f}:${r}`)) continue;
        out.push([u, f, r]);
      }
    }
  }
  return out;
}

function cubeFromVisible(u: number, f: number, r: number): CubeFaces {
  // Assign hidden faces to the remaining three IDs so the whole die still has 1–6 once each.
  // Foil orientations get canonical tip defaults (only RH paths carry true spin).
  const used = new Set([u, f, r]);
  const rest = [1, 2, 3, 4, 5, 6].filter((n) => !used.has(n));
  return {
    U: u,
    D: rest[0]!,
    F: f,
    B: rest[1]!,
    L: rest[2]!,
    R: r,
    tipU: "B",
    tipD: "B",
    tipF: "U",
    tipB: "U",
    tipL: "U",
    tipR: "U",
  };
}

export function makeCube(seed: number): CubeFaces {
  const orients = allRightHanded();
  return orients[((seed % 24) + 24) % 24];
}

/**
 * Eight response options for a cube-rotation item.
 * Exactly one option is a right-handed rotation of the target.
 * Every option (target-facing views) shows three distinct face marks.
 * Distractors: mirror of the target, then distinct-but-impossible corners.
 */
export function cubeOptions(seed: number, answer: number): CubeFaces[] {
  const target = makeCube(seed);
  let correct = rotY(rotX(target));
  if (visKey(correct) === visKey(target)) correct = rotY(correct);

  const seen = new Set<string>([visKey(target), visKey(correct)]);
  const rest: CubeFaces[] = [];

  const mirrored = mirrorLR(target);
  if (!seen.has(visKey(mirrored)) && visibleMarksDistinct(mirrored)) {
    seen.add(visKey(mirrored));
    rest.push(mirrored);
  }

  // Other left-handed orientations (still three distinct marks; not a valid RH turn).
  const lh = allLeftHanded();
  const lhStart = ((seed * 5) % lh.length + lh.length) % lh.length;
  for (let n = 0; n < lh.length && rest.length < 3; n++) {
    const c = lh[(lhStart + n) % lh.length]!;
    const k = visKey(c);
    if (seen.has(k) || !visibleMarksDistinct(c)) continue;
    seen.add(k);
    rest.push(c);
  }

  const pool = distinctImpossibleTriples();
  const start = ((seed * 13) % pool.length + pool.length) % pool.length;
  for (let n = 0; n < pool.length && rest.length < 7; n++) {
    const [u, f, r] = pool[(start + n * 17) % pool.length]!;
    const k = `${u}:${f}:${r}`;
    if (seen.has(k)) continue;
    seen.add(k);
    rest.push(cubeFromVisible(u, f, r));
  }

  // Last resort: permute unused distinct triples (should be rare).
  let guard = 0;
  while (rest.length < 7 && guard < 200) {
    guard++;
    const u = 1 + ((seed + guard) % 6);
    const f = 1 + ((seed + guard * 3) % 6);
    const r = 1 + ((seed + guard * 5) % 6);
    if (new Set([u, f, r]).size !== 3) continue;
    const k = `${u}:${f}:${r}`;
    if (seen.has(k) || validVisibleKeys().has(k)) continue;
    seen.add(k);
    rest.push(cubeFromVisible(u, f, r));
  }

  while (rest.length < 7) {
    // Absolute fallback — still force three distinct marks.
    const base = (rest.length % 4) + 1;
    const u = base;
    const f = ((base + 1) % 6) + 1;
    const r = ((base + 3) % 6) + 1;
    rest.push(cubeFromVisible(u, f, r));
  }

  const slot = Math.min(7, Math.max(0, answer - 1));
  const slots: CubeFaces[] = [];
  let j = 0;
  for (let i = 0; i < 8; i++) {
    slots.push(i === slot ? correct : rest[j++]!);
  }
  return slots;
}

/** @deprecated pip layout kept for any legacy callers; rotation UI uses FACE_GLYPHS. */
export function pipCells(n: number): Array<[number, number]> {
  const k = ((n - 1) % 6) + 1;
  switch (k) {
    case 1:
      return [[1, 1]];
    case 2:
      return [
        [0, 0],
        [2, 2],
      ];
    case 3:
      return [
        [0, 0],
        [1, 1],
        [2, 2],
      ];
    case 4:
      return [
        [0, 0],
        [2, 0],
        [0, 2],
        [2, 2],
      ];
    case 5:
      return [
        [0, 0],
        [2, 0],
        [1, 1],
        [0, 2],
        [2, 2],
      ];
    default:
      return [
        [0, 0],
        [0, 1],
        [0, 2],
        [2, 0],
        [2, 1],
        [2, 2],
      ];
  }
}

export function cellToUV(col: number, row: number): [number, number] {
  return [0.22 + col * 0.28, 0.22 + row * 0.28];
}
