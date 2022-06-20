import React, { FC } from "react";
import {
  useStepper,
  ControlledCreateOnlyInput,
  LabelledCreateOnlyInput,
  ControlledCreatableSelect,
  LabelledCreatableSelect,
} from "components/base";
import EventStep from "components/event/steps/EventStep";
import { Grid } from "@mui/material";
import { DownloadLinks } from "components/event/forms";
import { useForm, FormProvider } from "react-hook-form";
import { array, object, optional, string } from "superstruct";
import { NonEmptySelect, NonEmptySelectArray } from "common/form";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { useEventDispatch, useEventStore } from "common/store";
import { IOption } from "types/components";

const link = object({
  link: string(),
  id: string(),
});

const schema = object({
  wsPresenterNames: NonEmptySelectArray,
  wsSkillLevel: NonEmptySelect,
  wsRelevantSkills: optional(NonEmptySelectArray),
  wsUrls: optional(array(link)),
});

const options: IOption[] = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const WorkshopDetailsStep: FC = () => {
  const { wsPresenterNames, wsRelevantSkills, wsSkillLevel, wsUrls } =
    useEventStore();
  const dispatch = useEventDispatch();

  const methods = useForm({
    resolver: superstructResolver(schema),
    defaultValues: {
      wsPresenterNames,
      wsRelevantSkills,
      wsSkillLevel,
      wsUrls: wsUrls?.map((value) => ({ link: value })) || [],
    },
  });

  const { active, nextStep, previousStep } = useStepper(
    2,
    "3. Workshop Details",
    { optional: true }
  );

  const handleNext = () => {
    methods.handleSubmit((data, errors) => {
      if (!errors) {
        dispatch("UPDATE_WORKSHOP", {
          wsPresenterNames: data.wsPresenterNames,
          wsSkillLevel: data.wsSkillLevel,
          wsRelevantSkills: data.wsRelevantSkills,
          wsUrls: data.wsUrls.map((value) => value.link),
        });
        nextStep();
      }
    })();
  };

  return (
    <FormProvider {...methods}>
      <EventStep
        title={"Workshop Details"}
        handleNext={handleNext}
        active={active}
        handlePrevious={previousStep}
      >
        <Grid container item spacing={1} rowGap={2}>
          <Grid item xs={12}>
            <ControlledCreateOnlyInput
              name={"wsPresenterNames"}
              as={LabelledCreateOnlyInput}
              id="presenter-names"
              label={"Presenter Names"}
              placeholder={"Enter presenter names"}
              showError
            />
          </Grid>
          <Grid item xs={6}>
            <ControlledCreatableSelect
              name={"wsSkillLevel"}
              as={LabelledCreatableSelect}
              id="skill-level"
              label={"Skill Level"}
              placeholder={"Select or create a skill level"}
              options={options}
              showError
            />
          </Grid>
          <Grid item xs={6}>
            <ControlledCreatableSelect
              name={"wsRelevantSkills"}
              as={LabelledCreatableSelect}
              id="relevant-skills"
              label="Relevant Skills"
              placeholder={"Select or enter relevant skills"}
              isMulti
              showError
            />
          </Grid>
          <Grid item xs={12}>
            <DownloadLinks />
          </Grid>
        </Grid>
      </EventStep>
    </FormProvider>
  );
};

export default WorkshopDetailsStep;
