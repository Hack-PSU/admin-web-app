import { EventType } from "api";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { IOption } from "components/base/Select/types";

interface IEventBaseModel {
  type: IOption<EventType> | null;
  name: string;
  location: IOption<number> | null;
  description: string;
  date: {
    start: Date;
    end: Date;
  };
}

interface IWorkshopModel {
  wsPresenterNames: IOption[] | undefined;
  wsSkillLevel: IOption | undefined;
  wsRelevantSkills: IOption[] | undefined;
  wsUrls: string[] | undefined;
  icon: File | undefined;
}

type EventModel = IEventBaseModel & IWorkshopModel;

type EventSlice = EventModel & {
  updateType(type: IOption<EventType>): void;
  updateDetails(details: Omit<IEventBaseModel, "type">): void;
  updateWorkshop(details: Omit<IWorkshopModel, "icon">): void;
  updateIcon(icon: IWorkshopModel["icon"]): void;
  clear(): void;
};

const eventSliceDefaults: EventModel = {
  type: { value: EventType.ACTIVITY, label: "Activity" },
  name: "",
  location: null,
  date: {
    start: new Date(),
    end: new Date(),
  },
  description: { blocks: [], entityMap: {} },
  wsPresenterNames: undefined,
  wsSkillLevel: undefined,
  wsUrls: [],
  wsRelevantSkills: undefined,
  icon: undefined,
};

export const useEventStore = create<EventSlice, [["zustand/immer", never]]>(
  immer((set) => ({
    ...eventSliceDefaults,
    updateType: (type) =>
      set((draft) => {
        draft.type = type;
      }),
    updateDetails: (details) =>
      set((draft) => {
        draft.name = details.name;
        draft.location = details.location;
        draft.description = details.description;
        draft.date = details.date;
      }),
    updateWorkshop: (details) =>
      set((draft) => {
        draft.wsRelevantSkills = details.wsRelevantSkills;
        draft.wsSkillLevel = details.wsSkillLevel;
        draft.wsPresenterNames = details.wsPresenterNames;
        draft.wsUrls = details.wsUrls;
      }),
    updateIcon: (icon) =>
      set((draft) => {
        draft.icon = icon;
      }),
    clear: () =>
      set((draft) => {
        draft.type = eventSliceDefaults.type;
        draft.name = eventSliceDefaults.name;
        draft.location = eventSliceDefaults.location;
        draft.description = eventSliceDefaults.description;
        draft.date = eventSliceDefaults.date;
        draft.wsPresenterNames = eventSliceDefaults.wsPresenterNames;
        draft.wsSkillLevel = eventSliceDefaults.wsSkillLevel;
        draft.wsRelevantSkills = eventSliceDefaults.wsRelevantSkills;
        draft.wsUrls = eventSliceDefaults.wsUrls;
        draft.icon = eventSliceDefaults.icon;
      }),
  }))
);
