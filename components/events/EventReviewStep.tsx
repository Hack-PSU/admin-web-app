import React, { FC, useCallback } from "react";
import EventStep from "./EventStep";
import { Grid, Typography, Card, CardContent, Chip, Box } from "@mui/material";
import { useStepper } from "components/base";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { fetch, createEventForm, EventType } from "api";
import { useSnackbar } from "notistack";

const EventReviewStep: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { active, previousStep } = useStepper(4, "5. Review");

  // For now, using dummy data - in a real implementation, you'd get this from your state management
  const eventData = {
    name: "Sample Event",
    type: EventType.ACTIVITY,
    description: "Sample description",
    location: "Sample Location",
    startDate: new Date(),
    endDate: new Date(),
    icon: null,
  };

  const createEventMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      
      formData.append("name", eventData.name);
      formData.append("type", eventData.type);
      formData.append("description", eventData.description);
      formData.append("locationId", "1"); // Mock location ID
      formData.append("startTime", eventData.startDate.getTime().toString());
      formData.append("endTime", eventData.endDate.getTime().toString());

      if (eventData.icon) {
        formData.append("icon", eventData.icon);
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

  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case EventType.WORKSHOP:
        return "Workshop";
      case EventType.FOOD:
        return "Food";
      case EventType.ACTIVITY:
        return "Activity";
      case EventType.CHECKIN:
        return "Check In";
      default:
        return "Event";
    }
  };

  return (
    <EventStep
      title={`Review ${getEventTypeLabel(eventData.type)}`}
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
                  {eventData.name}
                </Typography>
                <Chip
                  label={getEventTypeLabel(eventData.type)}
                  size="small"
                  color="primary"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {eventData.description}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body2">
                    {eventData.location}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body2">
                    {eventData.startDate.toLocaleDateString()} at {eventData.startDate.toLocaleTimeString()}
                  </Typography>
                </Grid>
              </Grid>
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