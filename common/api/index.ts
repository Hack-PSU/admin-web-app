import { PaginatedQueryFn } from "types/hooks";
import {
  CreateEntity,
  DeleteEntity,
  EventEndpointResponse,
  GetEntity,
  IEventEntity,
  IGetAllEventsResponse,
  IGetAllHackersResponse,
  IHackathonEntity,
  ILocationEntity,
  LocationEndpointResponse,
  UpdateEntity,
} from "types/api";
import api from "api/axios";
import { AxiosResponse } from "axios";

/**
 * Queries
 */

/**
 * Get All Hackers
 * @param offset (optional)
 * @param limit (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Statistics-Get_list_of_all_users
 */
export const getAllHackers: PaginatedQueryFn<
  AxiosResponse<IGetAllHackersResponse[]>
> = async (offset, limit) =>
  api.get<IGetAllHackersResponse[]>("/admin/data", {
    params: {
      type: "registration",
      offset: offset ?? 0,
      ...(limit ? { limit } : {}),
    },
  });

/**
 * Get All Events
 * @param offset (optional)
 * @param limit (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Events-Get_events
 */
export const getAllEvents: PaginatedQueryFn<
  AxiosResponse<IGetAllEventsResponse[]>
> = async (offset, limit) =>
  api.get<IGetAllEventsResponse[]>("/live/events", {
    // params: {
    // offset: offset ?? 0,
    // ...(limit ? { limit } : {}),
    // },
  });

/**
 * Get All Locations
 * @param offset (optional)
 * @param limit (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Location-Get_Location_List
 */
export const getAllLocations: PaginatedQueryFn<
  AxiosResponse<LocationEndpointResponse[]>
> = async (offset, limit) =>
  api.get("/admin/location", {
    params: {
      offset: offset ?? 0,
      ...(limit ? { limit } : {}),
    },
  });

/**
 * Get All Hackathons
 * @param offset (optional)
 * @param limit (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Get_Hackathons
 */
export const getAllHackathons: PaginatedQueryFn<
  AxiosResponse<IHackathonEntity[]>
> = async (offset, limit) =>
  api.get("/admin/hackathon", {
    params: {
      offset: offset ?? 0,
      ...(limit ? { limit } : {}),
    },
  });

/**
 * Get Hackathon Count
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-get_count_of_hackathon
 */
export const getHackathonCount: GetEntity<
  AxiosResponse<{ count: number }>
> = async () => api.get("/admin/hackathon/count");

/**
 * Mutations
 */

/**
 * Create A Location
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Location-Create_Location
 */
export const createLocation: CreateEntity<
  ILocationEntity,
  "uid",
  AxiosResponse<LocationEndpointResponse>
> = async (entity) => api.post("/admin/location", entity);

/**
 * Update A Location
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Location-Update_Location
 */
export const updateLocation: UpdateEntity<
  ILocationEntity,
  AxiosResponse<LocationEndpointResponse>
> = async (entity) => api.post("/admin/location/update", entity);

/**
 * Delete A Location
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Location-Remove_Location
 */
export const deleteLocation: DeleteEntity<
  ILocationEntity,
  "uid",
  AxiosResponse<LocationEndpointResponse>
> = async (entity) => api.post("/admin/location/delete", entity);

/**
 * Create an Event
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Events-New_Event
 */
export const createEvent: CreateEntity<
  IEventEntity,
  "uid",
  AxiosResponse<EventEndpointResponse>
> = async (entity) => api.post("/live/events", entity);

/**
 * Update an Event
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Events-Update_Event
 */
export const updateEvent: UpdateEntity<
  IEventEntity,
  AxiosResponse<EventEndpointResponse>
> = async (entity) => api.post("/live/events/update", entity);

/**
 * Delete an Event
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Events-Delete_Event
 */
export const deleteEvent: DeleteEntity<
  IEventEntity,
  "uid" | "hackathon",
  AxiosResponse<{}>
> = async (entity) => api.post("/live/events/delete", entity);

/**
 * Create a Hackathon
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Add_new_hackathon
 */
export const createHackathon: CreateEntity<
  IHackathonEntity,
  "uid" | "base_pin" | "active",
  AxiosResponse<IHackathonEntity>
> = async (entity) => api.post("/admin/hackathon", entity);

/**
 * Update a Hackathon
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Update_hackathon
 */
export const updateHackathon: UpdateEntity<
  IHackathonEntity,
  AxiosResponse<IHackathonEntity>
> = async (entity) => api.post("/admin/hackathon/update", entity);

/**
 * Update Active Hackathon
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Add_Active_hackathon
 */
export const updateActiveHackathon: DeleteEntity<
  IHackathonEntity,
  "uid",
  AxiosResponse<IHackathonEntity>
> = async (entity) => api.post("/admin/hackathon/active", entity);
