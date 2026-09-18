import { HEXACO_NORMS_15 } from "./archive";
import { cautionNotes, onetUrl, rankOccupations } from "./careers";
import { HEXACO_FACTORS } from "./hexaco-items";
import { RIASEC_LABEL, RIASEC_ORDER } from "./interest-items";
import type { CapSession } from "./types";

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
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
    "This file is an iCAP career-discovery profile (Cognition, Affect, Process, Interest).",
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
    "## Affect (HEXACO-PI-R)",
    "",
  ];

  if (hex) {
    lines.push("| Factor | Session (1–5) | College mean | College SD |");
    lines.push("| --- | ---: | ---: | ---: |");
    for (const f of HEXACO_FACTORS) {
      const n = HEXACO_NORMS_15[f];
      lines.push(
        `| ${f} | ${hex.factors[f].toFixed(2)} | ${n.m.toFixed(2)} | ${n.sd.toFixed(2)} |`,
      );
    }
    const alt = HEXACO_NORMS_15.Altruism;
    lines.push(
      `| Altruism | ${hex.altruism.toFixed(2)} | ${alt.m.toFixed(2)} | ${alt.sd.toFixed(2)} |`,
    );
    lines.push("");
    lines.push("### Facets");
    lines.push("");
    for (const [k, v] of Object.entries(hex.facets)) {
      lines.push(`- ${k}: ${v.toFixed(2)}`);
    }
  } else {
    lines.push("_Not completed in this session._");
  }

  lines.push("", "## Cognition (ICAR-60)", "");
  if (icar) {
    lines.push(`- Total: **${icar.total} / ${icar.max}**`);
    for (const [k, v] of Object.entries(icar.subtests)) {
      lines.push(`- ${k}: ${v.correct} / ${v.max}`);
    }
  } else {
    lines.push("_Not completed in this session._");
  }

  lines.push("", "## Process", "");
  if (span) {
    lines.push("### Automated O-Span");
    lines.push(`- Absolute score: **${span.absolute}**`);
    lines.push(`- Math accuracy: ${pct(span.mathAccuracy)}`);
    lines.push(`- Partial (set-correct): ${pct(span.partialPct)}`);
  } else {
    lines.push("### Automated O-Span", "", "_Not completed._");
  }
  lines.push("");
  if (flank) {
    lines.push("### Flanker");
    lines.push(`- Congruent: ${pct(flank.congruent.acc)} · ${Math.round(flank.congruent.rt)} ms`);
    lines.push(
      `- Incongruent: ${pct(flank.incongruent.acc)} · ${Math.round(flank.incongruent.rt)} ms`,
    );
    lines.push(`- Conflict cost: **${Math.round(flank.costMs)} ms**`);
  } else {
    lines.push("### Flanker", "", "_Not completed._");
  }
  lines.push("");
  if (dccs) {
    lines.push("### DCCS");
    lines.push(
      `- Pre-switch (shape): ${pct(dccs.pre.acc)} (${dccs.pre.correct}/${dccs.pre.n}) · ${Math.round(dccs.pre.rt)} ms`,
    );
    lines.push(
      `- Post-switch (color): ${pct(dccs.post.acc)} (${dccs.post.correct}/${dccs.post.n}) · ${Math.round(dccs.post.rt)} ms`,
    );
    lines.push(`- Switch: **${dccs.switchPass ? "Pass" : "Fail"}**`);
  } else {
    lines.push("### DCCS", "", "_Not completed._");
  }

  lines.push("", "## Interest (O*NET Interest Profiler Short Form)", "");
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
