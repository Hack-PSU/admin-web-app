import React, { FC, useCallback } from "react";
import EventStep from "./EventStep";
import { Grid } from "@mui/material";
import {
  ControlledCreatableSelect,
  ControlledInput,
  ControlledSelect,
  LabelledCreatableSelect,
  LabelledInput,
  LabelledSelect,
  useStepper,
} from "components/base";
import { FormProvider, useForm } from "react-hook-form";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { array, object, optional, string } from "superstruct";
import { useEventStore } from "common/store";

const skillLevelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const schema = object({
  wsPresenterNames: optional(array(object({ value: string(), label: string() }))),
  wsSkillLevel: optional(object({ value: string(), label: string() })),
  wsRelevantSkills: optional(array(object({ value: string(), label: string() }))),
  wsUrls: optional(array(string())),
});

const WorkshopDetailsStep: FC = () => {
  const { 
    wsPresenterNames, 
    wsSkillLevel, 
    wsRelevantSkills, 
    wsUrls, 
    updateWorkshop 
  } = useEventStore();

  const methods = useForm({
    resolver: superstructResolver(schema),
    defaultValues: {
      wsPresenterNames,
      wsSkillLevel,
      wsRelevantSkills,
      wsUrls,
    },
  });

  const { nextStep, active, previousStep } = useStepper(2, "3. Workshop Details");

  const handleNext = useCallback(() => {
    methods.handleSubmit((data) => {
      updateWorkshop(data);
      nextStep();
    })();
  }, [methods, nextStep, updateWorkshop]);

  return (
    <FormProvider {...methods}>
      <EventStep
        title="Workshop Details"
        handleNext={handleNext}
        active={active}
        handlePrevious={previousStep}
      >
        <Grid container item spacing={1} gap={2}>
          <Grid item xs={12}>
            <ControlledCreatableSelect
              name="wsPresenterNames"
              as={LabelledCreatableSelect}
              id="wsPresenterNames"
              label="Presenter Names"
              placeholder="Add presenter names"
              isMulti
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledSelect
              name="wsSkillLevel"
              options={skillLevelOptions}
              as={LabelledSelect}
              id="wsSkillLevel"
              label="Skill Level"
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledCreatableSelect
              name="wsRelevantSkills"
              as={LabelledCreatableSelect}
              id="wsRelevantSkills"
              label="Relevant Skills"
              placeholder="Add relevant skills"
              isMulti
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledInput
              name="wsUrls"
              as={LabelledInput}
              id="wsUrls"
              label="Workshop URLs"
              placeholder="Enter URLs separated by commas"
              sx={{ width: "100%" }}
            />
          </Grid>
        </Grid>
      </EventStep>
    </FormProvider>
  );
};

export default WorkshopDetailsStep;