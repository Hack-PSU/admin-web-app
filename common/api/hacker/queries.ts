import { createQuery, CreateQueryReturn } from "api/utils";
import { IGetAllHackersResponse } from "./entity";
import { QueryAction, QueryKeyFactory, QueryScope } from "api/types";

type GetAllHackersParams = { type: string };

/**
 * Get All Hackers
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Statistics-Get_list_of_all_users
 */
export const getAllHackers: CreateQueryReturn<
  IGetAllHackersResponse[],
  GetAllHackersParams
> = (params, token) =>
  createQuery<IGetAllHackersResponse[]>("/admin/data")(
    {
      type: "registration_stats",
      ...params,
    },
    token
  );

export const HackerKeys = {
  all: [{ entity: "hacker" }],
  findAll: () =>
    [
      {
        ...HackerKeys.all[0],
        action: QueryAction.query,
        scope: QueryScope.ALL,
      },
    ] as const,
  findById: (id: string | number) =>
    [{ ...HackerKeys.all[0], action: QueryAction.query, scope: id }] as const,
  update: (id: string | number) =>
    [{ ...HackerKeys.all[0], action: QueryAction.update, scope: id }] as const,
  delete: (id: string | number) =>
    [{ ...HackerKeys.all[0], action: QueryAction.delete, scope: id }] as const,
};
