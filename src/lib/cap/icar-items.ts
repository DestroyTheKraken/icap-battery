export type IcarKind = "series" | "verbal" | "matrix" | "rotation";

export interface IcarItem {
  id: string;
  kind: IcarKind;
  prompt: string;
  options: string[];
  answer: number; // 1-indexed
  figural?: "matrix" | "rotation";
  seed: number;
}

/** Original iCAP letter/number series. */
export const SERIES_ITEMS: IcarItem[] = [
  {
    id: "SP.01",
    kind: "series",
    prompt: "In the following number series, what number comes next?\n3, 6, 12, 24, 48, …",
    options: ["72", "84", "96", "100", "108", "120", "None of these", "I don't know"],
    answer: 3,
    seed: 1,
  },
  {
    id: "SP.02",
    kind: "series",
    prompt: "In the following number series, what number comes next?\n5, 8, 12, 17, 23, …",
    options: ["28", "29", "30", "31", "32", "35", "None of these", "I don't know"],
    answer: 3,
    seed: 2,
  },
  {
    id: "SP.03",
    kind: "series",
    prompt: "In the following alphanumeric series, what letter comes next?\nA, C, F, J, O, …",
    options: ["S", "T", "U", "V", "W", "X", "None of these", "I don't know"],
    answer: 3,
    seed: 3,
  },
  {
    id: "SP.04",
    kind: "series",
    prompt: "In the following alphanumeric series, what letter comes next?\nB, D, G, K, P, …",
    options: ["S", "T", "U", "V", "W", "X", "None of these", "I don't know"],
    answer: 4,
    seed: 4,
  },
  {
    id: "SP.05",
    kind: "series",
    prompt: "In the following number series, what number comes next?\n1, 1, 2, 3, 5, 8, …",
    options: ["11", "12", "13", "14", "15", "16", "None of these", "I don't know"],
    answer: 3,
    seed: 5,
  },
  {
    id: "SP.06",
    kind: "series",
    prompt: "In the following alphanumeric series, what letter comes next?\nZ, X, U, Q, L, …",
    options: ["E", "F", "G", "H", "I", "J", "None of these", "I don't know"],
    answer: 2,
    seed: 6,
  },
  {
    id: "SP.07",
    kind: "series",
    prompt: "In the following number series, what number comes next?\n81, 27, 9, 3, …",
    options: ["0", "1", "2", "3", "9", "27", "None of these", "I don't know"],
    answer: 2,
    seed: 7,
  },
  {
    id: "SP.08",
    kind: "series",
    prompt: "In the following alphanumeric series, what letter comes next?\nD, E, G, J, N, …",
    options: ["P", "Q", "R", "S", "T", "U", "None of these", "I don't know"],
    answer: 4,
    seed: 8,
  },
  {
    id: "SP.09",
    kind: "series",
    prompt: "In the following number series, what number comes next?\n2, 5, 10, 17, 26, …",
    options: ["35", "36", "37", "38", "39", "40", "None of these", "I don't know"],
    answer: 3,
    seed: 9,
  },
];

