import { CheckoutItemKeys, ItemKeys } from "./checkout_item";
import { EventKeys } from "./event";
import { HackathonKeys } from "./hackathon";
import { HackerKeys } from "./hacker";
import { LocationKeys } from "./location";

export const QueryKeys = {
  event: EventKeys,
  manageItems: ItemKeys,
  checkoutItem: CheckoutItemKeys,
  hacker: HackerKeys,
  hackathon: HackathonKeys,
  location: LocationKeys,
};

export * from "./checkout_item";
export * from "./event";
export * from "./hackathon";
export * from "./hacker";
export * from "./location";
export * from "./types";
export * from "./utils";
