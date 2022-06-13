import React from "react";
import { NextPage } from "next";
import { Button, darken, Grid, Typography, useTheme } from "@mui/material";
import { DetailsForm, EventFormSection, WorkshopForm } from "components/event";
import { FormProvider, useForm } from "react-hook-form";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { getAllEvents } from "api/index";
import { EventType, IGetAllEventsResponse } from "types/api";
import ModalProvider from "components/context/ModalProvider";
import AddNewLocationModal from "components/modal/AddNewLocationModal";

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
    <ModalProvider>
      <AddNewLocationModal />
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
            sx={{
              fontWeight: "bold",
            }}
          >
            New Event
          </Typography>
        </Grid>
        <FormProvider {...methods}>
          <EventFormSection label={"Details"}>
            <DetailsForm />
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
    </ModalProvider>
  );
};

export const getServerSideProps = withServerSideProps(
  async (context, token) => {
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
  }
);

export default withDefaultLayout(NewEvent);
