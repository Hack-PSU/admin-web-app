import { FC } from "react";
import { HeaderGroup } from "react-table";
import { Box, Grid, useTheme } from "@mui/material";
import { EvaIcon } from "components/base";

interface ISortColumnProps {
  header: HeaderGroup;
}

const ArrowUp: FC<{ fill: string }> = ({ fill }) => (
  <path
    d="M7.65837 6.68798L1.34337 6.68798C1.09407 6.68834 0.84975 6.61809 0.63871 6.48536C0.427669 6.35263 0.258531 6.16285 0.150875 5.93798C0.0248504 5.67117 -0.0236889 5.37433 0.0107878 5.08128C0.0452645 4.78823 0.161371 4.51075 0.345875 4.28048L3.50338 0.455481C3.62729 0.312509 3.78049 0.197844 3.95259 0.119258C4.12469 0.040672 4.31168 7.53878e-07 4.50088 7.86958e-07C4.69007 8.20038e-07 4.87706 0.0406721 5.04916 0.119258C5.22127 0.197845 5.37446 0.312509 5.49838 0.455482L8.65588 4.28048C8.84038 4.51076 8.95649 4.78823 8.99096 5.08128C9.02544 5.37433 8.9769 5.67118 8.85088 5.93798C8.74322 6.16285 8.57408 6.35263 8.36304 6.48536C8.152 6.61809 7.90768 6.68834 7.65837 6.68798Z"
    fill={fill}
  />
);

const ArrowDown: FC<{ fill: string }> = ({ fill }) => (
  <path
    d="M1.34333 10L7.65833 10C7.90764 9.99965 8.15196 10.0699 8.363 10.2026C8.57404 10.3354 8.74318 10.5251 8.85083 10.75C8.97686 11.0168 9.0254 11.3137 8.99092 11.6067C8.95644 11.8998 8.84034 12.1772 8.65583 12.4075L5.49833 16.2325C5.37442 16.3755 5.22122 16.4901 5.04912 16.5687C4.87702 16.6473 4.69003 16.688 4.50083 16.688C4.31164 16.688 4.12465 16.6473 3.95255 16.5687C3.78044 16.4901 3.62725 16.3755 3.50333 16.2325L0.345832 12.4075C0.161327 12.1772 0.0452212 11.8998 0.0107445 11.6067C-0.0237321 11.3137 0.0248087 11.0168 0.150833 10.75C0.25849 10.5251 0.427627 10.3354 0.638668 10.2026C0.849709 10.0699 1.09402 9.99965 1.34333 10Z"
    fill={fill}
  />
);

const Defs = () => (
  <defs>
    <linearGradient
      id="paint0_linear_269_1491"
      x1="5.0001"
      y1="6.68799"
      x2="5.0001"
      y2="6.28224e-06"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#FC466B" />
      <stop offset="1" stopColor="#EF9771" />
    </linearGradient>
    <linearGradient
      id="paint0_linear_273_1443"
      x1="4.50088"
      y1="7.86958e-07"
      x2="4.50088"
      y2="6.68798"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#FC466B" />
      <stop offset="1" stopColor="#EF9771" />
    </linearGradient>
  </defs>
);

const SortColumn: FC<ISortColumnProps> = ({ header }) => {
  const theme = useTheme();

  return (
    <Grid container item flexDirection="column">
      <svg
        width="10"
        height="17"
        viewBox="0 0 10 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ArrowUp
          fill={
            header.isSorted && !header.isSortedDesc
              ? "url(#paint0_linear_273_1443)"
              : theme.palette.header.light
          }
        />
        <ArrowDown
          fill={
            header.isSorted && header.isSortedDesc
              ? "url(#paint0_linear_269_1491)"
              : theme.palette.header.light
          }
        />
        <Defs />
      </svg>
    </Grid>
  );
};

export default SortColumn;
