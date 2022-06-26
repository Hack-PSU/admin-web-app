import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import { IHackathonEntity } from "./entity";
import { QueryAction, QueryKeyFactory, QueryScope } from "api/types";

/**
 * Get All Hackathons
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Get_Hackathons
 */
export const getAllHackathons: CreateQueryReturn<IHackathonEntity[]> =
  createQuery("/admin/hackathon");

/**
 * Get Hackathon Count
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-get_count_of_hackathon
 */
export const getHackathonCount: CreateQueryReturn<{ count: number }> =
  createQuery("/admin/hackathon/count");

/**
 * Create a Hackathon
 * @param entity
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Add_new_hackathon
 */
export const createHackathon: CreateMutationReturn<
  Omit<IHackathonEntity, "uid" | "base_pin" | "active">,
  IHackathonEntity
> = createMutation("/admin/hackathon");

/**
 * Update a Hackathon
 * @param entity
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Update_hackathon
 */
export const updateHackathon: CreateMutationReturn<
  Partial<IHackathonEntity>,
  IHackathonEntity
> = createMutation("/admin/hackathon/update");

/**
 * Update Active Hackathon
 * @param entity
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Add_Active_hackathon
 */
export const updateActiveHackathon: CreateMutationReturn<
  Pick<IHackathonEntity, "uid">,
  IHackathonEntity
> = createMutation("/admin/hackathon/active");

export const HackathonKeys = {
  all: [{ entity: "hackathon" }] as const,
  findAll: () =>
    [
      {
        ...HackathonKeys.all[0],
        action: QueryAction.query,
        scope: QueryScope.ALL,
      },
    ] as const,
  findById: (id: string | number) =>
    [
      { ...HackathonKeys.all[0], action: QueryAction.query, scope: id },
    ] as const,
  update: (id: string | number) =>
    [
      { ...HackathonKeys.all[0], action: QueryAction.update, scope: id },
    ] as const,
  delete: (id: string | number) =>
    [
      { ...HackathonKeys.all[0], action: QueryAction.delete, scope: id },
    ] as const,
};
