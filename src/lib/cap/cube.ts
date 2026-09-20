export type CubeFaces = {
  U: number;
  D: number;
  F: number;
  B: number;
  L: number;
  R: number;
};

/**
 * Six distinct face marks (different glyph on each side).
 * Indices 1–6 map to these glyphs. Greek capitals stay visually distinct
 * under isometric foreshortening better than pip dice.
 */
export const FACE_GLYPHS = ["Α", "Β", "Γ", "Δ", "Ε", "Ζ"] as const;

export function faceGlyph(n: number): string {
  const i = ((Math.floor(n) - 1) % 6 + 6) % 6;
  return FACE_GLYPHS[i]!;
}

/** Canonical right-handed cube: 1 opposite 6, 2 opposite 5, 3 opposite 4. */
export const CANON: CubeFaces = { U: 1, D: 6, F: 2, B: 5, L: 4, R: 3 };

export function rotY(c: CubeFaces): CubeFaces {
  return { U: c.U, D: c.D, F: c.R, R: c.B, B: c.L, L: c.F };
}
export function rotX(c: CubeFaces): CubeFaces {
  return { U: c.B, D: c.F, F: c.U, B: c.D, L: c.L, R: c.R };
}
export function rotZ(c: CubeFaces): CubeFaces {
  return { F: c.F, B: c.B, U: c.L, R: c.U, D: c.R, L: c.D };
}
export function mirrorLR(c: CubeFaces): CubeFaces {
  return { U: c.U, D: c.D, F: c.F, B: c.B, L: c.R, R: c.L };
}

export function visKey(c: CubeFaces) {
  return `${c.U}:${c.F}:${c.R}`;
}

export function oppositesOk(c: CubeFaces) {
  return c.U + c.D === 7 && c.F + c.B === 7 && c.L + c.R === 7;
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

/** All U/F/R triples that cannot appear on any physical cube corner. */
function allImpossibleVisibleTriples(): Array<[number, number, number]> {
  const valid = validVisibleKeys();
  const out: Array<[number, number, number]> = [];
  for (let u = 1; u <= 6; u++) {
    for (let f = 1; f <= 6; f++) {
      for (let r = 1; r <= 6; r++) {
        if (valid.has(`${u}:${f}:${r}`)) continue;
        out.push([u, f, r]);
      }
    }
  }
  return out;
}

function cubeFromVisible(u: number, f: number, r: number): CubeFaces {
  // Hidden faces are arbitrary; only U/F/R are drawn.
  return { U: u, D: u, F: f, B: f, L: r, R: r };
}

export function makeCube(seed: number): CubeFaces {
  const orients = allRightHanded();
  return orients[((seed % 24) + 24) % 24];
}

/**
 * Eight response options for a cube-rotation item.
 * Exactly one option is a right-handed rotation of the target.
 * Distractors: direct mirror of the target, then views whose visible
 * U/F/R triple is impossible on any physical cube — so they cannot look
 * like an alternate correct turn once each face has a unique glyph.
 */
export function cubeOptions(seed: number, answer: number): CubeFaces[] {
  const target = makeCube(seed);
  let correct = rotY(rotX(target));
  if (visKey(correct) === visKey(target)) correct = rotY(correct);

  const seen = new Set<string>([visKey(target), visKey(correct)]);
  const rest: CubeFaces[] = [];

  const mirrored = mirrorLR(target);
  if (!seen.has(visKey(mirrored))) {
    seen.add(visKey(mirrored));
    rest.push(mirrored);
  }

  // Prefer varied foils: distinct-but-impossible corners first, then duplicates.
  const pool = allImpossibleVisibleTriples().slice().sort((a, b) => {
    const da = new Set(a).size;
    const db = new Set(b).size;
    if (da !== db) return db - da; // more distinct marks first
    return a[0]! + a[1]! * 7 + a[2]! * 13 - (b[0]! + b[1]! * 7 + b[2]! * 13);
  });
  const start = ((seed * 13) % pool.length + pool.length) % pool.length;
  for (let n = 0; n < pool.length && rest.length < 7; n++) {
    const [u, f, r] = pool[(start + n * 17) % pool.length]!;
    const k = `${u}:${f}:${r}`;
    if (seen.has(k)) continue;
    seen.add(k);
    rest.push(cubeFromVisible(u, f, r));
  }

  // Should be unreachable (168 impossible triples); keep slots defined.
  while (rest.length < 7) {
    const filler = cubeFromVisible(1, 1, 1 + rest.length);
    const k = visKey(filler);
    if (seen.has(k)) {
      rest.push(cubeFromVisible(2, 2, 2 + rest.length));
    } else {
      seen.add(k);
      rest.push(filler);
    }
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
