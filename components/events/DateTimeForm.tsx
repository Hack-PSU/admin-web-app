import React, { FC } from "react";
import { Grid } from "@mui/material";
import { LabelledDatePicker } from "components/base/Pickers";
import { LabelledTimeInput } from "components/base/Pickers/TimeInput";
import { useDateTimeRange } from "common/hooks";

const DateTimeForm: FC = () => {
  const { register } = useDateTimeRange("date");

  return (
    <>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} sm={6}>
          <LabelledDatePicker
            name="startDate"
            label="Start Date"
            {...register("startDate")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelledTimeInput
            name="startTime"
            label="Start Time"
            {...register("startTime")}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} sm={6}>
          <LabelledDatePicker
            name="endDate"
            label="End Date"
            {...register("endDate")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LabelledTimeInput
            name="endTime"
            label="End Time"
            {...register("endTime")}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DateTimeForm;