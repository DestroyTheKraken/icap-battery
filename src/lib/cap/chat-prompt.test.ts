import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { CHAT_STARTER, profileFilename } from "./chat-prompt.ts";

const here = dirname(fileURLToPath(import.meta.url));

test("profileFilename slugs the name and date", () => {
  assert.equal(profileFilename("Jordan Lee", "2026-09-17T12:00:00Z"), "jordan-lee-profile-2026-09-17.md");
  assert.equal(profileFilename("  ", "2026-09-17"), "icap-profile-2026-09-17.md");
});

test("CHAT_STARTER matches frozen icap-starter.txt", () => {
  const file = readFileSync(join(here, "icap-starter.txt"), "utf8").replace(/\r\n/g, "\n").trimEnd();
  const ts = CHAT_STARTER.replace(/\r\n/g, "\n").trimEnd();
  assert.equal(ts, file);
});

test("CHAT_STARTER is the check-in + form coach prompt", () => {
  assert.match(CHAT_STARTER, /^I attached my iCAP profile/);
  assert.match(CHAT_STARTER, /Context Refinement Form/);
  assert.match(CHAT_STARTER, /STOP after check-in/);
  assert.match(
    CHAT_STARTER,
    /Medical includes clinics, hospitals, dental, massage, therapy, nursing/,
  );
  assert.match(CHAT_STARTER, /public schools/);
  assert.match(CHAT_STARTER, /do not wrap it in a search link/);
  assert.match(CHAT_STARTER, /<after_form>/);
  assert.doesNotMatch(CHAT_STARTER, /HEXACO-PI-R/);
  assert.doesNotMatch(CHAT_STARTER, /ICAR-60/);
  assert.doesNotMatch(CHAT_STARTER, /\bICAR\b/);
  // Ban rules live under after_form, not inside the printed form block.
  const formBlock = CHAT_STARTER.slice(
    CHAT_STARTER.indexOf("<form>"),
    CHAT_STARTER.indexOf("</form>"),
  );
  assert.doesNotMatch(formBlock, /Medical includes/);
  assert.doesNotMatch(formBlock, /Government includes/);
});
