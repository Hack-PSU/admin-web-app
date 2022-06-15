import React, { FC } from "react";
import { Grid, useTheme } from "@mui/material";
import { WithChildren } from "types/common";
import Menu from "components/SideMenu/Menu";

const DefaultLayout: FC<WithChildren> = ({ children }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      sx={{
        overflow: "hidden",
        height: "100vh",
      }}
    >
      <Grid item sx={{ overflow: "auto", width: "20%", height: "100vh" }}>
        <Menu />
      </Grid>
      <Grid
        item
        sx={{
          width: "80%",
          flexGrow: 1,
          overflow: "auto",
          height: "100vh",
          padding: theme.spacing(3, 4),
        }}
      >
        {children}
      </Grid>
    </Grid>
  );
};

export default DefaultLayout;
