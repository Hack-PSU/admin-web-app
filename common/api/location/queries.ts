import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import { ILocationEntity, ILocationUpdateEntity } from "./entity";
import { QueryAction, QueryKeyFactory, QueryScope } from "api/types";

/**
 * Get All Locations
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Location-Get_Location_List
 */
export const getAllLocations: CreateQueryReturn<ILocationEntity[]> =
  createQuery("/admin/location");

/**
 * Create A Location
 * @param entity
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Location-Create_Location
 */
export const createLocation: CreateMutationReturn<
  Omit<ILocationUpdateEntity, "uid">,
  ILocationEntity
> = createMutation("/admin/location");

/**
 * Update A Location
 * @param entity
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Location-Update_Location
 */
export const updateLocation: CreateMutationReturn<
  Partial<ILocationUpdateEntity>,
  ILocationEntity
> = createMutation("/admin/location/update");

/**
 * Delete A Location
 * @param entity
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Location-Remove_Location
 */
export const deleteLocation: CreateMutationReturn<
  Pick<ILocationEntity, "uid">,
  ILocationEntity
> = createMutation("/admin/location/delete");

export const LocationKeys = {
  all: [{ entity: "location" }] as const,
  findAll: () =>
    [
      {
        ...LocationKeys.all[0],
        action: QueryAction.query,
        scope: QueryScope.ALL,
      },
    ] as const,
  findById: (id: string | number) =>
    [{ ...LocationKeys.all[0], action: QueryAction.query, scope: id }] as const,
  createOne: () =>
    [
      {
        ...LocationKeys.all[0],
        action: QueryAction.create,
        scope: QueryScope.NEW,
      },
    ] as const,
  update: (id: string | number) =>
    [
      { ...LocationKeys.all[0], action: QueryAction.update, scope: id },
    ] as const,
  delete: (id: string | number) =>
    [
      { ...LocationKeys.all[0], action: QueryAction.delete, scope: id },
    ] as const,
  updateBatch: () =>
    [
      {
        ...LocationKeys.all[0],
        action: QueryAction.updateBatch,
        scope: QueryScope.ALL,
      },
    ] as const,
};
