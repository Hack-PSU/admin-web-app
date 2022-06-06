import React, { FC, useMemo } from "react";
import { TableProps } from "types/components";
import { useFlexLayout, useTable } from "react-table";
import { Grid, useTheme } from "@mui/material";
import TableCell from "./TableCell";
import TableRow from "./TableRow";

const SimpleTable: FC<TableProps> = ({ columns, data, ...props }) => {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 200,
    }),
    []
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

  const theme = useTheme();

  /* eslint-disable react/jsx-key */
  // eslint disabled since library handles jsx-key insertion
  return (
    <Grid container {...getTableProps()}>
      <Grid container item>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((header) => (
              <TableCell header={header}>{header.render("Header")}</TableCell>
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
              {row.cells.map((cell) => (
                <TableCell cell={cell}>{cell.render("Cell")}</TableCell>
              ))}
            </TableRow>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default SimpleTable;
