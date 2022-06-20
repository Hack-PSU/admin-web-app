import React, { FC, useEffect, useState } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { WithChildren } from "types/common";
import Menu from "components/SideMenu/Menu";

const DefaultLayout: FC<WithChildren> = ({ children }) => {
  const theme = useTheme();
  const shouldClose = useMediaQuery(theme.breakpoints.down("lg"));

  const [open, setOpen] = useState<boolean>(true);

  const toggleDrawer = () => {
    setOpen((open) => !open);
  };

  useEffect(() => {
    if (shouldClose) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [shouldClose]);

  return (
    <Grid
      container
      sx={{
        overflow: "hidden",
        height: "100vh",
      }}
    >
      <Grid
        item
        sx={{ overflow: "auto", width: open ? "20%" : 0, height: "100vh" }}
      >
        <Menu
          open={open}
          shouldClose={shouldClose}
          handleClose={toggleDrawer}
        />
      </Grid>
      <Grid
        item
        sx={{
          width: open ? "80%" : "100%",
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
