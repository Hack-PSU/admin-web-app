import React from "react";
import { NextPage } from "next";
import { EventType, IGetAllEventsResponse } from "types/api";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { getAllEvents } from "api/index";
import { Grid, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import EventEditDetails from "components/event/edit/EventEditDetails";
import { ContentState, convertToRaw } from "draft-js";
import { DateTime } from "luxon";
import EventEditIcon from "components/event/edit/EventEditIcon";
import EventEditImage from "components/event/edit/EventEditImage";
import EventEditWorkshop from "components/event/edit/EventEditWorkshop";

interface IEventPageProps {
  event: IGetAllEventsResponse;
}

const EventPage: NextPage<IEventPageProps> = ({ event }) => {
  const methods = useForm({
    defaultValues: {
      eventTitle: event.event_title,
      eventLocation: {
        value: String(event.event_location),
        label: event.location_name,
      },
      eventType: { value: event.event_type, label: event.event_type },
      eventDescription: convertToRaw(
        ContentState.createFromText(event.event_description)
      ),
      eventDate: {
        start: DateTime.fromMillis(event.event_start_time).toJSDate(),
        end: DateTime.fromMillis(event.event_end_time).toJSDate(),
      },
      eventIcon: [],
      eventImage: [],
      wsPresenterNames:
        event.ws_presenter_names
          ?.split(", ")
          .map((value) => ({ value, label: value })) ?? [],
      wsSkillLevel: {
        value: event.ws_skill_level,
        label: event.ws_skill_level,
      },
      wsRelevantSkills:
        event.ws_relevant_skills
          ?.split(", ")
          .map((value) => ({ value, label: value })) ?? null,
      wsUrls: event.ws_urls.map((link) => ({ link })),
    },
  });

  return (
    <FormProvider {...methods}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Edit{" "}
            {event.event_type === EventType.WORKSHOP ? "Workshop" : "Event"}
          </Typography>
        </Grid>
        <Grid container item spacing={2}>
          <Grid container item xs={4} flexDirection="column">
            <Grid item sx={{ height: "50%" }}>
              <EventEditIcon />
            </Grid>
            <Grid item sx={{ height: "50%" }}>
              <EventEditImage />
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <EventEditDetails />
          </Grid>
          {event.event_type === EventType.WORKSHOP && (
            <Grid item xs={12}>
              <EventEditWorkshop />
            </Grid>
          )}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export const getServerSideProps = withServerSideProps(async (context) => {
  const { uid } = context.query;
  const events = await getAllEvents();

  if (events && events?.data.body.data) {
    const event = events?.data.body.data.find((value) => value.uid === uid);
    if (event) {
      return {
        props: {
          event,
        },
      };
    } else {
      return {
        redirect: {
          destination: "/events",
          permanent: false,
        },
      };
    }
  } else {
    return {
      redirect: {
        destination: "/events",
        permanent: false,
      },
    };
  }
});

export default withDefaultLayout(EventPage);
