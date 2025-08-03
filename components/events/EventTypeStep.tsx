import React, { FC, useCallback, useState } from "react";
import EventStep from "./EventStep";
import { Grid } from "@mui/material";
import { ControlledSelect, LabelledSelect, useStepper } from "components/base";
import { EventType } from "api";
import { FormProvider, useForm } from "react-hook-form";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { enums, object, string } from "superstruct";

const options = [
  { value: EventType.ACTIVITY, label: "Activity" },
  { value: EventType.WORKSHOP, label: "Workshop" },
  { value: EventType.FOOD, label: "Food" },
  { value: EventType.CHECKIN, label: "Check In" },
];

const schema = object({
  type: object({
    value: enums([EventType.FOOD, EventType.ACTIVITY, EventType.WORKSHOP, EventType.CHECKIN]),
    label: string(),
  }),
});

type FormData = {
  type: { value: EventType; label: string };
};

const EventTypeStep: FC = () => {
  const [eventType, setEventType] = useState<{ value: EventType; label: string } | null>(
    { value: EventType.ACTIVITY, label: "Activity" }
  );

  const methods = useForm<FormData>({
    resolver: superstructResolver(schema),
    defaultValues: {
      type: eventType,
    },
  });

  const { active, nextStep } = useStepper(0, "1. Event Type");

  const handleNext = useCallback(() => {
    methods
      .handleSubmit((data) => {
        if (data.type) {
          setEventType(data.type);
          nextStep();
        }
      })();
  }, [methods, nextStep]);

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