/** Original iCAP verbal-reasoning items. */
export const VERBAL_ITEMS: IcarItem[] = [
  {
    id: "VB.01",
    kind: "verbal",
    prompt: "Which word is most nearly the opposite of scarce?",
    options: ["Rare", "Abundant", "Hidden", "Fragile", "Costly", "Distant", "None of these", "I don't know"],
    answer: 2,
    seed: 1,
  },
  {
    id: "VB.02",
    kind: "verbal",
    prompt: "A baker needs 3 cups of flour for every 2 loaves. How many cups for 10 loaves?",
    options: ["12", "14", "15", "16", "18", "20", "None of these", "I don't know"],
    answer: 3,
    seed: 2,
  },
  {
    id: "VB.03",
    kind: "verbal",
    prompt: "Which word does not belong with the others?",
    options: ["Oak", "Maple", "Pine", "Cedar", "Rose", "Birch", "None of these", "I don't know"],
    answer: 5,
    seed: 3,
  },
  {
    id: "VB.04",
    kind: "verbal",
    prompt: "If all blips are zorps, and some zorps are soft, which must be true?",
    options: ["All blips are soft", "Some blips may be soft", "No blips are soft", "All zorps are blips", "Soft things are blips", "Blips are never zorps", "None of these", "I don't know"],
    answer: 2,
    seed: 4,
  },
  {
    id: "VB.05",
    kind: "verbal",
    prompt: "Complete the analogy: Needle is to sew as brush is to …",
    options: ["Paint", "Wood", "Hair", "Cloth", "Metal", "Water", "None of these", "I don't know"],
    answer: 1,
    seed: 5,
  },
  {
    id: "VB.06",
    kind: "verbal",
    prompt: "Which number is 25% of 80?",
    options: ["10", "15", "20", "25", "30", "40", "None of these", "I don't know"],
    answer: 3,
    seed: 6,
  },
  {
    id: "VB.07",
    kind: "verbal",
    prompt: "Choose the best definition of concise:",
    options: ["Lengthy", "Brief and clear", "Confusing", "Decorative", "Loud", "Ancient", "None of these", "I don't know"],
    answer: 2,
    seed: 7,
  },
  {
    id: "VB.08",
    kind: "verbal",
    prompt: "Three printers make 90 pages in 3 minutes at the same rate. How many pages can 2 printers make in 3 minutes?",
    options: ["30", "45", "60", "75", "90", "120", "None of these", "I don't know"],
    answer: 3,
    seed: 8,
  },
  {
    id: "VB.09",
    kind: "verbal",
    prompt: "Which word is a synonym of commence?",
    options: ["Finish", "Pause", "Begin", "Cancel", "Delay", "Hide", "None of these", "I don't know"],
    answer: 3,
    seed: 9,
  },
  {
    id: "VB.10",
    kind: "verbal",
    prompt: "If a shelf holds 8 boxes and each box holds 6 jars, how many jars on 3 full shelves?",
    options: ["96", "112", "128", "144", "160", "180", "None of these", "I don't know"],
    answer: 4,
    seed: 10,
  },
  {
    id: "VB.11",
    kind: "verbal",
    prompt: "Which word does not match the category of the others?",
    options: ["Square", "Circle", "Triangle", "Rectangle", "Cube", "Pentagon", "None of these", "I don't know"],
    answer: 5,
    seed: 11,
  },
  {
    id: "VB.12",
    kind: "verbal",
    prompt: "A train travels 90 miles in 1.5 hours. What is its average speed in mph?",
    options: ["45", "50", "55", "60", "65", "70", "None of these", "I don't know"],
    answer: 4,
    seed: 12,
  },
  {
    id: "VB.13",
    kind: "verbal",
    prompt: "Complete the analogy: Author is to book as composer is to …",
    options: ["Stage", "Score", "Audience", "Piano", "Ticket", "Curtain", "None of these", "I don't know"],
    answer: 2,
    seed: 13,
  },
  {
    id: "VB.14",
    kind: "verbal",
    prompt: "Which fraction is largest?",
    options: ["1/3", "2/7", "3/10", "3/8", "1/4", "2/9", "None of these", "I don't know"],
    answer: 4,
    seed: 14,
  },
  {
    id: "VB.15",
    kind: "verbal",
    prompt: "Select the word that best completes: She spoke with great ___ about the plan.",
    options: ["Ambiguity", "Clarity", "Humidity", "Geometry", "Inertia", "Silence", "None of these", "I don't know"],
    answer: 2,
    seed: 15,
  },
  {
    id: "VB.16",
    kind: "verbal",
    prompt: "If today is Wednesday, what day will it be 10 days from now?",
    options: ["Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Thursday", "None of these", "I don't know"],
    answer: 2,
    seed: 16,
  },
];

const LETTERS = ["A", "B", "C", "D", "E", "F", "None of these", "I don't know"];

/** Original iCAP matrix figures (local generative analogues). */
export const MATRIX_ITEMS: IcarItem[] = Array.from({ length: 11 }, (_, i) => ({
  id: `MX.${i + 1}`,
  kind: "matrix" as const,
  prompt: "Which option completes the matrix?",
  options: LETTERS,
  answer: (i % 6) + 1,
  figural: "matrix" as const,
  seed: 43 + i,
}));

/** Original iCAP die-rotation figures (local generative analogues). */
export const ROTATION_ITEMS: IcarItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: `RT.${i + 1}`,
  kind: "rotation" as const,
  prompt: "Which option is a rotation of the target cube? (not a mirror)",
  options: ["A", "B", "C", "D", "E", "F", "G", "H"],
  answer: (i % 8) + 1,
  figural: "rotation" as const,
  seed: 100 + i,
}));

export function allIcarItems() {
  return [...SERIES_ITEMS, ...VERBAL_ITEMS, ...MATRIX_ITEMS, ...ROTATION_ITEMS];
}
