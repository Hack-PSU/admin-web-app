import { FC } from "react";
import { Grid, GridProps, Typography, useTheme } from "@mui/material";
import { WithChildren } from "types/common";

interface IChartContainer extends GridProps {
  title: string;
}

const ChartContainer: FC<WithChildren<IChartContainer>> = ({
  title,
  children,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Grid
      container
      item
      flexDirection="column"
      {...props}
      sx={{
        boxShadow: 2,
        borderRadius: "15px",
        padding: theme.spacing(3, 4),
        ...props.sx,
      }}
    >
      <Grid item>
        <Typography
          variant="h6"
          sx={{ color: "common.black", fontWeight: 700 }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid container item justifyContent="center" alignItems="center">
        {children}
      </Grid>
    </Grid>
  );
};

export default ChartContainer;
