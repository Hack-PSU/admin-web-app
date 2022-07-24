import { FC } from "react";
import { WithChildren } from "types/common";
import { Grid, GridProps, useTheme } from "@mui/material";

const DefaultCell: FC<WithChildren<GridProps>> = ({ children, ...props }) => {
  const theme = useTheme();

  return (
    <Grid
      {...props}
      container
      item
      sx={{
        padding: theme.spacing(0, 2, 0, 0),
        my: "auto",
        ...props.sx,
      }}
    >
      {children}
    </Grid>
  );
};

export default DefaultCell;
