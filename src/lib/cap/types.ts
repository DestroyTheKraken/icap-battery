export type InstrumentId =
  | "hexaco"
  | "icar"
  | "aospan"
  | "flanker"
  | "dccs"
  | "interest";

export type SessionStatus = "idle" | "in_progress" | "complete";

export type RunMode = "battery" | "single";

export type RiasecKey = "R" | "I" | "A" | "S" | "E" | "C";

export interface Citation {
  id: string;
  text: string;
  url?: string;
}

export interface HexacoScores {
  factors: Record<string, number>;
  facets: Record<string, number>;
  altruism: number;
  responses: number[];
}

export interface IcarScores {
  total: number;
  max: number;
  subtests: {
    series: { correct: number; max: number };
    verbal: { correct: number; max: number };
    matrix: { correct: number; max: number };
    rotation: { correct: number; max: number };
  };
  responses: Array<{ id: string; choice: number | null; correct: boolean }>;
}

export interface AospanScores {
  absolute: number;
  partialPct: number;
  mathAccuracy: number;
  trials: Array<{
    setSize: number;
    letters: string[];
    recalled: string[];
    mathOk: boolean;
    letterOk: boolean;
  }>;
}

export interface FlankerScores {
  congruent: { acc: number; rt: number };
  incongruent: { acc: number; rt: number };
  costMs: number;
  trials: Array<{
    congruent: boolean;
    target: "L" | "R";
    correct: boolean;
    rt: number | null;
    timeout: boolean;
  }>;
}

export interface DccsScores {
  pre: { acc: number; rt: number; n: number; correct: number };
  post: { acc: number; rt: number; n: number; correct: number };
  switchPass: boolean;
  trials: Array<{
    block: "shape" | "color";
    correct: boolean;
    rt: number | null;
  }>;
}

export interface InterestScores {
  means: Record<RiasecKey, number>;
  sums: Record<RiasecKey, number>;
  holland: string;
  responses: number[];
}

export interface CareerAnalysis {
  generatedAt: string;
  text: string;
}

export interface InstrumentResult {
  instrument: InstrumentId;
  startedAt: string;
  finishedAt: string;
  hexaco?: HexacoScores;
  icar?: IcarScores;
  aospan?: AospanScores;
  flanker?: FlankerScores;
  dccs?: DccsScores;
  interest?: InterestScores;
}

export interface CapSession {
  id: string;
  mode: RunMode;
  startedAt: string;
  finishedAt?: string;
  status: SessionStatus;
  currentIndex: number;
  results: Partial<Record<InstrumentId, InstrumentResult>>;
  careerAnalysis?: CareerAnalysis;
}
