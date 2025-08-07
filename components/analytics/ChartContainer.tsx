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
        // reduce padding on extra-small screens to maximise available space
        padding: { xs: theme.spacing(2, 2), sm: theme.spacing(3, 4) },
        // allow horizontal scrolling on small screens when charts are wider than
        // the viewport; ensures charts remain usable without breaking layout
        overflowX: "auto",
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
