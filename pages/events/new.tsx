import React from "react";
import { NextPage } from "next";
import { Button, darken, Grid, Typography, useTheme } from "@mui/material";
import { DetailForm, EventFormSection, WorkshopForm } from "components/event";
import { FormProvider, useForm } from "react-hook-form";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { getAllEvents } from "api/index";
import { EventType, IGetAllEventsResponse } from "types/api";

interface INewEventProps {
  events: IGetAllEventsResponse[];
}

const NewEvent: NextPage<INewEventProps> = ({ events }) => {
  const methods = useForm();
  const eventType = methods.watch("type");

  const theme = useTheme();

  const onSubmit = () => {
    methods.handleSubmit((data) => {
      console.log(data);
    })();
  };

  return (
    <Grid
      container
      sx={{
        flexDirection: "column",
      }}
      gap={1.4}
    >
      <Grid item>
        <Typography
          variant="h3"
          style={{
            fontSize: theme.typography.pxToRem(42),
          }}
          sx={{
            fontWeight: "bold",
          }}
        >
          New Event
        </Typography>
      </Grid>
      <FormProvider {...methods}>
        <EventFormSection label={"Details"}>
          <DetailForm />
        </EventFormSection>
        {eventType && eventType.value === EventType.WORKSHOP && (
          <EventFormSection label={"Workshop"} sx={{ mt: 2 }}>
            <WorkshopForm />
          </EventFormSection>
        )}
        <Grid item mt={2}>
          <Button
            sx={{
              borderRadius: "15px",
              backgroundColor: "#f0f0f0",
              lineHeight: "1.2rem",
              textTransform: "none",
              color: "black",
              fontWeight: "bold",
              fontSize: "1rem",
              padding: theme.spacing(1, 5),
              ":hover": {
                backgroundColor: darken("#f0f0f0", 0.05),
              },
            }}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </Grid>
      </FormProvider>
    </Grid>
  );
};

export const getServerSideProps = withServerSideProps(async (token) => {
  const resp = await getAllEvents(undefined, undefined, token);
  let events: IGetAllEventsResponse[] = [];

  if (resp && resp.data) {
    events = resp.data.body.data;
  }
  return {
    props: {
      events,
    },
  };
});

export default withDefaultLayout(NewEvent);
