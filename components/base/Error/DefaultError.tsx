import { FC } from "react";
import { Grid, Typography } from "@mui/material";
import { IBaseErrorProps } from "types/components";

const DefaultError: FC<IBaseErrorProps> = () => {
  return (
    <Grid component={"div"} container alignItems="center" justifyContent="center">
      <Grid item>
        <Typography component={"h1"} variant="h1" sx={{ fontSize: '1.2rem' }}>
          Oops an error occurred.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default DefaultError;