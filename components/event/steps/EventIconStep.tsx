import React, { FC } from "react";
import EventStep from "components/event/steps/EventStep";
import {
  ControlledDropzone,
  DropzonePlaceholder,
  useStepper,
} from "components/base";
import { Grid } from "@mui/material";
import EventDropzoneItem from "components/event/forms/EventDropzoneItem";
import { useForm, FormProvider } from "react-hook-form";
import { useEventDispatch, useEventStore } from "common/store";

const EventIconStep: FC = () => {
  const { eventIcon } = useEventStore();
  const dispatch = useEventDispatch();

  const { nextStep, previousStep, active, gotoStep } = useStepper(
    4,
    "5. Event Icon",
    { optional: true }
  );

  const methods = useForm({
    defaultValues: {
      eventIcon: eventIcon ? [eventIcon] : [],
    },
  });

  const handleNext = () => {
    methods.handleSubmit((data, errors) => {
      if (data.eventIcon.length > 0) {
        dispatch("UPDATE_ICON", {
          eventIcon: data.eventIcon[0],
        });
        nextStep();
      } else {
        gotoStep(5, 4);
      }
    })();
  };

  return (
    <FormProvider {...methods}>
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
            {methods.watch("eventIcon", []).length > 0 ? (
              <EventDropzoneItem name="eventIcon" />
            ) : (
              <DropzonePlaceholder />
            )}
          </ControlledDropzone>
        </Grid>
      </EventStep>
    </FormProvider>
  );
};

export default EventIconStep;
