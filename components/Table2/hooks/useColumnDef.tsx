import { ColumnDef, RowData, TableMeta } from "@tanstack/react-table";
import { ColumnType, ColumnTypeMeta } from "../types";
import { useCallback, useMemo } from "react";
import {
  DefaultHeaderCell,
  DefaultInputCell,
  DefaultRowSelectionCell,
  DefaultTextCell,
} from "../defaults";
import _ from "lodash";
import { Grid } from "@mui/material";
import { SortColumn } from "../actions";

type ColumnConfig = {
  name: string;
  placeholder?: string;
};

type TableColumnDef<TData extends RowData> = ColumnDef<TData> & {
  type: ColumnType;
  name: string;
  placeholder?: string;
  // meta: ColumnConfig;
};

type UseColumnDefOptions<TData extends RowData> = {
  columns: TableColumnDef<TData>[];
  // RowSelection defaults to true
  useRowSelection?: boolean;

  // Set to false if header row selection should select data
  // irrespective of pagination
  usePageRowSelection?: boolean;
};

type UseColumnDefReturn<TData extends RowData> = {
  columns: ColumnDef<TData>[];
  columnType: ColumnTypeMeta;
  defaultColumn: Partial<ColumnDef<TData>>;
};

export function useColumnDef<TData extends RowData>(
  options: UseColumnDefOptions<TData>
): UseColumnDefReturn<TData> {
  const {
    columns: initialColumns,
    usePageRowSelection = true,
    useRowSelection = true,
  } = options;

  const getColumnConfig = useCallback(() => {
    // Make ColumnType Meta
    const columnType: ColumnTypeMeta = initialColumns.reduce((acc, curr) => {
      if (curr.id) {
        if (curr.type === "input") {
          acc[curr.id] = {
            type: curr.type,
            name: curr.name,
            placeholder: curr?.placeholder ?? "",
          };
        } else {
          acc[curr.id] = {
            type: curr.type,
            name: curr.name ?? "",
          };
        }
      }
      return acc;
    }, {} as ColumnTypeMeta);

    const processedColumns: ColumnDef<TData>[] = _.map(
      initialColumns,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ type, meta, ...c }) => ({ ...c })
    );

    let columnDefs = processedColumns;

    if (useRowSelection) {
      columnDefs = [
        {
          id: "selection",
          size: 1,
          maxSize: 8,
          header: ({ table, column }) => (
            <DefaultRowSelectionCell
              cellProps={{
                sx: {
                  flex: `${column.getSize()} 0 auto`,
                  width: `${column.getSize()}px`,
                },
              }}
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={
                usePageRowSelection
                  ? table.getToggleAllPageRowsSelectedHandler()
                  : table.getToggleAllRowsSelectedHandler()
              }
            />
          ),
          cell: ({ row, column }) => (
            <DefaultRowSelectionCell
              cellProps={{
                sx: {
                  flex: `${column.getSize()} 0 auto`,
                  width: `${column.getSize()}px`,
                },
              }}
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          ),
        },
        ...processedColumns,
      ] as ColumnDef<TData>[];
    }
    return {
      columns: columnDefs,
      columnType,
    };
  }, [initialColumns, useRowSelection, usePageRowSelection]);

  const columns = useMemo(() => getColumnConfig().columns, [getColumnConfig]);
  const columnType = useMemo(
    () => getColumnConfig().columnType,
    [getColumnConfig]
  );

  const defaultColumn: Partial<ColumnDef<TData>> = useMemo(
    () => ({
      minSize: 30,
      size: 150,
      maxSize: 200,
      header: ({ column }) => {
        const meta = columnType[column.id];

        if (meta.type === "input" || meta.type === "text") {
          return meta.name;
        }
      },
      cell: ({ row, table, cell, column }) => {
        const meta = columnType[column.id];

        if (meta.type !== "input") {
          const formatter =
            table.options.meta?.formatter[column.id] ||
            ((value: unknown) => `${value}`);

          return (
            <DefaultTextCell
              cellProps={{
                sx: {
                  flex: `${column.getSize()} 0 auto`,
                  width: `${column.getSize()}px`,
                },
              }}
            >
              {formatter(cell.getValue())}
            </DefaultTextCell>
          );
        } else {
          return (
            <DefaultInputCell
              cellProps={{
                sx: {
                  flex: `${column.getSize()} 0 auto`,
                  width: `${column.getSize()}px`,
                },
              }}
              name={`${
                table.options.getRowId
                  ? table.options.getRowId(row.original, row.index)
                  : row.index
              }.${meta.name}`}
              placeholder={meta.placeholder}
            />
          );
        }
      },
    }),
    [columnType]
  );

  return useMemo(
    () => ({
      columns,
      columnType,
      defaultColumn,
    }),
    [columns, columnType, defaultColumn]
  );
}
