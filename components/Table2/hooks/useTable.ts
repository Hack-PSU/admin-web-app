import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowData,
  Table,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import { ColumnTypeMeta } from "../types";

type ColumnFormatterMeta = {
  [key: string]: (value: unknown) => string;
};

declare module "@tanstack/react-table" {
  // eslint-disable-next-line
  interface TableMeta {
    formatter: ColumnFormatterMeta;
    columnType: ColumnTypeMeta;
  }
}

type UseTableOptions<TData extends RowData> = Omit<
  TableOptions<TData>,
  | "getCoreRowModel"
  | "getPaginationRowModel"
  | "getExpandedRowModel"
  | "getFilteredRowModel"
  | "getGroupedRowModel"
  | "getSortedRowModel"
> & {
  usePagination?: boolean;
  useExpanded?: boolean;
  useFilter?: boolean;
  useSorted?: boolean;
  // formatter can be used to format a cell's value.
  // Its key must be the column id for that cell
  formatter?: ColumnFormatterMeta;
  columnType: ColumnTypeMeta;
};

type UseTableReturn<TData extends RowData> = Table<TData>;

export function useTable<TData extends RowData>(
  options: UseTableOptions<TData>
): UseTableReturn<TData> {
  const {
    useExpanded = false,
    useSorted = true,
    usePagination = true,
    useFilter = true,
    formatter,
    columnType,
    ...tableOptions
  } = options;

  return useReactTable<TData>({
    ...tableOptions,
    meta: {
      ...tableOptions.meta,
      formatter: formatter ?? {},
      columnType,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: useSorted ? getSortedRowModel() : undefined,
    getExpandedRowModel: useExpanded ? getExpandedRowModel() : undefined,
    getFilteredRowModel: useFilter ? getFilteredRowModel() : undefined,
    getPaginationRowModel: usePagination ? getPaginationRowModel() : undefined,
  });
}
