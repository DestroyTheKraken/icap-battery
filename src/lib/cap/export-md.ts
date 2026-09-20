import { cautionNotes, onetUrl, rankOccupations } from "./careers.ts";
import { HEXACO_FACTORS } from "./hexaco-items.ts";
import { RIASEC_LABEL, RIASEC_ORDER } from "./interest-items.ts";
import type { CapSession } from "./types.ts";

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

function nearThree(n: number) {
  return Math.abs(n - 3) <= 0.01;
}

/** Validity flags for the export coach block — computed from session numbers. */
export function validityLines(session: CapSession | null): string[] {
  const hex = session?.results.hexaco?.hexaco;
  const span = session?.results.aospan?.aospan;
  const flank = session?.results.flanker?.flanker;
  const cog = session?.results.icar?.icar;

  let affectLine: string;
  if (!hex) {
    affectLine = "- Affect spread: missing";
  } else {
    const flat = HEXACO_FACTORS.filter((f) => nearThree(hex.factors[f] ?? NaN)).length;
    affectLine =
      flat >= 5
        ? `- Affect spread: FLAG (${flat} of 6 factor means ≈ 3.00)`
        : `- Affect spread: OK (${flat} of 6 factor means ≈ 3.00)`;
  }

  let wmLine: string;
  if (!span || typeof span.mathAccuracy !== "number") {
    wmLine = "- Working memory: FLAG (math accuracy missing — absolute score is not usable)";
  } else if (span.mathAccuracy < 0.85) {
    wmLine = `- Working memory: FLAG (math accuracy ${pct(span.mathAccuracy)} < 85% — absolute score is not usable)`;
  } else {
    wmLine = `- Working memory: OK (math accuracy ${pct(span.mathAccuracy)})`;
  }

  let flankLine: string;
  if (!flank || typeof flank.costMs !== "number") {
    flankLine = "- Flanker: missing";
  } else if (flank.costMs < 0 || Math.abs(flank.costMs) < 20) {
    flankLine = `- Flanker: FLAG (conflict cost ${Math.round(flank.costMs)} ms)`;
  } else {
    flankLine = `- Flanker: OK (conflict cost ${Math.round(flank.costMs)} ms)`;
  }

  let cogLine: string;
  if (!cog) {
    cogLine = "- Cognition: missing";
  } else {
    cogLine = `- Cognition: raw total ${cog.total} / ${cog.max} (do not label as IQ)`;
  }

  return [
    "## Validity (read this before coaching)",
    "",
    affectLine,
    wmLine,
    flankLine,
    cogLine,
    "",
    "If any FLAG is present, do not treat Cognition, working memory, or Affect as a picture of the person. Ask before using those scores for job advice.",
    "",
    "### Sources",
    "- O*NET Interest Profiler: https://www.onetcenter.org/IP.html",
    "- My Next Move: https://www.mynextmove.org/",
    "- IPIP public-domain items: https://ipip.ori.org/",
    "",
  ];
}

