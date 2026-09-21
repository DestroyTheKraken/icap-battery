import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { PILOT_FEEDBACK_FORM_URL } from "./pilot";

export type SendProfileEmailInput = {
  email: string;
  name: string;
  filename: string;
  markdown: string;
};

function buildEmailBody(name: string) {
  const who = name.trim() || "there";
  return `Hi ${who},

Thank you for taking the time to complete the iCAP pilot sitting. We are grateful you trusted us with that hour — it means a great deal as we refine this tool and the work around it.

Attached is your iCAP profile markdown file. Please keep it for your own records. You can upload it to Claude, Grok, or Gemini with the in-app chat starter whenever you are ready.

Quick reminder (same limits as in the app):
• iCAP is a career-discovery aid for this private pilot.
• It is not a clinical assessment, medical diagnosis, hiring screen, or a guarantee of school or job outcomes.
• Your answers stayed in your browser until you chose to export; share the file only if you want to.

If you are willing, we would sincerely appreciate one more minute of your help. A short survey helps us improve iCAP, supports Joshua’s career learning work, and shapes future products. There is no pressure — but we do hope you will fill it out:

${PILOT_FEEDBACK_FORM_URL}

Thank you again for your time and honesty.

Warm regards,
Joshua
iCAP pilot
`;
}

export const sendProfileEmail = createServerFn({ method: "POST" })
  .validator((input: SendProfileEmailInput) => {
    const email = String(input?.email ?? "")
      .trim()
      .toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }
    const markdown = String(input?.markdown ?? "");
    if (!markdown.trim()) throw new Error("Missing profile content.");
    const filename = String(input?.filename ?? "icap-profile.md").replace(/[^\w.\-]+/g, "_");
    const name = String(input?.name ?? "").trim();
    return { email, name, filename, markdown };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from =
      process.env.ICAP_EMAIL_FROM?.trim() || "iCAP Pilot <onboarding@resend.dev>";

    if (!apiKey) {
      return {
        ok: false as const,
        error:
          "Email sending is not configured yet (missing RESEND_API_KEY). Your file still downloaded.",
      };
    }

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: data.email,
      subject: "Your iCAP profile — thank you, and a one-minute ask",
      text: buildEmailBody(data.name),
      attachments: [
        {
          filename: data.filename.endsWith(".md") ? data.filename : `${data.filename}.md`,
          content: Buffer.from(data.markdown, "utf8"),
        },
      ],
    });

    if (result.error) {
      return { ok: false as const, error: result.error.message || "Email failed to send." };
    }

    return { ok: true as const, id: result.data?.id ?? null };
  });
