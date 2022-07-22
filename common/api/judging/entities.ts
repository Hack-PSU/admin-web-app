export interface IScoreEntity {
  project_id: number;
  judge: string;
  creativity: number;
  technical: number;
  implementation: number;
  clarity: number;
  growth: number;
  humanitarian?: number;
  supply_chain?: number;
  environmental?: number;
}

export interface IProjectEntity {
  project: string;
  uid: number;
  hackathon: string;
}
