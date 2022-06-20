import create from "zustand";
import { eventStoreAction, eventStoreSlice } from "common/store/slices";
import { State } from "common/store/types";

export const useStore = create<State>((set) => ({
  eventStore: eventStoreSlice,
  eventDispatch: eventStoreAction(set),
}));
