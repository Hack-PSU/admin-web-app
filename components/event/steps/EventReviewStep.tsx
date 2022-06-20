import React, { FC } from "react";
import { useStepper } from "components/base";
import { Grid, Typography } from "@mui/material";
import {
  EventDetailsReview,
  WorkshopDetailsReview,
  EventImageReview,
} from "components/event/review";
import EventStep from "./EventStep";
import { EventType } from "types/api";
import { useEventStore } from "common/store";

const EventReviewStep: FC = () => {
  const { active, previousStep } = useStepper(5, "6. Review");

  const onSubmit = () => {
    return null;
  };

  const { eventType, eventImage, eventIcon } = useEventStore();

  return (
    <EventStep
      title={`Review ${
        eventType && eventType.value === EventType.WORKSHOP
          ? "Workshop"
          : "Event"
      }`}
      handleNext={onSubmit}
      handleNextTitle="Submit"
      active={active}
      handlePrevious={previousStep}
    >
      <Grid container item flexDirection="column" rowGap={1.5}>
        <Grid item>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Basic Details
          </Typography>
        </Grid>
        <Grid
          container
          item
          rowGap={2}
          justifyContent="center"
          alignItems="center"
        >
          <EventDetailsReview />
        </Grid>
        {eventType && eventType.value === EventType.WORKSHOP && (
          <>
            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Workshop Details
              </Typography>
            </Grid>
            <Grid
              container
              item
              rowGap={2}
              justifyContent="center"
              alignItems="center"
            >
              <WorkshopDetailsReview />
            </Grid>
          </>
        )}
        {eventImage && (
          <>
            <Grid item sx={{ mt: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Event Image
              </Typography>
            </Grid>
            <Grid container item justifyContent="center" alignItems="center">
              <EventImageReview name={"eventImage"} />
            </Grid>
          </>
        )}
        {eventIcon && (
          <>
            <Grid item sx={{ mt: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Event Icon
              </Typography>
            </Grid>
            <Grid container item justifyContent="center" alignItems="center">
              <EventImageReview name={"eventIcon"} />
            </Grid>
          </>
        )}
      </Grid>
    </EventStep>
  );
};

export default EventReviewStep;
