export type CubeFaces = {
  U: number;
  D: number;
  F: number;
  B: number;
  L: number;
  R: number;
};

/** Right-handed die: 1 opposite 6, 2 opposite 5, 3 opposite 4. */
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

/** 24 orientations of a right-handed die (6 faces up × 4 twists). */
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

/** 24 left-handed (mirror) orientations — not reachable by rotating a RH die. */
export function allLeftHanded(): CubeFaces[] {
  return allRightHanded().map(mirrorLR);
}

export function isRightHandedView(c: CubeFaces): boolean {
  const rh = new Set(allRightHanded().map(visKey));
  return rh.has(visKey(c));
}

/** Broken die: visible faces that violate opposite-sum-7 (impossible physical die). */
function impossibleView(seed: number, n: number): CubeFaces {
  const base = makeCube(seed + n + 3);
  const faces = [1, 2, 3, 4, 5, 6];
  const pick = (offset: number) => faces[(seed + n + offset) % 6]!;
  // Force U+D ≠ 7 and keep a distinct visible triple.
  return {
    U: pick(0),
    D: pick(0), // same as U → opposite sum ≠ 7
    F: pick(1 + (n % 4)),
    B: pick(2 + (n % 3)),
    L: pick(3),
    R: pick(4),
  };
}

export function makeCube(seed: number): CubeFaces {
  const orients = allRightHanded();
  return orients[((seed % 24) + 24) % 24];
}

/**
 * Eight response options for a die-rotation item.
 * Exactly one option is a right-handed rotation of the target; the rest are
 * mirrors and/or impossible face configs. Other RH orientations must never
 * appear — on a standard die every RH view is a valid rotation of every other.
 */
export function cubeOptions(seed: number, answer: number): CubeFaces[] {
  const target = makeCube(seed);
  let correct = rotY(rotX(target));
  if (visKey(correct) === visKey(target)) correct = rotY(correct);

  const seen = new Set<string>([visKey(target), visKey(correct)]);
  const rest: CubeFaces[] = [];

  const lh = allLeftHanded();
  const start = ((seed % lh.length) + lh.length) % lh.length;
  for (let n = 0; n < lh.length && rest.length < 7; n++) {
    const c = lh[(start + n) % lh.length]!;
    const k = visKey(c);
    if (seen.has(k)) continue;
    seen.add(k);
    rest.push(c);
  }

  let guard = 0;
  while (rest.length < 7 && guard < 32) {
    const bad = impossibleView(seed, rest.length + guard);
    const k = visKey(bad);
    guard++;
    if (seen.has(k) || isRightHandedView(bad)) continue;
    seen.add(k);
    rest.push(bad);
  }

  let fill = 0;
  while (rest.length < 7) {
    const filler: CubeFaces = {
      U: 1 + (fill % 6),
      D: 1 + (fill % 6),
      F: 1 + ((fill + 1) % 6),
      B: 1 + ((fill + 2) % 6),
      L: 1 + ((fill + 3) % 6),
      R: 1 + ((fill + 4) % 6),
    };
    fill++;
    const k = visKey(filler);
    if (seen.has(k) || isRightHandedView(filler)) {
      if (fill > 64) {
        rest.push(filler);
        break;
      }
      continue;
    }
    seen.add(k);
    rest.push(filler);
  }

  const slot = Math.min(7, Math.max(0, answer - 1));
  const slots: CubeFaces[] = [];
  let j = 0;
  for (let i = 0; i < 8; i++) {
    slots.push(i === slot ? correct : rest[j++]!);
  }
  return slots;
}

/** Pip cells on a 3×3 face grid (col, row). */
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
