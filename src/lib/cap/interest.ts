import { IP_ITEMS, RIASEC_ORDER, type RiasecKey } from "./interest-items.ts";
import type { InterestScores } from "./types";

export function hollandCode(means: Record<RiasecKey, number>): string {
  return [...RIASEC_ORDER]
    .sort((a, b) => means[b] - means[a] || RIASEC_ORDER.indexOf(a) - RIASEC_ORDER.indexOf(b))
    .slice(0, 3)
    .join("");
}

export function scoreInterest(responses: number[], items = IP_ITEMS): InterestScores {
  const bucket: Record<RiasecKey, { s: number; n: number }> = {
    R: { s: 0, n: 0 },
    I: { s: 0, n: 0 },
    A: { s: 0, n: 0 },
    S: { s: 0, n: 0 },
    E: { s: 0, n: 0 },
    C: { s: 0, n: 0 },
  };
  for (const it of items) {
    const v = responses[it.n - 1];
    if (!v) continue;
    bucket[it.scale].s += v;
    bucket[it.scale].n += 1;
  }
  const means = {} as Record<RiasecKey, number>;
  const sums = {} as Record<RiasecKey, number>;
  for (const k of RIASEC_ORDER) {
    sums[k] = bucket[k].s;
    means[k] = bucket[k].n ? +(bucket[k].s / bucket[k].n).toFixed(2) : 0;
  }
  return { means, sums, holland: hollandCode(means), responses };
}
