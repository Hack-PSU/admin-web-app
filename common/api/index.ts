import { CheckoutItemKeys, ItemKeys } from "./checkout_item";
import { EventKeys } from "./event";
import { HackathonKeys } from "./hackathon";
import { HackerKeys } from "./hacker";
import { LocationKeys } from "./location";
import {
  ExtraCreditAssignmentKeys,
  ExtraCreditClassKeys,
} from "./extra_credit";
import { JudgingScoreQueryKeys } from "api/judging";

export const QueryKeys = {
  event: EventKeys,
  manageItems: ItemKeys,
  checkoutItem: CheckoutItemKeys,
  hacker: HackerKeys,
  hackathon: HackathonKeys,
  location: LocationKeys,
  extraCreditClass: ExtraCreditClassKeys,
  extraCreditAssignment: ExtraCreditAssignmentKeys,
  judgingProject: JudgingScoreQueryKeys,
  judgingScore: JudgingScoreQueryKeys,
};

export * from "./checkout_item";
export * from "./event";
export * from "./hackathon";
export * from "./hacker";
export * from "./location";
export * from "./extra_credit";
export * from "./judging";
export * from "./types";
export * from "./utils";
