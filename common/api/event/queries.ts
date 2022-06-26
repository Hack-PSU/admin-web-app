import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import { IEventEntity, IGetAllEventsResponse } from "./entity";
import { QueryAction, QueryScope } from "api/types";

/**
 * Get all events
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Events-Get_events
 */
export const getAllEvents: CreateQueryReturn<IGetAllEventsResponse[]> =
  createQuery("/live/events");

/**
 * Get an event
 * @param param (optional)
 * @param token (optional)
 */
export const getEvent: CreateQueryReturn<IGetAllEventsResponse> =
  createQuery<IGetAllEventsResponse>("/live/events");

/**
 * Create an event
 * @param entity (IEventEntity)
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Events-New_Event
 */
export const createEvent: CreateMutationReturn<
  Omit<IEventEntity, "uid">,
  IEventEntity
> = createMutation("/live/events");

/**
 * Update an event
 * @param entity (IEventEntity)
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Events-Update_Event
 */
export const updateEvent: CreateMutationReturn<
  Partial<IEventEntity>,
  IEventEntity
> = createMutation("/live/events/update");

/**
 * Delete an event
 * @param entity (uid: string, hackathon?: string)
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Events-Delete_Event
 */
export const deleteEvent: CreateMutationReturn<
  Pick<IEventEntity, "uid" | "hackathon">,
  {}
> = createMutation("/live/events/delete");

export const EventKeys = {
  all: [{ entity: "event" }] as const,
  findAll: () =>
    [
      { ...EventKeys.all[0], action: QueryAction.query, scope: QueryScope.ALL },
    ] as const,
  findById: (id: string | number) =>
    [{ ...EventKeys.all[0], action: QueryAction.query, scope: id }] as const,
  update: (id: string | number) =>
    [{ ...EventKeys.all[0], action: QueryAction.update, scope: id }] as const,
  delete: (id: string | number) =>
    [{ ...EventKeys.all[0], action: QueryAction.delete, scope: id }] as const,
};
