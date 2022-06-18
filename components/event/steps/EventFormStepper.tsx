import React, { FC } from "react";
import { StepperProvider, Stepper } from "components/base";
import EventTypeStep from "./EventTypeStep";
import { Grid } from "@mui/material";
import EventDetailsStep from "./EventDetailsStep";

const EventFormStepper: FC = () => {
  return (
    <StepperProvider>
      <Stepper />
      <Grid container alignItems="center" gap={10} flexDirection="column">
        <EventTypeStep />
        <EventDetailsStep />
      </Grid>
    </StepperProvider>
  );
};

export default EventFormStepper;
