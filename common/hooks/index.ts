import { useQuery } from "react-query";
import { useCallback, useEffect, useState } from "react";
import {
  PaginatedQueryFn,
  UseDateTime,
  UseDateTimeRange,
  UsePaginatedQuery,
  UsePaginatedQueryOptions,
} from "types/hooks";
import { useFormContext, UseFormReturn } from "react-hook-form";
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

export function useDateTimeRange(
  name: string
  // startDateName: string,
  // endDateName: string,
): UseDateTimeRange {
  const { setValue, register } = useFormContext();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(
    DateTime.fromFormat("01:00 AM", "hh:mm a").toJSDate()
  );

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(
    DateTime.fromFormat("01:00 AM", "hh:mm a").toJSDate()
  );

  const [isMultipleDays, setIsMultipleDays] = useState<boolean>(false);

  const formatDate = useCallback((date: Date, time: Date) => {
    return DateTime.fromJSDate(date)
      .set({
        hour: time.getHours(),
        minute: time.getMinutes(),
        second: 0,
        millisecond: 0,
      })
      .toJSDate();
  }, []);

  const getValue = useCallback(() => {
    return [
      formatDate(startDate, startTime),
      formatDate(isMultipleDays ? endDate : startDate, endTime),
    ];
  }, [isMultipleDays, formatDate, startDate, startTime, endDate, endTime]);

  useEffect(() => {
    register(`${name}.start`);
    register(`${name}.end`);
  }, [register, name]);

  useEffect(() => {
    const startDateTime = getValue()[0];
    setValue(`${name}.start`, startDateTime);
  }, [name, getValue, setValue, startDate, startTime]);

  useEffect(() => {
    const endDateTime = getValue()[1];
    setValue(`${name}.end`, endDateTime);
  }, [name, getValue, endDate, endTime, setValue]);

  const toggleMultiple = useCallback(() => {
    setIsMultipleDays((multiple) => !multiple);
  }, []);

  return {
    register(type) {
      switch (type) {
        case "startDate":
          return {
            value: startDate,
            onChange: setStartDate,
          };
        case "startTime":
          return {
            value: startTime,
            onChange: setStartTime,
          };
        case "endDate":
          return {
            value: endDate,
            onChange: setEndDate,
          };
        case "endTime":
          return {
            value: endTime,
            onChange: setEndTime,
          };
      }
    },
    startDateTime: getValue()[0],
    endDateTime: getValue()[1],
    toggleMultiple,
    isMultipleDays,
  };
}
