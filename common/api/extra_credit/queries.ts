import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import { IGetAllHackersResponse } from "../hacker";
import {
  IAssignExtraCreditClassEntity,
  IExtraCreditAssignmentEntity,
  IExtraCreditClassCreateEntity,
  IExtraCreditClassEntity,
} from "./entity";
import { CreateEntity, QueryAction, QueryScope } from "api/types";

/**
 * Get all extra credit classes
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-User-Get_Extra_Credit_Classes
 */
export const getAllExtraCreditClasses: CreateQueryReturn<
  IExtraCreditClassEntity[]
> = createQuery("/users/extra-credit");

/**
 * Get all extra credit assignments
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Admin_Statistics-Get_Extra_Credit_Assignments
 */
export const getAllExtraCreditAssignments: CreateQueryReturn<
  IExtraCreditAssignmentEntity[]
> = createQuery("/admin/data?type=extra_credit_assignments");

/**
 * Get all assignments for a class
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-User-Get_Extra_Credit_Assignments_By_Class
 */
export const getAllAssignmentsByClass: CreateQueryReturn<IExtraCreditAssignmentEntity> =
  createQuery("/extra-credit/assignment?type=class");

/**
 * Get all assignments for a hacker
 * @param param (required)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-User-Get_Extra_Credit_Assignments_By_User
 */
export const getAllAssignmentsByHacker: CreateQueryReturn<
  IExtraCreditAssignmentEntity[],
  Pick<IGetAllHackersResponse, "uid">
> = createQuery("/users/extra-credit/assignment?type=user");

/**
 * Get an assignment for a hacker
 * @param param (required)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-User-Get_Extra_Credit_Assignments
 */
export const getAssignmentByHacker: CreateQueryReturn<
  IExtraCreditAssignmentEntity,
  Pick<IGetAllHackersResponse, "uid">
> = createQuery("/users/extra-credit/assignment");

/**
 * Create an extra credit class
 * @param entity (required)
 * @param param (optional)
 * @param token (optional)
 */
export const createExtraCreditClass: CreateMutationReturn<
  Omit<IExtraCreditClassCreateEntity, "uid">,
  IExtraCreditClassEntity
> = createMutation("/users/extra-credit/add-class");

export const assignExtraCreditClass: CreateMutationReturn<
  IAssignExtraCreditClassEntity,
  IExtraCreditAssignmentEntity
> = createMutation("/users/extra-credit");

/**
 * Delete all assignments by hacker
 * @param entity (required)
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-User-Remove_Extra_Credit_Assignment
 */
export const deleteAllAssignmentsByHacker: CreateMutationReturn<
  { userUid: string; hackathonUid: string },
  {}
> = createMutation("/users/extra-credit/delete-user");

/**
 * Delete an assignment
 * @param entity (required)
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-User-Remove_Extra_Credit_Assignment
 */
export const deleteAssignment: CreateMutationReturn<
  { uid: string; hackathonUid: string },
  {}
> = createMutation("/users/extra-credit/delete");

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
