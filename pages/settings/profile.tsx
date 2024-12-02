import React, { FC } from "react";
import { withSettingsLayout } from "components/settings";
import { Grid, lighten, Typography, useTheme } from "@mui/material";
import { Button } from "components/base";
import { useFirebase } from "api/providers/FirebaseProvider";

const Profile: FC = () => {
  const theme = useTheme();
  const { logout } = useFirebase();

  return (
    <Grid container flexDirection={"column"} gap={1} sx={{ width: "100%" }}>
      <Grid item>
        <Typography
          variant={"h6"}
          sx={{
            fontWeight: 700,
          }}
        >
          Logout
        </Typography>
      </Grid>
      <Grid item sx={{ width: "100%" }}>
        <Button
          onClick={logout}
          sx={{
            width: "20%",
            px: 2,
            py: 1,
            borderRadius: "10px",
            backgroundColor: "common.black",
            ":hover": {
              backgroundColor: lighten(theme.palette.common.black, 0.15),
            },
          }}
          textProps={{
            sx: {
              color: "common.white",
            },
          }}
        >
          Logout
        </Button>
      </Grid>
    </Grid>
  );
};

export default withSettingsLayout(Profile);
