export type RiasecKey = "R" | "I" | "A" | "S" | "E" | "C";

export const RIASEC_ORDER: RiasecKey[] = ["R", "I", "A", "S", "E", "C"];

export const RIASEC_LABEL: Record<RiasecKey, string> = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

export const RIASEC_BLURB: Record<RiasecKey, string> = {
  R: "Build, repair, work outdoors, tools and machines.",
  I: "Research, analyze, solve problems, science and data.",
  A: "Create, design, write, perform, make things new.",
  S: "Help, teach, counsel, care for people.",
  E: "Lead, sell, start things, persuade, manage.",
  C: "Organize, track, keep records, run systems cleanly.",
};

export interface InterestItem {
  n: number;
  text: string;
  scale: RiasecKey;
}

const R: string[] = [
  "Build kitchen cabinets",
  "Lay brick or tile",
  "Repair household appliances",
  "Raise fish in a fish hatchery",
  "Assemble electronic parts",
  "Drive a truck to deliver packages to offices and homes",
  "Test the quality of parts before shipment",
  "Repair and install locks",
  "Set up and operate machines to make products",
  "Put out forest fires",
];
const I: string[] = [
  "Develop a new medicine",
  "Study ways to reduce water pollution",
  "Conduct chemical experiments",
  "Study the movement of planets",
  "Examine blood samples using a microscope",
  "Investigate the cause of a fire",
  "Develop a way to better predict the weather",
  "Work in a biology lab",
  "Invent a replacement for sugar",
  "Do laboratory tests to identify diseases",
];
const A: string[] = [
  "Write books or plays",
  "Play a musical instrument",
  "Compose or arrange music",
  "Draw pictures",
  "Create special effects for movies",
  "Paint sets for plays",
  "Write scripts for movies or television shows",
  "Perform jazz or tap dance",
  "Sing in a band",
  "Edit movies",
];
const S: string[] = [
  "Teach an individual an exercise routine",
  "Help people with personal or emotional problems",
  "Give career guidance to people",
  "Perform rehabilitation therapy",
  "Do volunteer work at a non-profit organization",
  "Teach children how to play sports",
  "Teach sign language to people who are deaf or hard of hearing",
  "Help conduct a group therapy session",
  "Take care of children at a day-care center",
  "Teach a high-school class",
];
const E: string[] = [
  "Buy and sell stocks and bonds",
  "Manage a retail store",
  "Operate a beauty salon or barber shop",
  "Manage a department within a large company",
  "Start your own business",
  "Negotiate business contracts",
  "Represent a client in a lawsuit",
  "Market a new line of clothing",
  "Sell merchandise at a department store",
  "Manage a clothing store",
];
const C: string[] = [
  "Develop a spreadsheet using computer software",
  "Proofread records or forms",
  "Install software across computers on a large network",
  "Operate a calculator",
  "Keep shipping and receiving records",
  "Calculate the wages of employees",
  "Inventory supplies using a hand-held computer",
  "Record rent payments",
  "Keep inventory records",
  "Stamp, sort, and distribute mail for an organization",
];

/** O*NET Interest Profiler Short Form (60 items). Public domain, U.S. DOL/ETA. */
export const IP_ITEMS: InterestItem[] = (() => {
  const out: InterestItem[] = [];
  let n = 1;
  for (let i = 0; i < 10; i++) {
    out.push({ n: n++, text: R[i], scale: "R" });
    out.push({ n: n++, text: I[i], scale: "I" });
    out.push({ n: n++, text: A[i], scale: "A" });
    out.push({ n: n++, text: S[i], scale: "S" });
    out.push({ n: n++, text: E[i], scale: "E" });
    out.push({ n: n++, text: C[i], scale: "C" });
  }
  return out;
})();

export const INTEREST_LIKERT = [
  { v: 1, label: "Strongly dislike" },
  { v: 2, label: "Dislike" },
  { v: 3, label: "Unsure" },
  { v: 4, label: "Like" },
  { v: 5, label: "Strongly like" },
] as const;
