import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CapSession, CareerAnalysis, InstrumentId, InstrumentResult } from "./types";
import { BATTERY_ORDER } from "./instruments";

function uid() {
  return crypto.randomUUID();
}

interface CapState {
  takerName: string;
  session: CapSession | null;
  setTakerName: (name: string) => void;
  startBattery: () => void;
  startSingle: (id: InstrumentId) => void;
  saveResult: (id: InstrumentId, result: InstrumentResult) => void;
  saveCareerAnalysis: (analysis: CareerAnalysis) => void;
  advance: () => void;
  reset: () => void;
}

export const useCapStore = create<CapState>()(
  persist(
    (set, get) => ({
      takerName: "",
      session: null,
      setTakerName: (takerName) => set({ takerName }),
      startBattery: () =>
        set({
          session: {
            id: uid(),
            mode: "battery",
            startedAt: new Date().toISOString(),
            status: "in_progress",
            currentIndex: 0,
            results: {},
          },
        }),
      startSingle: (id) => {
        const idx = BATTERY_ORDER.indexOf(id);
        set({
          session: {
            id: uid(),
            mode: "single",
            startedAt: new Date().toISOString(),
            status: "in_progress",
            currentIndex: idx,
            results: {},
          },
        });
      },
      saveResult: (id, result) => {
        const session = get().session;
        if (!session) return;
        set({
          session: {
            ...session,
            results: { ...session.results, [id]: result },
          },
        });
      },
      saveCareerAnalysis: (analysis) => {
        const session = get().session;
        if (!session) return;
        set({ session: { ...session, careerAnalysis: analysis } });
      },
      advance: () => {
        const session = get().session;
        if (!session) return;
        if (session.mode === "single") {
          set({
            session: {
              ...session,
              status: "complete",
              finishedAt: new Date().toISOString(),
            },
          });
          return;
        }
        const next = session.currentIndex + 1;
        if (next >= BATTERY_ORDER.length) {
          set({
            session: {
              ...session,
              currentIndex: next,
              status: "complete",
              finishedAt: new Date().toISOString(),
            },
          });
          return;
        }
        set({ session: { ...session, currentIndex: next } });
      },
      reset: () => set({ session: null }),
    }),
    { name: "cap-battery-v3" },
  ),
);
