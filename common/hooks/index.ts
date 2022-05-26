import {useQuery} from "react-query";
import {useEffect, useState} from "react";
import {PaginatedQueryFn, UsePaginatedQuery, UsePaginatedQueryOptions} from "types/hooks";

export function usePaginatedQuery<TData>(
  queryKey: string, queryFn: PaginatedQueryFn<TData>, { page: initialPage, limit }: UsePaginatedQueryOptions,
  ): UsePaginatedQuery<TData> {
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setOffset((page - 1) * limit + 1);
  }, [limit, page]);

  const handleNext = () => {
    setPage(page => page + 1);
  };

  const handlePrev = () => {
    setPage(page => page - 1);
  };

  const handleJump = (to: number) => {
    setPage(to);
  };

  const query = useQuery(
    [queryKey, offset, limit],
    ({ queryKey }) => queryFn(Number(queryKey[1]), Number(queryKey[2])),
    { keepPreviousData: true });

  return {
    ...query,
    page,
    handlePrev,
    handleNext,
    handleJump
  };
}