import { FC } from "react";
import { Grid, Switch, Typography } from "@mui/material";
import {
  LabelledDatePicker,
  LabelledTimePicker,
} from "components/base/Pickers";
import { useDateTimeRange } from "common/hooks";

const DateTimeForm: FC = () => {
  const {
    startDateTime: startDate,
    endDateTime: endDate,
    register,
    toggleMultiple,
    isMultipleDays,
  } = useDateTimeRange("eventDate");

  const onChangeSwitch = () => {
    toggleMultiple();
  };

  return (
    <Grid container item flexDirection="column" gap={1}>
      <Grid container item spacing={2}>
        <Grid container item spacing={2}>
          <Grid item xs={6}>
            <LabelledDatePicker
              id="start-date"
              label={"Start Date"}
              {...register("startDate")}
              inputProps={{
                sx: {
                  width: "100%",
                  mt: 0.6,
                },
              }}
              startDate={startDate}
              endDate={endDate}
              selectsStart={isMultipleDays}
            />
          </Grid>
          <Grid item xs={6}>
            <LabelledDatePicker
              id="end-date"
              label="End Date"
              {...register("endDate")}
              inputProps={{
                sx: {
                  mt: 0.6,
                  width: "100%",
                },
              }}
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              selectsEnd={isMultipleDays}
              disabled={!isMultipleDays}
            />
          </Grid>
        </Grid>
        <Grid container item alignItems="center">
          <Grid item>
            <Switch checked={isMultipleDays} onChange={onChangeSwitch} />
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" sx={{ fontSize: "0.85rem" }}>
              Toggle to choose a different end date
            </Typography>
          </Grid>
        </Grid>
        <Grid container item spacing={2}>
          <Grid item xs={6}>
            <LabelledTimePicker
              menuWidth="200px"
              id="start-time"
              label="Start Time"
              {...register("startTime")}
              sx={{
                mt: 0.6,
                width: "100%",
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <LabelledTimePicker
              menuWidth="200px"
              id="end-time"
              label="End Time"
              {...register("endTime")}
              sx={{
                mt: 0.6,
                width: "100%",
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DateTimeForm;
