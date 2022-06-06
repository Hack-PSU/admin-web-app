import { PaginatedQueryFn } from "types/hooks";
import {
  ApiResponse,
  CreateEntity,
  DeleteEntity,
  EventEndpointResponse,
  GetEntity,
  ICheckoutEntity,
  ICheckoutItemEntity,
  ICheckoutRequestResponse,
  IEventEntity,
  IGetAllCheckoutItemsResponse,
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
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Statistics-Get_list_of_all_users
 */
export const getAllHackers: PaginatedQueryFn<
  AxiosResponse<ApiResponse<IGetAllHackersResponse[]>>
> = async (offset, limit, token) =>
  api.get("/admin/data", {
    params: {
      type: "registration_stats",
      // ...(offset ? { offset } : {}),
      // ...(limit ? { limit } : {}),
    },
    ...(token
      ? {
          headers: {
            idtoken: token,
          },
        }
      : {}),
  });

/**
 * Get All Events
 * @param offset (optional)
 * @param limit (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Events-Get_events
 */
export const getAllEvents: PaginatedQueryFn<
  AxiosResponse<ApiResponse<IGetAllEventsResponse[]>>
> = async (offset, limit, token) =>
  api.get("/live/events", {
    params: {
      ...(offset ? { offset } : {}),
      ...(limit ? { limit } : {}),
    },
    ...(token
      ? {
          headers: {
            idtoken: token,
          },
        }
      : {}),
  });

/**
 * Get All Locations
 * @param offset (optional)
 * @param limit (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Location-Get_Location_List
 */
export const getAllLocations: PaginatedQueryFn<
  AxiosResponse<ApiResponse<LocationEndpointResponse[]>>
> = async (offset, limit, token) =>
  api.get("/admin/location", {
    params: {
      ...(offset ? { offset } : {}),
      ...(limit ? { limit } : {}),
    },
    ...(token
      ? {
          headers: {
            idtoken: token,
          },
        }
      : {}),
  });

/**
 * Get All Hackathons
 * @param offset (optional)
 * @param limit (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Get_Hackathons
 */
export const getAllHackathons: PaginatedQueryFn<
  AxiosResponse<ApiResponse<IHackathonEntity[]>>
> = async (offset, limit, token) =>
  api.get("/admin/hackathon", {
    params: {
      ...(offset ? { offset } : {}),
      ...(limit ? { limit } : {}),
    },
    ...(token
      ? {
          headers: {
            idtoken: token,
          },
        }
      : {}),
  });

/**
 * Get Hackathon Count
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-get_count_of_hackathon
 */
export const getHackathonCount: GetEntity<{ count: number }> = async (
  params,
  token
) =>
  api.get("/admin/hackathon/count", {
    ...(token
      ? {
          headers: {
            idtoken: token,
          },
        }
      : {}),
  });

/**
 * Get All Checked Out Items
 * @param params no params available here
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Item_Checkout-Get_list_of_checkout_out_items
 */
export const getAllCheckoutItems: GetEntity<
  IGetAllCheckoutItemsResponse
> = async (params, token) =>
  api.get("/admin/checkout", {
    ...(token
      ? {
          headers: {
            idtoken: token,
          },
        }
      : {}),
  });

/**
 * Get All Available Checkout Items
 * @param params no params available here - undefined
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Item_Checkout-Get_items_for_checkout
 */
export const getAllAvailableItems: GetEntity<ICheckoutItemEntity> = async (
  params,
  token
) =>
  api.get("/admin/checkout/items", {
    ...(token
      ? {
          headers: {
            idtoken: token,
          },
        }
      : {}),
  });

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
  LocationEndpointResponse
> = async (entity) => api.post("/admin/location", entity);

/**
 * Update A Location
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Location-Update_Location
 */
export const updateLocation: UpdateEntity<
  ILocationEntity,
  LocationEndpointResponse
> = async (entity) => api.post("/admin/location/update", entity);

/**
 * Delete A Location
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Location-Remove_Location
 */
export const deleteLocation: DeleteEntity<
  ILocationEntity,
  "uid",
  LocationEndpointResponse
> = async (entity) => api.post("/admin/location/delete", entity);

/**
 * Create an Event
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Events-New_Event
 */
export const createEvent: CreateEntity<
  IEventEntity,
  "uid",
  EventEndpointResponse
> = async (entity) => api.post("/live/events", entity);

/**
 * Update an Event
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Events-Update_Event
 */
export const updateEvent: UpdateEntity<
  IEventEntity,
  EventEndpointResponse
> = async (entity) => api.post("/live/events/update", entity);

/**
 * Delete an Event
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Events-Delete_Event
 */
export const deleteEvent: DeleteEntity<
  IEventEntity,
  "uid" | "hackathon",
  {}
> = async (entity) => api.post("/live/events/delete", entity);

/**
 * Create a Hackathon
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Add_new_hackathon
 */
export const createHackathon: CreateEntity<
  IHackathonEntity,
  "uid" | "base_pin" | "active",
  IHackathonEntity
> = async (entity) => api.post("/admin/hackathon", entity);

/**
 * Update a Hackathon
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Update_hackathon
 */
export const updateHackathon: UpdateEntity<
  IHackathonEntity,
  IHackathonEntity
> = async (entity) => api.post("/admin/hackathon/update", entity);

/**
 * Update Active Hackathon
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Add_Active_hackathon
 */
export const updateActiveHackathon: DeleteEntity<
  IHackathonEntity,
  "uid",
  IHackathonEntity
> = async (entity) => api.post("/admin/hackathon/active", entity);

/**
 * Create a Checkout Request
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Item_Checkout-Create_new_Item_Checkout
 */
export const createCheckoutRequest: CreateEntity<
  ICheckoutEntity,
  "uid" | "checkoutTime" | "hackathon" | "returnTime",
  ICheckoutRequestResponse
> = async (entity) => api.post("/admin/post", entity);

/**
 * Return a Checked Out Item
 * @param entity
 * @link https://api.hackpsu.org/v2/doc/#api-Item_Checkout-Return_checkout_item
 */
export const returnCheckoutItem: DeleteEntity<
  ICheckoutItemEntity,
  "uid",
  {}
> = async (entity) =>
  api.post("/admin/checkout/return", { checkoutId: entity.uid });
