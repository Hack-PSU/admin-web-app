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
  createEventForm,
  createLocation,
  EventType,
  fetch,
  LocationEntity,
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
    type,
    icon,
    name,
    location,
    description,
    date,
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
    ({ entity }: CreateEntity<FormData>) =>
      fetch(() => createEventForm(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.event.all);
        enqueueSnackbar("Successfully created event", {
          variant: "success",
        });
      },
    }
  );

  const { mutateAsync: mutateLocation, isLoading: isLoadingLocation } =
    useMutation(
      ({ entity }: CreateEntity<LocationEntity>) =>
        fetch(() => createLocation(entity)),
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(QueryKeys.location.all);
        },
      }
    );

  const onSubmit = useCallback(async () => {
    let locationId = location?.value ?? -1;
    if (location && location.isNew) {
      const data = await mutateLocation({
        entity: {
          name: location.label,
        },
      });
      if (data?.id) {
        locationId = data?.id;
      }
    }

    const formData = new FormData();

    if (icon) {
      formData.append("icon", icon);
    }
    formData.append("type", type ? type.value : EventType.ACTIVITY);
    formData.append("description", prepareContent(convertFromRaw(description)));
    formData.append("location", String(locationId));
    formData.append(
      "startTime",
      String(DateTime.fromJSDate(date.start).toMillis())
    );
    formData.append(
      "endTime",
      String(DateTime.fromJSDate(date.end).toMillis())
    );
    formData.append("name", name);

    if (wsUrls) {
      formData.append("wsUrls", wsUrls.join("|"));
    }

    if (wsPresenterNames) {
      formData.append(
        "wsPresenterNames",
        wsPresenterNames.map((name) => name.value).join(", ")
      );
    }

    if (wsSkillLevel) {
      formData.append("wsSkillLevel", wsSkillLevel.value);
    }

    if (wsRelevantSkills) {
      formData.append(
        "wsRelevantSkills",
        wsRelevantSkills.map((skill) => skill.value).join(", ")
      );
    }

    await mutateEvent({ entity: formData });
  }, [
    location,
    mutateEvent,
    icon,
    type,
    description,
    date,
    name,
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

  if (isLoading || isLoadingLocation) {
    return <Loading />;
  }

  return (
    <EventStep
      title={`Review ${
        type && type.value === EventType.WORKSHOP ? "Workshop" : "Event"
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
        {type && type.value === EventType.WORKSHOP && (
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
        {icon && (
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
