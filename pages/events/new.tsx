import React, { FC, useEffect } from "react";
import { withDefaultLayout } from "common/HOCs";
import { Grid, Typography } from "@mui/material";
import EventFormStepper from "components/event/steps/EventFormStepper";
import { useEventStore } from "common/store";

const EventSteps: FC = () => {
  const { clear } = useEventStore();

  useEffect(() => {
    clear();
  }, [clear]);

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
