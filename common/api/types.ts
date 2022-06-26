export enum QueryScope {
  ALL = "all",
  ID = "byId",
}

export enum QueryAction {
  query = "get",
  update = "update",
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
