export interface ICheckoutItemEntity {
  uid?: number;
  name: string;
  quantity: number;
}

export interface IGetAllCheckoutItemsResponse {
  uid: number;
  item_id: number;
  user_id: string;
  checkout_time: string;
  return_time: string | null;
  hackathon?: string;
  firstname: string;
  lastname: string;
  name: string;
}

export interface ICheckoutRequestEntity {
  uid?: number;
  itemId: string;
  userId: string;
  checkoutTime: number;
  returnTime?: number;
  hackathon?: string;
}

export interface ICheckoutRequestResponse {
  item_id: number;
  user_id: string;
  checkout_time: number;
}
