import { createServerFn } from "@tanstack/react-start";

export type ScoreBundle = {
  holland?: string;
  interest?: Record<string, number>;
  hexaco?: Record<string, number>;
  icar?: { total: number; max: number; subtests: Record<string, { correct: number; max: number }> };
  aospan?: { absolute: number; mathAccuracy: number };
  flanker?: { costMs: number; congruentAcc: number; incongruentAcc: number };
  dccs?: { switchPass: boolean; preAcc: number; postAcc: number };
  ranked?: string[];
};

export const interpretProfile = createServerFn({ method: "POST" })
  .validator((input: { scores: ScoreBundle }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI is not available in this environment." };

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 900,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are a blunt career-discovery analyst for iCAP (Cognition, Affect, Process, Interest). Write markdown in plain language. No diagnosis, no medical claims, no guaranteed outcomes. Be specific. Name occupations a person can search. If a path is a poor fit, say so plainly. Always end with: scores are heuristics; verify against real work samples, transcripts, and people in the job.",
          },
          {
            role: "user",
            content: `Interpret this CAP + interest profile for a student or career-changer. Return:
## Fit
(one paragraph)
## Search here first
(6-8 occupations with why)
## Steer clear — unless you have a strong reason
(3 occupations or clusters, with why)
## Education vs. career-change
(one short paragraph)

Scores JSON:
${JSON.stringify(data.scores)}`,
          },
        ],
      }),
    });
    if (!res.ok) {
      return { ok: false as const, error: `Analysis failed (${res.status}). Try again in a moment.` };
    }
    const body = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const text = body.choices[0]?.message.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "Empty analysis. Try again." };
    return { ok: true as const, text };
  });
