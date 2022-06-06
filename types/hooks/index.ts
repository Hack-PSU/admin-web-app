import { UseQueryResult } from "react-query";
import { UseControllerReturn } from "react-hook-form";
import { Column, ColumnWithLooseAccessor, UseTableOptions } from "react-table";

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

export type ColumnOptions = Omit<ColumnWithLooseAccessor, "columns" | "id"> & {
  hideHeader?: boolean;
};

export type ColumnState<T extends object> = UseTableOptions<T>["columns"];

export type TableColumnBuilder<T extends object> = {
  addColumn(name: string, options?: ColumnOptions): TableColumnBuilder<T>;
};

export type ColumnBuilder<T extends object> = TableColumnBuilder<T> & {
  save(): ColumnState<T>;
};

export type BuilderCallback<
  T extends object,
  TBuilder = TableColumnBuilder<T>
> = (builder: TBuilder) => TBuilder;

export type TableColumnBuilderConfig = <T extends object>(
  state: ColumnState<T>
) => ColumnBuilder<T>;
export type AddColumnConfig = <T extends object>(
  state: ColumnState<T>,
  options: Column
) => TableColumnBuilder<T>;
export type AddGroupConfig = <T extends object>(
  state: ColumnState<T>,
  options: Column
) => TableColumnBuilder<T>;
