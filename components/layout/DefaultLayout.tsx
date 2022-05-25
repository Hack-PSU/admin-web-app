import React, {FC} from "react";
import {Grid} from "@mui/material";
import {WithChildren} from "types/common";

const DefaultLayout: FC<WithChildren> = ({ children }) => {
  return (
    <Grid
      container
      sx={{
        overflow: "hidden",
        height: "100vh",
      }}
    >
      <Grid item sx={{ overflow: "hidden", width: "20%", height: "100vh" }}>
      {/* Side Menu Here */}
      </Grid>
      <Grid item sx={{ flexGrow: 1, overflow: "auto", height: '100vh' }}>
        { children }
      </Grid>
    </Grid>
  )
}

export default DefaultLayout