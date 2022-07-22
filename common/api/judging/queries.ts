import { IProjectEntity, IScoreEntity } from "./entities";
import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import { QueryAction, QueryScope } from "api/types";

/**
 * Get all projects (from Devpost)
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Judging-Get_All_Projects
 */
export const getAllProjects: CreateQueryReturn<IProjectEntity[]> = createQuery(
  "/judging/project/all"
);

/**
 * Get all scores
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Judging-Get_all_Scores
 */
export const getAllScores: CreateQueryReturn<IScoreEntity[]> =
  createQuery("/judging/score/all");

/**
 * Create a project
 * @param entity (required)
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Judging-Insert_Project
 */
export const createProject: CreateMutationReturn<
  Omit<IProjectEntity, "uid" | "hackathon">,
  IProjectEntity
> = createMutation("/judging/project");

export const JudgingProjectQueryKeys = {
  all: [{ entity: "judging_project" }] as const,
  findAll: () =>
    [
      {
        ...JudgingProjectQueryKeys.all[0],
        action: QueryAction.query,
        scope: QueryScope.ALL,
      },
    ] as const,
  createOne: () =>
    [
      {
        ...JudgingProjectQueryKeys.all[0],
        action: QueryAction.create,
        scope: QueryScope.NEW,
      },
    ] as const,
};

export const JudgingScoreQueryKeys = {
  all: [{ entity: "judging_score" }] as const,
  findAll: () =>
    [
      {
        ...JudgingScoreQueryKeys.all[0],
        action: QueryAction.query,
        scope: QueryScope.ALL,
      },
    ] as const,
  createOne: () =>
    [
      {
        ...JudgingScoreQueryKeys.all[0],
        action: QueryAction.create,
        scope: QueryScope.NEW,
      },
    ] as const,
};
