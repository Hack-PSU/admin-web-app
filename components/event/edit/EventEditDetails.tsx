import React, { FC } from "react";
import EventEdit from "./EventEdit";
import { Box, Grid } from "@mui/material";
import {
  ControlledCreatableSelect,
  ControlledInput,
  ControlledSelect,
  InputLabel,
  LabelledCreatableSelect,
  LabelledInput,
  LabelledSelect,
} from "components/base";
import { RichText } from "components/base/RichText";
import { useDateTimeRange } from "common/hooks";
import {
  LabelledDatePicker,
  LabelledTimePicker,
} from "components/base/Pickers";
import { EventType, fetch, getAllLocations, QueryKeys } from "api";
import { useQuery } from "@tanstack/react-query";
import { IOption } from "types/components";

const eventTypeOptions = [
  { value: EventType.ACTIVITY, label: "Activity" },
  { value: EventType.WORKSHOP, label: "Workshop" },
  { value: EventType.FOOD, label: "Food" },
];

type Props = {
  locationOptions: IOption<number>[];
};

const EventEditDetails: FC<Props> = ({ locationOptions }) => {
  const {
    startDateTime: startDate,
    endDateTime: endDate,
    register,
  } = useDateTimeRange("eventDate", { isMultiple: true });

  // const { data: locationOptions } = useQuery(
  //   QueryKeys.location.findAll(),
  //   () => fetch(getAllLocations),
  //   {
  //     select: (data) => {
  //       if (data) {
  //         return data.map((d) => ({
  //           value: String(d.uid),
  //           label: d.location_name,
  //         }));
  //       }
  //     },
  //   }
  // );

  return (
    <EventEdit title={"Basic Details"}>
      <Grid container item spacing={1} rowGap={1.5}>
        <Grid item xs={12}>
          <ControlledInput
            name={"eventTitle"}
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
            name={"eventLocation"}
            placeholder={"Select or create a location"}
            as={LabelledCreatableSelect}
            id="event-location"
            label={"Location"}
            options={locationOptions}
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledSelect
            name={"eventType"}
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
            <RichText
              placeholder={"Enter a description"}
              name={"eventDescription"}
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
          <LabelledTimePicker
            {...register("startTime")}
            id={"start-time"}
            label={"Start Time"}
            menuWidth="200px"
          />
        </Grid>
        <Grid item xs={6}>
          <LabelledTimePicker
            {...register("endTime")}
            id={"end-time"}
            label={"End Time"}
            menuWidth={"200px"}
          />
        </Grid>
        <Grid item xs={12}>
          <ControlledInput
            name={"eventIcon"}
            placeholder={"Enter event icon url"}
            as={LabelledInput}
            label={"Event Icon"}
            id={"event-icon"}
            showError
          />
        </Grid>
      </Grid>
    </EventEdit>
  );
};

export default EventEditDetails;
