import { UseQueryResult } from "react-query";

export type PaginatedQueryFn<TData> = (
  offset?: number,
  limit?: number,
  token?: string
) => Promise<TData | undefined>;

export type UsePaginatedQueryOptions = {
  page: number;
  limit: number;
};

export type UsePaginatedQuery<TData> = UseQueryResult<
  TData | undefined,
  unknown
> & {
  page: number;
  handleNext(): void;
  handlePrev(): void;
  handleJump(to: number): void;
};
