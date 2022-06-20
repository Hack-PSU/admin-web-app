import React, { FC } from "react";
import { Box, Grid, styled } from "@mui/material";
import { InputLabel } from "components/base";
import EventDetail from "./EventDetail";
import { DateTime } from "luxon";
import { ContentState, convertFromRaw, Editor, EditorState } from "draft-js";
import { decorator } from "components/base/RichText/decorators";
import { useEventStore } from "common/store";

const ReadOnlyEditor = styled(Box)(({ theme }) => ({
  "& .public-DraftEditor-content": {
    fontSize: "0.85rem",
    color: theme.palette.common.black,
    fontFamily: "Poppins",
  },
}));

const EventDetailsReview: FC = () => {
  const { eventName, eventType, eventLocation, eventDescription, eventDate } =
    useEventStore();

  return (
    <>
      <Grid item xs={4}>
        <EventDetail detail={eventName} label={"Event Name"} />
      </Grid>
      <Grid item xs={4}>
        <EventDetail label={"Event Type"} detail={eventType?.label ?? ""} />
      </Grid>
      <Grid item xs={4}>
        <EventDetail
          label={"Event Location"}
          detail={eventLocation?.label ?? ""}
        />
      </Grid>
      <Grid item xs={12}>
        <InputLabel id={"Description"} label={"Description"} />
        <ReadOnlyEditor>
          <Editor
            onChange={() => null}
            editorState={EditorState.createWithContent(
              convertFromRaw(eventDescription),
              decorator
            )}
            readOnly={true}
          />
        </ReadOnlyEditor>
      </Grid>
      <Grid item xs={3}>
        <EventDetail
          label={"Start Date"}
          detail={DateTime.fromJSDate(eventDate.start).toLocaleString(
            DateTime.DATE_SHORT
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <EventDetail
          label={"Start Time"}
          detail={DateTime.fromJSDate(eventDate.start).toLocaleString(
            DateTime.TIME_SIMPLE
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <EventDetail
          label={"End Date"}
          detail={DateTime.fromJSDate(eventDate.end).toLocaleString(
            DateTime.DATE_SHORT
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <EventDetail
          label={"End Time"}
          detail={DateTime.fromJSDate(eventDate.end).toLocaleString(
            DateTime.TIME_SIMPLE
          )}
        />
      </Grid>
    </>
  );
};

export default EventDetailsReview;
