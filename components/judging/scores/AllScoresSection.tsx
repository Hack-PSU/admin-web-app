import React, { FC } from "react";
import { UseScoreResultsReturn } from "components/judging";
import { Grid, Typography } from "@mui/material";

type AllScoresSectionProps = Pick<UseScoreResultsReturn, "allData">;

const AllScoresSection: FC<AllScoresSectionProps> = ({ allData }) => {
  return (
    <Grid container item>
      <Grid item>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          All Scores
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AllScoresSection;
