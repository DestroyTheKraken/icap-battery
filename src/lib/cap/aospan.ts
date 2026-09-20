/** Unsworth, Heitz, Schrock & Engle (2005) Automated O-Span. */

/** Letter-only practice sets (Unsworth 2005). */
export const AOSPAN_LETTER_PRAC = [2, 2, 3, 3];
/** Math-only practice operations — also used for the response-time cap. */
export const AOSPAN_MATH_PRAC_N = 15;
/** Dual practice: three sets of size 2 (Unsworth 2005). */
export const AOSPAN_DUAL_PRAC = [2, 2, 2];
export const AOSPAN_SET_SIZES = [3, 4, 5, 6, 7] as const;
export const AOSPAN_REPS = 3;
export const AOSPAN_LETTER_MS = 800;
export const AOSPAN_SCORED_N = AOSPAN_SET_SIZES.length * AOSPAN_REPS;

export function aospanScoredSizes(shuffleFn: <T>(a: T[]) => T[]) {
  const sizes: number[] = [];
  for (const s of AOSPAN_SET_SIZES) {
    for (let i = 0; i < AOSPAN_REPS; i++) sizes.push(s);
  }
  return shuffleFn(sizes);
}

/** Mean + 2.5 SD of math-practice first-response times (Unsworth 2005). */
export function aospanMathCap(rts: number[]): number {
  if (!rts.length) return 8000;
  const mean = rts.reduce((a, b) => a + b, 0) / rts.length;
  if (rts.length === 1) return mean;
  const variance = rts.reduce((s, x) => s + (x - mean) ** 2, 0) / (rts.length - 1);
  return mean + 2.5 * Math.sqrt(variance);
}

/** Exact serial recall (Unsworth absolute scoring requires perfect order). */
export function aospanLetterOk(expected: string[], recalled: string[]): boolean {
  return (
    expected.length > 0 &&
    recalled.length === expected.length &&
    recalled.every((ch, idx) => ch === expected[idx])
  );
}
