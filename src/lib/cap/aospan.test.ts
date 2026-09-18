import assert from "node:assert/strict";
import { test } from "node:test";
import { aospanMathCap, aospanScoredSizes } from "./aospan.ts";

test("aospanMathCap is mean + 2.5 SD", () => {
  assert.equal(aospanMathCap([]), 8000);
  assert.equal(aospanMathCap([2500]), 2500);
  const rts = [2000, 2200, 1800, 2100, 1900];
  const mean = rts.reduce((a, b) => a + b, 0) / rts.length;
  const sd = Math.sqrt(rts.reduce((s, x) => s + (x - mean) ** 2, 0) / (rts.length - 1));
  assert.equal(aospanMathCap(rts), mean + 2.5 * sd);
});

test("scored sizes are three of each 3–7", () => {
  const sizes = aospanScoredSizes((a) => a);
  assert.equal(sizes.length, 15);
  for (const s of [3, 4, 5, 6, 7]) {
    assert.equal(sizes.filter((x) => x === s).length, 3);
  }
});
