import { api, ApiAxiosInstance } from "api/axios";
import { AxiosError, AxiosResponse, Method } from "axios";
import { GetServerSidePropsContext } from "next";

type QueryReturn<TResponse> = AxiosResponse<TResponse>;

type PathParams = {
  [key: string]: any;
};

export type CreateQueryReturn<
  TResponse,
  TParams extends PathParams = {},
  TQuery extends object = {}
> = (
  params?: TParams,
  query?: TQuery,
  token?: string
) => Promise<QueryReturn<TResponse>>;
export type CreateMutationReturn<
  TEntity,
  TResponse = TEntity,
  TParams extends PathParams = {},
  TQuery extends object = {}
> = (
  entity: TEntity,
  params?: TParams,
  query?: TQuery,
  token?: string
) => Promise<QueryReturn<TResponse>>;

function replacePathParams(path: string, params: PathParams) {
  const replaceParams = Object.keys(params).reduce((acc, curr) => {
    acc[`:${curr}`] = params[curr] as any;
    return acc;
  }, {} as { [key: string]: any });

  const regex = new RegExp(Object.keys(replaceParams).join("|"));
  return path.replace(regex, (match) => replaceParams[match]);
}

export function createQuery<
  TResponse,
  TParams extends PathParams = {},
  TQuery extends object = {}
>(
  url: string,
  instance: ApiAxiosInstance = api
): CreateQueryReturn<TResponse, TParams, TQuery> {
  return (params, query, token) => {
    let endpoint = url;

    if (!!params) {
      endpoint = replacePathParams(url, params);
    }

    return instance.request<TResponse>({
      url: endpoint,
      method: "GET",
      params: query,
      ...(token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {}),
    });
  };
}

export function createMutation<
  TEntity,
  TResponse,
  TParams,
  TQuery extends object
>(
  url: string,
  method: Method = "POST",
  instance: ApiAxiosInstance = api
): CreateMutationReturn<TEntity, TResponse, TParams, TQuery> {
  return (entity, params, query, token) => {
    let endpoint = url;
    if (!!params) {
      endpoint = replacePathParams(url, params);
    }
    return instance.request<TResponse, AxiosResponse<TResponse>, TEntity>({
      url: endpoint,
      method,
      data: entity,
      ...(query ? { params: query } : {}),
      ...(token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {}),
    });
  };
}

export async function fetch<TResponse>(
  queryFn: () => Promise<QueryReturn<TResponse>>
): Promise<TResponse | undefined> {
  const resp = await queryFn();
  if (resp && resp.data) {
    return resp.data;
  }
}

export const resolveError = (
  context: GetServerSidePropsContext,
  error: any
) => {
  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401) {
      return {
        props: {},
        redirect: {
          destination: `/login?from=${context.resolvedUrl}`,
          permanent: false,
        },
      };
    }
  }
};
