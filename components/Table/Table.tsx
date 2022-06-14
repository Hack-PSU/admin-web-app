import React, { createContext, FC, useContext, useMemo } from "react";
import { WithChildren } from "types/common";
import {
  Cell,
  ColumnInstance,
  TableState,
  useFilters,
  useFlexLayout,
  useGlobalFilter,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
  usePagination,
  UsePaginationInstanceProps,
  useRowSelect,
  useSortBy,
  useTable,
  UseTableInstanceProps,
} from "react-table";
import TableCell from "components/Table/TableCell";
import {
  Checkbox as MuiCheckbox,
  Grid,
  lighten,
  useTheme,
} from "@mui/material";
import { TableProps } from "types/components";
import { NamesState } from "types/hooks";
import { ITableActionProps } from "components/Table/actions/types";
import GlobalActions from "components/Table/GlobalActions";
import TableRow from "components/Table/TableRow";
import {
  DeleteAction,
  FilterAction,
  PaginationAction,
  RefreshAction,
  SortAction,
} from "components/Table/actions";

interface ITableProps extends TableProps<object> {
  limit: number;
  names: NamesState[];
  onRefresh(): void;
  onDelete(): void;
}

type TableContextHooks = Pick<
  UseTableInstanceProps<object>,
  "getTableProps" | "headerGroups" | "prepareRow" | "headers"
> &
  Pick<
    UsePaginationInstanceProps<object>,
    "page" | "gotoPage" | "nextPage" | "previousPage" | "pageCount"
  > &
  Pick<UseGlobalFiltersState<object>, "globalFilter"> &
  Pick<TableState, "pageIndex"> &
  Pick<UseGlobalFiltersInstanceProps<object>, "setGlobalFilter"> &
  Pick<ITableActionProps, "names"> & {
    onRefresh(): void;
    onDelete(): void;
    headerMap: ITableActionProps["headers"];
  };

type TableComponent = FC<WithChildren<ITableProps>> & {
  GlobalActions: FC;
  Container: FC<Required<WithChildren>>;
  Actions: FC<Required<WithChildren>>;
  ActionsLeft: FC<WithChildren>;
  Filter: FC;
  Sort: FC;
  ActionsCenter: FC<WithChildren>;
  Pagination: FC;
  ActionsRight: FC<WithChildren>;
  Refresh: FC;
  Delete: FC;
  Header: FC;
  Body: FC;
};

const TableContext = createContext<TableContextHooks>({} as TableContextHooks);
const useTableContext = () => useContext(TableContext);

const Table: TableComponent = ({
  columns,
  data,
  names,
  onDelete,
  onRefresh,
  children,
  limit,
  ...props
}) => {
  const theme = useTheme();

  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 200,
      Cell: ({ cell }: { cell: Cell }) => (
        <TableCell
          {...cell.getCellProps()}
          sx={{ padding: theme.spacing(0, 2, 0, 0) }}
        >
          {cell.value}
        </TableCell>
      ),
    }),
    [theme]
  );

  const {
    // Table instance
    getTableProps,
    headerGroups,
    prepareRow,
    headers,

    // Pagination and Filter
    page,
    gotoPage,
    setGlobalFilter,
    nextPage,
    previousPage,
    pageCount,
    state: { pageIndex, globalFilter },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      pageCount: data ? data.length : 0,
      initialState: {
        pageIndex: 0,
        pageSize: limit,
      },
      ...props,
    },
    useFlexLayout, // use flexbox instead of HTML tables
    useFilters, // use column filters
    useGlobalFilter, // use global filters
    useSortBy, // use column sorting
    usePagination, // use row pagination
    useRowSelect, // use row selection with checkbox
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <TableCell empty>
              <MuiCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </TableCell>
          ),
          Cell: ({ row }) => (
            <TableCell empty>
              <MuiCheckbox {...row.getToggleRowSelectedProps()} />
            </TableCell>
          ),
        },
        ...columns,
      ]);
    }
  );

  const headerMap = useMemo(
    () =>
      headers.reduce((acc, header) => {
        acc[String(header.id)] = header;
        return acc;
      }, {} as { [key: string]: ColumnInstance<object> }),
    []
  );

  const value = useMemo(
    () => ({
      getTableProps,
      headerGroups,
      prepareRow,
      headers,
      page,
      gotoPage,
      nextPage,
      setGlobalFilter,
      previousPage,
      pageCount,
      pageIndex,
      globalFilter,
      names,
      headerMap,
      onRefresh,
      onDelete,
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }),
    [page, pageIndex, pageCount, globalFilter]
  );

  return (
    // @ts-ignore
    <TableContext.Provider value={value}>
      <Grid container gap={1.5} flexDirection="column">
        {children}
      </Grid>
    </TableContext.Provider>
  );
};

