import React, { FC, useEffect } from "react";
import { WithChildren } from "types/common";
import { useFirebase } from "components/context";
import Spinner from "assets/lottie/spinner.json";

import Lottie from "lottie-react";
import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";

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

const Root: FC<WithChildren> = ({ children }) => {
  const { isAuthenticated } = useFirebase();
  const router = useRouter();

  const isLogin = router.pathname.startsWith("/login");

  return (
    <Box sx={{ backgroundColor: "background.light" }}>
      {isAuthenticated || isLogin ? children : <Loading />}
    </Box>
  );
};

export default Root;
