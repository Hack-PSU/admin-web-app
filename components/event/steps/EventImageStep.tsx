import React, { FC, useCallback } from "react";
import EventStep from "./EventStep";
import {
  ControlledDropzone,
  DropzonePlaceholder,
  useStepper,
} from "components/base";
import { useFormContext } from "react-hook-form";
import { Grid } from "@mui/material";
import EventDropzoneItem from "components/event/forms/EventDropzoneItem";

const EventImageStep: FC = () => {
  const { nextStep, gotoStep, previousStep, active } = useStepper(
    3,
    "4. Event Image",
    { optional: true }
  );
  const { watch } = useFormContext();

  const eventImage: File[] = watch("eventImage", []);

  const handleNext = useCallback(() => {
    if (!eventImage) {
      gotoStep(4, 3);
    } else {
      nextStep();
    }
  }, [eventImage, gotoStep, nextStep]);

  return (
    <EventStep
      title={"Event Image"}
      handleNext={handleNext}
      active={active}
      handlePrevious={previousStep}
    >
      <Grid item>
        <ControlledDropzone
          name={"eventImage"}
          multiple={false}
          maxFiles={1}
          custom
          replace
        >
          {eventImage && eventImage.length > 0 ? (
            <EventDropzoneItem />
          ) : (
            <DropzonePlaceholder />
          )}
        </ControlledDropzone>
      </Grid>
    </EventStep>
  );
};

export default EventImageStep;
