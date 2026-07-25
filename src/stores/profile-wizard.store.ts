import { create } from "zustand";

import type {
  ProfileBasicsInput,
  ProfileLinksInput,
  ProfilePreferencesInput,
  ProfileStackInput,
} from "@/shared/schemas/profile.schema";

interface ProfileWizardState {
  step: number;
  basics: Partial<ProfileBasicsInput>;
  stack: Partial<ProfileStackInput>;
  preferences: Partial<ProfilePreferencesInput>;
  links: Partial<ProfileLinksInput>;
  resumeFile: File | null;

  setStep: (step: number) => void;
  next: () => void;
  back: () => void;
  setBasics: (data: Partial<ProfileBasicsInput>) => void;
  setStack: (data: Partial<ProfileStackInput>) => void;
  setPreferences: (data: Partial<ProfilePreferencesInput>) => void;
  setLinks: (data: Partial<ProfileLinksInput>) => void;
  setResumeFile: (file: File | null) => void;
  reset: () => void;
}

const TOTAL_STEPS = 4;

export const useProfileWizardStore = create<ProfileWizardState>((set) => ({
  step: 1,
  basics: {},
  stack: {},
  preferences: {},
  links: {},
  resumeFile: null,

  setStep: (step) => set({ step: Math.min(Math.max(step, 1), TOTAL_STEPS) }),
  next: () => set((s) => ({ step: Math.min(s.step + 1, TOTAL_STEPS) })),
  back: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  setBasics: (data) => set((s) => ({ basics: { ...s.basics, ...data } })),
  setStack: (data) => set((s) => ({ stack: { ...s.stack, ...data } })),
  setPreferences: (data) => set((s) => ({ preferences: { ...s.preferences, ...data } })),
  setLinks: (data) => set((s) => ({ links: { ...s.links, ...data } })),
  setResumeFile: (resumeFile) => set({ resumeFile }),
  reset: () =>
    set({ step: 1, basics: {}, stack: {}, preferences: {}, links: {}, resumeFile: null }),
}));
