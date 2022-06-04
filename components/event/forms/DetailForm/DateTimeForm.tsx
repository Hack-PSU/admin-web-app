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
  } = useDateTimeRange("date");

  const dateTimeSpan = isMultipleDays ? 3 : 4;

  const onChangeSwitch = () => {
    toggleMultiple();
  };

  return (
    <Grid container item flexDirection="column" gap={0.5}>
      <Grid container item>
        <Grid item xs={dateTimeSpan}>
          <LabelledDatePicker
            id="start-date"
            label={"Start Date"}
            {...register("startDate")}
            inputProps={{
              sx: {
                width: "90%",
                mt: 0.6,
              },
            }}
            startDate={startDate}
            endDate={endDate}
            selectsStart={isMultipleDays}
          />
        </Grid>
        <Grid item xs={dateTimeSpan}>
          <LabelledTimePicker
            id="start-time"
            label="Start Time"
            {...register("startTime")}
            sx={{
              mt: 0.6,
              width: "90%",
            }}
          />
        </Grid>
        {isMultipleDays && (
          <Grid item xs={dateTimeSpan}>
            <LabelledDatePicker
              id="end-date"
              label="End Date"
              {...register("endDate")}
              inputProps={{
                sx: {
                  mt: 0.6,
                  width: "90%",
                },
              }}
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              selectsEnd={isMultipleDays}
            />
          </Grid>
        )}
        <Grid item xs={dateTimeSpan}>
          <LabelledTimePicker
            id="end-time"
            label="End Time"
            {...register("endTime")}
            sx={{
              mt: 0.6,
              width: "90%",
            }}
          />
        </Grid>
      </Grid>
      <Grid container item alignItems="center">
        <Grid item>
          <Switch checked={isMultipleDays} onChange={onChangeSwitch} />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ fontSize: "0.85rem" }}>
            Toggle to select a different end date
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DateTimeForm;
