export enum EventType {
  WORKSHOP = "workshop",
  FOOD = "food",
  ACTIVITY = "activity",
}

export interface IEventEntity {
  uid: string;
  eventLocation: number;
  eventStartTime: number;
  eventEndTime: number;
  eventTitle: string;
  eventDescription: string;
  wsPresenterNames?: string;
  wsSkillLevel?: string;
  wsRelevantSkills?: string;
  wsUrls?: string;
  eventIcon: string | null;
  eventType: EventType;
  hackathon?: string;
}

export interface IGetAllEventsResponse {
  uid: string;
  event_location: number;
  event_start_time: string;
  event_end_time: string;
  event_title: string;
  event_description: string;
  event_type: EventType;
  event_icon?: string;
  ws_presenter_names?: string;
  ws_skill_level?: string;
  ws_relevant_skills?: string;
  hackathon: string;
  location_name: string;
  ws_urls: string[];
}
