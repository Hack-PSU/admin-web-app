import { UseQueryOptions, UseQueryResult } from "react-query";
import { UseControllerReturn } from "react-hook-form";
import { ColumnWithLooseAccessor, UseTableOptions } from "react-table";

export type PaginatedQueryFn<TData> = (
  offset?: number,
  limit?: number,
  token?: string
) => Promise<TData | undefined>;

export type UsePaginatedQueryOptions = {
  page: number;
  limit: number;
};

export type UsePaginatedQuery<TData> = {
  request(page: number): Promise<TData | undefined>;
  page: number;
  limit: number;
  handlePageChange(page: number): void;
};

export type UseApiQueryReturn<TData> = {
  request(...params: any[]): Promise<TData | undefined>;
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

// export type FilterOptions = {
//   type:
//   // options?: string[];
// };

type ColumnDataType = "text" | "date" | "custom";

export type ColumnOptions = Omit<ColumnWithLooseAccessor, "columns"> & {
  type: ColumnDataType;
  filterType?: "checkbox" | "input" | "date" | "time" | "hide";
  hideHeader?: boolean;
};

export type NamesState = {
  name: string;
  type: ColumnDataType;
  columnId: string;
};

export type ColumnState<T extends object> = {
  columns: UseTableOptions<T>["columns"];
  names: NamesState[];
};

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

export type AddConfigOptions = ColumnWithLooseAccessor & {
  name: string;
  type: ColumnDataType;
  // filterOption: FilterOptions;
};

export type TableColumnBuilderConfig = <T extends object>(
  state: ColumnState<T>
) => ColumnBuilder<T>;
export type AddColumnConfig = <T extends object>(
  state: ColumnState<T>,
  options: AddConfigOptions
) => TableColumnBuilder<T>;

export type UseColumnBuilderReturn<T extends object> = {
  columns: UseTableOptions<T>["columns"];
  filters: string[];
};

export type UseClipboardReturn = {
  onClickToCopy(value: string): void;
};

export type UsePaginationOptions = Omit<
  UseQueryOptions,
  "queryKey" | "queryFn"
> &
  UsePaginatedQueryOptions;

export type UseServerSidePaginationReturn<TData> = UseQueryResult<
  TData,
  unknown
> & {};
