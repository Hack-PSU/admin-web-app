import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
  deleteQuery,
  DeleteQueryReturn,
} from "api/utils";
import { EventEntity } from "./entity";
import { QueryAction, QueryScope } from "api/types";

/**
 * Get all events
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Events-Get_events
 */
export const getAllEvents: CreateQueryReturn<EventEntity[]> =
  createQuery("/events");

/**
 * Get an event
 * @param param (optional)
 * @param token (optional)
 */
export const getEvent: CreateQueryReturn<EventEntity, { id: string }> =
  createQuery("/events/:id");

/**
 * Create an event
 * @param entity (IEventEntity)
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Events-New_Event
 */
export const createEvent: CreateMutationReturn<
  Omit<EventEntity, "id">,
  EventEntity
> = createMutation("/events");

export const createEventForm: CreateMutationReturn<FormData, EventEntity> =
  createMutation("/events");

/**
 * Update an event
 * @param entity (IEventEntity)
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Events-Update_Event
 */
export const updateEvent: CreateMutationReturn<
  FormData,
  EventEntity,
  { id: string }
> = createMutation("/events/:id", "PATCH");

/**
 * Delete an event
 * @param entity (uid: string, hackathon?: string)
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Events-Delete_Event
 */

export const deleteEvent = deleteQuery<{ id: string }>("events/:id");

export const EventKeys = {
  all: [{ entity: "event" }] as const,
  findAll: () =>
    [
      { ...EventKeys.all[0], action: QueryAction.query, scope: QueryScope.ALL },
    ] as const,
  findById: (...ids: (string | number)[]) =>
    [
      { ...EventKeys.all[0], action: QueryAction.query, scope: [...ids] },
    ] as const,
  update: (...ids: (string | number)[]) =>
    [
      { ...EventKeys.all[0], action: QueryAction.update, scope: [...ids] },
    ] as const,
  delete: (...ids: (string | number)[]) =>
    [
      { ...EventKeys.all[0], action: QueryAction.delete, scope: [...ids] },
    ] as const,
};
