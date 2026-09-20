/** Pilot feedback survey — replace with your live Google Form URL after you create it. */
export const PILOT_FEEDBACK_FORM_URL =
  "https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_FORM_ID/viewform";

export const PILOT_CONSENT_VERSION = "2026-09-20-v1";

export type PilotConsentRecord = {
  version: string;
  acceptedAt: string;
  method: "checkbox";
};
