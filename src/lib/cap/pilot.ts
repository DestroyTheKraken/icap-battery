/** Pilot feedback survey — replace with your live Google Form URL after you create it. */
export const PILOT_FEEDBACK_FORM_URL = "https://forms.gle/6L8stWZ2JzaHjRtS6";

export const PILOT_CONSENT_VERSION = "2026-09-20-v1";

export type PilotConsentRecord = {
  version: string;
  acceptedAt: string;
  method: "checkbox";
};
