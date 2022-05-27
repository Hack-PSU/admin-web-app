import React, { FC } from "react";
import { Grid, useTheme } from "@mui/material";
import { WithChildren } from "types/common";
import { SideMenu } from "components/SideMenu";

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
      <Grid item sx={{ overflow: "hidden", width: "20%", height: "100vh" }}>
        <SideMenu />
      </Grid>
      <Grid
        item
        sx={{
          flexGrow: 1,
          overflow: "auto",
          height: "100vh",
          padding: theme.spacing(3, 5) }}
      >
        {children}
      </Grid>
    </Grid>
  );
};

export default DefaultLayout;