import type { InstrumentId } from "./types";

/** Administration order for the live battery. Do not reorder for UI. */
export const BATTERY_ORDER: InstrumentId[] = [
  "hexaco",
  "icar",
  "aospan",
  "flanker",
  "dccs",
  "interest",
];

/** Site-wide display order for the four iCAP arms when shown together. */
export type CapArm = "Interest" | "Cognition" | "Affect" | "Process";

export const ARM_DISPLAY_ORDER: CapArm[] = ["Interest", "Cognition", "Affect", "Process"];

export const ARM_LETTER: Record<CapArm, string> = {
  Interest: "I",
  Cognition: "C",
  Affect: "A",
  Process: "P",
};

/**
 * Instrument order for hub/Sources/profile UI (I → C → A → P).
 * Distinct from BATTERY_ORDER, which is how the sitting is administered.
 */
export const DISPLAY_INSTRUMENT_ORDER: InstrumentId[] = [
  "interest",
  "icar",
  "hexaco",
  "aospan",
  "flanker",
  "dccs",
];

export const INSTRUMENT_META: Record<
  InstrumentId,
  {
    arm: CapArm;
    title: string;
    plainTitle: string;
    short: string;
    duration: string;
    items: string;
    construct: string;
    why: string;
  }
> = {
  hexaco: {
    arm: "Affect",
    title: "IPIP six-factor work-style inventory",
    plainTitle: "Personality",
    short: "Personality",
    duration: "10–15 min",
    items: "60 statements",
    construct: "Six work-style domains (Honesty-Humility through Openness)",
    why: "You rate 60 everyday statements about yourself. There are no right answers. This is here because a job is not only tasks — it is people, rules, stress, and new ideas every day. We chose a public-domain six-factor inventory so you can see whether a path will fit who you already are.",
  },
  icar: {
    arm: "Cognition",
    title: "iCAP problem-solving set",
    plainTitle: "Problem solving",
    short: "Ability",
    duration: "45–60 min (untimed)",
    items: "60 puzzles",
    construct: "Series, verbal, matrix, cube rotation — untimed",
    why: "Sixty puzzles with words, numbers, patterns, and turning objects in space. No clock. This is here so you can tell a long, hard program from a mismatch — and from a path that will bore you. We chose four kinds of puzzles, not one parlor trick, so a single question type cannot define you.",
  },
  aospan: {
    arm: "Process",
    title: "Operation span procedure (Unsworth et al., 2005)",
    plainTitle: "Working memory",
    short: "Working memory",
    duration: "~20 min",
    items: "15 scored sets",
    construct: "Working memory capacity under dual load",
    why: "You remember a few letters while you do simple math. That is the everyday skill of keeping something in mind while you handle something else. We chose a standard dual-task because interrupt-heavy work — kitchens, clinics, dispatch, classrooms — lives or dies on this.",
  },
  flanker: {
    arm: "Process",
    title: "Arrow flanker (Eriksen method)",
    plainTitle: "Focus in noise",
    short: "Inhibition",
    duration: "8–12 min",
    items: "80 scored trials",
    construct: "Selective attention / conflict cost",
    why: "Five arrows appear. You answer the one in the middle and ignore the rest. This is here because a lot of real work is noisy. We chose a simple, well-studied attention method so the result means one thing: can you still pick the right move when the room is loud.",
  },
  dccs: {
    arm: "Process",
    title: "Dimensional card-sort (Zelazo method)",
    plainTitle: "Switching gears",
    short: "Set shifting",
    duration: "6–8 min",
    items: "24 scored trials",
    construct: "Cognitive flexibility after a rule switch",
    why: "First you sort cards one way. Then the rule changes. The hard part is dropping the old rule. We chose this because jobs change the plan constantly, and a test that never switches cannot tell you about that cost.",
  },
  interest: {
    arm: "Interest",
    title: "O*NET Interest Profiler Short Form",
    plainTitle: "Work you want",
    short: "Interest",
    duration: "10–20 min",
    items: "60 activities",
    construct: "Holland Realistic–Investigative–Artistic–Social–Enterprising–Conventional",
    why: "Sixty ordinary work activities — build, teach, keep the books, start a shop. You rate like or dislike, not talent. Want matters as much as skill. We chose this public career list because it turns those likes into real job families you can search: making, investigating, creating, helping, leading, organizing.",
  },
};

export const ARM_COPY: Record<CapArm, { lead: string }> = {
  Affect: {
    lead: "Career discovery starts with who you already are. If the daily life of a job fights your nature, you will not last — even if you are qualified on paper.",
  },
  Cognition: {
    lead: "The next question is how you handle new problems you have not been trained for yet. Some paths will stretch you. Some will bury you. Some will bore you. You deserve an honest look, not a pep talk.",
  },
  Process: {
    lead: "Work is what your mind does all day: holding a thought, ignoring noise, and switching when the plan changes. People leave jobs they are “smart enough” for because this load is wrong.",
  },
  Interest: {
    lead: "Want matters as much as skill. People get stuck in work they can do and cannot stand. This last piece asks what you would like a day to be made of.",
  },
};

export const BATTERY_DURATION =
  "Plan about 90 to 180 minutes for the full sitting. Some parts are timed; others let you work at your own pace.";
