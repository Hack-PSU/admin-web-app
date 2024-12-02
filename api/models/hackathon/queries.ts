import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import { HackathonEntity } from "./entity";
import { QueryAction, QueryScope } from "api/types";

/**
 * Get All Hackathons
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Get_Hackathons
 */
export const getAllHackathons: CreateQueryReturn<HackathonEntity[]> =
  createQuery("/hackathons");

export const getActiveHackathon: CreateQueryReturn<HackathonEntity[]> =
  createQuery("/hackathons?active=true");

/**
 * Create a Hackathon
 * @param entity
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Add_new_hackathon
 */
export const createHackathon: CreateMutationReturn<
  Omit<HackathonEntity, "id" | "active">,
  HackathonEntity
> = createMutation("/hackathons");

/**
 * Update a Hackathon
 * @param entity
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Hackathon-Update_hackathon
 */
export const updateHackathon: CreateMutationReturn<
  Partial<Omit<HackathonEntity, "id">>,
  HackathonEntity,
  { id: string }
> = createMutation("/hackathons/:id", "PATCH");

/**
 * Mark hackathon as active
 */
export const markActiveHackathon: CreateMutationReturn<
  {},
  HackathonEntity,
  { id: string }
> = createMutation("/hackathons/:id/active", "PATCH");

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
  updateOne: () =>
    [
      {
        ...HackathonKeys.all[0],
        action: QueryAction.update,
        scope: QueryScope.ID,
      },
    ] as const,
  delete: (id: string | number) =>
    [
      { ...HackathonKeys.all[0], action: QueryAction.delete, scope: id },
    ] as const,
};
