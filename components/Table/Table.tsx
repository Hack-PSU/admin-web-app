import React, { createContext, FC, useContext } from "react";
import { flexRender, RowData, Table as BaseTable } from "@tanstack/react-table";
import {
  TableContainer,
  Grid,
  lighten,
  TableBody,
  Table as MuiTable,
  useTheme,
  TableHead,
  Collapse,
  darken,
} from "@mui/material";
import { WithChildren } from "types/common";
import {
  GlobalSearch,
  GlobalRefresh,
  GlobalPageSize,
  DeleteAction,
  PaginationAction,
  SortColumn,
} from "./actions";
import { DefaultCell, DefaultHeaderCell, DefaultRow } from "./defaults";

const TableContext = createContext<TableProps<any>>({} as TableProps<any>);
export const useTableContext = () => useContext(TableContext);

type TableProps<TData extends RowData> = BaseTable<TData> & {
  renderSubRows?: (row: TData) => React.ReactNode;
};

type TableActionsProps = {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
};

interface ITableComponent {
  <TData extends RowData = any>(
    props: WithChildren<TableProps<TData>>
  ): ReturnType<FC>;
  GlobalActions: FC<WithChildren>;
  GlobalRefresh: typeof GlobalRefresh;
  GlobalPageSize: typeof GlobalPageSize;
  Container: FC<WithChildren>;
  Actions: FC<TableActionsProps>;
  PaginationAction: typeof PaginationAction;
  DeleteAction: typeof DeleteAction;
  Content: FC<WithChildren<{ overflowVisible?: boolean }>>;
  Header: FC;
  Body: FC;
}

const Table: ITableComponent = ({ children, ...props }) => {
  return (
    <TableContext.Provider value={props as TableProps<any>}>
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
    <Grid
      container
      sx={{
        padding: theme.spacing(2),
        borderBottom: `2px solid ${theme.palette.border.light}`,
      }}
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
    </Grid>
  );
};

const Content: FC<WithChildren<{ overflowVisible?: boolean }>> = ({
  overflowVisible,
  children,
}) => {
  return (
    <TableContainer
      sx={{
        width: "100%",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
        ...(overflowVisible ? { overflow: "visible" } : {}),
      }}
    >
      <MuiTable sx={{ width: "100%" }}>{children}</MuiTable>
    </TableContainer>
  );
};

const Header: FC = () => {
  const { getHeaderGroups } = useTableContext();
  const theme = useTheme();

  return (
    <TableHead>
      {getHeaderGroups().map((headerGroup) => (
        <DefaultRow
          key={headerGroup.id}
          sx={{
            backgroundColor: lighten(theme.palette.border.light, 0.3),
            borderBottom: `2px solid ${theme.palette.border.light}`,
          }}
        >
          {headerGroup.headers.map((header) => {
            if (header.id === "select") {
              return flexRender(header.column.columnDef.header, {
                ...header.getContext(),
                key: header.id,
              });
            }

            return (
              <DefaultHeaderCell
                column={header.column}
                cellProps={{
                  sx: {
                    cursor: "pointer",
                    userSelect: "none",
                  },
                  onClick: header.column.getCanSort()
                    ? header.column.getToggleSortingHandler()
                    : undefined,
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
    </TableHead>
  );
};

const Body: FC = () => {
  const theme = useTheme();
  const {
    getRowModel,
    options: { meta },
    getAllColumns,
    renderSubRows,
  } = useTableContext();

  return (
    <TableBody>
      {getRowModel().rows.map((row, index) => (
        <>
          <DefaultRow
            key={`${row.id}-${index}`}
            sx={{
              padding: theme.spacing(1.5),
              ":last-of-type": {
                borderBottom: 0,
              },
              ...(meta?.rowType === "expand"
                ? {
                    borderBottom: 0,
                    cursor: "pointer",
                    ":hover": {
                      backgroundColor: darken(theme.palette.common.white, 0.05),
                    },
                    transition: "background-color 200ms ease-in-out",
                  }
                : {}),
            }}
            onClick={
              meta?.rowType === "expand"
                ? () => row.toggleExpanded()
                : undefined
            }
          >
            {row.getVisibleCells().map((cell) =>
              flexRender(cell.column.columnDef.cell, {
                ...cell.getContext(),
                key: cell.id,
              })
            )}
          </DefaultRow>
          {meta?.rowType === "expand" && (
            <DefaultRow
              key={`${row.id}-${index + 1}`}
              sx={{
                padding: theme.spacing(0),
              }}
            >
              <DefaultCell
                disableDefault
                colSpan={getAllColumns().length}
                sx={{
                  ":first-child": {
                    padding: 0,
                  },
                }}
              >
                <Collapse in={row.getIsExpanded()} timeout="auto" unmountOnExit>
                  {renderSubRows && renderSubRows(row.original)}
                </Collapse>
              </DefaultCell>
            </DefaultRow>
          )}
        </>
      ))}
    </TableBody>
  );
};

Table.GlobalActions = GlobalActions;
Table.GlobalRefresh = GlobalRefresh;
Table.GlobalPageSize = GlobalPageSize;
Table.Container = Container;
Table.Actions = Actions;
Table.PaginationAction = PaginationAction;
Table.DeleteAction = DeleteAction;
Table.Content = Content;
Table.Header = Header;
Table.Body = Body;

export default Table;
