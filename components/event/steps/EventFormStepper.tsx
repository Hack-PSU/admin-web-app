import React, { FC } from "react";
import { StepperProvider, Stepper } from "components/base";
import EventTypeStep from "./EventTypeStep";
import { Grid } from "@mui/material";
import EventDetailsStep from "./EventDetailsStep";
import WorkshopDetailsStep from "./WorkshopDetailsStep";
import EventImageStep from "./EventImageStep";
import EventIconStep from "./EventIconStep";
import EventReviewStep from "./EventReviewStep";

const EventFormStepper: FC = () => {
  return (
    <StepperProvider>
      <Stepper />
      <Grid container alignItems="center" gap={10} flexDirection="column">
        <EventTypeStep />
        <EventDetailsStep />
        <WorkshopDetailsStep />
        <EventImageStep />
        <EventIconStep />
        <EventReviewStep />
      </Grid>
    </StepperProvider>
  );
};

export default EventFormStepper;
