import { OrganizerEntity } from "common/api/organizer/entity";

export interface ProjectEntity {
  id: number;
  name: string;
  hackathonId?: string;
}

export interface ScoreEntity {
  id: number;
  projectId: number;
  judgeId: number;
  creativity: number;
  technical: number;
  implementation: number;
  clarity: number;
  growth: number;
  submitted: boolean;
  challenge1: number;
  challenge2: number;
  challenge3: number;
}

export type ScoreJudgeEntity = Omit<OrganizerEntity, "privilege">;
export type ScoreProjectEntity = Omit<ProjectEntity, "hackathonId">;

export interface ScoreDataEntity
  extends Omit<ScoreEntity, "judgeId" | "projectId" | "hackathonId"> {
  project: ScoreProjectEntity;
  judge: ScoreJudgeEntity;
}

export interface ScoreBreakdownEntity extends Omit<ScoreDataEntity, "project"> {
  total: number;
}

export interface ProjectBreakdownEntity
  extends ProjectEntity,
    Omit<ScoreEntity, "id" | "projectId" | "judgeId"> {
  average: number;
  scores: ScoreBreakdownEntity[];
}

export interface GenerateJudgingEntity {
  users: string[];
  projects: number[];
  projectsPerUser: number;
}
