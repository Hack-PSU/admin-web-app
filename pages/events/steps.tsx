import React, { FC } from "react";
import { withDefaultLayout } from "common/HOCs";
import { useForm, FormProvider } from "react-hook-form";
import { Grid, Typography } from "@mui/material";
import EventFormStepper from "components/event/steps/EventFormStepper";

const EventSteps: FC = () => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <Grid container flexDirection="column">
        <Grid item>
          <Typography variant="h3">New Events</Typography>
        </Grid>
        <Grid item>
          <EventFormStepper />
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default withDefaultLayout(EventSteps);
