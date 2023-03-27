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
import DateTimeForm from "components/event/forms/DetailsForm/DateTimeForm";
import { FormProvider, useForm } from "react-hook-form";
import { EventType, fetch, getAllLocations, QueryKeys } from "api";
import { useEventStore } from "common/store";
import { any, date, object, optional } from "superstruct";
import { NonEmptySelect, NonEmptyString } from "common/form";
import { useQuery } from "@tanstack/react-query";
import { ControlledEditor } from "components/base/Editor";
import { superstructResolver } from "@hookform/resolvers/superstruct";

const schema = object({
  name: NonEmptyString,
  location: NonEmptySelect,
  description: optional(any()),
  date: object({
    start: date(),
    end: date(),
  }),
});

const EventDetailsStep: FC = () => {
  const { type, name, location, description, date, updateDetails } =
    useEventStore();

  const methods = useForm({
    resolver: superstructResolver(schema),
    defaultValues: {
      name,
      location,
      description,
      date,
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
            value: d.id,
            label: d.name,
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
      console.log(data, errors);
      if (!errors) {
        let locationData = data.location;

        // location is not found in currentLocations
        if (
          data.location &&
          currentLocations &&
          !currentLocations.has(data.location.value)
        ) {
          locationData = {
            ...data.location,
            isNew: true,
          };
        }

        updateDetails({
          name: data.name,
          location: locationData,
          description: data.description,
          date: data.date,
        });

        if (type && type.value !== EventType.WORKSHOP) {
          gotoStep(3, 2);
        } else {
          nextStep();
        }
      }
    })();
  }, [currentLocations, gotoStep, methods, nextStep, type, updateDetails]);

  return (
    <FormProvider {...methods}>
      <EventStep
        title="Event Details"
        handleNext={handleNext}
        handleNextTitle={
          type && type.value === EventType.WORKSHOP
            ? "Next"
            : "Continue to Event Icon"
        }
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
              showError
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
              showError
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel id={"description"} label={"Description (optional)"} />
            <Box mt={0.6}>
              <ControlledEditor
                name={"description"}
                placeholder={"Enter a description"}
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
