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
import DownloadLinks from "components/event/forms/DownloadLinks";

const WorkshopDetailsStep: FC = () => {
  const { active, nextStep, previousStep } = useStepper(
    2,
    "3. Workshop Details",
    { optional: true }
  );

  return (
    <EventStep
      title={"Workshop Details"}
      handleNext={nextStep}
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
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledCreatableSelect
            name={"wsSkillLevel"}
            as={LabelledCreatableSelect}
            id="skill-level"
            label={"Skill Level"}
            placeholder={"Select or create a skill level"}
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
          />
        </Grid>
        <Grid item xs={12}>
          <DownloadLinks />
        </Grid>
      </Grid>
    </EventStep>
  );
};

export default WorkshopDetailsStep;
