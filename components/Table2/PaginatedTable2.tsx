import React, { FC, useMemo } from "react";
import { TableProps } from "types/components";
import {
  Cell,
  useFilters,
  useFlexLayout,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import {
  Grid,
  lighten,
  useTheme,
  Checkbox as MuiCheckbox,
} from "@mui/material";
import TableRow from "./TableRow";
import TableCell from "./TableCell";
import { NamesState } from "types/hooks";
import TableActions from "./TableActions";
import GlobalActions from "./GlobalActions";

export interface IPaginatedTableProps extends TableProps<object> {
  limit: number;
  names: NamesState[];
  onRefresh(): void;
  onDelete(): void;
}

const PaginatedTable: FC<IPaginatedTableProps> = ({
  columns,
  data,
  names,
  limit,
  onRefresh,
  onDelete,
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

  /* eslint-disable react/jsx-key */
  // eslint disabled since library handles jsx-key insertion
  return (
    <Grid container gap={1.5} flexDirection="column">
      <GlobalActions
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
        names={names}
      />
      <Grid
        container
        sx={{
          border: `1px solid ${theme.palette.table.border}`,
          borderRadius: "10px",
        }}
        {...getTableProps()}
      >
        <TableActions
          pageCount={pageCount}
          pageIndex={pageIndex}
          previousPage={previousPage}
          headers={headers}
          names={names}
          gotoPage={gotoPage}
          nextPage={nextPage}
          onRefresh={onRefresh}
          onDelete={onDelete}
        />
        <Grid container item>
          {headerGroups.map((headerGroup) => (
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
        <Grid container item>
          {page.map((row) => {
            prepareRow(row);
            return (
              <TableRow
                sx={{
                  padding: theme.spacing(1.5, 1.5),
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
      </Grid>
    </Grid>
  );
};

export default PaginatedTable;
