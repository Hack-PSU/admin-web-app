import { createQuery, CreateQueryReturn } from "api/utils";
import { RegistrationEntity } from "./entity";
import { QueryAction, QueryScope } from "api/types";

/**
 * Get all registrations
 * @param all - Set to true to return all registrations, false for current hackathon only
 */
export const getAllRegistrations: CreateQueryReturn<RegistrationEntity[], { all?: boolean }> = 
  createQuery("/registrations");

export const RegistrationKeys = {
  all: [{ entity: "registration" }] as const,
  findAll: (all?: boolean) =>
    [
      {
        ...RegistrationKeys.all[0],
        action: QueryAction.query,
        scope: all ? QueryScope.ALL : "active",
      },
    ] as const,
};