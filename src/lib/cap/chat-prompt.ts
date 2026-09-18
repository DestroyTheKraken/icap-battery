export const CHAT_STARTER = `I have attached my iCAP profile. If you cannot see an attached file, stop and ask me to upload it before doing anything else.

Treat the attached file as the source of truth for how I think, how I typically operate, how I handle daily work load, and what kinds of work I am drawn to. Then coach me in plain language:

1. In one short paragraph, describe the kind of worker and learner I appear to be.
2. Give me 8–12 education and job paths that fit. Mix trades, certificates, two-year, and four-year options when they fit. For each: the title, why it fits, and one first step (a person to talk to, a sample task, or a program to look up).
3. Give me 4–6 paths I should steer clear of unless I have a strong personal reason — and say why, without being cruel.
4. Propose a 90-day plan: one conversation, one skill sample I can show, and one application or enrollment action.
5. Where scores are missing or thin, say so. Do not invent them.

Do not diagnose. Do not promise a salary or an outcome. Do not flatter. Prefer specific job titles I can search tomorrow. If the file's commentary and its scores disagree, trust the scores.`;

export const CHAT_DESTINATIONS = [
  { name: "Claude", href: "https://claude.ai/new" },
  { name: "Grok", href: "https://grok.com" },
  { name: "Gemini", href: "https://gemini.google.com/app" },
] as const;

export function profileFilename(name: string, isoDate: string) {
  const date = isoDate.slice(0, 10);
  const slug =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "icap";
  return `${slug}-profile-${date}.md`;
}
