import React, { FC, useCallback } from "react";
import EventStep from "./EventStep";
import { Grid, Typography, Card, CardContent, Chip, Box } from "@mui/material";
import { useStepper } from "components/base";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { 
  fetch, 
  createEventForm, 
  createLocation,
  EventType, 
  LocationEntity 
} from "api";
import { useSnackbar } from "notistack";
import { useEventStore } from "common/store";

const EventReviewStep: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
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

  const createEventMutation = useMutation({
    mutationFn: async () => {
      let locationId = location?.value;

      // Create location if it's new
      if (location?.isNew) {
        const newLocation: Omit<LocationEntity, "id"> = {
          name: location.label,
        };
        const createdLocation = await fetch(createLocation(newLocation));
        locationId = createdLocation.id;
      }

      const formData = new FormData();
      
      formData.append("name", name);
      formData.append("type", type ? type.value : EventType.ACTIVITY);
      formData.append("description", description);
      formData.append("locationId", String(locationId));
      formData.append("startTime", date.start.getTime().toString());
      formData.append("endTime", date.end.getTime().toString());

      // Workshop specific fields
      if (type?.value === EventType.WORKSHOP) {
        if (wsPresenterNames) {
          formData.append("wsPresenterNames", wsPresenterNames.map(p => p.label).join(", "));
        }
        if (wsSkillLevel) {
          formData.append("wsSkillLevel", wsSkillLevel.label);
        }
        if (wsRelevantSkills) {
          formData.append("wsRelevantSkills", wsRelevantSkills.map(s => s.label).join(", "));
        }
        if (wsUrls && wsUrls.length > 0) {
          wsUrls.forEach(url => formData.append("wsUrls", url));
        }
      }

      if (icon) {
        formData.append("icon", icon);
      }

      return fetch(createEventForm(formData));
    },
    onSuccess: () => {
      enqueueSnackbar("Event created successfully!", { variant: "success" });
      router.push("/events");
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.message || "Failed to create event", { variant: "error" });
    },
  });

  const handleSubmit = useCallback(() => {
    createEventMutation.mutate();
  }, [createEventMutation]);

  return (
    <EventStep
      title={`Review ${type?.label || "Event"}`}
      handleNext={handleSubmit}
      handleNextTitle={createEventMutation.isLoading ? "Creating..." : "Create Event"}
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