import React, { FC, useEffect } from "react";
import { withDefaultLayout } from "common/HOCs";
import { useForm, FormProvider } from "react-hook-form";
import { Grid, Typography } from "@mui/material";
import EventFormStepper from "components/event/steps/EventFormStepper";
import { useEventDispatch } from "common/store";

const EventSteps: FC = () => {
  const dispatch = useEventDispatch();

  useEffect(() => {
    dispatch("CLEAR");
  }, [dispatch]);

  return (
    <Grid container flexDirection="column" sx={{ paddingBottom: 2 }}>
      <Grid item>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          New Events
        </Typography>
      </Grid>
      <Grid item>
        <EventFormStepper />
      </Grid>
    </Grid>
  );
};

export default withDefaultLayout(EventSteps);
