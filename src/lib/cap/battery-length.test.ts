import assert from "node:assert/strict";
import { test } from "node:test";
import { HEXACO_FACTORS, HEXACO_ITEMS } from "./hexaco-items.ts";
import {
  MATRIX_ITEMS,
  ROTATION_ITEMS,
  SERIES_ITEMS,
  VERBAL_ITEMS,
  allIcarItems,
} from "./icar-items.ts";
import { IP_ITEMS } from "./interest-items.ts";
import {
  ARM_DISPLAY_ORDER,
  BATTERY_ORDER,
  DISPLAY_INSTRUMENT_ORDER,
  INSTRUMENT_META,
} from "./instruments.ts";
import {
  AOSPAN_DUAL_PRAC,
  AOSPAN_LETTER_PRAC,
  AOSPAN_MATH_PRAC_N,
  AOSPAN_SCORED_N,
  aospanMathCap,
  aospanScoredSizes,
} from "./aospan.ts";

test("IPIP six-factor inventory is 60 items (10 per domain)", () => {
  assert.equal(HEXACO_ITEMS.length, 60);
  assert.equal(INSTRUMENT_META.hexaco.items, "60 statements");
  for (const f of HEXACO_FACTORS) {
    assert.equal(HEXACO_ITEMS.filter((i) => i.factor === f).length, 10);
  }
});

test("iCAP problem-solving set is 9 series + 16 verbal + 11 matrix + 24 rotation", () => {
  assert.equal(SERIES_ITEMS.length, 9);
  assert.equal(VERBAL_ITEMS.length, 16);
  assert.equal(MATRIX_ITEMS.length, 11);
  assert.equal(ROTATION_ITEMS.length, 24);
  assert.equal(allIcarItems().length, 60);
  assert.ok(SERIES_ITEMS.every((i) => i.id.startsWith("SP.")));
  assert.ok(VERBAL_ITEMS.every((i) => i.id.startsWith("VB.")));
});

test("Interest Profiler is the 60-item Short Form", () => {
  assert.equal(IP_ITEMS.length, 60);
  assert.equal(INSTRUMENT_META.interest.items, "60 activities");
});

test("UI display order is Interest → Cognition → Affect → Process", () => {
  assert.deepEqual(ARM_DISPLAY_ORDER, ["Interest", "Cognition", "Affect", "Process"]);
  assert.deepEqual(
    DISPLAY_INSTRUMENT_ORDER.map((id) => INSTRUMENT_META[id].arm),
    ["Interest", "Cognition", "Affect", "Process", "Process", "Process"],
  );
  assert.deepEqual(BATTERY_ORDER, ["hexaco", "icar", "aospan", "flanker", "dccs", "interest"]);
});

test("AOSPAN practice and scored block match Unsworth 2005", () => {
  assert.deepEqual(AOSPAN_LETTER_PRAC, [2, 2, 3, 3]);
  assert.equal(AOSPAN_MATH_PRAC_N, 15);
  assert.deepEqual(AOSPAN_DUAL_PRAC, [2, 2, 2]);
  assert.equal(AOSPAN_SCORED_N, 15);
  const sizes = aospanScoredSizes((a) => a);
  assert.deepEqual(sizes, [3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7]);
  assert.equal(aospanMathCap([1000, 1000, 1000]), 1000);
  const cap = aospanMathCap([1000, 2000, 3000]);
  assert.ok(cap > 2000 && cap < 5000);
});
