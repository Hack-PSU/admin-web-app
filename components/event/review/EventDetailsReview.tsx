import React, { FC } from "react";
import { Box, Grid, styled } from "@mui/material";
import { InputLabel } from "components/base";
import EventDetail from "./EventDetail";
import { useFormContext } from "react-hook-form";
import { DateTime } from "luxon";
import { Editor, EditorState } from "draft-js";
import { decorator } from "components/base/RichText/decorators";

const ReadOnlyEditor = styled(Box)(({ theme }) => ({
  "& .public-DraftEditor-content": {
    fontSize: "0.85rem",
    color: theme.palette.common.black,
    fontFamily: "Poppins",
  },
}));

const EventDetailsReview: FC = () => {
  const { getValues } = useFormContext();

  return (
    <>
      <Grid item xs={4}>
        <EventDetail detail={getValues("name")} label={"Event Name"} />
      </Grid>
      <Grid item xs={4}>
        <EventDetail
          label={"Event Type"}
          detail={getValues("type")?.label ?? ""}
        />
      </Grid>
      <Grid item xs={4}>
        <EventDetail
          label={"Event Location"}
          detail={getValues("location")?.label ?? ""}
        />
      </Grid>
      <Grid item xs={12}>
        <InputLabel id={"Description"} label={"Description"} />
        <ReadOnlyEditor>
          <Editor
            onChange={() => null}
            editorState={EditorState.createWithContent(
              getValues("description"),
              decorator
            )}
            readOnly={true}
          />
        </ReadOnlyEditor>
      </Grid>
      <Grid item xs={3}>
        <EventDetail
          label={"Start Date"}
          detail={DateTime.fromJSDate(getValues("date.start")).toLocaleString(
            DateTime.DATE_SHORT
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <EventDetail
          label={"Start Time"}
          detail={DateTime.fromJSDate(getValues("date.start")).toLocaleString(
            DateTime.TIME_SIMPLE
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <EventDetail
          label={"End Date"}
          detail={DateTime.fromJSDate(getValues("date.end")).toLocaleString(
            DateTime.DATE_SHORT
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <EventDetail
          label={"End Time"}
          detail={DateTime.fromJSDate(getValues("date.end")).toLocaleString(
            DateTime.TIME_SIMPLE
          )}
        />
      </Grid>
    </>
  );
};

export default EventDetailsReview;
