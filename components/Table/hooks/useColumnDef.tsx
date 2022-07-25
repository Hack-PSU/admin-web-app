import { ColumnDef, RowData } from "@tanstack/react-table";
import { ColumnFormatterMeta, ColumnType, ColumnTypeMeta } from "../types";
import { useCallback, useMemo } from "react";
import {
  DefaultInputCell,
  DefaultRowSelectionCell,
  DefaultTextCell,
} from "../defaults";
import _ from "lodash";
import { Checkbox } from "@mui/material";

type TableColumnDef<TData extends RowData> = ColumnDef<TData> & {
  type: ColumnType;
  format?: (value: unknown) => string;
  inputName?: string;
  placeholder?: string;
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
  formatter: ColumnFormatterMeta;
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
            inputName: curr.inputName ?? "",
            placeholder: curr?.placeholder ?? "",
          };
        } else {
          acc[curr.id] = {
            type: curr.type,
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
          id: "select",
          header: ({ table, column }) => (
            <DefaultRowSelectionCell
              column={column}
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
              column={column}
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          ),
        },
        ...processedColumns,
      ] as ColumnDef<TData>[];
    }

    const formatter = initialColumns.reduce((acc, curr) => {
      if (curr.id) {
        if (curr.format) {
          acc[curr.id] = curr.format;
        } else {
          acc[curr.id] = (value: unknown) => `${value}`;
        }
      }
      return acc;
    }, {} as ColumnFormatterMeta);

    return {
      columns: columnDefs,
      columnType,
      formatter,
    };
  }, [initialColumns, useRowSelection, usePageRowSelection]);

  const columns = useMemo(() => getColumnConfig().columns, [getColumnConfig]);
  const columnType = useMemo(
    () => getColumnConfig().columnType,
    [getColumnConfig]
  );

  const formatter = useMemo(
    () => getColumnConfig().formatter,
    [getColumnConfig]
  );

  const defaultColumn: Partial<ColumnDef<TData>> = useMemo(
    () => ({
      minSize: 30,
      size: 150,
      maxSize: 200,
      cell: ({ row, table, cell, column }) => {
        const meta = columnType[column.id];

        if (meta.type !== "input") {
          const format =
            formatter[column.id] || ((value: unknown) => `${value}`);

          return (
            <DefaultTextCell column={column}>
              {format(cell.getValue())}
            </DefaultTextCell>
          );
        } else {
          return (
            <DefaultInputCell
              column={column}
              name={`${
                table.options.getRowId
                  ? table.options.getRowId(row.original, row.index)
                  : row.index
              }.${meta.inputName}`}
              placeholder={meta.placeholder}
            />
          );
        }
      },
    }),
    [columnType, formatter]
  );

  return useMemo(
    () => ({
      columns,
      columnType,
      defaultColumn,
      formatter,
    }),
    [columns, columnType, defaultColumn, formatter]
  );
}
