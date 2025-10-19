import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import {
  OrganizerApplicationEntity,
  ApplicationsByTeamResponse,
  AcceptRejectDto,
  OrganizerTeam,
} from "./entity";
import { QueryAction, QueryScope } from "api/types";

/**
 * Get All Applications (Exec Only)
 */
export const getAllApplications: CreateQueryReturn<
  OrganizerApplicationEntity[]
> = createQuery("/organizer-applications");

/**
 * Get Applications by Team (Team Members)
 */
export const getApplicationsByTeam: CreateQueryReturn<
  ApplicationsByTeamResponse,
  { team: OrganizerTeam }
> = createQuery("/organizer-applications/by-team/:team");

/**
 * Get Single Application (Team Members)
 */
export const getApplicationById: CreateQueryReturn<
  OrganizerApplicationEntity,
  { id: number }
> = createQuery("/organizer-applications/:id");

/**
 * Submit Application (Public - handled via FormData)
 * Note: Use FormData directly for this endpoint
 */
export const submitApplication: CreateMutationReturn<
  FormData,
  OrganizerApplicationEntity
> = createMutation("/organizer-applications", "POST");

/**
 * Accept Application (Exec Only)
 */
export const acceptApplication: CreateMutationReturn<
  AcceptRejectDto,
  OrganizerApplicationEntity,
  { id: number }
> = createMutation("/organizer-applications/:id/accept", "PATCH");

/**
 * Reject Application (Exec Only)
 */
export const rejectApplication: CreateMutationReturn<
  AcceptRejectDto,
  OrganizerApplicationEntity,
  { id: number }
> = createMutation("/organizer-applications/:id/reject", "PATCH");

export const OrganizerApplicationKeys = {
  all: [{ entity: "organizer-application" }] as const,
  findAll: () =>
    [
      {
        ...OrganizerApplicationKeys.all[0],
        action: QueryAction.query,
        scope: QueryScope.ALL,
      },
    ] as const,
  findByTeam: (team: OrganizerTeam) =>
    [
      {
        ...OrganizerApplicationKeys.all[0],
        action: QueryAction.query,
        scope: team,
      },
    ] as const,
  findById: (id: string | number) =>
    [
      {
        ...OrganizerApplicationKeys.all[0],
        action: QueryAction.query,
        scope: id,
      },
    ] as const,
  accept: (id: string | number) =>
    [
      {
        ...OrganizerApplicationKeys.all[0],
        action: QueryAction.update,
        scope: `accept-${id}`,
      },
    ] as const,
  reject: (id: string | number) =>
    [
      {
        ...OrganizerApplicationKeys.all[0],
        action: QueryAction.update,
        scope: `reject-${id}`,
      },
    ] as const,
};
