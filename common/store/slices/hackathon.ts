import create from "zustand";
import { HackathonEntity } from "api";
import { immer } from "zustand/middleware/immer";

interface IHackathonSlice {
  activeHackathon: HackathonEntity | null;

  updateActiveHackathon(hackathon: HackathonEntity): void;
}

export const useHackathonStore = create<
  IHackathonSlice,
  [["zustand/immer", never]]
>(
  immer((set) => ({
    activeHackathon: null,
    updateActiveHackathon: (hackathon: HackathonEntity) =>
      set((draft) => {
        draft.activeHackathon = hackathon;
      }),
  }))
);
