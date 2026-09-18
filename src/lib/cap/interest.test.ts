import assert from "node:assert/strict";
import { test } from "node:test";
import { hollandCode, scoreInterest } from "./interest.ts";
import { IP_ITEMS, RIASEC_ORDER } from "./interest-items.ts";

test("holland code ranks by mean, ties break in RIASEC order", () => {
  assert.equal(
    hollandCode({ R: 5, I: 5, A: 4, S: 3, E: 2, C: 1 }),
    "RIA",
  );
  assert.equal(
    hollandCode({ R: 3, I: 3, A: 3, S: 3, E: 3, C: 3 }),
    "RIA",
  );
});

test("scoreInterest sums Short Form 60 by scale", () => {
  const responses = Array(IP_ITEMS.length).fill(0);
  for (const it of IP_ITEMS) {
    responses[it.n - 1] = it.scale === "I" ? 5 : 1;
  }
  const s = scoreInterest(responses);
  assert.equal(s.holland[0], "I");
  assert.equal(s.means.I, 5);
  assert.equal(s.means.R, 1);
  assert.equal(IP_ITEMS.length, 60);
  for (const k of RIASEC_ORDER) {
    assert.equal(IP_ITEMS.filter((it) => it.scale === k).length, 10);
  }
});
