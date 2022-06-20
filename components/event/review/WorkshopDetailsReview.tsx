import React, { FC } from "react";
import { Grid } from "@mui/material";
import EventDetail from "./EventDetail";
import { useEventStore } from "common/store";
import { IOption } from "types/components";

const joinMultiple = (values: IOption[], extract?: (value: any) => string) => {
  if (!values) return "";

  let extractValue = (value: any) => value;

  if (extract) {
    extractValue = extract;
  }

  if (values.length < 2) {
    return values.join("");
  } else if (values.length === 2) {
    return `${extractValue(values[0])} and ${extractValue(values[1])}`;
  } else {
    const exceptLast = values
      .slice(0, values.length - 1)
      .map(extractValue)
      .join(", ");
    const lastWord = extractValue(values[values.length - 1]);
    return `${exceptLast}, and ${lastWord}`;
  }
};

const WorkshopDetailsReview: FC = () => {
  const { wsPresenterNames, wsRelevantSkills, wsSkillLevel } = useEventStore();

  return (
    <>
      <Grid item xs={12}>
        <EventDetail
          label={"Presenter Names"}
          detail={joinMultiple(wsPresenterNames ?? [], (value) => value.label)}
        />
      </Grid>
      <Grid item xs={6}>
        <EventDetail label={"Skill Level"} detail={wsSkillLevel?.label ?? ""} />
      </Grid>
      <Grid item xs={6}>
        <EventDetail
          label={"Relevant Skills"}
          detail={joinMultiple(wsRelevantSkills ?? [], (value) => value.label)}
        />
      </Grid>
    </>
  );
};

export default WorkshopDetailsReview;
