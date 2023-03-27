import React, { FC } from "react";
import { Box, Grid, styled } from "@mui/material";
import { InputLabel } from "components/base";
import EventDetail from "./EventDetail";
import { DateTime } from "luxon";
import { convertFromRaw, Editor, EditorState } from "draft-js";
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
        <ReadOnlyEditor>
          <Editor
            onChange={() => null}
            editorState={EditorState.createWithContent(
              convertFromRaw(description),
              decorator
            )}
            readOnly={true}
          />
        </ReadOnlyEditor>
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
