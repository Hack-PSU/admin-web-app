import React, { FC, useCallback, useMemo } from "react";
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
import { EventType, fetch, getAllLocations, QueryKeys } from "api";
import { useEventStore } from "common/store";
import { any, date, object, optional } from "superstruct";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { NonEmptySelect, NonEmptyString } from "common/form";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { IOption } from "types/components";

// const locationOptions = [
//   { value: "Location1", label: "Location 1" },
//   { value: "Location2", label: "Location 2" },
// ];

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
  const {
    eventType,
    eventName,
    eventLocation,
    eventDescription,
    eventDate,
    updateDetails,
  } = useEventStore();

  const methods = useForm({
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

  const { data: locationOptions } = useQuery(
    QueryKeys.location.findAll(),
    () => fetch(getAllLocations),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            value: d.uid,
            label: d.location_name,
          }));
        }
      },
    }
  );

  const currentLocations = useMemo(() => {
    if (locationOptions) {
      return new Set(locationOptions.map((l) => l.value));
    }
    return new Set();
  }, [locationOptions]);

  const handleNext = useCallback(() => {
    methods.handleSubmit((data, errors) => {
      if (!errors) {
        let locationData = data.eventLocation;

        // location is not found in currentLocations
        if (
          data.eventLocation &&
          currentLocations &&
          !currentLocations.has(data.eventLocation.value)
        ) {
          locationData = {
            ...data.eventLocation,
            isNew: true,
          };
        }

        updateDetails({
          eventName: data.eventName,
          eventLocation: locationData,
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
  }, [updateDetails, gotoStep, nextStep, currentLocations]);

  return (
    <FormProvider {...methods}>
      <EventStep
        title="Event Details"
        handleNext={handleNext}
        handleNextTitle={
          eventType && eventType.value === EventType.WORKSHOP
            ? "Next"
            : "Continue to Event Icon"
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
