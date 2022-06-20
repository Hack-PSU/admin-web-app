import { useStore } from "./store";

export const useEventStore = () => useStore((state) => state.eventStore);
export const useEventDispatch = () => useStore((state) => state.eventDispatch);