export function sessionMarkdown(session: CapSession | null, takerName = "") {
  const hex = session?.results.hexaco?.hexaco;
  const icar = session?.results.icar?.icar;
  const span = session?.results.aospan?.aospan;
  const flank = session?.results.flanker?.flanker;
  const dccs = session?.results.dccs?.dccs;
  const interest = session?.results.interest?.interest;
  const when = (session?.finishedAt ?? session?.startedAt ?? new Date().toISOString()).slice(0, 10);
  const ranked = rankOccupations(session);
  const caution = cautionNotes(session);
  const who = takerName.trim() || "Unnamed test-taker";

  const lines: string[] = [
    `# iCAP profile — ${who}`,
    "",
    "This file is an iCAP career-discovery profile (Interest, Cognition, Affect, Process).",
    "It is meant to be **uploaded as an attachment** in a chat, then used with the iCAP coach prompt.",
    "Not a diagnosis. Not a guarantee of job fit. Scores are heuristics.",
    "",
    `- Name: ${who}`,
    `- Date: ${when}`,
    `- Battery: iCAP`,
    `- Mode: ${session?.mode ?? "none"}`,
    `- Session: ${session?.id ?? "none"}`,
    `- Status: ${session?.status ?? "idle"}`,
    "",
    "_AI makes mistakes, so always double check anything AI gives you._",
    "",
    ...validityLines(session),
  ];

  lines.push("## Interest (O*NET Interest Profiler Short Form)", "");
  if (interest) {
    lines.push(`- Holland code: **${interest.holland}**`);
    lines.push("");
    lines.push("| Theme | Mean (1–5) |");
    lines.push("| --- | ---: |");
    for (const k of RIASEC_ORDER) {
      lines.push(`| ${RIASEC_LABEL[k]} (${k}) | ${interest.means[k].toFixed(2)} |`);
    }
  } else {
    lines.push("_Not completed in this session._");
  }

  lines.push("", "## Cognition (iCAP problem solving)", "");
  if (icar) {
    lines.push(`- Total: **${icar.total} / ${icar.max}**`);
    for (const [k, v] of Object.entries(icar.subtests)) {
      lines.push(`- ${k}: ${v.correct} / ${v.max}`);
    }
  } else {
    lines.push("_Not completed in this session._");
  }

  lines.push("", "## Affect (IPIP six-factor)", "");
  if (hex) {
    lines.push("| Factor | Session mean (1–5) |");
    lines.push("| --- | ---: |");
    for (const f of HEXACO_FACTORS) {
      lines.push(`| ${f} | ${hex.factors[f].toFixed(2)} |`);
    }
  } else {
    lines.push("_Not completed in this session._");
  }

  lines.push("", "## Process", "");
  if (span) {
    lines.push("### Working memory (operation span procedure)");
    lines.push(`- Absolute score: **${span.absolute}**`);
    lines.push(`- Math accuracy: ${pct(span.mathAccuracy)}`);
    lines.push(`- Partial (set-correct): ${pct(span.partialPct)}`);
  } else {
    lines.push("### Working memory", "", "_Not completed._");
  }
  lines.push("");
  if (flank) {
    lines.push("### Focus in noise (arrow flanker)");
    lines.push(`- Congruent: ${pct(flank.congruent.acc)} · ${Math.round(flank.congruent.rt)} ms`);
    lines.push(
      `- Incongruent: ${pct(flank.incongruent.acc)} · ${Math.round(flank.incongruent.rt)} ms`,
    );
    lines.push(`- Conflict cost: **${Math.round(flank.costMs)} ms**`);
  } else {
    lines.push("### Focus in noise", "", "_Not completed._");
  }
  lines.push("");
  if (dccs) {
    lines.push("### Switching gears (dimensional card-sort)");
    lines.push(
      `- Pre-switch (shape): ${pct(dccs.pre.acc)} (${dccs.pre.correct}/${dccs.pre.n}) · ${Math.round(dccs.pre.rt)} ms`,
    );
    lines.push(
      `- Post-switch (color): ${pct(dccs.post.acc)} (${dccs.post.correct}/${dccs.post.n}) · ${Math.round(dccs.post.rt)} ms`,
    );
    lines.push(`- Switch: **${dccs.switchPass ? "Pass" : "Fail"}**`);
  } else {
    lines.push("### Switching gears", "", "_Not completed._");
  }

  lines.push("", "## Career search list", "");
  if (interest) {
    lines.push("Ranked from the profile. Starting points, not a verdict.");
    lines.push("");
    for (const occ of ranked) {
      lines.push(
        `- **${occ.title}** — ${occ.holland} · Job Zone ${occ.zone} · ${occ.cluster} · ${onetUrl(occ.onet)}`,
      );
    }
    if (caution.length) {
      lines.push("", "### Caution", "");
      for (const n of caution) lines.push(`- ${n}`);
    }
  } else {
    lines.push("_Complete the Interest Profiler to generate a search list._");
  }

  if (session?.careerAnalysis?.text) {
    lines.push("", "## AI interpretation", "");
    lines.push("_Heuristic only. Double check._");
    lines.push("");
    lines.push(session.careerAnalysis.text);
  }

  lines.push("");
  lines.push("_Scores stored locally in this browser only. No server-side profile archive._");
  return lines.join("\n");
}

export function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".md") ? filename : `${filename}.md`;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
