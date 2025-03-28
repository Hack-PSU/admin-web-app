import React, { FC } from "react";
import { Grid, Typography, CircularProgress } from "@mui/material";

const Loading: FC = () => {
  return (
    <Grid
      container
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100vh", width: "100%" }}
    >
      <Grid item>
        <CircularProgress size={250} sx={{ color: "#1976d2" }} />
      </Grid>
      <Grid item>
        <Typography variant="h2" sx={{ fontWeight: 600, mt: 2 }}>
          Loading
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Loading;
