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
import { useForm, FormProvider } from "react-hook-form";
import { EventType } from "api";
import { useEventDispatch, useEventStore } from "common/store";
import { any, date, object, optional } from "superstruct";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { NonEmptySelect, NonEmptyString } from "common/form";

const locationOptions = [
  { value: "Location1", label: "Location 1" },
  { value: "Location2", label: "Location 2" },
];

const schema = object({
  eventName: NonEmptyString,
  eventLocation: NonEmptySelect,
  eventDescription: optional(any()),
  eventDate: object({
    start: date(),
    end: date(),
  }),
});

const EventDetailsStep: FC = () => {
  const { eventType, eventName, eventLocation, eventDescription, eventDate } =
    useEventStore();
  const dispatch = useEventDispatch();

  const methods = useForm({
    // @ts-ignore
    resolver: superstructResolver(schema),
    defaultValues: {
      eventName,
      eventLocation,
      eventDescription,
      eventDate,
    },
  });

  const { nextStep, active, previousStep, gotoStep } = useStepper(
    1,
    "2. Event Details"
  );

  const handleNext = () => {
    methods.handleSubmit((data, errors) => {
      if (!errors) {
        dispatch("UPDATE_DETAILS", {
          eventName: data.eventName,
          eventLocation: data.eventLocation,
          eventDescription: data.eventDescription,
          eventDate: data.eventDate,
        });
        if (eventType && eventType.value !== EventType.WORKSHOP) {
          gotoStep(3, 2);
        } else {
          nextStep();
        }
      }
    })();
  };

  return (
    <FormProvider {...methods}>
      <EventStep
        title="Event Details"
        handleNext={handleNext}
        handleNextTitle={
          eventType && eventType.value === EventType.WORKSHOP
            ? "Next"
            : "Continue to Event Image"
        }
        active={active}
        handlePrevious={previousStep}
      >
        <Grid container item spacing={1} gap={2}>
          <Grid item xs={12}>
            <ControlledInput
              name={"eventName"}
              placeholder={"Enter event name"}
              as={LabelledInput}
              id="name"
              label="Name"
              sx={{
                width: "100%",
              }}
              showError
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledCreatableSelect
              name={"eventLocation"}
              options={locationOptions}
              as={LabelledCreatableSelect}
              id="location"
              label="Location"
              placeholder={"Select a location or type to create one"}
              showError
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel
              id={"eventDescription"}
              label={"Description (optional)"}
            />
            <Box mt={0.6}>
              <RichText
                placeholder="Enter a description"
                name="eventDescription"
              />
            </Box>
          </Grid>
          <DateTimeForm />
        </Grid>
      </EventStep>
    </FormProvider>
  );
};

export default EventDetailsStep;
