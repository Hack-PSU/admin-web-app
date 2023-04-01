import React, { useCallback, useMemo } from "react";
import { NextPage } from "next";
import {
  createLocation,
  EventEntity,
  EventType,
  fetch,
  getAllLocations,
  getEvent,
  LocationEntity,
  QueryEntity,
  QueryKeys,
  updateEvent,
} from "api";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { Grid, lighten, Typography, useTheme } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import EventEditDetails from "components/event/edit/EventEditDetails";
import { DateTime } from "luxon";
import EventEditWorkshop from "components/event/edit/EventEditWorkshop";
import _ from "lodash";
import { Button } from "components/base";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import EventEditIcon from "components/event/edit/EventEditIcon";
import EventIconPreview from "components/event/edit/EventIconPreview";
import { useRouter } from "next/router";

interface IEventPageProps {
  event: EventEntity;
}

const EventPage: NextPage<IEventPageProps> = ({ event }) => {
  const router = useRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    defaultValues: {
      name: event.name,
      location: {
        value: event.location?.id,
        label: event.location?.name,
      },
      type: {
        value: event.type,
        label: _.capitalize(event.type),
      },
      description: event.description,
      date: {
        start: DateTime.fromMillis(event.startTime).toJSDate(),
        end: DateTime.fromMillis(event.endTime).toJSDate(),
      },
      iconUrl: event.icon,
      icon: [],
      wsPresenterNames:
        event.wsPresenterNames
          ?.split(", ")
          .map((value) => ({ value, label: value })) ?? [],
      wsSkillLevel: {
        value: event.wsSkillLevel,
        label: event.wsSkillLevel,
      },
      wsRelevantSkills:
        event.wsRelevantSkills
          ?.split(", ")
          .map((value) => ({ value, label: value })) ?? null,
      wsUrls: event.wsUrls?.map((link) => ({ link })) ?? [],
    },
  });

  const { handleSubmit } = methods;

  const { data: locationOptions } = useQuery(
    QueryKeys.location.findAll(),
    () => fetch(getAllLocations),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            value: d.id,
            label: d.name,
          }));
        }
      },
    }
  );

  const currentLocations = useMemo(() => {
    if (locationOptions) {
      return new Set(locationOptions.map((d) => d.value));
    }
    return new Set();
  }, [locationOptions]);

  const { mutateAsync: mutateUpdateEvent } = useMutation(
    ({ entity: { id, data } }: QueryEntity<{ data: FormData; id: string }>) =>
      fetch(() => updateEvent(data, { id })),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.event.all);
        enqueueSnackbar("Successfully updated event", {
          variant: "success",
        });
        await router.back();
      },
    }
  );

  const { mutateAsync: mutateCreateLocation } = useMutation(
    ({ entity }: QueryEntity<Omit<LocationEntity, "id">>) =>
      fetch(() => createLocation(entity))
  );

  const onSubmit = useCallback(() => {
    handleSubmit(async (data) => {
      if (currentLocations) {
        let eventLocation = data.location.value ?? -1;
        if (!currentLocations.has(data.location.value)) {
          // create new location
          const newLocationData = await mutateCreateLocation({
            entity: {
              name: data.location.label,
            },
          });

          if (newLocationData?.id) {
            eventLocation = newLocationData?.id;
          }
        }

        const formData = new FormData();

        if (event.icon) {
          formData.append("icon", event.icon);
        }
        formData.append(
          "type",
          data.type ? data.type.value : EventType.ACTIVITY
        );
        formData.append("description", data.description);
        formData.append("locationId", String(eventLocation));
        formData.append(
          "startTime",
          String(DateTime.fromJSDate(data.date.start).toMillis())
        );
        formData.append(
          "endTime",
          String(DateTime.fromJSDate(data.date.end).toMillis())
        );
        formData.append("name", data.name);

        if (data.wsUrls) {
          formData.append("wsUrls", data.wsUrls.join("|"));
        }

        if (data.wsPresenterNames) {
          formData.append(
            "wsPresenterNames",
            data.wsPresenterNames.map((name) => name.value).join(", ")
          );
        }

        if (data.wsSkillLevel.value) {
          formData.append("wsSkillLevel", data.wsSkillLevel.value);
        }

        if (data.wsRelevantSkills) {
          formData.append(
            "wsRelevantSkills",
            data.wsRelevantSkills.map((skill) => skill.value).join(", ")
          );
        }

        await mutateUpdateEvent({
          entity: {
            data: formData,
            id: event.id,
          },
        });
      }
    })();
  }, [
    handleSubmit,
    currentLocations,
    event.icon,
    event.id,
    mutateUpdateEvent,
    mutateCreateLocation,
  ]);

  return (
    <FormProvider {...methods}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Edit {event.type === EventType.WORKSHOP ? "Workshop" : "Event"}
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
          <Grid container item xs={4} flexDirection={"column"}>
            <Grid item sx={{ width: "100%" }}>
              <EventIconPreview />
            </Grid>
          </Grid>
          <Grid container item xs={6} flexDirection="column">
            <Grid item sx={{ height: "50%" }}>
              <EventEditIcon />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <EventEditDetails locationOptions={locationOptions ?? []} />
          </Grid>
          {event.type === EventType.WORKSHOP && (
            <Grid item xs={12}>
              <EventEditWorkshop />
            </Grid>
          )}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export const getServerSideProps = withServerSideProps(
  async (context, token) => {
    const { id } = context.query;
    const event = await fetch(() => getEvent({ id: id as string }, {}, token));

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
  }
);

export default withDefaultLayout(EventPage);
