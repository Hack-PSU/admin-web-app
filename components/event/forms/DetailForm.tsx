import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ControlledInput,
  ControlledSelect,
  LabelledSelect,
} from "components/base";
import LabelledEventInput from "components/event/forms/LabelledEventInput";
import { Grid } from "@mui/material";
import LabelledEventSelect from "components/event/forms/LabelledEventSelect";
import { EventType } from "types/api";
import { DatePicker, TimePicker } from "components/base/Pickers";
import { useDateTime } from "common/hooks";
import { LabelledDatePicker } from "components/base/Pickers/DatePicker";
import { LabelledTimePicker } from "components/base/Pickers/TimePicker";
import { DateTime } from "luxon";

interface IDetailFormProps {
  onSelectWorkshop(isWorkshop: boolean): void;
}

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
  const methods = useForm();

  const { dateTime: startDate, register: registerStart } = useDateTime(
    "startDate",
    methods
  );
  const { dateTime: endDate, register: registerEnd } = useDateTime(
    "endDate",
    methods
  );

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
      <Grid item xs={3}>
        <LabelledDatePicker
          id="start-date"
          label={"Start Date"}
          {...registerStart("date")}
          inputProps={{
            sx: {
              width: "90%",
              mt: 0.6,
            },
          }}
          startDate={startDate}
          endDate={endDate}
          selectsStart
        />
      </Grid>
      <Grid item xs={3}>
        <LabelledTimePicker
          id="start-time"
          label="Start Time"
          {...registerStart("time")}
          sx={{
            mt: 0.6,
            width: "90%",
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <LabelledDatePicker
          id="end-date"
          label="End Date"
          {...registerEnd("date")}
          inputProps={{
            sx: {
              mt: 0.6,
              width: "90%",
            },
          }}
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          selectsEnd
        />
      </Grid>
      <Grid item xs={3}>
        <LabelledTimePicker
          id="end-time"
          label="End Time"
          {...registerEnd("time")}
          sx={{
            mt: 0.6,
            width: "90%",
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <ControlledInput
          name="description"
          placeholder={"Enter a description"}
          id="description"
          label={"Description"}
          as={LabelledEventInput}
          sx={{
            width: "100%",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default DetailForm;
