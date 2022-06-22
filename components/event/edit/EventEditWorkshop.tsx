import React, { FC } from "react";
import EventEdit from "./EventEdit";
import { Grid } from "@mui/material";
import {
  ControlledCreatableSelect,
  ControlledCreateOnlyInput,
  LabelledCreatableSelect,
  LabelledCreateOnlyInput,
} from "components/base";
import { DownloadLinks } from "components/event";

const EventEditWorkshop: FC = () => {
  return (
    <EventEdit title={"Workshop Details"}>
      <Grid container item spacing={1.5} rowGap={1.5}>
        <Grid item xs={12}>
          <ControlledCreateOnlyInput
            name={"wsPresenterNames"}
            as={LabelledCreateOnlyInput}
            id={"presenter-names"}
            label="Presenter Names"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledCreatableSelect
            name={"wsSkillLevel"}
            as={LabelledCreatableSelect}
            id="skill-level"
            label="Skill Level"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledCreatableSelect
            name={"wsRelevantSkills"}
            as={LabelledCreatableSelect}
            id={"relevant-skills"}
            label="Relevant Skills"
            placeholder="Enter relevant skills"
          />
        </Grid>
        <DownloadLinks />
      </Grid>
    </EventEdit>
  );
};

export default EventEditWorkshop;
