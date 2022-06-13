import { FC } from "react";
import { Grid, GridProps, useTheme } from "@mui/material";
import { WithChildren } from "types/common";

const TableRow: FC<WithChildren<GridProps>> = ({ children, sx, ...props }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      item
      sx={{
        padding: theme.spacing(1, 0),
        borderBottom: `2px solid ${theme.palette.table.divider}`,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Grid>
  );
};

export default TableRow;
