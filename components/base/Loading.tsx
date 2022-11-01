import React, { FC } from "react";
import { Grid, Typography } from "@mui/material";
import Lottie from "lottie-react";
import Spinner from "assets/lottie/spinner.json";

const Loading: FC = () => {
  return (
    <Grid
      container
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "100vh",
        width: "100%",
      }}
    >
      <Grid item>
        <Lottie
          animationData={Spinner}
          loop
          autoplay
          style={{ height: "250px" }}
        />
      </Grid>
      <Grid item>
        <Typography variant="h2" sx={{ fontWeight: 600 }}>
          Loading
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Loading;
