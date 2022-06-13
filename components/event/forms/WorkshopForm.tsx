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
      <Grid item xs={12}>
        <ControlledInput
          id="presenter-names"
          label="Presenter Names"
          name={"presenterNames"}
          placeholder={"Enter presenter names"}
          as={LabelledEventInput}
          sx={{
            width: "100%",
          }}
        />
      </Grid>
      <Grid
        container
        item
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={6}>
          <ControlledSelect
            id="skill-level"
            label="Skill Level"
            name={"skillLevel"}
            placeholder={"Select a skill level"}
            items={skills}
            as={LabelledEventSelect}
            sx={{
              width: "100%",
              mt: 0.6,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledInput
            id="skills"
            label="Skills"
            name={"skills"}
            placeholder={"List skills"}
            as={LabelledEventInput}
            sx={{
              width: "100%",
              mt: 0.6,
            }}
          />
        </Grid>
      </Grid>
      <DownloadLinks />
    </Grid>
  );
};

export default WorkshopForm;
