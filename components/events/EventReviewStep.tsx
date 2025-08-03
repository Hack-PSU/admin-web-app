import React, { FC, useCallback } from "react";
import EventStep from "./EventStep";
import { Grid, Typography, Card, CardContent, Chip, Box } from "@mui/material";
import { useStepper } from "components/base";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { 
  fetch, 
  createEventForm, 
  createLocation,
  EventType, 
  LocationEntity,
  QueryKeys 
} from "api";
import { useSnackbar } from "notistack";
import { useEventStore } from "common/store";
import { DateTime } from "luxon";

type CreateEntity<T> = { entity: T };

const EventReviewStep: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { active, previousStep } = useStepper(4, "5. Review");
  
  const {
    type,
    name,
    location,
    description,
    date,
    wsPresenterNames,
    wsSkillLevel,
    wsRelevantSkills,
    wsUrls,
    icon
  } = useEventStore();

  const {
    mutateAsync: mutateEvent,
    isLoading,
  } = useMutation(
    ({ entity }: CreateEntity<FormData>) =>
      fetch(() => createEventForm(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.event.all);
        enqueueSnackbar("Successfully created event", {
          variant: "success",
        });
        router.push("/events");
      },
      onError: (error: any) => {
        enqueueSnackbar(error?.message || "Failed to create event", { 
          variant: "error" 
        });
      },
    }
  );

  const { mutateAsync: mutateLocation } = useMutation(
    ({ entity }: CreateEntity<Omit<LocationEntity, "id">>) =>
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
    formData.append("description", description);
    formData.append("locationId", String(locationId));
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

  return (
    <EventStep
      title={`Review ${type?.label || "Event"}`}
      handleNext={onSubmit}
      handleNextTitle={isLoading ? "Creating..." : "Create Event"}
      active={active}
      handlePrevious={previousStep}
    >
      <Grid container item spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography variant="h6" fontWeight="medium">
                  {name}
                </Typography>
                <Chip
                  label={type?.label || "Event"}
                  size="small"
                  color="primary"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {description || "No description provided"}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body2">
                    {location?.label || "No location selected"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body2">
                    {date.start.toLocaleDateString()} at {date.start.toLocaleTimeString()}
                  </Typography>
                </Grid>
              </Grid>

              {/* Workshop Details */}
              {type?.value === EventType.WORKSHOP && (
                <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
                  <Typography variant="subtitle2" color="text.primary" gutterBottom>
                    Workshop Details
                  </Typography>
                  <Grid container spacing={2}>
                    {wsPresenterNames && wsPresenterNames.length > 0 && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          Presenters
                        </Typography>
                        <Typography variant="body2">
                          {wsPresenterNames.map(p => p.label).join(", ")}
                        </Typography>
                      </Grid>
                    )}
                    {wsSkillLevel && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                          Skill Level
                        </Typography>
                        <Typography variant="body2">
                          {wsSkillLevel.label}
                        </Typography>
                      </Grid>
                    )}
                    {wsRelevantSkills && wsRelevantSkills.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Relevant Skills
                        </Typography>
                        <Typography variant="body2">
                          {wsRelevantSkills.map(s => s.label).join(", ")}
                        </Typography>
                      </Grid>
                    )}
                    {wsUrls && wsUrls.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Resources
                        </Typography>
                        <Typography variant="body2">
                          {wsUrls.join(", ")}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Please review the information above. Once you click "Create Event", your event will be published.
          </Typography>
        </Grid>
      </Grid>
    </EventStep>
  );
};

export default EventReviewStep;