import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import {
  ICheckoutItemEntity,
  ICheckoutRequestEntity,
  ICheckoutRequestResponse,
  IGetAllCheckoutItemsResponse,
} from "./entity";
import { QueryAction, QueryScope } from "api/types";

/**
 * Get All Checked Out Items
 * @param params no params available here
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Item_Checkout-Get_list_of_checkout_out_items
 */
export const getAllCheckoutItems: CreateQueryReturn<
  IGetAllCheckoutItemsResponse[]
> = createQuery("/admin/checkout");

/**
 * Get All Available Checkout Items
 * @param params no params available here
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Item_Checkout-Get_items_for_checkout
 */
export const getAllAvailableItems: CreateQueryReturn<ICheckoutItemEntity[]> =
  createQuery("/admin/checkout/items");

/**
 * Create a Checkout Item
 * @param entity
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Item_Checkout-Add_new_item_for_checkout
 */
export const createCheckoutItem: CreateMutationReturn<
  Omit<ICheckoutItemEntity, "uid">
> = createMutation("/admin/checkout/items");

/**
 * Create a Checkout Request
 * @param entity
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Item_Checkout-Create_new_Item_Checkout
 */
export const createCheckoutRequest: CreateMutationReturn<
  Omit<
    ICheckoutRequestEntity,
    "uid" | "checkoutTime" | "hackathon" | "returnTime"
  >,
  ICheckoutRequestResponse
> = createMutation("/admin/checkout");

/**
 * Return a Checked Out Item
 * @param entity
 * @param params (optional)
 * @param token (optional)
 * @link https://api.hackpsu.org/v2/doc/#api-Item_Checkout-Return_checkout_item
 */
export const returnCheckoutItem: CreateMutationReturn<
  Pick<ICheckoutItemEntity, "uid">,
  {}
> = createMutation("/admin/checkout/return");

export const ItemKeys = {
  all: [{ entity: "item" }],
  findAll: () =>
    [
      {
        ...ItemKeys.all[0],
        action: QueryAction.query,
        scope: QueryScope.ALL,
      },
    ] as const,
  findById: (id: string | number) =>
    [{ ...ItemKeys.all[0], action: QueryAction.query, scope: id }] as const,
  createOne: () =>
    [
      { ...ItemKeys.all[0], action: QueryAction.create, scope: QueryScope.NEW },
    ] as const,
  update: (id: string | number) =>
    [{ ...ItemKeys.all[0], action: QueryAction.update, scope: id }] as const,
  updateBatch: () =>
    [
      {
        ...ItemKeys.all[0],
        action: QueryAction.updateBatch,
        scope: QueryScope.ALL,
      },
    ] as const,
  delete: (id: string | number) =>
    [{ ...ItemKeys.all[0], action: QueryAction.delete, scope: id }] as const,
};

export const CheckoutItemKeys = {
  all: [{ entity: "checkout_item" }],
  findAll: () =>
    [
      {
        ...CheckoutItemKeys.all[0],
        action: QueryAction.query,
        scope: QueryScope.ALL,
      },
    ] as const,
  findById: (id: string | number) =>
    [
      { ...CheckoutItemKeys.all[0], action: QueryAction.query, scope: id },
    ] as const,
  update: (id: string | number) =>
    [
      { ...CheckoutItemKeys.all[0], action: QueryAction.update, scope: id },
    ] as const,
  delete: (id: string | number) =>
    [
      { ...CheckoutItemKeys.all[0], action: QueryAction.delete, scope: id },
    ] as const,
};
