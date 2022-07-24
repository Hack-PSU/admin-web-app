import React, { createContext, FC, useContext } from "react";
import { flexRender, RowData, Table as BaseTable } from "@tanstack/react-table";
import { Grid, lighten, useTheme } from "@mui/material";
import { WithChildren } from "types/common";
import {
  GlobalSearch,
  GlobalRefresh,
  GlobalPageSize,
  DeleteAction,
  PaginationAction,
  SortColumn,
} from "./actions";
import { DefaultHeaderCell, DefaultRow } from "components/Table2/defaults";

const TableContext = createContext<BaseTable<any>>({} as BaseTable<any>);
export const useTableContext = () => useContext(TableContext);

type TableActionsProps = {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
};

interface ITableComponent {
  <TData extends RowData = any>(
    props: WithChildren<BaseTable<TData>>
  ): ReturnType<FC>;
  GlobalActions: FC<WithChildren>;
  GlobalRefresh: typeof GlobalRefresh;
  GlobalPageSize: typeof GlobalPageSize;
  Container: FC<WithChildren>;
  Actions: FC<TableActionsProps>;
  PaginationAction: typeof PaginationAction;
  DeleteAction: typeof DeleteAction;
  Header: FC;
  Body: FC;
}

const Table: ITableComponent = ({ children, ...props }) => {
  return (
    <TableContext.Provider value={props as BaseTable<any>}>
      <Grid container gap={1.5} flexDirection={"column"}>
        {children}
      </Grid>
    </TableContext.Provider>
  );
};

const GlobalActions: FC<WithChildren> = ({ children }) => {
  return (
    <Grid container item justifyContent={"space-between"}>
      <GlobalSearch />
      <Grid
        container
        item
        xs={7}
        justifyContent={"flex-end"}
        columnSpacing={1}
        alignItems={"center"}
      >
        {children}
      </Grid>
    </Grid>
  );
};

const Container: FC<WithChildren> = ({ children }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      item
      sx={{
        border: `1px solid ${theme.palette.border.light}`,
        borderRadius: "10px",
        boxShadow: 1,
      }}
    >
      {children}
    </Grid>
  );
};

const Actions: FC<TableActionsProps> = ({ left, center, right }) => {
  const theme = useTheme();

  return (
    <DefaultRow
      sx={{
        padding: theme.spacing(2),
        borderBottom: `2px solid ${theme.palette.border.light}`,
      }}
      alignItems="center"
    >
      <Grid container item xs={3}>
        {left}
      </Grid>
      <Grid container item justifyContent="center" xs={6}>
        {center}
      </Grid>
      <Grid container item xs={3} justifyContent="flex-end">
        {right}
      </Grid>
    </DefaultRow>
  );
};

const Header: FC = () => {
  const { getHeaderGroups } = useTableContext();
  const theme = useTheme();

  return (
    <Grid container item>
      {getHeaderGroups().map((headerGroup) => (
        <DefaultRow
          key={headerGroup.id}
          sx={{
            padding: theme.spacing(1, 1.5),
            backgroundColor: lighten(theme.palette.border.light, 0.3),
            borderBottom: `2px solid ${theme.palette.border.light}`,
          }}
        >
          {headerGroup.headers.map((header) => {
            if (header.id === "selection") {
              return flexRender(header.column.columnDef.header, {
                ...header.getContext(),
                key: header.id,
              });
            }

            return (
              <DefaultHeaderCell
                cellProps={{
                  sx: {
                    flex: `${header.column.getSize()} 0 auto`,
                    width: `${header.column.getSize()}px`,
                    cursor: "pointer",
                    userSelect: "none",
                  },
                  onClick: header.column.getToggleSortingHandler(),
                }}
                key={header.id}
                after={
                  header.column.getCanSort() ? (
                    <Grid item sx={{ ml: 1.5, mt: 0.3 }}>
                      <SortColumn
                        isSorted={!!header.column.getIsSorted()}
                        isSortedDesc={header.column.getIsSorted() === "desc"}
                      />
                    </Grid>
                  ) : null
                }
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </DefaultHeaderCell>
            );
          })}
        </DefaultRow>
      ))}
    </Grid>
  );
};

const Body: FC = () => {
  const theme = useTheme();
  const { getRowModel } = useTableContext();

  return (
    <Grid container item>
      {getRowModel().rows.map((row) => (
        <DefaultRow
          key={row.id}
          sx={{
            padding: theme.spacing(1.5),
            ":last-of-type": {
              borderBottom: 0,
            },
          }}
        >
          {row
            .getVisibleCells()
            .map((cell) =>
              flexRender(cell.column.columnDef.cell, {
                ...cell.getContext(),
                key: cell.id,
              })
            )}
        </DefaultRow>
      ))}
    </Grid>
  );
};

Table.GlobalActions = GlobalActions;
Table.GlobalRefresh = GlobalRefresh;
Table.GlobalPageSize = GlobalPageSize;
Table.Container = Container;
Table.Actions = Actions;
Table.PaginationAction = PaginationAction;
Table.DeleteAction = DeleteAction;
Table.Header = Header;
Table.Body = Body;

export default Table;
