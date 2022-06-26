import api from "api/axios";
import { AxiosError, AxiosResponse, Method } from "axios";
import { ApiResponse } from "./types";
import { GetServerSidePropsContext } from "next";

type QueryReturn<TResponse> = AxiosResponse<ApiResponse<TResponse>>;

export type CreateQueryByIdReturn<TResponse, TParam extends object = {}> = (
  id: string | number,
  params?: TParam,
  token?: string
) => Promise<QueryReturn<TResponse>>;
export type CreateMutationByIdReturn<
  TEntity,
  TResponse,
  TParam extends object = {}
> = (
  id: string | number,
  entity: TEntity,
  param?: TParam,
  token?: string
) => Promise<QueryReturn<TResponse>>;

export type CreateQueryReturn<TResponse, TParam extends object = {}> = (
  params?: TParam,
  token?: string
) => Promise<QueryReturn<TResponse>>;
export type CreateMutationReturn<
  TEntity,
  TResponse = TEntity,
  TParam extends object = {}
> = (
  entity: TEntity,
  param?: TParam,
  token?: string
) => Promise<QueryReturn<TResponse>>;

export function createQuery<TResponse, TParam extends object = {}>(
  url: string
): CreateQueryReturn<TResponse, TParam> {
  return (params, token) =>
    api.request<ApiResponse<TResponse>>({
      url,
      method: "GET",
      ...(params ? { params } : {}),
      ...(token
        ? {
            headers: {
              idtoken: token,
            },
          }
        : {}),
    });
}

export function createMutation<TEntity, TResponse, TParam extends object = {}>(
  url: string,
  method: Method = "POST"
): CreateMutationReturn<TEntity, TResponse, TParam> {
  return (entity, params, token) =>
    api.request<ApiResponse<TResponse>, QueryReturn<TResponse>, TEntity>({
      url,
      method,
      data: entity,
      ...(params ? { params } : {}),
      ...(token
        ? {
            headers: {
              idtoken: token,
            },
          }
        : {}),
    });
}

export async function fetch<TResponse>(
  queryFn: () => Promise<QueryReturn<TResponse>>
): Promise<TResponse | undefined> {
  const resp = await queryFn();
  if (resp && resp.data.body.data) {
    return resp.data.body.data;
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
