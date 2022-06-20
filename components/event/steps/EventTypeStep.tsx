import React, { FC, useCallback } from "react";
import EventStep from "./EventStep";
import { Grid } from "@mui/material";
import { ControlledSelect, LabelledSelect, useStepper } from "components/base";
import { EventType } from "types/api";
import { useForm, FormProvider } from "react-hook-form";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { assert, enums, object, string } from "superstruct";
import { useEventDispatch, useEventStore } from "common/store";

const options = [
  { value: EventType.ACTIVITY, label: "Activity" },
  { value: EventType.WORKSHOP, label: "Workshop" },
  { value: EventType.FOOD, label: "Food" },
];

const schema = object({
  type: object({
    value: enums([EventType.FOOD, EventType.ACTIVITY, EventType.WORKSHOP]),
    label: string(),
  }),
});

const EventTypeStep: FC = () => {
  const { eventType } = useEventStore();
  const dispatch = useEventDispatch();

  const methods = useForm({
    resolver: superstructResolver(schema),
    defaultValues: {
      type: eventType,
    },
  });

  const { active, nextStep } = useStepper(0, "1. Event Type");

  const handleNext = useCallback(() => {
    methods
      .handleSubmit((data, error) => {
        if (data.type) {
          dispatch("UPDATE_TYPE", { type: data.type });
        }
      })()
      .then(() => nextStep());
  }, [dispatch, methods, nextStep]);

  return (
    <FormProvider {...methods}>
      <EventStep title="Event Type" handleNext={handleNext} active={active}>
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
    </FormProvider>
  );
};

export default EventTypeStep;
