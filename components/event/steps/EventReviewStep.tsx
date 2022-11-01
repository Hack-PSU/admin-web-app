import React, { FC, useCallback, useEffect } from "react";
import { Loading, useStepper } from "components/base";
import { Grid, Typography } from "@mui/material";
import {
  EventDetailsReview,
  EventImageReview,
  WorkshopDetailsReview,
} from "components/event/review";
import EventStep from "./EventStep";
import {
  CreateEntity,
  createEvent,
  createLocation,
  EventType,
  fetch,
  IEventEntity,
  ILocationUpdateEntity,
  QueryKeys,
} from "api";
import { useEventStore } from "common/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { prepareContent } from "components/base/RichText";
import { convertFromRaw } from "draft-js";
import { DateTime } from "luxon";
import { useRouter } from "next/router";

const EventReviewStep: FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { active, previousStep } = useStepper(4, "5. Review");

  const { enqueueSnackbar } = useSnackbar();
  const {
    eventType,
    eventIcon,
    eventName,
    eventLocation,
    eventDescription,
    eventDate,
    wsUrls,
    wsSkillLevel,
    wsRelevantSkills,
    wsPresenterNames,
  } = useEventStore();

  const {
    mutateAsync: mutateEvent,
    isLoading,
    isSuccess,
  } = useMutation(
    ({ entity }: CreateEntity<IEventEntity>) =>
      fetch(() => createEvent(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.event.all);
        enqueueSnackbar("Successfully created event", {
          variant: "success",
        });
      },
    }
  );

  const { mutateAsync: mutateLocation } = useMutation(
    ({ entity }: CreateEntity<ILocationUpdateEntity>) =>
      fetch(() => createLocation(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.location.all);
      },
    }
  );

  const onSubmit = useCallback(async () => {
    let eventLocationUid = eventLocation?.value ?? -1;
    if (eventLocation && eventLocation.isNew) {
      const data = await mutateLocation({
        entity: {
          locationName: eventLocation.label,
        },
      });
      if (data?.uid) {
        eventLocationUid = data?.uid;
      }
    }
    await mutateEvent({
      entity: {
        eventIcon: eventIcon ?? null,
        eventType: eventType ? eventType.value : EventType.ACTIVITY,
        eventDescription: prepareContent(convertFromRaw(eventDescription)),
        eventLocation: eventLocationUid,
        eventStartTime: DateTime.fromJSDate(eventDate.start).toMillis(),
        eventEndTime: DateTime.fromJSDate(eventDate.end).toMillis(),
        eventTitle: eventName,
        wsUrls: wsUrls?.join("|") ?? undefined,
        wsPresenterNames:
          wsPresenterNames?.map((name) => name.value).join(", ") ?? undefined,
        wsSkillLevel: wsSkillLevel?.value ?? undefined,
        wsRelevantSkills:
          wsRelevantSkills?.map((skill) => skill.value).join(", ") ?? undefined,
      },
    });
  }, [
    eventLocation,
    mutateEvent,
    eventIcon,
    eventType,
    eventDescription,
    eventDate,
    eventName,
    wsUrls,
    wsPresenterNames,
    wsSkillLevel,
    wsRelevantSkills,
    mutateLocation,
  ]);

  useEffect(() => {
    if (isSuccess) {
      void router.push("/events");
    }
  }, [isSuccess, router]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <EventStep
      title={`Review ${
        eventType && eventType.value === EventType.WORKSHOP
          ? "Workshop"
          : "Event"
      }`}
      handleNext={onSubmit}
      handleNextTitle="Submit"
      active={active}
      handlePrevious={previousStep}
    >
      <Grid container item flexDirection="column" rowGap={1.5}>
        <Grid item>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Basic Details
          </Typography>
        </Grid>
        <Grid
          container
          item
          rowGap={2}
          justifyContent="center"
          alignItems="center"
        >
          <EventDetailsReview />
        </Grid>
        {eventType && eventType.value === EventType.WORKSHOP && (
          <>
            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Workshop Details
              </Typography>
            </Grid>
            <Grid
              container
              item
              rowGap={2}
              justifyContent="center"
              alignItems="center"
            >
              <WorkshopDetailsReview />
            </Grid>
          </>
        )}
        {/*{eventImage && (*/}
        {/*  <>*/}
        {/*    <Grid item sx={{ mt: 0.5 }}>*/}
        {/*      <Typography variant="h6" sx={{ fontWeight: 800 }}>*/}
        {/*        Event Image*/}
        {/*      </Typography>*/}
        {/*    </Grid>*/}
        {/*    <Grid container item justifyContent="center" alignItems="center">*/}
        {/*      <EventImageReview name={"eventImage"} />*/}
        {/*    </Grid>*/}
        {/*  </>*/}
        {/*)}*/}
        {eventIcon && (
          <>
            <Grid item sx={{ mt: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Event Icon
              </Typography>
            </Grid>
            <Grid container item justifyContent="center" alignItems="center">
              <EventImageReview name={"eventIcon"} />
            </Grid>
          </>
        )}
      </Grid>
    </EventStep>
  );
};

export default EventReviewStep;
