import React, { FC } from "react";
import { Box, Grid } from "@mui/material";
import { InputLabel } from "components/base";
import EventDetail from "./EventDetail";
import { DateTime } from "luxon";
import { useEventStore } from "common/store";
import { Editor } from "components/base/Editor";

const EventDetailsReview: FC = () => {
  const { name, type, location, description, date } = useEventStore();

  return (
    <>
      <Grid item xs={4}>
        <EventDetail detail={name} label={"Event Name"} />
      </Grid>
      <Grid item xs={4}>
        <EventDetail label={"Event Type"} detail={type?.label ?? ""} />
      </Grid>
      <Grid item xs={4}>
        <EventDetail label={"Event Location"} detail={location?.label ?? ""} />
      </Grid>
      <Grid item xs={12}>
        <InputLabel id={"Description"} label={"Description"} />
        <Box mt={0.5}>
          <Editor
            onChange={() => null}
            value={description}
            placeholder={""}
            disabled
          />
        </Box>
      </Grid>
      <Grid item xs={3}>
        <EventDetail
          label={"Start Date"}
          detail={DateTime.fromJSDate(date.start).toLocaleString(
            DateTime.DATE_SHORT
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <EventDetail
          label={"Start Time"}
          detail={DateTime.fromJSDate(date.start).toLocaleString(
            DateTime.TIME_SIMPLE
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <EventDetail
          label={"End Date"}
          detail={DateTime.fromJSDate(date.end).toLocaleString(
            DateTime.DATE_SHORT
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <EventDetail
          label={"End Time"}
          detail={DateTime.fromJSDate(date.end).toLocaleString(
            DateTime.TIME_SIMPLE
          )}
        />
      </Grid>
    </>
  );
};

export default EventDetailsReview;
