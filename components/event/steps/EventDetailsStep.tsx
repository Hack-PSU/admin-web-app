import React, { FC } from "react";
import EventStep from "components/event/steps/EventStep";
import {
  ControlledCreatable,
  ControlledInput,
  InputLabel,
  LabelledCreatable,
  LabelledInput,
  useStepper,
} from "components/base";
import { Box, Grid } from "@mui/material";
import RichText from "components/base/RichText/RichText";
import DateTimeForm from "components/event/forms/DetailsForm/DateTimeForm";

const locationOptions = [
  { value: "Location1", label: "Location 1" },
  { value: "Location2", label: "Location 2" },
];

const EventDetailsStep: FC = () => {
  const { nextStep, active, previousStep } = useStepper(1, "2. Event Details");

  return (
    <EventStep
      title="Event Details"
      handleNext={nextStep}
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
          <ControlledCreatable
            name={"location"}
            options={locationOptions}
            as={LabelledCreatable}
            id="location"
            label="Location"
            placeholder={"Select or type to create"}
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
