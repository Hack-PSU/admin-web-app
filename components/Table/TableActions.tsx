import React, { FC, useMemo } from "react";
import TableRow from "components/Table/TableRow";
import { Grid, useTheme } from "@mui/material";
import { FilterAction } from "./actions";
import { NamesState } from "types/hooks";
import { TableProps } from "types/components";
import _ from "lodash";
import {
  ColumnInstance,
  HeaderGroup,
  UseTableInstanceProps,
} from "react-table";

interface ITableActionsProps {
  names: NamesState[];
  headers: UseTableInstanceProps<object>["headers"];
}

const TableActions: FC<ITableActionsProps> = ({ headers, names }) => {
  const theme = useTheme();

  const headerMap = useMemo(
    () =>
      headers.reduce((acc, header) => {
        acc[String(header.id)] = header;
        return acc;
      }, {} as { [key: string]: ColumnInstance<object> }),
    []
  );

  return (
    <TableRow
      sx={{
        borderRadius: "15px 15px 0 0",
        padding: theme.spacing(1.2, 2),
      }}
    >
      <Grid item>
        <FilterAction headers={headerMap} names={names} />
      </Grid>
    </TableRow>
  );
};

export default TableActions;
