import { HEXACO_FACTORS, HEXACO_ITEMS, type HexacoItem } from "./hexaco-items";
import type { HexacoScores } from "./types";

export { HEXACO_FACTORS, HEXACO_ITEMS, type HexacoItem };

export function scoreHexaco(responses: number[]): HexacoScores {
  const recode = (item: HexacoItem, raw: number) =>
    item.reverse ? 6 - raw : raw;

  const factorSums: Record<string, { s: number; n: number }> = {};
  const facetSums: Record<string, { s: number; n: number }> = {};
  let altS = 0;
  let altN = 0;

  for (const item of HEXACO_ITEMS) {
    const raw = responses[item.n - 1];
    if (!raw) continue;
    const v = recode(item, raw);
    if (item.factor === "Altruism") {
      altS += v;
      altN += 1;
      continue;
    }
    factorSums[item.factor] ??= { s: 0, n: 0 };
    factorSums[item.factor].s += v;
    factorSums[item.factor].n += 1;
    facetSums[item.facet] ??= { s: 0, n: 0 };
    facetSums[item.facet].s += v;
    facetSums[item.facet].n += 1;
  }

  const mean = (x?: { s: number; n: number }) =>
    x && x.n ? +(x.s / x.n).toFixed(2) : 0;

  const factors: Record<string, number> = {};
  for (const f of HEXACO_FACTORS) factors[f] = mean(factorSums[f]);
  const facets: Record<string, number> = {};
  for (const [k, v] of Object.entries(facetSums)) facets[k] = mean(v);

  return {
    factors,
    facets,
    // Altruism interstitial is not part of the 60-item IPIP domain form.
    altruism: mean({ s: altS, n: altN }),
    responses,
  };
}

export const LIKERT = [
  { v: 1, label: "Strongly disagree" },
  { v: 2, label: "Disagree" },
  { v: 3, label: "Neutral" },
  { v: 4, label: "Agree" },
  { v: 5, label: "Strongly agree" },
] as const;
