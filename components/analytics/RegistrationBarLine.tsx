import { useMemo } from "react";
import { Box, darken, Grid, Typography, useTheme } from "@mui/material";
import { MarkerCircle } from "@visx/marker";
import {
  AnimatedAxis,
  AnimatedBarSeries,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  Tooltip,
  buildChartTheme,
} from "@visx/xychart";
import { EvaIcon } from "components/base";

interface IBarLineProps<TBarData> {
  data: TBarData[];
  growth: { [name: string]: number };
  width: number;
  barKey: string;
  lineKey: string;
  lineColor?: string;
  height?: number;
  getXScale: (item: TBarData) => string;
  getYScale: (item: TBarData) => number;
  barColor: string;
  gridColor?: string;
}

function RegistrationBarLine<TBarData extends object>({
  data,
  width,
  height,
  getXScale,
  getYScale,
  barColor,
  lineColor,
  growth,
  barKey,
  lineKey,
}: IBarLineProps<TBarData>) {
  const theme = useTheme();

  const customTheme = useMemo(
    () =>
      buildChartTheme({
        colors: [],
        gridColor: theme.palette.border.light,
        gridColorDark: theme.palette.border.dark,
        tickLength: 0,
        backgroundColor: theme.palette.common.white,
      }),
    [theme]
  );

  return (
    <Grid item>
      <XYChart
        theme={customTheme}
        width={width}
        height={height ?? width}
        xScale={{ type: "band", padding: 0.2 }}
        yScale={{ type: "linear", nice: true }}
      >
        <MarkerCircle
          id={"marker-circle"}
          fill={theme.palette.common.black}
          refX={2}
          size={2}
        />
        <AnimatedAxis
          orientation={"left"}
          tickFormat={(value) =>
            (value as number).toLocaleString("en", { notation: "compact" })
          }
          strokeWidth={0}
          tickLabelProps={() => ({
            fontSize: 10,
            fontWeight: 500,
            color: theme.palette.common.black,
            textAnchor: "end",
            dominantBaseline: "start",
          })}
        />
        <AnimatedGrid columns={false} />
        <AnimatedBarSeries
          dataKey={barKey}
          data={data}
          xAccessor={getXScale}
          yAccessor={getYScale}
          colorAccessor={() => barColor}
        />
        <AnimatedLineSeries
          dataKey={lineKey}
          data={data}
          xAccessor={getXScale}
          yAccessor={getYScale}
          colorAccessor={() => lineColor ?? theme.palette.common.black}
          markerStart={"url(#marker-circle)"}
          markerMid={"url(#marker-circle)"}
          markerEnd={"url(#marker-circle)"}
        />
        <AnimatedAxis
          orientation={"bottom"}
          strokeWidth={0}
          tickLabelProps={() => ({
            fontSize: 10,
            fontWeight: 500,
            color: theme.palette.common.black,
            textAnchor: "middle",
          })}
        />
        <Tooltip
          snapTooltipToDatumX
          snapTooltipToDatumY
          renderTooltip={({ tooltipData }) => {
            if (tooltipData && tooltipData.nearestDatum) {
              const data = tooltipData.nearestDatum.datum;
              const growthAmount = growth[getXScale(data as TBarData)];

              const isIncreasing = growthAmount > 0;
              const growthPercentage = Math.abs(growthAmount).toPrecision(2);

              return (
                <Grid container>
                  <Grid container item alignItems="center">
                    <Grid item>
                      <Box mt={isIncreasing ? 0.3 : 0}>
                        <EvaIcon
                          size={"medium"}
                          name={"arrow-up"}
                          fill={
                            isIncreasing
                              ? theme.palette.success.main
                              : theme.palette.error.main
                          }
                          style={{
                            transform: isIncreasing
                              ? undefined
                              : "rotate(180deg)",
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item ml={0.2}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: isIncreasing
                            ? darken(theme.palette.success.main, 0.4)
                            : darken(theme.palette.error.main, 0.4),
                        }}
                      >
                        {`${growthPercentage}%`}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container item>
                    <Grid item>
                      <Typography variant={"body1"} sx={{ fontWeight: 700 }}>
                        Count:
                      </Typography>
                    </Grid>
                    <Grid item ml={0.5}>
                      <Typography variant={"body1"} sx={{ fontWeight: 600 }}>
                        {getYScale(data as TBarData)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              );
            }
            return null;
          }}
        />
      </XYChart>
    </Grid>
  );
}

export default RegistrationBarLine;
