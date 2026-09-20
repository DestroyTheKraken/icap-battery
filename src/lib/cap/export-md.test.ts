import assert from "node:assert/strict";
import { test } from "node:test";
import { sessionMarkdown, validityLines } from "./export-md.ts";
import type { CapSession } from "./types.ts";

function sampleSession(overrides: Partial<CapSession["results"]> = {}): CapSession {
  return {
    id: "test-session",
    mode: "battery",
    startedAt: "2026-09-19T12:00:00Z",
    finishedAt: "2026-09-19T14:00:00Z",
    status: "complete",
    currentIndex: 6,
    results: {
      hexaco: {
        instrument: "hexaco",
        startedAt: "2026-09-19T12:00:00Z",
        finishedAt: "2026-09-19T12:20:00Z",
        hexaco: {
          factors: {
            "Honesty-Humility": 3.0,
            Emotionality: 3.0,
            Extraversion: 3.0,
            Agreeableness: 3.0,
            Conscientiousness: 3.0,
            "Openness to Experience": 3.5,
          },
          facets: {},
          altruism: 0,
          responses: [],
        },
      },
      icar: {
        instrument: "icar",
        startedAt: "2026-09-19T12:20:00Z",
        finishedAt: "2026-09-19T13:10:00Z",
        icar: {
          total: 18,
          max: 60,
          subtests: {
            series: { correct: 3, max: 9 },
            verbal: { correct: 5, max: 16 },
            matrix: { correct: 4, max: 11 },
            rotation: { correct: 6, max: 24 },
          },
          responses: [],
        },
      },
      aospan: {
        instrument: "aospan",
        startedAt: "2026-09-19T13:10:00Z",
        finishedAt: "2026-09-19T13:30:00Z",
        aospan: {
          absolute: 12,
          partialPct: 0.5,
          mathAccuracy: 0.7,
          trials: [],
        },
      },
      flanker: {
        instrument: "flanker",
        startedAt: "2026-09-19T13:30:00Z",
        finishedAt: "2026-09-19T13:40:00Z",
        flanker: {
          congruent: { acc: 0.95, rt: 400 },
          incongruent: { acc: 0.9, rt: 410 },
          costMs: 10,
          trials: [],
        },
      },
      interest: {
        instrument: "interest",
        startedAt: "2026-09-19T13:50:00Z",
        finishedAt: "2026-09-19T14:00:00Z",
        interest: {
          means: { R: 4, I: 3.5, A: 2, S: 3, E: 2.5, C: 3 },
          sums: { R: 40, I: 35, A: 20, S: 30, E: 25, C: 30 },
          holland: "RI",
          responses: [],
        },
      },
      ...overrides,
    },
  };
}

test("export includes Validity, source URLs, O*NET, and no publisher test brands", () => {
  const md = sessionMarkdown(sampleSession(), "Alex Tester");
  assert.match(md, /## Validity \(read this before coaching\)/);
  assert.match(md, /https:\/\/www\.onetcenter\.org\/IP\.html/);
  assert.match(md, /https:\/\/www\.mynextmove\.org\//);
  assert.match(md, /https:\/\/ipip\.ori\.org\//);
  assert.match(md, /O\*NET Interest Profiler/);
  assert.match(md, /Starting points, not a verdict/);
  assert.doesNotMatch(md, /HEXACO-PI-R/);
  assert.doesNotMatch(md, /\bICAR-60\b/);
  assert.doesNotMatch(md, /\bICAR\b/);
  assert.match(md, /mynextmove\.org\/profile\//);
});

test("validityLines flags flat Affect, low math accuracy, and tiny flanker cost", () => {
  const lines = validityLines(sampleSession()).join("\n");
  assert.match(lines, /Affect spread: FLAG/);
  assert.match(lines, /Working memory: FLAG/);
  assert.match(lines, /Flanker: FLAG/);
  assert.match(lines, /Cognition: raw total 18 \/ 60/);
  assert.doesNotMatch(lines, /\bICAR\b/);
});

test("caution uses session language without publisher brands", () => {
  const md = sessionMarkdown(sampleSession(), "Alex");
  assert.match(md, /Problem-solving score is low THIS SESSION/);
  assert.match(md, /Working memory is unusable or modest/);
  assert.doesNotMatch(md, /\bICAR\b/);
  assert.doesNotMatch(md, /HEXACO-PI-R/);
});

test("export Name is the typed taker name, not a fixture id or filename stem", () => {
  const md = sessionMarkdown(sampleSession(), "Jeff");
  assert.match(md, /^- Name: Jeff$/m);
  assert.doesNotMatch(md, /mock-complete/);
  assert.doesNotMatch(md, /^- Name: jeff-/m);
  // Filename stem must not leak into Name when the display name is different.
  const renamed = sessionMarkdown(sampleSession(), "Jordan Lee");
  assert.match(renamed, /^- Name: Jordan Lee$/m);
  assert.doesNotMatch(renamed, /mock-complete/);
});
