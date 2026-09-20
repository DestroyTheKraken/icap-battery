import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHAT_DESTINATIONS, CHAT_STARTER, profileFilename } from "@/lib/cap/chat-prompt";
import { downloadText, sessionMarkdown } from "@/lib/cap/export-md";
import { useCapStore } from "@/lib/cap/store";
import type { CapSession } from "@/lib/cap/types";

export function WhatsNext({ session }: { session: CapSession | null }) {
  const takerName = useCapStore((s) => s.takerName);
  const setTakerName = useCapStore((s) => s.setTakerName);
  const [copied, setCopied] = useState<"prompt" | "file" | null>(null);
  const [md, setMd] = useState<string | null>(null);
  const when = (session?.finishedAt ?? session?.startedAt ?? new Date().toISOString()).slice(0, 10);
  const filename = profileFilename(takerName, when);
  const ready = Boolean(session);

  const exportProfile = async () => {
    const text = sessionMarkdown(session, takerName);
    setMd(text);
    downloadText(filename, text);
    try {
      await navigator.clipboard.writeText(text);
      setCopied("file");
    } catch {
      setCopied(null);
    }
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(CHAT_STARTER);
      setCopied("prompt");
    } catch {
      const el = document.getElementById("capi-chat-starter");
      if (el instanceof HTMLTextAreaElement) {
        el.focus();
        el.select();
      }
      setCopied("prompt");
    }
  };

  return (
    <article className="panel panel-accent rounded-[var(--radius-xl)] border-2 border-accent/70 p-5 md:p-7">
      <p className="text-xs uppercase tracking-[0.22em] text-accent">What's next</p>
      <h2 className="mt-2 font-display text-3xl md:text-4xl">Take the profile to a chat.</h2>
      <p className="mt-3 max-w-prose text-sm text-muted">
        The numbers below are your profile. You do not have to know how they were built. Export
        the file, upload it to a free chat, paste the prompt. Use the job links on this page too —
        both together beat either one alone.
      </p>

      <ol className="mt-6 space-y-4 text-sm">
        <li className="flex gap-3">
          <span className="font-display text-xl text-accent">1</span>
          <div>
            <p className="text-fg">Find your CAP.</p>
            <p className="mt-1 text-muted">
              {ready ? (
                "You have a session in this browser."
              ) : (
                <>
                  Start from the{" "}
                  <Link to="/" className="underline decoration-border-strong underline-offset-4">
                    hub
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="font-display text-xl text-accent">2</span>
          <div className="min-w-0 flex-1">
            <p className="text-fg">Export your profile.</p>
            <p className="mt-1 text-muted">
              Name the file so you can find it later. Format:{" "}
              <span className="text-fg">{filename}</span>
            </p>
            <label className="mt-3 block">
              <span className="sr-only">Your name</span>
              <input
                value={takerName}
                onChange={(e) => setTakerName(e.target.value)}
                placeholder="Your name (goes on the file)"
                autoComplete="name"
                className="h-11 w-full max-w-md rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm text-fg placeholder:text-subtle"
              />
            </label>
            <Button className="mt-3" onClick={exportProfile} disabled={!ready}>
              <Download className="size-4" />
              Export profile
            </Button>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="font-display text-xl text-accent">3</span>
          <div>
            <p className="text-fg">Upload that file to a chat.</p>
            <p className="mt-1 text-muted">
              Free tiers work. Upload the markdown — do not paste this prompt without the file.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {CHAT_DESTINATIONS.map((d) => (
                <li key={d.name}>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noreferrer"
                    className="interactive inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-border-strong px-3 text-sm text-fg hover:border-accent/45 hover:bg-elevated"
                  >
                    {d.name}
                    <ExternalLink className="size-3.5 text-muted" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="font-display text-xl text-accent">4</span>
          <div className="min-w-0 flex-1">
            <p className="text-fg">Paste this prompt.</p>
            <div className="mt-3 overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg">
              <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
                <p className="text-xs uppercase tracking-[0.16em] text-subtle">Chat starter</p>
                <Button size="sm" variant="ghost" onClick={copyPrompt}>
                  {copied === "prompt" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied === "prompt" ? "Copied" : "Copy prompt"}
                </Button>
              </div>
              <textarea
                id="capi-chat-starter"
                readOnly
                value={CHAT_STARTER}
                className="max-h-48 w-full resize-y bg-transparent p-3 font-mono text-xs leading-relaxed text-muted"
              />
            </div>
          </div>
        </li>
      </ol>

      <div className="mt-8 border-t border-border pt-5">
        <p className="text-xs uppercase tracking-[0.18em] text-subtle">Then</p>
        <ol className="mt-3 space-y-2 text-sm">
          <li className="flex gap-3">
            <span className="font-display text-lg text-accent">1</span>
            <span className="text-fg">Read your results. Check them against people who actually do the work.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-display text-lg text-accent">2</span>
            <span className="text-fg">Begin your journey — one conversation, one application, or one program this week.</span>
          </li>
        </ol>
      </div>

      {md && (
        <div className="mt-6 rounded-[var(--radius-md)] border border-border bg-bg p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-subtle">
            {copied === "file"
              ? "Copied — also saved as a download if the browser allowed it"
              : "If download is blocked, copy from here"}
          </p>
          <textarea
            readOnly
            value={md}
            className="mt-2 max-h-48 w-full resize-y bg-transparent font-mono text-xs leading-relaxed text-muted"
          />
        </div>
      )}
    </article>
  );
}