const TableGlobalActions: FC = () => {
  const { setGlobalFilter, globalFilter, names } = useTableContext();
  return (
    <GlobalActions
      setGlobalFilter={setGlobalFilter}
      globalFilter={globalFilter}
      names={names}
    />
  );
};

const TableContainer: FC<Required<WithChildren>> = ({ children }) => {
  const theme = useTheme();
  const { getTableProps } = useTableContext();

  return (
    <Grid
      container
      sx={{
        border: `1px solid ${theme.palette.table.border}`,
        borderRadius: "10px",
      }}
      {...getTableProps()}
    >
      {children}
    </Grid>
  );
};

const TableActions: FC<Required<WithChildren>> = ({ children }) => {
  const theme = useTheme();

  return (
    <TableRow
      sx={{
        padding: theme.spacing(2),
        borderBottom: `2px solid ${theme.palette.table.border}`,
      }}
      alignItems="center"
    >
      {children}
    </TableRow>
  );
};

const TableActionsLeft: FC<WithChildren> = ({ children }) => {
  return (
    <Grid container item xs={3}>
      {children}
    </Grid>
  );
};

const TableFilterAction: FC = () => {
  const { headerMap, names } = useTableContext();

  return (
    <Grid item xs={6}>
      <FilterAction headers={headerMap} names={names} />
    </Grid>
  );
};

const TableSortAction: FC = () => {
  const { headerMap, names } = useTableContext();

  return (
    <Grid item xs={6}>
      <SortAction headers={headerMap} names={names} />
    </Grid>
  );
};

const TableActionsCenter: FC<WithChildren> = ({ children }) => {
  return (
    <Grid container item justifyContent="center" xs={6}>
      {children}
    </Grid>
  );
};

const TablePaginationAction: FC = () => {
  const { nextPage, previousPage, gotoPage, pageCount, pageIndex } =
    useTableContext();

  return (
    <PaginationAction
      nextPage={nextPage}
      previousPage={previousPage}
      gotoPage={gotoPage}
      pageCount={pageCount}
      pageIndex={pageIndex}
    />
  );
};

const TableActionsRight: FC<WithChildren> = ({ children }) => {
  return (
    <Grid container item xs={3} justifyContent="flex-end">
      {children}
    </Grid>
  );
};

const TableRefreshAction: FC = () => {
  const { onRefresh } = useTableContext();

  return (
    <Grid container item xs={6} justifyContent="flex-end">
      <RefreshAction onClick={onRefresh} />
    </Grid>
  );
};

const TableDeleteAction: FC = () => {
  const { onDelete } = useTableContext();

  return (
    <Grid container item xs={6} justifyContent="flex-end">
      <DeleteAction onClick={onDelete} />
    </Grid>
  );
};

const TableHeader: FC = () => {
  const { headerGroups } = useTableContext();
  const theme = useTheme();

  return (
    <Grid container item>
      {headerGroups.map((headerGroup) => (
        // eslint-disable-next-line react/jsx-key
        <TableRow
          {...headerGroup.getHeaderGroupProps()}
          sx={{
            padding: theme.spacing(1, 1.5),
            backgroundColor: lighten(theme.palette.table.border, 0.3),
            borderBottom: `2px solid ${theme.palette.table.border}`,
          }}
        >
          {headerGroup.headers.map((header) => {
            if (header.id === "selection") {
              return header.render("Header");
            } else {
              return (
                <TableCell
                  header
                  {...header.getHeaderProps()}
                  textProps={{
                    sx: {
                      fontSize: theme.typography.pxToRem(15),
                    },
                  }}
                >
                  {header.render("Header")}
                </TableCell>
              );
            }
          })}
        </TableRow>
      ))}
    </Grid>
  );
};

const TableBody: FC = () => {
  const theme = useTheme();
  const { page, prepareRow } = useTableContext();

  return (
    <Grid container item>
      {page.map((row) => {
        prepareRow(row);
        return (
          // eslint-disable-next-line react/jsx-key
          <TableRow
            sx={{
              padding: theme.spacing(1.5),
              ":last-child": {
                borderBottom: 0,
              },
            }}
            {...row.getRowProps()}
          >
            {row.cells.map((cell) => cell.render("Cell"))}
          </TableRow>
        );
      })}
    </Grid>
  );
};

Table.GlobalActions = TableGlobalActions;
Table.Container = TableContainer;
Table.Actions = TableActions;
Table.ActionsLeft = TableActionsLeft;
Table.ActionsCenter = TableActionsCenter;
Table.ActionsRight = TableActionsRight;
Table.Filter = TableFilterAction;
Table.Sort = TableSortAction;
Table.Pagination = TablePaginationAction;
Table.Refresh = TableRefreshAction;
Table.Delete = TableDeleteAction;
Table.Header = TableHeader;
Table.Body = TableBody;

export default Table;
