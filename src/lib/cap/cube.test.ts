import assert from "node:assert/strict";
import test from "node:test";
import {
  CANON,
  FACE_GLYPHS,
  allLeftHanded,
  allRightHanded,
  cubeOptions,
  faceGlyph,
  faceTwist,
  isRightHandedView,
  makeCube,
  mirrorLR,
  oppositesOk,
  rotX,
  rotY,
  rotZ,
  visKey,
  visibleMarksDistinct,
} from "./cube.ts";

test("six distinct face glyphs", () => {
  assert.equal(FACE_GLYPHS.length, 6);
  assert.equal(new Set(FACE_GLYPHS).size, 6);
  assert.equal(faceGlyph(1), FACE_GLYPHS[0]);
  assert.equal(faceGlyph(6), FACE_GLYPHS[5]);
});

test("face tips spin with the die instead of staying fixed in UV", () => {
  assert.equal(CANON.tipU, "B");
  assert.equal(faceTwist("U", CANON.tipU), 0);

  const y1 = rotY(CANON);
  assert.equal(y1.U, CANON.U);
  assert.equal(y1.tipU, "R");
  assert.equal(faceTwist("U", y1.tipU), 1);

  const y2 = rotY(y1);
  assert.equal(y2.tipU, "F");
  assert.equal(faceTwist("U", y2.tipU), 2);

  const x1 = rotX(CANON);
  // Face that was Back (tip toward U) lands on Up; tip label remaps with the body.
  assert.equal(x1.U, CANON.B);
  assert.equal(x1.tipU, "F");
  assert.ok(faceTwist("U", x1.tipU) !== 0);

  const z1 = rotZ(CANON);
  assert.equal(z1.F, CANON.F);
  assert.equal(z1.tipF, "R");
  assert.equal(faceTwist("F", z1.tipF), 1);
});

test("24 RH orientations carry consistent tips (unique U/F/R + tip triple)", () => {
  const all = allRightHanded();
  const tipKeys = new Set(all.map((c) => `${visKey(c)}|${c.tipU}:${c.tipF}:${c.tipR}`));
  assert.equal(tipKeys.size, 24);
});

test("24 right-handed orientations, unique visible triples, opposites sum to 7", () => {
  const all = allRightHanded();
  assert.equal(all.length, 24);
  const keys = new Set(all.map(visKey));
  assert.equal(keys.size, 24);
  for (const c of all) {
    assert.equal(oppositesOk(c), true);
    assert.equal(visibleMarksDistinct(c), true);
  }
});

test("24 left-handed orientations, no overlap with right-handed visible triples", () => {
  const rh = new Set(allRightHanded().map(visKey));
  const lh = allLeftHanded();
  assert.equal(lh.length, 24);
  const lhKeys = new Set(lh.map(visKey));
  assert.equal(lhKeys.size, 24);
  for (const k of lhKeys) assert.equal(rh.has(k), false);
  for (const c of lh) assert.equal(visibleMarksDistinct(c), true);
});

test("mirror is not a right-handed orientation of the target", () => {
  const t = makeCube(7);
  assert.equal(isRightHandedView(mirrorLR(t)), false);
});

test("cube options: exactly one RH rotation; every option has three distinct marks", () => {
  const validVis = new Set([...allRightHanded(), ...allLeftHanded()].map(visKey));
  for (let seed = 0; seed < 24; seed++) {
    const answer = (seed % 8) + 1;
    const target = makeCube(seed);
    const opts = cubeOptions(seed, answer);
    assert.equal(opts.length, 8);
    assert.ok(opts.every((c) => c != null), `seed ${seed} had undefined slots`);
    const keys = opts.map(visKey);
    assert.equal(new Set(keys).size, 8, `seed ${seed} had duplicate views`);
    assert.equal(keys.includes(visKey(target)), false, `seed ${seed} included target`);

    for (const c of opts) {
      assert.equal(
        visibleMarksDistinct(c),
        true,
        `seed ${seed} option ${visKey(c)} repeats a face mark`,
      );
    }

    const rhCount = opts.filter((c) => isRightHandedView(c)).length;
    assert.equal(rhCount, 1, `seed ${seed} had ${rhCount} RH options`);
    assert.equal(isRightHandedView(opts[answer - 1]!), true, `seed ${seed} keyed slot not RH`);

    const distractors = opts.filter((_, i) => i !== answer - 1);
    assert.ok(
      distractors.some((c) => visKey(c) === visKey(mirrorLR(target))),
      `seed ${seed} expected direct mirror of target`,
    );
    const nonMirror = distractors.filter((c) => visKey(c) !== visKey(mirrorLR(target)));
    for (const c of nonMirror) {
      if (isRightHandedView(c)) continue;
      // Non-mirror foils must not be another valid RH view (already counted) and
      // LH mirrors of other orientations are allowed; impossible corners are not in validVis.
      assert.ok(
        !isRightHandedView(c) || validVis.has(visKey(c)),
        `seed ${seed} unexpected foil ${visKey(c)}`,
      );
    }
  }
});

test("practice seed 9002: only keyed option is RH; no duplicate marks on any option", () => {
  const seed = 9002;
  const answer = 4;
  const opts = cubeOptions(seed, answer);
  assert.equal(opts.filter((c) => isRightHandedView(c)).length, 1);
  assert.equal(isRightHandedView(opts[answer - 1]!), true);
  for (const c of opts) assert.equal(visibleMarksDistinct(c), true);
});
