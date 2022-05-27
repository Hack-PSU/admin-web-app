import React, { useState } from 'react';
import { NextPage } from "next";
import { Grid, Typography } from "@mui/material";
import { DetailForm, EventFormSection } from "components/event";
import { FormProvider, useForm } from "react-hook-form";

const NewEvent: NextPage = () => {
  const [isWorkshop, setIsWorkshop] = useState<boolean>(false);
  const methods = useForm();

  const toggleWorkshop = () => {
    setIsWorkshop(bool => !bool);
  };

  return (
    <Grid
      container
      sx={{
        flexDirection: "column"
      }}
      gap={1.4}
    >
      <Grid item>
        <Typography component={"h1"} variant="h1" sx={{ fontSize: '0.8rem', fontWeight: "bold" }} >
          New Event
        </Typography>
        <FormProvider {...methods}>
          <EventFormSection label={"Details"}>
            <DetailForm onSelectWorkshop={toggleWorkshop} />
          </EventFormSection>
          { isWorkshop &&
            <EventFormSection label={"Workshop"}>
              <></>
            </EventFormSection>
          }
        </FormProvider>
      </Grid>
    </Grid>
  );
};

export default NewEvent;
