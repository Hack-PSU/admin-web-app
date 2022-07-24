import { FC } from "react";
import { WithChildren } from "types/common";
import { Grid, GridProps, useTheme } from "@mui/material";

const DefaultRow: FC<WithChildren<GridProps>> = ({ children, ...props }) => {
  const theme = useTheme();

  return (
    <Grid
      {...props}
      container
      item
      sx={{
        padding: theme.spacing(1, 0),
        borderBottom: `2px solid ${theme.palette.border.light}`,
        ...props.sx,
      }}
      alignItems={"center"}
    >
      {children}
    </Grid>
  );
};

export default DefaultRow;
