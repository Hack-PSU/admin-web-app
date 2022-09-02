import create from "zustand";
import { IHackathonEntity } from "api";
import { immer } from "zustand/middleware/immer";

interface IHackathonSlice {
  activeHackathon: IHackathonEntity | null;
  updateActiveHackathon(hackathon: IHackathonEntity): void;
}

export const useHackathonStore = create<
  IHackathonSlice,
  [["zustand/immer", never]]
>(
  immer((set) => ({
    activeHackathon: null,
    updateActiveHackathon: (hackathon: IHackathonEntity) =>
      set((draft) => {
        draft.activeHackathon = hackathon;
      }),
  }))
);
