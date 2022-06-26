// import { AxiosResponse } from "axios";
//
//
//
// export type CreateEntity<TInput, TOmit extends keyof TInput, TResponse> = (
//   entity: Omit<TInput, TOmit>,
//   token?: string
// ) => Promise<AxiosResponse<ApiResponse<TResponse>> | undefined>;
//
// export type GetEntity<TResponse, TParams = any> = (
//   params?: TParams,
//   token?: string
// ) => Promise<AxiosResponse<ApiResponse<TResponse>> | undefined>;
//
// export type UpdateEntity<TInput, TResponse> = (
//   entity: Partial<TInput>,
//   extractId?: (entity: Partial<TInput>) => number | string,
//   token?: string
// ) => Promise<AxiosResponse<ApiResponse<TResponse>> | undefined>;
//
// export type DeleteEntity<TInput, TParams extends keyof TInput, TResponse> = (
//   entity: Pick<TInput, TParams>,
//   token?: string
// ) => Promise<AxiosResponse<ApiResponse<TResponse>>>;
//
// export interface IGetAllHackersResponse {
//   pre_uid?: string;
//   uid: string;
//   firstname: string;
//   lastname: string;
//   gender: string;
//   eighteenBeforeEvent: boolean;
//   shirt_size: string;
//   dietary_restriction?: string;
//   allergies?: string;
//   travel_reimbursement: boolean;
//   driving: boolean;
//   first_hackathon: boolean;
//   university: string;
//   email: string;
//   academic_year: string;
//   major: string;
//   resume?: string;
//   mlh_coc: boolean;
//   mlh_dcp: boolean;
//   phone: string;
//   address: string;
//   race: string;
//   coding_experience: string;
//   referral?: string;
//   project?: string;
//   submitted: boolean;
//   expectations?: string;
//   veteran: string;
//   pin: number;
//   share_address_mlh: boolean;
//   share_address_sponsors: boolean;
//   time: string;
//   hackathon: string;
//   name: string;
//   start_time: string;
//   end_time: string;
//   base_pin: number;
//   active: boolean;
//   user_id?: string;
//   rsvp_time?: string;
//   rsvp_status: boolean;
//   user_uid?: string;
// }
//
// export interface IGetAllEventsResponse {
//   uid: string;
//   event_location: number;
//   event_start_time: number;
//   event_end_time: number;
//   event_title: string;
//   event_description: string;
//   event_type: EventType;
//   event_icon?: string;
//   ws_presenter_names?: string;
//   ws_skill_level?: string;
//   ws_relevant_skills?: string;
//   hackathon: string;
//   location_name: string;
//   ws_urls: string[];
// }
//
// export interface ILocationEntity {
//   uid: number;
//   location_name: string;
// }
//
// export type LocationEndpointResponse = ILocationEntity;
//
// export interface IEventEntity {
//   uid: string;
//   eventLocation: number;
//   eventStartTime: number;
//   eventEndTime: number;
//   eventTitle: number;
//   eventDescription: string;
//   wsPresenterNames?: string;
//   wsSkillLevel?: string;
//   wsRelevantSkills?: string;
//   wsUrls?: string;
//   eventIcon: string;
//   eventType: EventType;
//   hackathon?: string;
// }
//
// export type EventEndpointResponse = IEventEntity;
//
// export interface IHackathonEntity {
//   uid: string;
//   name: string;
//   start_time: string;
//   end_time: string;
//   base_pin: number;
//   active: boolean;
// }
//
// export interface ICheckoutEntity {
//   uid?: number;
//   itemId: string;
//   userId: string;
//   checkoutTime: number;
//   returnTime?: number;
//   hackathon?: string;
// }
//
// export interface IGetAllCheckoutItemsResponse {
//   uid: number;
//   item_id: number;
//   user_id: string;
//   checkout_time: string;
//   return_time: string | null;
//   hackathon?: string;
//   firstname: string;
//   lastname: string;
//   name: string;
// }
//
// export interface ICheckoutRequestResponse {
//   item_id: number;
//   user_id: string;
//   checkout_time: number;
// }
//
// export interface ICheckoutItemEntity {
//   uid?: number;
//   name: string;
//   quantity: number;
// }
