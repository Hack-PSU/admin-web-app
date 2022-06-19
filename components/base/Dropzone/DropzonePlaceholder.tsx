import React, { FC } from "react";
import { Grid, Typography } from "@mui/material";
import EvaIcon from "../EvaIcon";

const DropzonePlaceholder: FC = () => {
  return (
    <>
      <Grid item>
        <EvaIcon
          name={"cloud-upload-outline"}
          size="xlarge"
          fill="#1a1a1a"
          style={{ transform: "scale(1.6)" }}
        />
      </Grid>
      <Grid item>
        <Typography
          variant="h6"
          sx={{ color: "common.black", fontWeight: 700 }}
        >
          Drag &amp; Drop Images Here
        </Typography>
      </Grid>
    </>
  );
};

export default DropzonePlaceholder;
