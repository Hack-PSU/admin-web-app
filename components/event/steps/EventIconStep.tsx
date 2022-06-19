import React, { FC, useCallback } from "react";
import EventStep from "components/event/steps/EventStep";
import {
  ControlledDropzone,
  DropzonePlaceholder,
  useStepper,
} from "components/base";
import { Grid } from "@mui/material";
import EventDropzoneItem from "components/event/forms/EventDropzoneItem";
import { useFormContext } from "react-hook-form";

const EventIconStep: FC = () => {
  const { watch } = useFormContext();
  const { nextStep, previousStep, active, gotoStep } = useStepper(
    4,
    "5. Event Icon",
    { optional: true }
  );

  const eventIcon: File[] = watch("eventIcon", []);

  const handleNext = useCallback(() => {
    if (!eventIcon) {
      gotoStep(5, 4);
    } else {
      nextStep();
    }
  }, [eventIcon, gotoStep, nextStep]);

  return (
    <EventStep
      title={"Event Icon"}
      handleNext={handleNext}
      active={active}
      handlePrevious={previousStep}
    >
      <Grid item>
        <ControlledDropzone
          name={"eventIcon"}
          multiple={false}
          maxFiles={1}
          custom
          replace
        >
          {eventIcon && eventIcon.length > 0 ? (
            <EventDropzoneItem />
          ) : (
            <DropzonePlaceholder />
          )}
        </ControlledDropzone>
      </Grid>
    </EventStep>
  );
};

export default EventIconStep;
