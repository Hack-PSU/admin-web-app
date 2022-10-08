import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import { ISponsorshipEntity } from "./entity";
import { QueryAction, QueryScope } from "api/types";

/**
 * Get all Sponsors
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Sponsorship-Get_all_Sponsors
 */
export const getAllSponsors: CreateQueryReturn<ISponsorshipEntity[]> =
  createQuery("/sponsorship/all");

/**
 * Get a Sponsor by Uid
 * @param params ({ uid: number })
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Sponsorship-Get_Sponsor
 */
export const getSponsor: CreateQueryReturn<
  ISponsorshipEntity,
  { uid: number }
> = createQuery("/sponsorship");

/**
 * Create a Sponsor
 * @param entity (ISponsorshipEntity)
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Sponsorship-Insert_Sponsor
 */
export const createSponsor: CreateMutationReturn<ISponsorshipEntity> =
  createMutation("/sponsorship");

/**
 * Update a Sponsor
 * @param entity (Partial<ISponsorshipEntity>)
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Sponsorship-Update_Sponsor
 */
export const updateSponsor: CreateMutationReturn<
  Partial<ISponsorshipEntity>,
  ISponsorshipEntity
> = createMutation("/sponsorship/update");

/**
 * Delete a Sponsor
 * @param entity ({ uid: number })
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Sponsorship-Delete_Sponsor
 */
export const deleteSponsor: CreateMutationReturn<{ uid: number }, {}> =
  createMutation("/sponsorship/delete");

export const SponsorshipQueryKeys = {
  all: [{ entity: "sponsorship" }] as const,
  findAll: () =>
    [
      {
        ...SponsorshipQueryKeys.all[0],
        scope: QueryScope.ALL,
        action: QueryAction.query,
      },
    ] as const,
  findOne: (id?: number | string) =>
    [
      {
        ...SponsorshipQueryKeys.all[0],
        scope: id ?? QueryScope.ID,
        action: QueryAction.query,
      },
    ] as const,
  createOne: () =>
    [
      {
        ...SponsorshipQueryKeys.all[0],
        scope: QueryScope.NEW,
        action: QueryAction.create,
      },
    ] as const,
  updateOne: (id?: number | string) =>
    [
      {
        ...SponsorshipQueryKeys.all[0],
        scope: id ?? QueryScope.ID,
        action: QueryAction.update,
      },
    ] as const,
  deleteOne: (id?: number | string) =>
    [
      {
        ...SponsorshipQueryKeys.all[0],
        scope: id ?? QueryScope.ID,
        action: QueryAction.delete,
      },
    ] as const,
};
