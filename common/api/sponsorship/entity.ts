export interface SponsorEntity {
  id: number;
  name: string;
  level: string;
  logo: string;
  order: number;
  link?: string;
  hackathonId?: string;
}

export type PatchBatchSponsor = Partial<
  Omit<SponsorEntity, "id" | "name" | "logo" | "hackathonId">
> &
  Pick<SponsorEntity, "id">;
