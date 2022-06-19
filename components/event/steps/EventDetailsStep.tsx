import React, { FC, useCallback } from "react";
import EventStep from "components/event/steps/EventStep";
import {
  ControlledCreatableSelect,
  ControlledInput,
  InputLabel,
  LabelledCreatableSelect,
  LabelledInput,
  useStepper,
} from "components/base";
import { Box, Grid } from "@mui/material";
import RichText from "components/base/RichText/RichText";
import DateTimeForm from "components/event/forms/DetailsForm/DateTimeForm";
import { useFormContext } from "react-hook-form";
import { EditorState } from "draft-js";
import { EventType } from "types/api";

const locationOptions = [
  { value: "Location1", label: "Location 1" },
  { value: "Location2", label: "Location 2" },
];

const EventDetailsStep: FC = () => {
  const { getValues } = useFormContext();
  const { nextStep, active, previousStep, gotoStep } = useStepper(
    1,
    "2. Event Details"
  );

  const handleNext = useCallback(() => {
    const eventType = getValues("type");

    if (eventType && eventType.value !== EventType.WORKSHOP) {
      gotoStep(3, 2);
    } else {
      nextStep();
    }
  }, [getValues, gotoStep, nextStep]);

  return (
    <EventStep
      title="Event Details"
      handleNext={handleNext}
      active={active}
      handlePrevious={previousStep}
    >
      <Grid container item spacing={1} gap={2}>
        <Grid item xs={12}>
          <ControlledInput
            name={"name"}
            placeholder={"Enter event name"}
            as={LabelledInput}
            id="name"
            label="Name"
            sx={{
              width: "100%",
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ControlledCreatableSelect
            name={"location"}
            options={locationOptions}
            as={LabelledCreatableSelect}
            id="location"
            label="Location"
            placeholder={"Select a location or type to create one"}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel id={"description"} label={"Description"} />
          <Box mt={0.6}>
            <RichText placeholder="Enter a description" name="description" />
          </Box>
        </Grid>
        <DateTimeForm />
      </Grid>
    </EventStep>
  );
};

export default EventDetailsStep;
