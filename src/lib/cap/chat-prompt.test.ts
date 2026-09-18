import assert from "node:assert/strict";
import { test } from "node:test";
import { profileFilename } from "./chat-prompt.ts";

test("profileFilename slugs the name and date", () => {
  assert.equal(profileFilename("Jordan Lee", "2026-09-17T12:00:00Z"), "jordan-lee-profile-2026-09-17.md");
  assert.equal(profileFilename("  ", "2026-09-17"), "icap-profile-2026-09-17.md");
});
