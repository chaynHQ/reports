import { create } from "zustand";

// Read OS-level reduced-motion preference synchronously on the client.
// Returns false on the server (SSR); client components will initialise
// correctly once the store is first accessed in the browser.
const getOsReduceMotion = (): boolean =>
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

interface AppState {
  activeChapter: string | null;
  isAudioMuted: boolean;
  hasInteracted: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  setActiveChapter: (chapter: string | null) => void;
  setIsAudioMuted: (muted: boolean) => void;
  setHasInteracted: (interacted: boolean) => void;
  setReduceMotion: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeChapter: null,
  isAudioMuted: true,
  hasInteracted: false,
  reduceMotion: getOsReduceMotion(),
  highContrast: false,
  setActiveChapter: (chapter) => set({ activeChapter: chapter }),
  setIsAudioMuted: (muted) => set({ isAudioMuted: muted }),
  setHasInteracted: (interacted) => set({ hasInteracted: interacted }),
  setReduceMotion: (value) => set({ reduceMotion: value }),
  setHighContrast: (value) => set({ highContrast: value }),
}));
