import React, { FC, useMemo } from "react";
import TableRow from "components/Table/TableRow";
import { Grid, useTheme } from "@mui/material";
import {
  FilterAction,
  SortAction,
  PaginationAction,
  RefreshAction,
  DeleteAction,
} from "./actions";
import { NamesState } from "types/hooks";
import {
  ColumnInstance,
  UsePaginationInstanceProps,
  UseTableInstanceProps,
} from "react-table";

interface ITableActionsProps {
  names: NamesState[];
  headers: UseTableInstanceProps<object>["headers"];
  nextPage(): void;
  previousPage(): void;
  gotoPage: UsePaginationInstanceProps<object>["gotoPage"];
  pageCount: number;
  pageIndex: number;
  onRefresh(): void;
  onDelete(): void;
}

const TableActions: FC<ITableActionsProps> = ({
  headers,
  names,
  nextPage,
  previousPage,
  gotoPage,
  pageIndex,
  pageCount,
  onRefresh,
  onDelete,
}) => {
  const theme = useTheme();

  const headerMap = useMemo(
    () =>
      headers.reduce((acc, header) => {
        acc[String(header.id)] = header;
        return acc;
      }, {} as { [key: string]: ColumnInstance<object> }),
    []
  );

  return (
    <TableRow
      sx={{
        borderRadius: "15px 15px 0 0",
        padding: theme.spacing(2, 2),
        borderBottom: `2px solid ${theme.palette.table.border}`,
      }}
      alignItems={"center"}
    >
      <Grid container item xs={3}>
        <Grid item xs={6}>
          <FilterAction headers={headerMap} names={names} />
        </Grid>
        <Grid item xs={6}>
          <SortAction headers={headerMap} names={names} />
        </Grid>
      </Grid>
      <Grid container item justifyContent="center" xs={6}>
        <PaginationAction
          nextPage={nextPage}
          previousPage={previousPage}
          gotoPage={gotoPage}
          pageCount={pageCount}
          pageIndex={pageIndex}
        />
      </Grid>
      <Grid container item xs={3} justifyContent="flex-end">
        <Grid container item xs={6} justifyContent="flex-end">
          <RefreshAction onClick={onRefresh} />
        </Grid>
        <Grid container item xs={6} justifyContent="flex-end">
          <DeleteAction onClick={onDelete} />
        </Grid>
      </Grid>
    </TableRow>
  );
};

export default TableActions;
