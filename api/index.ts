import {
  CheckoutItemKeys,
  ItemKeys,
  EventKeys,
  HackathonKeys,
  HackerKeys,
  LocationKeys,
  ExtraCreditAssignmentKeys,
  ExtraCreditClassKeys,
  JudgingProjectQueryKeys,
  JudgingScoreQueryKeys,
  OrganizerQueryKeys,
  SponsorshipQueryKeys,
  FlagQueryKeys,
  AnalyticsQueryKeys,
} from "./models";

export const QueryKeys = {
  event: EventKeys,
  manageItems: ItemKeys,
  checkoutItem: CheckoutItemKeys,
  hacker: HackerKeys,
  hackathon: HackathonKeys,
  location: LocationKeys,
  extraCreditClass: ExtraCreditClassKeys,
  extraCreditAssignment: ExtraCreditAssignmentKeys,
  judgingProject: JudgingProjectQueryKeys,
  judgingScore: JudgingScoreQueryKeys,
  organizer: OrganizerQueryKeys,
  sponsorship: SponsorshipQueryKeys,
  flag: FlagQueryKeys,
  analytics: AnalyticsQueryKeys,
};

export * from "./models";
export * from "./types";
export * from "./utils";
