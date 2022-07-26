import { Column } from "@tanstack/table-core";
import { TableCellProps } from "@mui/material";

export type DefaultCellProps = TableCellProps & { disableDefault?: boolean };

export type BaseCellProps<TData, TValue = unknown> = {
  column?: Column<TData, TValue>;
  cellProps?: DefaultCellProps;
};
