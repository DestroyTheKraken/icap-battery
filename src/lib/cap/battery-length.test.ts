import assert from "node:assert/strict";
import { test } from "node:test";
import { HEXACO_ITEMS } from "./hexaco-items.ts";
import { ICAR_MATRIX, ICAR_ROTATION, ICAR_SERIES, ICAR_VERBAL, allIcarItems } from "./icar-items.ts";
import { IP_ITEMS, RIASEC_ORDER } from "./interest-items.ts";
import {
  AOSPAN_DUAL_PRAC,
  AOSPAN_LETTER_PRAC,
  AOSPAN_MATH_PRAC_N,
  AOSPAN_SCORED_N,
  aospanMathCap,
  aospanScoredSizes,
} from "./aospan.ts";
import { INSTRUMENT_META } from "./instruments.ts";

test("HEXACO-PI-R is the published 100-item form", () => {
  assert.equal(HEXACO_ITEMS.length, 100);
  const by: Record<string, number> = {};
  for (const it of HEXACO_ITEMS) by[it.factor] = (by[it.factor] ?? 0) + 1;
  assert.equal(by["Honesty-Humility"], 16);
  assert.equal(by.Emotionality, 16);
  assert.equal(by.Extraversion, 16);
  assert.equal(by.Agreeableness, 16);
  assert.equal(by.Conscientiousness, 16);
  assert.equal(by["Openness to Experience"], 16);
  assert.equal(by.Altruism, 4);
  assert.equal(INSTRUMENT_META.hexaco.duration, "20–25 min");
  assert.match(INSTRUMENT_META.hexaco.items, /100/);
});

test("ICAR-60 is 9 series + 16 verbal + 11 matrix + 24 rotation", () => {
  assert.equal(ICAR_SERIES.length, 9);
  assert.equal(ICAR_VERBAL.length, 16);
  assert.equal(ICAR_MATRIX.length, 11);
  assert.equal(ICAR_ROTATION.length, 24);
  assert.equal(allIcarItems().length, 60);
  assert.match(INSTRUMENT_META.icar.duration, /45–60/);
});

test("Interest Profiler is the 60-item Short Form (10 per RIASEC)", () => {
  assert.equal(IP_ITEMS.length, 60);
  for (const k of RIASEC_ORDER) {
    assert.equal(IP_ITEMS.filter((it) => it.scale === k).length, 10);
  }
  assert.match(INSTRUMENT_META.interest.duration, /10–20/);
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
