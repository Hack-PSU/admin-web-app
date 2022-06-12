import React, { FC, useMemo } from "react";
import { TableProps } from "types/components";
import {
  Cell,
  useFilters,
  useFlexLayout,
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
import TableActions from "components/Table/TableActions";

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

  // const columns2 = useMemo(
  //   () => [
  //     {
  //       id: "name",
  //       Header: "name",
  //       accessor: "name",
  //       canFilter: false,
  //     }
  //   ],
  //   []
  // );

  const {
    // Table instance
    getTableProps,
    headerGroups,
    prepareRow,
    headers,

    // Pagination
    page,
    gotoPage,
    state: { pageIndex },
    pageCount,
    nextPage,
    previousPage,
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
    useFlexLayout,
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
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

  // console.log(columns);
  //
  // const jumpToPage = (page: number) => {
  //   handlePageChange(page);
  //   gotoPage(page);
  // };

  /* eslint-disable react/jsx-key */
  // eslint disabled since library handles jsx-key insertion
  return (
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
  );
};

export default PaginatedTable;
