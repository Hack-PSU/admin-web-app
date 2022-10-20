export interface ISponsorshipEntity {
  uid: number;
  name: string;
  level: string;
  logo: string;
  order: number;
  website_link?: string;
  hackathon?: string;
}
