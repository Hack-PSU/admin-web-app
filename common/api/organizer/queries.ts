import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import { IOrganizerEntity } from "./entity";
import { QueryAction, QueryScope } from "api/types";

/**
 * Gets all organizers for the active hackathon
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin-Get_All_Organizers
 */
export const getAllOrganizers: CreateQueryReturn<IOrganizerEntity[]> =
  createQuery("/admin/organizers/all");

/**
 * Gets an organizer using their Firebase UID
 * @param params (required): The Firebase UID of the user
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin-Get_Organizer
 */
export const getOrganizer: CreateQueryReturn<
  IOrganizerEntity,
  { uid: string }
> = createQuery("/admin/organizer");

/**
 * Creates an organizer
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin-Add_Organizer
 */
export const createOrganizer: CreateMutationReturn<IOrganizerEntity> =
  createMutation("/admin/organizer");

/**
 * Updates an organizer
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin-Delete_Organizer
 */
export const updateOrganizer: CreateMutationReturn<
  Partial<IOrganizerEntity>,
  IOrganizerEntity
> = createMutation("/admin/organizer/update");

export const OrganizerQueryKeys = {
  all: [{ entity: "organizer" }] as const,
  findAll: () =>
    [
      {
        ...OrganizerQueryKeys.all[0],
        action: QueryAction.query,
        scope: QueryScope.ALL,
      },
    ] as const,
  findOne: (id: string | number) =>
    [
      {
        ...OrganizerQueryKeys.all[0],
        action: QueryAction.query,
        scope: id,
      },
    ] as const,
  createOne: () =>
    [
      {
        ...OrganizerQueryKeys.all[0],
        action: QueryAction.create,
        scope: QueryScope.NEW,
      },
    ] as const,
  updateOne: () =>
    [
      {
        ...OrganizerQueryKeys.all[0],
        action: QueryAction.update,
        scope: QueryScope.ID,
      },
    ] as const,
};
