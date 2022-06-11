import React, { FC, useMemo } from "react";
import { TableProps } from "types/components";
import {
  Cell,
  useFilters,
  useFlexLayout,
  usePagination,
  useTable,
} from "react-table";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import TableRow from "./TableRow";
import TableCell from "./TableCell";
import { EvaIcon } from "components/base";
import { NamesState } from "types/hooks";
import TableActions from "components/Table/TableActions";
import { InputFilter, InputFilterRows } from "components/Table/filters";

interface IPaginatedTableProps extends TableProps<object> {
  limit: number;
  names: NamesState[];
}

const PaginatedTable: FC<IPaginatedTableProps> = ({
  columns,
  data,
  names,
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
    getTableProps,
    rows,
    headerGroups,
    prepareRow,
    headers,
    preFilteredRows,

    page,
    // gotoPage,
    state: { pageIndex, pageSize },
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
    usePagination
  );

  const onClickPreviousPage = () => {
    if (pageIndex - 1 > 0) {
      previousPage();
    }
  };

  const onClickNextPage = () => {
    if (data && data.length >= limit) {
      nextPage();
    }
  };

  // console.log(columns);

  // const jumpToPage = (page: number) => {
  //   handlePageChange(page);
  //   gotoPage(page);
  // };

  /* eslint-disable react/jsx-key */
  // eslint disabled since library handles jsx-key insertion
  return (
    <Grid container {...getTableProps()}>
      <TableActions headers={headers} names={names} />
      <Grid container item>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((header) => (
              <TableCell header {...header.getHeaderProps()}>
                {header.render("Header")}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </Grid>
      <Grid container item>
        {page.map((row) => {
          prepareRow(row);
          return (
            <TableRow
              sx={{
                padding: theme.spacing(1.8, 0),
              }}
              {...row.getRowProps()}
            >
              {row.cells.map((cell) => cell.render("Cell"))}
            </TableRow>
          );
        })}
      </Grid>
      <Grid
        container
        item
        sx={{ width: "100%" }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <IconButton
            onClick={previousPage}
            sx={{
              padding: theme.spacing(0.5, 1),
            }}
          >
            <Box mt={0.5}>
              <EvaIcon
                name={"chevron-left-outline"}
                size="large"
                fill="#1a1a1a"
              />
            </Box>
          </IconButton>
        </Grid>
        <Grid item>
          <Typography variant={"body1"} sx={{ mb: 0.2 }}>
            {pageIndex + 1}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            onClick={nextPage}
            sx={{
              padding: theme.spacing(0.5, 1),
            }}
          >
            <Box mt={0.5}>
              <EvaIcon
                name={"chevron-right-outline"}
                size="large"
                fill="#1a1a1a"
              />
            </Box>
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PaginatedTable;
