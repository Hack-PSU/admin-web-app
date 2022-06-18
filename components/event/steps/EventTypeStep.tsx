import React, { FC, useCallback } from "react";
import EventStep from "./EventStep";
import { Grid } from "@mui/material";
import { ControlledSelect, LabelledSelect, useStepper } from "components/base";
import { EventType } from "types/api";
import { useFormContext } from "react-hook-form";

const options = [
  { value: EventType.ACTIVITY, label: "Activity" },
  { value: EventType.WORKSHOP, label: "Workshop" },
  { value: EventType.FOOD, label: "Food" },
];

const EventTypeStep: FC = () => {
  const { active, nextStep } = useStepper(0, "1. Event Type");

  return (
    <EventStep title="Event Type" handleNext={nextStep} active={active}>
      <Grid item>
        <ControlledSelect
          name="type"
          options={options}
          as={LabelledSelect}
          id={"type"}
          label="Type"
        />
      </Grid>
    </EventStep>
  );
};

export default EventTypeStep;
