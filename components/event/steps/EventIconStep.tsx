import React, { FC, useCallback } from "react";
import EventStep from "components/event/steps/EventStep";
import {
  ControlledDropzone,
  ControlledInput,
  DropzonePlaceholder,
  LabelledInput,
  useStepper,
} from "components/base";
import { Grid } from "@mui/material";
import EventDropzoneItem from "components/event/forms/EventDropzoneItem";
import { useForm, FormProvider } from "react-hook-form";
import { useEventStore } from "common/store";
import { EventType } from "api";

const EventIconStep: FC = () => {
  const { eventIcon, updateIcon, eventType } = useEventStore();

  const { nextStep, previousStep, active, gotoStep } = useStepper(
    3,
    "4. Event Icon",
    { optional: true }
  );

  const methods = useForm({
    defaultValues: {
      eventIcon: eventIcon ?? "",
    },
  });

  const handleNext = () => {
    methods.handleSubmit((data) => {
      if (data.eventIcon) {
        updateIcon(data.eventIcon);
        nextStep();
      } else {
        gotoStep(4, 3);
      }
      // if (data.eventIcon.length > 0) {
      //   updateIcon(data.eventIcon[0]);
      //   nextStep();
      // } else {
      //   gotoStep(5, 4);
      // }
    })();
  };

  const handleClickPrevious = useCallback(() => {
    if (eventType && eventType.value !== EventType.WORKSHOP) {
      gotoStep(1, 2);
    } else {
      previousStep();
    }
  }, [eventType, gotoStep, previousStep]);

  return (
    <FormProvider {...methods}>
      <EventStep
        title={"Event Icon"}
        handleNext={handleNext}
        active={active}
        handlePrevious={handleClickPrevious}
      >
        <Grid item>
          <ControlledInput
            id={"eventIcon"}
            name={"eventIcon"}
            placeholder={"Enter event icon url"}
            as={LabelledInput}
            label={"Event Icon URL"}
            showError
            sx={{
              width: "100%",
            }}
          />
          {/*<ControlledDropzone*/}
          {/*  name={"eventIcon"}*/}
          {/*  multiple={false}*/}
          {/*  maxFiles={1}*/}
          {/*  custom*/}
          {/*  replace*/}
          {/*>*/}
          {/*  {methods.watch("eventIcon", []).length > 0 ? (*/}
          {/*    <EventDropzoneItem name="eventIcon" />*/}
          {/*  ) : (*/}
          {/*    <DropzonePlaceholder />*/}
          {/*  )}*/}
          {/*</ControlledDropzone>*/}
        </Grid>
      </EventStep>
    </FormProvider>
  );
};

export default EventIconStep;
