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

export const ICAR_SERIES: IcarItem[] = [
  {
    id: "LN.01",
    kind: "series",
    prompt: "In the following number series, what number comes next?\n64, 81, 100, 121, 144, …",
    options: ["154", "156", "162", "169", "178", "196", "None of these", "I don't know"],
    answer: 4,
    seed: 1,
  },
  {
    id: "LN.03",
    kind: "series",
    prompt: "In the following number series, what number comes next?\n4, 7, 11, 18, 29, …",
    options: ["37", "39", "46", "47", "49", "55", "None of these", "I don't know"],
    answer: 4,
    seed: 3,
  },
  {
    id: "LN.05",
    kind: "series",
    prompt: "In the following alphanumeric series, what letter comes next?\nC, F, I, L, O, …",
    options: ["Q", "R", "S", "T", "U", "V", "None of these", "I don't know"],
    answer: 2,
    seed: 5,
  },
  {
    id: "LN.06",
    kind: "series",
    prompt: "In the following alphanumeric series, what letter comes next?\nH, J, F, H, D, …",
    options: ["D", "E", "F", "G", "H", "I", "None of these", "I don't know"],
    answer: 3,
    seed: 6,
  },
  {
    id: "LN.07",
    kind: "series",
    prompt: "In the following alphanumeric series, what letter comes next?\nK, N, P, S, U, …",
    options: ["S", "T", "U", "V", "W", "X", "None of these", "I don't know"],
    answer: 6,
    seed: 7,
  },
  {
    id: "LN.33",
    kind: "series",
    prompt: "In the following alphanumeric series, what letter comes next?\nV, Q, M, J, H, …",
    options: ["E", "F", "G", "H", "I", "J", "None of these", "I don't know"],
    answer: 3,
    seed: 33,
  },
  {
    id: "LN.34",
    kind: "series",
    prompt: "In the following alphanumeric series, what letter comes next?\nI, J, L, O, S, …",
    options: ["T", "U", "V", "X", "Y", "Z", "None of these", "I don't know"],
    answer: 4,
    seed: 34,
  },
  {
    id: "LN.35",
    kind: "series",
    prompt: "In the following alphanumeric series, what letter comes next?\nZ, W, X, U, V, …",
    options: ["R", "S", "T", "U", "V", "W", "None of these", "I don't know"],
    answer: 2,
    seed: 35,
  },
  {
    id: "LN.58",
    kind: "series",
    prompt: "In the following alphanumeric series, what letter comes next?\nQ, S, N, P, L, …",
    options: ["J", "H", "I", "N", "M", "L", "None of these", "I don't know"],
    answer: 4,
    seed: 58,
  },
];

