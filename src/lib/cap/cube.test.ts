import assert from "node:assert/strict";
import test from "node:test";
import {
  allLeftHanded,
  allRightHanded,
  cubeOptions,
  isRightHandedView,
  makeCube,
  mirrorLR,
  oppositesOk,
  visKey,
} from "./cube.ts";

test("24 right-handed orientations, unique visible triples, opposites sum to 7", () => {
  const all = allRightHanded();
  assert.equal(all.length, 24);
  const keys = new Set(all.map(visKey));
  assert.equal(keys.size, 24);
  for (const c of all) assert.equal(oppositesOk(c), true);
});

test("24 left-handed orientations, no overlap with right-handed visible triples", () => {
  const rh = new Set(allRightHanded().map(visKey));
  const lh = allLeftHanded();
  assert.equal(lh.length, 24);
  const lhKeys = new Set(lh.map(visKey));
  assert.equal(lhKeys.size, 24);
  for (const k of lhKeys) assert.equal(rh.has(k), false);
});

test("mirror is not a right-handed orientation of the target", () => {
  const t = makeCube(7);
  assert.equal(isRightHandedView(mirrorLR(t)), false);
});

test("cube options: exactly one RH rotation, keyed slot, target excluded", () => {
  for (let seed = 0; seed < 24; seed++) {
    const answer = (seed % 8) + 1;
    const target = makeCube(seed);
    const opts = cubeOptions(seed, answer);
    assert.equal(opts.length, 8);
    const keys = opts.map(visKey);
    assert.equal(new Set(keys).size, 8, `seed ${seed} had duplicate views`);
    assert.equal(keys.includes(visKey(target)), false, `seed ${seed} included target`);

    const rhCount = opts.filter((c) => isRightHandedView(c)).length;
    assert.equal(rhCount, 1, `seed ${seed} had ${rhCount} RH options`);
    assert.equal(isRightHandedView(opts[answer - 1]!), true, `seed ${seed} keyed slot not RH`);

    const distractors = opts.filter((c) => !isRightHandedView(c));
    assert.equal(distractors.length, 7);
    const lhKeys = new Set(allLeftHanded().map(visKey));
    assert.ok(
      distractors.some((c) => lhKeys.has(visKey(c))),
      `seed ${seed} expected at least one mirror distractor`,
    );
  }
});

test("practice-like seeds also have unique RH answer", () => {
  for (const seed of [9001, 9002, 123, 53]) {
    const answer = 4;
    const opts = cubeOptions(seed, answer);
    assert.equal(opts.filter((c) => isRightHandedView(c)).length, 1);
    assert.equal(isRightHandedView(opts[answer - 1]!), true);
  }
});
