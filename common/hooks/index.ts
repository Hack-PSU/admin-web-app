import { useQuery } from "react-query";
import { useCallback, useEffect, useState } from "react";
import {
  PaginatedQueryFn,
  UseDateTime,
  UsePaginatedQuery,
  UsePaginatedQueryOptions,
} from "types/hooks";
import { UseFormReturn } from "react-hook-form";
import { DateTime } from "luxon";

export function usePaginatedQuery<TData>(
  queryKey: string,
  queryFn: PaginatedQueryFn<TData>,
  { page: initialPage, limit }: UsePaginatedQueryOptions
): UsePaginatedQuery<TData> {
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setOffset((page - 1) * limit + 1);
  }, [limit, page]);

  const handleNext = () => {
    setPage((page) => page + 1);
  };

  const handlePrev = () => {
    setPage((page) => page - 1);
  };

  const handleJump = (to: number) => {
    setPage(to);
  };

  const query = useQuery(
    [queryKey, offset, limit],
    ({ queryKey }) => queryFn(Number(queryKey[1]), Number(queryKey[2])),
    { keepPreviousData: true }
  );

  return {
    ...query,
    page,
    handlePrev,
    handleNext,
    handleJump,
  };
}

export function useDateTime(name: string, methods: UseFormReturn): UseDateTime {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(
    DateTime.fromFormat("01:00 AM", "hh:mm a").toJSDate()
  );

  const formatDate = useCallback(() => {
    return DateTime.fromJSDate(date).set({
      hour: time.getHours(),
      minute: time.getMinutes(),
    });
  }, [date, time]);

  useEffect(() => {
    methods.setValue(name, formatDate().toJSDate());
  }, [name, date, time, methods, formatDate]);

  return <UseDateTime>{
    dateTime: formatDate().toJSDate(),
    register(type) {
      if (type === "date") {
        return {
          value: date,
          onChange: setDate,
        };
      } else if (type === "time") {
        return {
          value: time,
          onChange: setTime,
        };
      }
    },
  };
}
