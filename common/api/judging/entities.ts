export interface IScoreEntity {
  uid: number;
  project_id: number;
  judge: string;
  creativity: number;
  technical: number;
  implementation: number;
  clarity: number;
  growth: number;
  submitted: boolean;
  humanitarian?: number;
  supply_chain?: number;
  environmental?: number;
}

export interface IGenerateJudgingEntity {
  judges: string[];
  projectsPerOrganizer: number;
}

export interface IProjectEntity {
  project: string;
  uid: number;
  hackathon: string;
}
