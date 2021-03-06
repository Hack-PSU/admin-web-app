import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
} from "react";
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
  useMountedLayoutEffect,
  usePagination,
  UsePaginationInstanceProps,
  useRowSelect,
  UseRowSelectInstanceProps,
  useSortBy,
  useTable,
  UseTableInstanceProps,
} from "react-table";
import TableCell, { DefaultCell } from "components/Table/TableCell";
import {
  Checkbox as MuiCheckbox,
  Grid,
  lighten,
  useTheme,
} from "@mui/material";
import { IOption, TableProps } from "types/components";
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
import SortColumn from "components/Table/actions/SortColumn";
import { Select } from "components/base";
import { ActionMeta, SingleValue } from "react-select";

export interface ITableProps<T extends object> extends TableProps<T> {
  limit: number;
  names: NamesState[];
  onRefresh(): void;
  onDelete(): void;
  onSelectRows?(rows: Record<string, boolean>): void;
}

type TableContextHooks = Pick<
  UseTableInstanceProps<object>,
  "getTableProps" | "headerGroups" | "prepareRow" | "headers"
> &
  Pick<
    UsePaginationInstanceProps<object>,
    | "page"
    | "gotoPage"
    | "nextPage"
    | "previousPage"
    | "pageCount"
    | "canPreviousPage"
    | "canNextPage"
    | "setPageSize"
  > &
  Pick<UseGlobalFiltersState<object>, "globalFilter"> &
  Pick<TableState, "pageIndex"> &
  Pick<UseGlobalFiltersInstanceProps<object>, "setGlobalFilter"> &
  Pick<ITableActionProps, "names"> & {
    onRefresh(): void;
    onDelete(): void;
    headerMap: ITableActionProps["headers"];
  };

type TableComponent = FC<WithChildren<ITableProps<any>>> & {
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
  onSelectRows,
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
    state: { pageIndex, globalFilter, selectedRowIds },
    canNextPage,
    canPreviousPage,
    setPageSize,

    // Row selection
    selectedFlatRows,
  } = useTable(
    {
      ...props,
      columns,
      data,
      defaultColumn,
      pageCount: data ? data.length : 0,
      initialState: {
        pageIndex: 0,
        pageSize: limit,
        ...props.initialState,
      },
      autoResetPage: false,
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
              <MuiCheckbox
                sx={{
                  color: "border.dark",
                }}
                {...getToggleAllPageRowsSelectedProps()}
              />
            </TableCell>
          ),
          Cell: ({ row }) => (
            <TableCell empty>
              <MuiCheckbox
                sx={{
                  color: "border.dark",
                }}
                {...row.getToggleRowSelectedProps()}
              />
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

  useEffect(() => {
    if (onSelectRows) {
      onSelectRows(selectedRowIds);
    }
  }, [onSelectRows, selectedRowIds]);

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
      canNextPage,
      canPreviousPage,
      setPageSize,
    }),
    [
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
      canNextPage,
      canPreviousPage,
      setPageSize,
    ]
  );

  return (
    <TableContext.Provider value={value}>
      <Grid container gap={1.5} flexDirection="column">
        {children}
      </Grid>
    </TableContext.Provider>
  );
};

const TableGlobalActions: FC = () => {
  const { setGlobalFilter, globalFilter, names, onRefresh, setPageSize } =
    useTableContext();

  const onChangePageSize = (
    newValue: SingleValue<IOption>,
    action: ActionMeta<IOption>
  ) => {
    if (newValue) {
      setPageSize(Number(newValue.value));
    }
  };

  return (
    <Grid container item justifyContent="space-between">
      <GlobalActions
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
        names={names}
      />
      <Grid
        container
        item
        xs={7}
        justifyContent="flex-end"
        columnSpacing={1}
        alignItems="center"
      >
        <Grid item xs={3} sx={{ height: "100%" }}>
          <RefreshAction onClick={onRefresh} />
        </Grid>
        <Grid item xs={3}>
          <Select
            options={[
              { value: "4", label: "4 entries" },
              { value: "8", label: "8 entries" },
              { value: "10", label: "10 entries" },
              { value: "20", label: "20 entries" },
            ]}
            name={"limit"}
            defaultValue={{ value: "8", label: "8 entries" }}
            onChange={onChangePageSize}
          />
        </Grid>
      </Grid>
    </Grid>
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
        boxShadow: 1,
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
  const {
    nextPage,
    previousPage,
    gotoPage,
    pageCount,
    pageIndex,
    canPreviousPage,
    canNextPage,
  } = useTableContext();

  return (
    <PaginationAction
      nextPage={nextPage}
      previousPage={previousPage}
      gotoPage={gotoPage}
      pageCount={pageCount}
      pageIndex={pageIndex}
      canNextPage={canNextPage}
      canPreviousPage={canPreviousPage}
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
                  container
                  header
                  empty
                  alignItems="center"
                  {...header.getHeaderProps(
                    !header.disableSortBy
                      ? header.getSortByToggleProps()
                      : undefined
                  )}
                  textProps={{
                    sx: {
                      fontSize: theme.typography.pxToRem(15),
                    },
                  }}
                >
                  <Grid item>
                    <DefaultCell
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "header.light",
                        fontSize: theme.typography.pxToRem(15),
                      }}
                    >
                      {header.render("Header")}
                    </DefaultCell>
                  </Grid>
                  {!header.disableSortBy && (
                    <Grid item sx={{ ml: 1.5 }}>
                      <SortColumn header={header} />
                    </Grid>
                  )}
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
