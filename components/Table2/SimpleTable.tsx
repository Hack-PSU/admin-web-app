import React, { FC, useMemo } from "react";
import { TableProps } from "types/components";
import { Cell, useFlexLayout, useTable } from "react-table";
import { Grid, useTheme } from "@mui/material";
import TableCell from "./TableCell";
import TableRow from "./TableRow";

const SimpleTable: FC<TableProps> = ({ columns, data, ...props }) => {
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

  const { getTableProps, rows, prepareRow, headerGroups } = useTable(
    {
      columns,
      data,
      defaultColumn,
      ...props,
    },
    useFlexLayout
  );

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
    </Grid>
  );
};

export default SimpleTable;
