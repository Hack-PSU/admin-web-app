import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import { ECClassResponse, ExtraCreditClassEntity } from "./entity";
import { QueryAction, QueryScope } from "api/types";

/**
 * Get all extra credit classes
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-User-Get_Extra_Credit_Classes
 */
export const getAllExtraCreditClasses: CreateQueryReturn<
  ExtraCreditClassEntity[]
> = createQuery("/extra-credit/classes");

/**
 * Get all extra credit assignments
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Statistics-Get_Extra_Credit_Assignments
 */
export const getAllExtraCreditAssignments: CreateQueryReturn<
  ECClassResponse[]
> = createQuery("/extra-credit/assignments");

/**
 * Get all assignments for a hacker
 * @param param (required)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-User-Get_Extra_Credit_Assignments_By_User
 */
export const getAllAssignmentsByHacker: CreateQueryReturn<
  ExtraCreditClassEntity[],
  { id: string }
> = createQuery("/users/:id/extra-credit/classes");

/**
 * Create an extra credit class
 * @param entity (required)
 * @param param (optional)
 * @param token (optional)
 */
export const createExtraCreditClass: CreateMutationReturn<
  Omit<ExtraCreditClassEntity, "id" | "hackathonId">,
  ExtraCreditClassEntity
> = createMutation("/extra-credit/classes");

export const assignExtraCreditClass: CreateMutationReturn<
  {},
  {},
  { id: string; classId: string }
> = createMutation("/users/:id/extra-credit/assign/:classId");

/**
 * Delete an assignment
 * @param entity (required)
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-User-Remove_Extra_Credit_Assignment
 */
export const deleteAssignment: CreateMutationReturn<
  {},
  {},
  { id: string; classId: number }
> = createMutation("/users/:id/extra-credit/unassign/:classId");

export const ExtraCreditClassKeys = {
  all: [{ entity: "extra_credit_class" }] as const,
  findAll: () =>
    [
      {
        ...ExtraCreditClassKeys.all[0],
        action: QueryAction.query,
        scope: QueryScope.ALL,
      },
    ] as const,
  createOne: () =>
    [
      {
        ...ExtraCreditClassKeys.all[0],
        action: QueryAction.create,
        scope: QueryScope.NEW,
      },
    ] as const,
};

export const ExtraCreditAssignmentKeys = {
  all: [{ entity: "extra_credit_assignment" }] as const,
  findAll: () =>
    [
      {
        ...ExtraCreditAssignmentKeys.all[0],
        action: QueryAction.query,
        scope: QueryScope.ALL,
      },
    ] as const,
  findById: (id: number | string) =>
    [
      {
        ...ExtraCreditAssignmentKeys.all[0],
        action: QueryAction.query,
        scope: id,
      },
    ] as const,
  createOne: () =>
    [
      {
        ...ExtraCreditAssignmentKeys.all[0],
        action: QueryAction.create,
        scope: QueryScope.ID,
      },
    ] as const,
  deleteOne: () =>
    [
      {
        ...ExtraCreditAssignmentKeys.all[0],
        action: QueryAction.delete,
        scope: QueryScope.ID,
      },
    ] as const,
  deleteAll: () =>
    [
      {
        ...ExtraCreditAssignmentKeys.all[0],
        action: QueryAction.delete,
        scope: QueryScope.ALL,
      },
    ] as const,
};
