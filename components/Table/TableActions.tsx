import React, { FC } from "react";
import TableRow from "components/Table/TableRow";
import { Grid, useTheme } from "@mui/material";

interface ITableActionsProps {
  names: string[];
}

const TableActions: FC<ITableActionsProps> = ({ names }) => {
  const theme = useTheme();

  return (
    <TableRow
      sx={{
        borderRadius: "15px 15px 0 0",
        padding: theme.spacing(1.2, 2),
      }}
    >
      <Grid container item>
        <Grid item></Grid>
      </Grid>
    </TableRow>
  );
};

export default TableActions;
