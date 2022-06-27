import React, { FC, useCallback } from "react";
import EventStep from "./EventStep";
import {
  ControlledDropzone,
  DropzonePlaceholder,
  useStepper,
} from "components/base";
import { useForm, FormProvider } from "react-hook-form";
import { Grid } from "@mui/material";
import EventDropzoneItem from "components/event/forms/EventDropzoneItem";
import { useEventDispatch, useEventStore } from "common/store";
import { EventType } from "api";

const EventImageStep: FC = () => {
  const { eventImage, eventType } = useEventStore();
  const dispatch = useEventDispatch();

  const { nextStep, gotoStep, previousStep, active } = useStepper(
    3,
    "4. Event Image",
    { optional: true }
  );
  const methods = useForm({
    defaultValues: {
      eventImage: eventImage ? [eventImage] : [],
    },
  });

  const handleNext = () => {
    methods.handleSubmit((data) => {
      if (data.eventImage.length > 0) {
        dispatch("UPDATE_IMAGE", {
          eventImage: data.eventImage[0],
        });
        nextStep();
      } else {
        // mark current step as skipped
        gotoStep(4, 3);
      }
    })();
  };

  const handlePrevious = useCallback(() => {
    if (eventType && eventType.value === EventType.WORKSHOP) {
      previousStep();
    } else {
      // skip workshop details (ie. previous step)
      gotoStep(1, 2);
    }
  }, [eventType, previousStep, gotoStep]);

  return (
    <FormProvider {...methods}>
      <EventStep
        title={"Event Image"}
        handleNext={handleNext}
        active={active}
        handlePrevious={handlePrevious}
      >
        <Grid item>
          <ControlledDropzone
            name={"eventImage"}
            multiple={false}
            maxFiles={1}
            custom
            replace
          >
            {methods.watch("eventImage", []).length > 0 ? (
              <EventDropzoneItem name="eventImage" />
            ) : (
              <DropzonePlaceholder />
            )}
          </ControlledDropzone>
        </Grid>
      </EventStep>
    </FormProvider>
  );
};

export default EventImageStep;
