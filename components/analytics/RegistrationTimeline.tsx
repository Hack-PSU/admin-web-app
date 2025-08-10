import { useMemo } from "react";
import { Grid, useTheme } from "@mui/material";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  XYChart,
  Tooltip,
  buildChartTheme,
} from "@visx/xychart";
import { Line } from "@visx/shape";

export interface TimelineDataPoint {
  day: number;
  count: number;
  hackathonName: string;
  hackathonId: string;
}

interface IRegistrationTimelineProps {
  data: TimelineDataPoint[];
  width: number;
  height?: number;
}

function RegistrationTimeline({
  data,
  width,
  height = 350,
}: IRegistrationTimelineProps) {
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

  // Group data by hackathon for different colored lines
  const groupedData = useMemo(() => {
    const groups = data.reduce((acc, point) => {
      if (!acc[point.hackathonId]) {
        acc[point.hackathonId] = {
          name: point.hackathonName,
          data: [],
          color: theme.palette.primary.main, // Default color
        };
      }
      acc[point.hackathonId].data.push(point);
      return acc;
    }, {} as Record<string, { name: string; data: TimelineDataPoint[]; color: string }>);

    // Assign different colors to each hackathon
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.sunset.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ];

    Object.keys(groups).forEach((key, index) => {
      groups[key].color = colors[index % colors.length];
    });

    return groups;
  }, [data, theme]);

  return (
    <Grid item>
      <XYChart
        theme={customTheme}
        width={width}
        height={height}
        xScale={{ type: "linear", nice: true }}
        yScale={{ type: "linear", nice: true }}
      >
        <AnimatedAxis
          orientation={"left"}
          label="Registration Count"
          tickFormat={(value) =>
            (value as number).toLocaleString("en", { notation: "compact" })
          }
          strokeWidth={0}
          tickLabelProps={() => ({
            fontSize: 10,
            fontWeight: 500,
            color: theme.palette.common.black,
            textAnchor: "end",
            dominantBaseline: "middle",
          })}
        />
        <AnimatedAxis
          orientation={"bottom"}
          label="Days Before Event"
          strokeWidth={0}
          tickFormat={(value) => `${Math.abs(value as number)}`}
          tickLabelProps={() => ({
            fontSize: 10,
            fontWeight: 500,
            color: theme.palette.common.black,
            textAnchor: "middle",
          })}
        />
        <AnimatedGrid columns={false} />
        
        {/* Render a line series for each hackathon */}
        {Object.entries(groupedData).map(([hackathonId, group]) => (
          <AnimatedLineSeries
            key={hackathonId}
            dataKey={`line-${hackathonId}`}
            data={group.data}
            xAccessor={(d) => d.day}
            yAccessor={(d) => d.count}
            colorAccessor={() => group.color}
          />
        ))}
        
        <Tooltip
          snapTooltipToDatumX
          showHorizontalCrosshair
          showVerticalCrosshair
          renderTooltip={({ tooltipData, colorScale }) => {
            if (tooltipData && tooltipData.nearestDatum) {
              const data = tooltipData.nearestDatum.datum as TimelineDataPoint;
              const day = data.day;
              
              // Find all data points at this x-position (day) across all hackathons
              const allDataAtDay = Object.entries(groupedData).map(([hackathonId, group]) => {
                const dataPoint = group.data.find(d => d.day === day);
                return dataPoint ? { ...dataPoint, color: group.color } : null;
              }).filter(Boolean);
              
              return (
                <div style={{ 
                  padding: '8px', 
                  backgroundColor: 'white', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  minWidth: '150px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    Day {Math.abs(day)} before event
                  </div>
                  {allDataAtDay.map((point, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '4px' 
                    }}>
                      <div style={{ 
                        width: '12px', 
                        height: '3px', 
                        backgroundColor: point.color,
                        marginRight: '8px'
                      }} />
                      <div style={{ fontSize: '12px' }}>
                        <strong>{point.hackathonName}:</strong> {point.count}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />
      </XYChart>
    </Grid>
  );
}

export default RegistrationTimeline;