import React, { FC } from "react";
import { Stepper } from "components/base";
import { Grid } from "@mui/material";
import EventTypeStep from "./EventTypeStep";
import EventDetailsStep from "./EventDetailsStep";
import WorkshopDetailsStep from "./WorkshopDetailsStep";
import EventIconStep from "./EventIconStep";
import EventReviewStep from "./EventReviewStep";

const EventFormStepper: FC = () => {
  return (
    <>
      <Stepper />
      <Grid container alignItems="center" gap={10} flexDirection="column">
        <EventTypeStep />
        <EventDetailsStep />
        <WorkshopDetailsStep />
        <EventIconStep />
        <EventReviewStep />
      </Grid>
    </>
  );
};

export default EventFormStepper;