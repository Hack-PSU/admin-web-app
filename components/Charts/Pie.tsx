import React, { useCallback, useRef } from "react";
import * as Shape from "@visx/shape";
import { PieProps } from "@visx/shape/lib/shapes/Pie";
import { Group } from "@visx/group";
import { hexToRgb } from "common/color";
import { schemeTableau10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "@visx/scale";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import _ from "lodash";

// @ts-expect-error no typedefs
import Color from "colorjs.io";
import { Box, Grid, Typography } from "@mui/material";

interface IPieProps<TData> extends PieProps<TData> {
  // units are in px
  width: number;
  getKey: (item: TData) => string;
  getLabel: (item: TData) => string;
  getCount: (item: TData) => number;
  getTooltipData: (item: TData) => string;
  height?: number;
  arcWidth?: number;
  useD3Color?: boolean;

  // range must be in hex
  colorRange?: [string, string];
  d3Color?: readonly string[];
}

const hexToColor = (hex: string) => {
  const rgb = hexToRgb(hex);
  if (rgb) {
    const normalized = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
    return new Color("srgb", normalized);
  }
};

const interpolateColor = (
  interpolate: (point: number) => string,
  length: number
) => {
  return (order: number) => interpolate(order / length);
};

function Pie<TData extends object>({
  width,
  height,
  data,
  arcWidth,
  colorRange,
  d3Color,
  getKey,
  getLabel,
  getTooltipData,
  getCount,
  useD3Color = true,
  ...props
}: IPieProps<TData>) {
  const {
    showTooltip,
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    hideTooltip,
  } = useTooltip<TData>();
  const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal(
    {
      scroll: true,
      detectBounds: true,
    }
  );

  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipTimeout = useRef<{ timeout?: NodeJS.Timeout }>({
    timeout: undefined,
  });

  const centerX = width / 2;
  const centerY = height ? height / 2 : centerX;
  const outerRadius = centerY;
  const innerRadius = outerRadius - (arcWidth ?? centerX / 2.1);

  const margin = { horizontal: 10, vertical: 10 };

  const colorScaleHex = useCallback(
    (order: number) => {
      const length = data ? data.length : 1;
      if (colorRange) {
        const scale = [hexToColor(colorRange[0]), hexToColor(colorRange[1])];
        return interpolateColor(
          (point) =>
            scale[0].range(scale[1], {
              space: "p3",
              outputSpace: "srgb",
              maxDeltaE: length,
            })(point),
          length
        )(order);
      }
    },
    [colorRange, data]
  );

  const d3ColorScale = useCallback(
    (key: string) => {
      if (data) {
        const d3Range = (d3Color ?? schemeTableau10) as string[];
        const keys = data.map(getKey);

        return scaleOrdinal<string, string>({
          domain: keys,
          range: d3Range,
        })(key);
      }
      return "";
    },
    [d3Color, getKey, data]
  );

  const onHoverData = useCallback(
    (event: React.MouseEvent, data: TData) => {
      if (tooltipTimeout.current?.timeout)
        clearTimeout(tooltipTimeout.current.timeout);

      const containerX =
        ("clientX" in event ? event.clientX : 0) - containerBounds.left;
      const containerY =
        ("clientY" in event ? event.clientY : 0) - containerBounds.top;

      showTooltip({
        tooltipTop: containerY,
        tooltipLeft: containerX,
        tooltipData: data,
      });
    },
    [containerBounds.left, containerBounds.top, showTooltip]
  );

  const onMouseLeave = useCallback(() => {
    tooltipTimeout.current.timeout = setTimeout(() => {
      hideTooltip();
    }, 3000);
  }, [hideTooltip]);

  return (
    <Grid container item ref={containerRef} pt={2}>
      <svg
        width={width + 2 * margin.vertical}
        height={height ?? width + 2 * margin.horizontal}
        ref={svgRef}
      >
        <Group
          top={centerX + margin.vertical / 2}
          left={centerY + margin.horizontal / 2}
        >
          <Shape.Pie
            data={data}
            padAngle={0.02}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            pieValue={getCount}
            {...props}
          >
            {(pie) =>
              pie.arcs.map((arc) => {
                const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.2;
                const [centroidX, centroidY] = pie.path.centroid(arc);

                return (
                  <g
                    key={`pie-arc-${getKey(arc.data)}-${arc.index}`}
                    onMouseMove={(e) => onHoverData(e, arc.data)}
                    onMouseLeave={onMouseLeave}
                  >
                    <path
                      d={`${pie.path(arc)}`}
                      fill={
                        useD3Color
                          ? d3ColorScale(getKey(arc.data))
                          : colorScaleHex(arc.index)
                      }
                    />
                    {hasSpaceForLabel && (
                      <g key={`pie-arc-text-${getKey(arc.data)}`}>
                        <text
                          textAnchor={"middle"}
                          x={centroidX}
                          y={centroidY}
                          fontSize={12}
                          pointerEvents={"none"}
                          fill={"white"}
                          fontWeight={600}
                          fontFamily={"Inter"}
                        >
                          {_.capitalize(getLabel(arc.data))}
                        </text>
                        <text
                          textAnchor={"middle"}
                          x={centroidX}
                          y={centroidY}
                          dy={"1rem"}
                          fontSize={12}
                          pointerEvents={"none"}
                          fill={"white"}
                          fontWeight={400}
                          fontFamily={"Inter"}
                        >
                          {getTooltipData(arc.data)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })
            }
          </Shape.Pie>
        </Group>
      </svg>
      {tooltipOpen && tooltipData && !!tooltipLeft && !!tooltipTop && (
        <TooltipInPortal left={tooltipLeft} top={tooltipTop - 50}>
          <Grid container>
            <Grid container item spacing={0.5}>
              <Grid item>
                <Typography
                  variant={"body1"}
                  sx={{
                    fontWeight: 700,
                    color: "common.black",
                    fontSize: "0.8rem",
                  }}
                >
                  Label:
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant={"body1"}
                  sx={{
                    fontWeight: 500,
                    color: "common.black",
                    fontSize: "0.8rem",
                  }}
                >
                  {_.capitalize(getLabel(tooltipData))}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item spacing={0.5}>
              <Grid item>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    color: "common.black",
                    fontSize: "0.8rem",
                  }}
                >
                  Count:
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: "common.black",
                    fontSize: "0.8rem",
                  }}
                >
                  {getCount(tooltipData)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </TooltipInPortal>
      )}
    </Grid>
  );
}

export default Pie;
