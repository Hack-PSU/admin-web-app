import React, { useState } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { Grid, Typography } from "@mui/material";
import { DetailForm, EventFormSection } from "components/event";
import { FormProvider, useForm } from "react-hook-form";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { getAllEvents } from "api/index";
import { IGetAllEventsResponse } from "types/api";

interface INewEventProps {
  events: IGetAllEventsResponse[];
}

const NewEvent: NextPage<INewEventProps> = ({ events }) => {
  const [isWorkshop, setIsWorkshop] = useState<boolean>(false);
  const methods = useForm();

  const toggleWorkshop = () => {
    setIsWorkshop((bool) => !bool);
  };

  // console.log(events);

  // const { data } = useQuery("events", () => getAllEvents(0));

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
          component={"h1"}
          variant="h1"
          sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
        >
          New Event
        </Typography>
        <FormProvider {...methods}>
          <EventFormSection label={"Details"}>
            <DetailForm onSelectWorkshop={toggleWorkshop} />
          </EventFormSection>
          {/*{ isWorkshop &&*/}
          {/*  <EventFormSection label={"Workshop"}>*/}
          {/*    <></>*/}
          {/*  </EventFormSection>*/}
          {/*}*/}
        </FormProvider>
      </Grid>
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
