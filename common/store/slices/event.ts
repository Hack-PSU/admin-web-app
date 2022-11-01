import { EventType } from "api";
import { RawDraftContentState } from "draft-js";
import {
  ModelSlice,
  State,
  StoreAction,
  StoreDispatch,
} from "common/store/types";
import { IOption } from "types/components";
import produce from "immer";
import create from "zustand";
import { immer } from "zustand/middleware/immer";

interface IEventBaseModel {
  eventType: IOption<EventType> | null;
  eventName: string;
  eventLocation: IOption<number> | null;
  eventDescription: RawDraftContentState;
  eventDate: {
    start: Date;
    end: Date;
  };
}

interface IWorkshopModel {
  wsPresenterNames: IOption[] | undefined;
  wsSkillLevel: IOption | undefined;
  wsRelevantSkills: IOption[] | undefined;
  wsUrls: string[] | undefined;
  eventImage: File | undefined;
  eventIcon: string | undefined;
}

type EventModel = IEventBaseModel & IWorkshopModel;

type EventSlice = EventModel & {
  updateType(type: IOption<EventType>): void;
  updateDetails(details: Omit<IEventBaseModel, "eventType">): void;
  updateWorkshop(
    details: Omit<IWorkshopModel, "eventImage" | "eventIcon">
  ): void;
  updateImage(image: IWorkshopModel["eventImage"]): void;
  updateIcon(icon: IWorkshopModel["eventIcon"]): void;
  clear(): void;
};

const eventSliceDefaults: EventModel = {
  eventType: { value: EventType.ACTIVITY, label: "Activity" },
  eventName: "",
  eventLocation: null,
  eventDate: {
    start: new Date(),
    end: new Date(),
  },
  eventDescription: { blocks: [], entityMap: {} },
  wsPresenterNames: undefined,
  wsSkillLevel: undefined,
  wsUrls: [],
  wsRelevantSkills: undefined,
  eventImage: undefined,
  eventIcon: undefined,
};

export const useEventStore = create<EventSlice, [["zustand/immer", never]]>(
  immer((set) => ({
    ...eventSliceDefaults,
    updateType: (type) =>
      set((draft) => {
        draft.eventType = type;
      }),
    updateDetails: (details) =>
      set((draft) => {
        draft.eventName = details.eventName;
        draft.eventLocation = details.eventLocation;
        draft.eventDescription = details.eventDescription;
        draft.eventDate = details.eventDate;
      }),
    updateWorkshop: (details) =>
      set((draft) => {
        draft.wsRelevantSkills = details.wsRelevantSkills;
        draft.wsSkillLevel = details.wsSkillLevel;
        draft.wsPresenterNames = details.wsPresenterNames;
        draft.wsUrls = details.wsUrls;
      }),
    updateImage: (image) =>
      set((draft) => {
        draft.eventImage = image;
      }),
    updateIcon: (icon) =>
      set((draft) => {
        draft.eventIcon = icon;
      }),
    clear: () =>
      set((draft) => {
        draft.eventType = eventSliceDefaults.eventType;
        draft.eventName = eventSliceDefaults.eventName;
        draft.eventLocation = eventSliceDefaults.eventLocation;
        draft.eventDescription = eventSliceDefaults.eventDescription;
        draft.eventDate = eventSliceDefaults.eventDate;
        draft.wsPresenterNames = eventSliceDefaults.wsPresenterNames;
        draft.wsSkillLevel = eventSliceDefaults.wsSkillLevel;
        draft.wsRelevantSkills = eventSliceDefaults.wsRelevantSkills;
        draft.wsUrls = eventSliceDefaults.wsUrls;
        draft.eventImage = eventSliceDefaults.eventImage;
        draft.eventIcon = eventSliceDefaults.eventIcon;
      }),
  }))
);

// export const eventStoreSlice: ModelSlice<IEventModel> = {
//   eventType: { value: EventType.ACTIVITY, label: "Activity" },
//   eventName: "",
//   eventLocation: null,
//   eventDate: {
//     start: new Date(),
//     end: new Date(),
//   },
//   eventDescription: { blocks: [], entityMap: {} },
//   wsPresenterNames: undefined,
//   wsSkillLevel: undefined,
//   wsUrls: [],
//   wsRelevantSkills: undefined,
//   eventImage: undefined,
//   eventIcon: undefined,
// };
//
// export const eventStoreAction: StoreAction<EventActions> = (set) => {
//   return (action, payload) => {
//     set(
//       produce((state: State) => {
//         const currentState = state.eventStore;
//         switch (action) {
//           case "UPDATE_TYPE":
//             if (payload) {
//               currentState.eventType = payload.type;
//             }
//             break;
//           case "UPDATE_DETAILS":
//             if (payload) {
//               currentState.eventName = payload.eventName;
//               currentState.eventLocation = payload.eventLocation;
//               currentState.eventDescription = payload.eventDescription;
//               currentState.eventDate = payload.eventDate;
//             }
//             break;
//           case "UPDATE_WORKSHOP":
//             if (payload) {
//               currentState.wsRelevantSkills = payload.wsRelevantSkills;
//               currentState.wsSkillLevel = payload.wsSkillLevel;
//               currentState.wsPresenterNames = payload.wsPresenterNames;
//               currentState.wsUrls = payload.wsUrls;
//             }
//             break;
//           case "UPDATE_IMAGE":
//             if (payload) {
//               currentState.eventImage = payload.eventImage;
//             }
//             break;
//           case "UPDATE_ICON":
//             if (payload) {
//               currentState.eventIcon = payload.eventIcon;
//             }
//             break;
//           case "CLEAR":
//             currentState.eventType = eventStoreSlice.eventType;
//             currentState.eventName = eventStoreSlice.eventName;
//             currentState.eventLocation = eventStoreSlice.eventLocation;
//             currentState.eventDescription = eventStoreSlice.eventDescription;
//             currentState.eventDate = eventStoreSlice.eventDate;
//             currentState.wsPresenterNames = eventStoreSlice.wsPresenterNames;
//             currentState.wsSkillLevel = eventStoreSlice.wsSkillLevel;
//             currentState.wsRelevantSkills = eventStoreSlice.wsRelevantSkills;
//             currentState.wsUrls = eventStoreSlice.wsUrls;
//             currentState.eventImage = eventStoreSlice.eventImage;
//             currentState.eventIcon = eventStoreSlice.eventIcon;
//             break;
//         }
//       })
//     );
//   };
// };
//
// export type EventStore = {
//   eventStore: ModelSlice<IEventModel>;
//   eventDispatch: StoreDispatch<EventActions>;
// };
