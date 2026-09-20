import assert from "node:assert/strict";
import test from "node:test";
import {
  allLeftHanded,
  allRightHanded,
  cubeOptions,
  faceGlyph,
  FACE_GLYPHS,
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

test("six distinct face glyphs", () => {
  assert.equal(FACE_GLYPHS.length, 6);
  assert.equal(new Set(FACE_GLYPHS).size, 6);
  assert.equal(faceGlyph(1), "Α");
  assert.equal(faceGlyph(6), "Ζ");
  assert.equal(faceGlyph(7), "Α");
});

test("mirror is not a right-handed orientation of the target", () => {
  const t = makeCube(7);
  assert.equal(isRightHandedView(mirrorLR(t)), false);
});

test("cube options: exactly one RH rotation; foils are not plausible cube corners", () => {
  const validVis = new Set([...allRightHanded(), ...allLeftHanded()].map(visKey));
  for (let seed = 0; seed < 24; seed++) {
    const answer = (seed % 8) + 1;
    const target = makeCube(seed);
    const opts = cubeOptions(seed, answer);
    assert.equal(opts.length, 8);
    assert.ok(opts.every((c) => c != null && typeof c.U === "number"), `seed ${seed} had undefined slots`);
    const keys = opts.map(visKey);
    assert.equal(new Set(keys).size, 8, `seed ${seed} had duplicate views`);
    assert.equal(keys.includes(visKey(target)), false, `seed ${seed} included target`);

    const rhCount = opts.filter((c) => isRightHandedView(c)).length;
    assert.equal(rhCount, 1, `seed ${seed} had ${rhCount} RH options`);
    assert.equal(isRightHandedView(opts[answer - 1]!), true, `seed ${seed} keyed slot not RH`);

    const distractors = opts.filter((_, i) => i !== answer - 1);
    assert.equal(distractors.length, 7);
    assert.ok(
      distractors.some((c) => visKey(c) === visKey(mirrorLR(target))),
      `seed ${seed} expected direct mirror of target`,
    );
    const nonMirror = distractors.filter((c) => visKey(c) !== visKey(mirrorLR(target)));
    for (const c of nonMirror) {
      assert.equal(
        validVis.has(visKey(c)),
        false,
        `seed ${seed} foil ${visKey(c)} still looks like a real cube`,
      );
    }
  }
});

test("practice seed 9002: only D looks like a rotation of the target cube", () => {
  const seed = 9002;
  const answer = 4; // D
  const target = makeCube(seed);
  const opts = cubeOptions(seed, answer);
  const validVis = new Set([...allRightHanded(), ...allLeftHanded()].map(visKey));

  assert.equal(opts.length, 8);
  assert.ok(opts.every((c) => c != null));
  assert.equal(opts.filter((c) => isRightHandedView(c)).length, 1);
  assert.equal(isRightHandedView(opts[answer - 1]!), true);

  for (let i = 0; i < 8; i++) {
    if (i === answer - 1) continue;
    const c = opts[i]!;
    const v = visKey(c);
    if (v === visKey(mirrorLR(target))) continue;
    assert.equal(validVis.has(v), false, `option ${String.fromCharCode(65 + i)}=${v} still plausible`);
  }
});

test("practice-like seeds also have unique RH answer", () => {
  for (const seed of [9001, 9002, 123, 53]) {
    const answer = 4;
    const opts = cubeOptions(seed, answer);
    assert.equal(opts.length, 8);
    assert.ok(opts.every((c) => c != null));
    assert.equal(opts.filter((c) => isRightHandedView(c)).length, 1);
    assert.equal(isRightHandedView(opts[answer - 1]!), true);
  }
});
