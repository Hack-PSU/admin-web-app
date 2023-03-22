export interface SponsorEntity {
  id: number;
  name: string;
  level: string;
  logo: string;
  order: number;
  link?: string;
  hackathonId?: string;
}
