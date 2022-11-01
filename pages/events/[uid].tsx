import React, { useCallback, useMemo } from "react";
import { NextPage } from "next";
import {
  EventType,
  IGetAllEventsResponse,
  getAllEvents,
  fetch,
  CreateEntity,
  IEventEntity,
  MutateEntity,
  updateEvent,
  QueryKeys,
  getEvent,
} from "api";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { Grid, lighten, Typography, useTheme } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import EventEditDetails from "components/event/edit/EventEditDetails";
import {
  ContentState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import { DateTime } from "luxon";
import EventEditWorkshop from "components/event/edit/EventEditWorkshop";
import _ from "lodash";
import { Button } from "components/base";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { prepareContent } from "components/base/RichText";

interface IEventPageProps {
  event: IGetAllEventsResponse;
}

const EventPage: NextPage<IEventPageProps> = ({ event }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const eventDescription = useMemo(() => {
    const htmlDescription = event.event_description;
    const htmlBlock = convertFromHTML(htmlDescription);
    const state = ContentState.createFromBlockArray(
      htmlBlock.contentBlocks,
      htmlBlock.entityMap
    );

    return convertToRaw(state);
  }, [event]);

  const methods = useForm({
    defaultValues: {
      eventTitle: event.event_title,
      eventLocation: {
        value: String(event.event_location),
        label: event.location_name,
      },
      eventType: {
        value: event.event_type,
        label: _.capitalize(event.event_type),
      },
      eventDescription,
      eventDate: {
        start: DateTime.fromMillis(parseInt(event.event_start_time)).toJSDate(),
        end: DateTime.fromMillis(parseInt(event.event_end_time)).toJSDate(),
      },
      eventIcon: event.event_icon ?? "",
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
      wsUrls: event.ws_urls?.map((link) => ({ link })) ?? [],
    },
  });

  const { handleSubmit } = methods;

  const { mutateAsync: mutateUpdateEvent } = useMutation(
    ({ entity }: MutateEntity<IEventEntity>) =>
      fetch(() => updateEvent(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.event.all);
        enqueueSnackbar("Successfully updated event", {
          variant: "success",
        });
      },
    }
  );

  const onSubmit = useCallback(() => {
    handleSubmit(async (data) => {
      await mutateUpdateEvent({
        entity: {
          uid: String(event.uid),
          eventTitle: data.eventTitle,
          eventLocation: parseInt(data.eventLocation.value),
          eventDescription: prepareContent(
            convertFromRaw(data.eventDescription)
          ),
          eventStartTime: DateTime.fromJSDate(data.eventDate.start).toMillis(),
          eventEndTime: DateTime.fromJSDate(data.eventDate.end).toMillis(),
          eventType: data.eventType.value,
          eventIcon: data.eventIcon,
          wsPresenterNames:
            data.wsPresenterNames?.map((name) => name.value).join(", ") ??
            undefined,
          wsRelevantSkills:
            data.wsRelevantSkills?.map((skill) => skill.value).join(", ") ??
            undefined,
          wsSkillLevel: data.wsSkillLevel.value,
          wsUrls: data.wsUrls.join("|"),
        },
      });
    })();
  }, [event, handleSubmit, mutateUpdateEvent]);

  return (
    <FormProvider {...methods}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Edit{" "}
            {event.event_type === EventType.WORKSHOP ? "Workshop" : "Event"}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button
            onClick={onSubmit}
            sx={{
              backgroundColor: "common.black",
              ":hover": {
                backgroundColor: lighten(theme.palette.common.black, 0.1),
              },
              width: "100%",
            }}
            textProps={{
              sx: {
                color: "common.white",
              },
            }}
          >
            Save
          </Button>
        </Grid>
        <Grid container item spacing={2}>
          {/*<Grid container item xs={4} flexDirection="column">*/}
          {/*  <Grid item sx={{ height: "50%" }}>*/}
          {/*    <EventEditIcon />*/}
          {/*  </Grid>*/}
          {/*  <Grid item sx={{ height: "50%" }}>*/}
          {/*    <EventEditImage />*/}
          {/*  </Grid>*/}
          {/*</Grid>*/}
          <Grid item xs={12}>
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
  const event = await fetch(() => getEvent({ uid: uid as string }));

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
});

export default withDefaultLayout(EventPage);
