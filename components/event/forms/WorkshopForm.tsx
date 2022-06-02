import { FC } from "react";
import { Grid } from "@mui/material";
import { ControlledInput, ControlledSelect } from "components/base";
import LabelledEventInput from "./LabelledEventInput";
import LabelledEventSelect from "./LabelledEventSelect";
import DownloadLinks from "components/event/forms/DownloadLinks";

const skills = [
  { value: "beginner", display: "Beginner" },
  { value: "intermediate", display: "Intermediate" },
  { value: "advanced", display: "Advanced" },
];

const WorkshopForm: FC = () => {
  return (
    <Grid container sx={{ width: "100%", flexWrap: "wrap" }} rowGap={3}>
      <Grid item xs={4}>
        <ControlledInput
          id="presenter-names"
          label="Presenter Names"
          name={"presenterNames"}
          placeholder={"Enter presenter names"}
          as={LabelledEventInput}
        />
      </Grid>
      <Grid item xs={4}>
        <ControlledSelect
          id="skill-level"
          label="Skill Level"
          name={"skillLevel"}
          placeholder={"Select a skill level"}
          items={skills}
          as={LabelledEventSelect}
        />
      </Grid>
      <Grid item xs={4}>
        <ControlledInput
          id="skills"
          label="Skills"
          name={"skills"}
          placeholder={"List skills"}
          as={LabelledEventInput}
        />
      </Grid>
      <DownloadLinks />
    </Grid>
  );
};

export default WorkshopForm;
