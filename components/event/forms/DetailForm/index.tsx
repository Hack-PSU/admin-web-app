import React, { FC } from "react";
import { ControlledInput, ControlledSelect } from "components/base";
import LabelledEventInput from "../LabelledEventInput";
import { Grid } from "@mui/material";
import LabelledEventSelect from "../LabelledEventSelect";
import { EventType } from "types/api";
import DateTimeForm from "./DateTimeForm";

const locationItems = [
  { value: "Location1", display: "Location 1" },
  { value: "Location2", display: "Location 2" },
];

const eventTypeItems = [
  { value: EventType.FOOD, display: "Food" },
  { value: EventType.ACTIVITY, display: "Event" },
  { value: EventType.WORKSHOP, display: "Workshop" },
];

const DetailForm: FC = () => {
  return (
    <Grid
      container
      sx={{ width: "100%", flexWrap: "wrap" }}
      rowGap={3}
      justifyContent="space-evenly"
    >
      <Grid item xs={4}>
        <ControlledInput
          name="name"
          placeholder="Enter event name"
          as={LabelledEventInput}
          label={"Name"}
          id="name"
        />
      </Grid>
      <Grid item xs={4}>
        <ControlledSelect
          items={locationItems}
          name="location"
          placeholder="Select a location"
          id="location"
          label="Location"
          as={LabelledEventSelect}
        />
      </Grid>
      <Grid item xs={4}>
        <ControlledSelect
          items={eventTypeItems}
          name="type"
          placeholder="Select a type"
          id="type"
          label="Type"
          as={LabelledEventSelect}
        />
      </Grid>
      <DateTimeForm />
      <Grid item xs={12}>
        <ControlledInput
          name="description"
          placeholder={"Enter a description"}
          id="description"
          label={"Description"}
          multiline
          fullWidth
          as={LabelledEventInput}
          sx={{
            width: "100%",
          }}
          rows={3}
        />
      </Grid>
    </Grid>
  );
};

export default DetailForm;
