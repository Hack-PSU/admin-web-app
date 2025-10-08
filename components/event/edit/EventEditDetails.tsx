import React, { FC } from "react";
import EventEdit from "./EventEdit";
import { Box, Grid, TextField } from "@mui/material";
import {
  ControlledCreatableSelect,
  ControlledInput,
  ControlledSelect,
  InputLabel,
  LabelledCreatableSelect,
  LabelledInput,
  LabelledSelect,
} from "components/base";
import { useDateTimeRange } from "common/hooks";
import { LabelledDatePicker } from "components/base/Pickers";
import { EventType } from "api";
import { LabelledTimeInput } from "components/base/Pickers/TimeInput";
import { IOption } from "components/base/Select/types";
import { Controller, useFormContext } from "react-hook-form";

const eventTypeOptions = [
  { value: EventType.ACTIVITY, label: "Activity" },
  { value: EventType.WORKSHOP, label: "Workshop" },
  { value: EventType.FOOD, label: "Food" },
  { value: EventType.CHECKIN, label: "Check In" },
];

type Props = {
  locationOptions: IOption<number>[];
};

const EventEditDetails: FC<Props> = ({ locationOptions }) => {
  const {
    startDateTime: startDate,
    endDateTime: endDate,
    register,
  } = useDateTimeRange("date", { isMultiple: true });

  const { control } = useFormContext();

  return (
    <EventEdit title={"Basic Details"}>
      <Grid container item spacing={1} rowGap={1.5}>
        <Grid item xs={12}>
          <ControlledInput
            name={"name"}
            placeholder={"Enter event title"}
            as={LabelledInput}
            id="event-title"
            label="Name"
            sx={{
              width: "100%",
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledCreatableSelect
            name={"location"}
            placeholder={"Select or create a location"}
            as={LabelledCreatableSelect}
            id="event-location"
            label={"Location"}
            options={locationOptions}
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledSelect
            name={"type"}
            placeholder={"Select a type"}
            as={LabelledSelect}
            id={"event-type"}
            label="Type"
            options={eventTypeOptions}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel id={"event-description"} label={"Description"} />
          <Box mt={0.6}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Enter a description"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "common.white",
                      border: "2px solid",
                      borderColor: "border.light",
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover": {
                        borderColor: "border.dark",
                      },
                      "&.Mui-focused": {
                        borderColor: "primary.main",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 16px",
                      fontSize: "15px",
                      lineHeight: "24px",
                    },
                  }}
                />
              )}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <LabelledDatePicker
            {...register("startDate")}
            id={"start-date"}
            label={"Start Date"}
            startDate={startDate}
            endDate={endDate}
            selectsStart={true}
          />
        </Grid>
        <Grid item xs={6}>
          <LabelledDatePicker
            {...register("endDate")}
            id={"end-date"}
            label={"End Date"}
            startDate={startDate}
            endDate={endDate}
            selectsEnd={true}
          />
        </Grid>
        <Grid item xs={6}>
          <LabelledTimeInput
            id={"start-time"}
            label={"Start Time"}
            {...register("startTime")}
          />
        </Grid>
        <Grid item xs={6}>
          <LabelledTimeInput
            id={"end-time"}
            label={"End Time"}
            {...register("endTime")}
          />
        </Grid>
      </Grid>
    </EventEdit>
  );
};

export default EventEditDetails;
