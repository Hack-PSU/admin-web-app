import {
  FilterFn,
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
import { ColumnTypeMeta, ColumnFormatterMeta, RenderSubRows } from "../types";
import { rankItem } from "@tanstack/match-sorter-utils";
import { OnDragEndResponder } from "react-beautiful-dnd";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line
  interface TableMeta {
    formatter: ColumnFormatterMeta;
    columnType: ColumnTypeMeta;
    rowType: "data" | "expand";
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
  | "getSubRows"
> & {
  usePagination?: boolean;
  useExpanded?: boolean;
  useFilter?: boolean;
  useSorted?: boolean;
  useDraggable?: boolean;
  // formatter can be used to format a cell's value.
  // Its key must be the column id for that cell
  formatter: ColumnFormatterMeta;
  columnType: ColumnTypeMeta;
  renderSubRows?: RenderSubRows<TData>;
  onDragEnd?: OnDragEndResponder;
};

type UseTableReturn<TData extends RowData> = Table<TData> &
  Pick<UseTableOptions<TData>, "renderSubRows"> & {
    isDraggable: boolean;
    onDragEnd?: OnDragEndResponder;
  };

const globalFilterFn: FilterFn<any> = (row, columnId, filterValue, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), filterValue);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

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
    renderSubRows,
    useDraggable,
    onDragEnd,
    ...tableOptions
  } = options;

  const table = useReactTable<TData>({
    ...tableOptions,
    meta: {
      ...tableOptions.meta,
      rowType: useExpanded ? "expand" : "data",
      formatter: formatter ?? {},
      columnType,
    },
    manualExpanding: useExpanded ? true : undefined,
    globalFilterFn: globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: useSorted ? getSortedRowModel() : undefined,
    getExpandedRowModel: useExpanded ? getExpandedRowModel() : undefined,
    getFilteredRowModel: useFilter ? getFilteredRowModel() : undefined,
    getPaginationRowModel: usePagination ? getPaginationRowModel() : undefined,
  });

  return {
    ...table,
    renderSubRows,
    isDraggable: useDraggable ?? false,
    onDragEnd,
  };
}
