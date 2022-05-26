import { FC } from "react";
import { IBaseErrorProps } from "types/components";
import { Grid, Typography } from "@mui/material";

const UnauthorizedError: FC<IBaseErrorProps> = ({ error }) => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100%", height: "100%" }}
      flexDirection="column"
      gap={0.5}
    >
      <Grid item>
        <Typography component={"h2"} variant="h4" textAlign="center" sx={{ fontSize: '2px' }}>
          An error occurred: { error }
        </Typography>
      </Grid>
      <Grid item>
        <Typography component={"h3"} variant="body1" textAlign="center">
          You do not have access to this page.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default UnauthorizedError;