import React, { FC } from "react";
import { withDefaultLayout } from "common/HOCs";
import { Grid, Typography } from "@mui/material";
import { StepperProvider } from "components/base";
import EventFormStepper from "components/events/EventFormStepper";

const EventSteps: FC = () => {
  return (
    <Grid container flexDirection="column" sx={{ paddingBottom: 2 }}>
      <Grid item>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          New Events
        </Typography>
      </Grid>
      <Grid item>
        <StepperProvider>
          <EventFormStepper />
        </StepperProvider>
      </Grid>
    </Grid>
  );
};

export default withDefaultLayout(EventSteps);