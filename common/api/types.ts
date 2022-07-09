export enum QueryScope {
  ALL = "all",
  NEW = "new",
  ID = "byId",
}

export enum QueryAction {
  query = "get",
  create = "create",
  update = "update",
  updateBatch = "updateBatch",
  delete = "delete",
}

type ApiQueryKey = {
  entity: string;
  action?: QueryAction | string;
  scope?: QueryScope | string | number;
};

export type QueryKeyFactory = {
  [key: string]:
    | readonly [ApiQueryKey]
    | (() => readonly [ApiQueryKey])
    | ((id: string | number) => readonly [ApiQueryKey]);
  all: readonly [ApiQueryKey];
};

export type ApiResponse<TData> = {
  api_response: string;
  status: number;
  body: {
    result: string;
    data: TData;
  };
};

export type CreateEntity<TEntity, TId extends string = "uid"> = {
  entity: Omit<TEntity, TId>;
};
export type MutateEntity<TEntity> = { entity: Partial<TEntity> };
