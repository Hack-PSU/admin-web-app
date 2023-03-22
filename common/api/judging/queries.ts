import {
  GenerateJudgingEntity,
  ProjectBreakdownEntity,
  ProjectEntity,
  ScoreDataEntity,
} from "./entities";
import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import { QueryAction, QueryScope } from "api/types";

/**
 * Get all projects
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Judging-Get_All_Projects
 */
export const getAllProjects: CreateQueryReturn<ProjectEntity[]> =
  createQuery("/judging/projects");

/**
 * Get all scores
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Judging-Get_all_Scores
 */
export const getAllScores: CreateQueryReturn<ScoreDataEntity[]> =
  createQuery("/judging/scores");

/**
 * Get a breakdown of scores by projects and each judge
 */
export const getScoreBreakdown: CreateQueryReturn<ProjectBreakdownEntity[]> =
  createQuery("/judging/breakdown");

/**
 * Create a project
 * @param entity (required)
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Judging-Insert_Project
 */
export const createProject: CreateMutationReturn<
  Omit<ProjectEntity, "id">,
  ProjectEntity
> = createMutation("/judging/projects");

/**
 * Generate judging assignments
 * @param entity (required)
 * @param param (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Judging-Generate_Judging_Assignments
 */
export const generateJudging: CreateMutationReturn<GenerateJudgingEntity, {}> =
  createMutation("/judging/scores/assign");

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
  createAll: () =>
    [
      {
        ...JudgingScoreQueryKeys.all[0],
        action: QueryAction.create,
        scope: QueryScope.ALL,
      },
    ] as const,
};
