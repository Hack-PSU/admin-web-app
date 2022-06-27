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

export interface IEventModel {
  eventType: IOption | null;
  eventName: string;
  eventLocation: IOption | null;
  eventDescription: RawDraftContentState;
  eventDate: {
    start: Date;
    end: Date;
  };
  wsPresenterNames: IOption[] | undefined;
  wsSkillLevel: IOption | undefined;
  wsRelevantSkills: IOption[] | undefined;
  wsUrls: string[] | undefined;
  eventImage: File | undefined;
  eventIcon: File | undefined;
}

export type EventActions =
  | "UPDATE_TYPE"
  | "UPDATE_DETAILS"
  | "UPDATE_WORKSHOP"
  | "UPDATE_IMAGE"
  | "UPDATE_ICON"
  | "CLEAR";

export const eventStoreSlice: ModelSlice<IEventModel> = {
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

export const eventStoreAction: StoreAction<EventActions> = (set) => {
  return (action, payload) => {
    set(
      produce((state: State) => {
        const currentState = state.eventStore;
        switch (action) {
          case "UPDATE_TYPE":
            if (payload) {
              currentState.eventType = payload.type;
            }
            break;
          case "UPDATE_DETAILS":
            if (payload) {
              currentState.eventName = payload.eventName;
              currentState.eventLocation = payload.eventLocation;
              currentState.eventDescription = payload.eventDescription;
              currentState.eventDate = payload.eventDate;
            }
            break;
          case "UPDATE_WORKSHOP":
            if (payload) {
              currentState.wsRelevantSkills = payload.wsRelevantSkills;
              currentState.wsSkillLevel = payload.wsSkillLevel;
              currentState.wsPresenterNames = payload.wsPresenterNames;
              currentState.wsUrls = payload.wsUrls;
            }
            break;
          case "UPDATE_IMAGE":
            if (payload) {
              currentState.eventImage = payload.eventImage;
            }
            break;
          case "UPDATE_ICON":
            if (payload) {
              currentState.eventIcon = payload.eventIcon;
            }
            break;
          case "CLEAR":
            currentState.eventType = eventStoreSlice.eventType;
            currentState.eventName = eventStoreSlice.eventName;
            currentState.eventLocation = eventStoreSlice.eventLocation;
            currentState.eventDescription = eventStoreSlice.eventDescription;
            currentState.eventDate = eventStoreSlice.eventDate;
            currentState.wsPresenterNames = eventStoreSlice.wsPresenterNames;
            currentState.wsSkillLevel = eventStoreSlice.wsSkillLevel;
            currentState.wsRelevantSkills = eventStoreSlice.wsRelevantSkills;
            currentState.wsUrls = eventStoreSlice.wsUrls;
            currentState.eventImage = eventStoreSlice.eventImage;
            currentState.eventIcon = eventStoreSlice.eventIcon;
            break;
        }
      })
    );
  };
};

export type EventStore = {
  eventStore: ModelSlice<IEventModel>;
  eventDispatch: StoreDispatch<EventActions>;
};
