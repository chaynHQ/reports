import { create } from "zustand";

interface AppState {
  activeChapter: string | null;
  isAudioMuted: boolean;
  hasInteracted: boolean;
  setActiveChapter: (chapter: string | null) => void;
  setIsAudioMuted: (muted: boolean) => void;
  setHasInteracted: (interacted: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeChapter: null,
  isAudioMuted: true,
  hasInteracted: false,
  setActiveChapter: (chapter) => set({ activeChapter: chapter }),
  setIsAudioMuted: (muted) => set({ isAudioMuted: muted }),
  setHasInteracted: (interacted) => set({ hasInteracted: interacted }),
}));
