import React, { FC, useCallback } from "react";
import EventStep from "components/event/steps/EventStep";
import {
  ControlledDropzone,
  DropzonePlaceholder,
  useStepper,
} from "components/base";
import { Grid } from "@mui/material";
import EventDropzoneItem from "components/event/forms/EventDropzoneItem";
import { FormProvider, useForm } from "react-hook-form";
import { useEventStore } from "common/store";
import { EventType } from "api";

const EventIconStep: FC = () => {
  const { icon, updateIcon, type } = useEventStore();

  const { nextStep, previousStep, active, gotoStep } = useStepper(
    3,
    "4. Event Icon",
    { optional: true }
  );

  const methods = useForm({
    defaultValues: {
      icon: icon ? [icon] : [],
    },
  });

  const handleNext = () => {
    methods.handleSubmit((data) => {
      if (data.icon) {
        updateIcon(data.icon[0]);
        nextStep();
      } else {
        gotoStep(4, 3);
      }
    })();
  };

  const handleClickPrevious = useCallback(() => {
    if (type && type.value !== EventType.WORKSHOP) {
      gotoStep(1, 2);
    } else {
      previousStep();
    }
  }, [type, gotoStep, previousStep]);

  return (
    <FormProvider {...methods}>
      <EventStep
        title={"Event Icon"}
        handleNext={handleNext}
        active={active}
        handlePrevious={handleClickPrevious}
      >
        <Grid item>
          <ControlledDropzone
            name={"icon"}
            multiple={false}
            maxFiles={1}
            custom
            replace
          >
            {methods.watch("icon", []).length > 0 ? (
              <EventDropzoneItem name={"icon"} />
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