export const ICAR_VERBAL: IcarItem[] = [
  {
    id: "VR.04",
    kind: "verbal",
    prompt: "What number is one fifth of one fourth of one ninth of 900?",
    options: ["2", "3", "4", "5", "6", "7", "None of these", "I don't know"],
    answer: 4,
    seed: 4,
  },
  {
    id: "VR.09",
    kind: "verbal",
    prompt: "Please mark the word that does not match the other words:",
    options: ["Sycamore", "Buckeye", "Elm", "Daffodil", "Hickory", "Sequoia", "They all match", "I don't know"],
    answer: 4,
    seed: 9,
  },
  {
    id: "VR.11",
    kind: "verbal",
    prompt: 'The opposite of a "stubborn" person is a "_____" person.',
    options: ["Flexible", "Passionate", "Mediocre", "Reserved", "Pigheaded", "Persistent", "None of these", "I don't know"],
    answer: 1,
    seed: 11,
  },
  {
    id: "VR.13",
    kind: "verbal",
    prompt: "Michelle likes 96 but not 45; she also likes 540 but not 250. Which does she like?",
    options: ["86", "93", "98", "128", "132", "140", "None of these", "I don't know"],
    answer: 5,
    seed: 13,
  },
  {
    id: "VR.14",
    kind: "verbal",
    prompt: "Adam and Melissa went fly-fishing and caught a total of 32 salmon. Melissa caught three times as many salmon as Adam. How many salmon did Adam catch?",
    options: ["7", "8", "9", "10", "11", "12", "None of these", "I don't know"],
    answer: 2,
    seed: 14,
  },
  {
    id: "VR.16",
    kind: "verbal",
    prompt: "Zach is taller than Matt and Richard is shorter than Zach. Which of the following statements would be most accurate?",
    options: [
      "Richard is taller than Matt",
      "Richard is shorter than Matt",
      "Richard is as tall as Matt",
      "It's impossible to tell",
      "Richard is taller than Zach",
      "Zach is shorter than Matt",
      "None of these",
      "I don't know",
    ],
    answer: 4,
    seed: 16,
  },
  {
    id: "VR.17",
    kind: "verbal",
    prompt: "Joshua is 12 years old and his sister is three times as old as he. When Joshua is 23 years old, how old will his sister be?",
    options: ["35", "39", "44", "47", "53", "57", "None of these", "I don't know"],
    answer: 4,
    seed: 17,
  },
  {
    id: "VR.18",
    kind: "verbal",
    prompt: "The sixth month of the year is:",
    options: ["September", "July", "May", "August", "June", "April", "None of these", "I don't know"],
    answer: 5,
    seed: 18,
  },
  {
    id: "VR.19",
    kind: "verbal",
    prompt: "If the day after tomorrow is two days before Thursday then what day is it today?",
    options: ["Friday", "Monday", "Wednesday", "Saturday", "Tuesday", "Sunday", "None of these", "I don't know"],
    answer: 6,
    seed: 19,
  },
  {
    id: "VR.23",
    kind: "verbal",
    prompt: "Please mark the word that does not match the other words:",
    options: ["Buenos Aires", "Melbourne", "Seattle", "Cairo", "Morocco", "Milan", "None of these", "I don't know"],
    answer: 5,
    seed: 23,
  },
  {
    id: "VR.26",
    kind: "verbal",
    prompt: 'The opposite of an "affable" person is a(n) "_____" person.',
    options: ["Angry", "Sociable", "Gracious", "Frustrated", "Reserved", "Ungrateful", "None of these", "I don't know"],
    answer: 5,
    seed: 26,
  },
  {
    id: "VR.31",
    kind: "verbal",
    prompt: "Isaac is shorter than George and Phillip is taller than George. Which of the following statements is most accurate?",
    options: [
      "Phillip is taller than Isaac",
      "Phillip is shorter than Isaac",
      "Phillip is as tall as Isaac",
      "It is impossible to tell",
      "Isaac is taller than George",
      "George is taller than Phillip",
      "None of these",
      "I don't know",
    ],
    answer: 1,
    seed: 31,
  },
  {
    id: "VR.32",
    kind: "verbal",
    prompt: "If the day before yesterday is three days after Saturday then what day is today?",
    options: ["Thursday", "Saturday", "Wednesday", "Friday", "Sunday", "Tuesday", "None of these", "I don't know"],
    answer: 1,
    seed: 32,
  },
  {
    id: "VR.36",
    kind: "verbal",
    prompt: 'The opposite of an "ambiguous" situation is a(n) "_____" situation.',
    options: ["suspicious", "vague", "unequivocal", "intelligent", "dubious", "genuine", "None of these", "I don't know"],
    answer: 3,
    seed: 36,
  },
  {
    id: "VR.39",
    kind: "verbal",
    prompt: "How many total legs do three cows and four chickens have?",
    options: ["16", "18", "20", "21", "22", "24", "None of these", "I don't know"],
    answer: 3,
    seed: 39,
  },
  {
    id: "VR.42",
    kind: "verbal",
    prompt: "The 4th planet from the sun is:",
    options: ["Jupiter", "Saturn", "Pluto", "Earth", "Mars", "Venus", "None of these", "I don't know"],
    answer: 5,
    seed: 42,
  },
];

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export const ICAR_MATRIX: IcarItem[] = Array.from({ length: 11 }, (_, i) => ({
  id: `MR.local.${i + 1}`,
  kind: "matrix" as const,
  prompt: "Which option completes the matrix?",
  options: [...LETTERS, "None of these", "I don't know"],
  answer: (i % 6) + 1,
  figural: "matrix" as const,
  seed: 43 + i,
}));

export const ICAR_ROTATION: IcarItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: `R3D.local.${i + 1}`,
  kind: "rotation" as const,
  prompt: "Which option is a rotation of the target die? (not a mirror)",
  options: ["A", "B", "C", "D", "E", "F", "G", "H"],
  answer: (i % 8) + 1,
  figural: "rotation" as const,
  seed: 100 + i,
}));

export function allIcarItems() {
  return [...ICAR_SERIES, ...ICAR_VERBAL, ...ICAR_MATRIX, ...ICAR_ROTATION];
}
