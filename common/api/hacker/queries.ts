import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import { UserEntity } from "./entity";
import { QueryAction, QueryScope } from "api/types";

/**
 * Get All Users
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Statistics-Get_list_of_all_users
 */
export const getAllUsers: CreateQueryReturn<UserEntity[]> =
  createQuery("/users");

/**
 * Create a User
 */
export const createUser: CreateMutationReturn<UserEntity> =
  createMutation("/users");

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
