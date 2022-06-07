import React, { FC, useMemo } from "react";
import { TableProps } from "types/components";
import { Cell, useFlexLayout, usePagination, useTable } from "react-table";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import TableRow from "./TableRow";
import TableCell from "./TableCell";
import { EvaIcon } from "components/base";

interface IPaginatedTableProps extends TableProps {
  page: number;
  limit: number;
  handlePageChange(page: number): void;
}

const PaginatedTable: FC<IPaginatedTableProps> = ({
  handlePageChange,
  columns,
  data,
  page,
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

    // gotoPage,
    nextPage,
    previousPage,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        pageIndex: page,
        pageSize: limit,
      },
      manualPagination: true,
      ...props,
    },
    usePagination,
    useFlexLayout
  );

  const onClickPreviousPage = () => {
    if (page - 1 > 0) {
      handlePageChange(page - 1);
      previousPage();
    }
  };

  const onClickNextPage = () => {
    if (data && data.length >= limit) {
      handlePageChange(page + 1);
      nextPage();
    }
  };

  // const jumpToPage = (page: number) => {
  //   handlePageChange(page);
  //   gotoPage(page);
  // };

  /* eslint-disable react/jsx-key */
  // eslint disabled since library handles jsx-key insertion
  return (
    <Grid container {...getTableProps()}>
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
        {rows.map((row) => {
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
            onClick={onClickPreviousPage}
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
            {page}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            onClick={onClickNextPage}
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
