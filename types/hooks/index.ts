import { UseQueryResult } from "react-query";
import { UseControllerReturn } from "react-hook-form";

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

type RegisterDateTimePicker = {
  value: Date;
  onChange: UseControllerReturn["field"]["onChange"];
};

export type UseDateTime = {
  dateTime: Date;
  register<T extends "date" | "time">(type: T): RegisterDateTimePicker;
};

type DateTimeRangeType = "startDate" | "startTime" | "endDate" | "endTime";

export type UseDateTimeRange = {
  startDateTime: Date;
  endDateTime: Date;
  register(type: DateTimeRangeType): RegisterDateTimePicker;
  toggleMultiple(): void;
  isMultipleDays: boolean;
};
