import React, { useState } from "react";
import { NextPage } from "next";
import {
  alpha,
  Button,
  darken,
  Grid,
  lighten,
  styled,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DetailForm,
  EventFormPanel,
  EventFormSection,
  WorkshopForm,
} from "components/event";
import { FormProvider, useForm } from "react-hook-form";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { getAllEvents } from "api/index";
import { EventType, IGetAllEventsResponse } from "types/api";

interface INewEventProps {
  events: IGetAllEventsResponse[];
}

interface IStyledTabProps {
  label: string;
}

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.common.black, 0.4)}`,
  "& .MuiTabs-indicator": {
    backgroundColor: "black",
  },
}));

const StyledTab = styled((props: IStyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  fontSize: theme.typography.pxToRem(17),
  color: alpha(theme.palette.common.black, 0.4),
  "&:hover": {
    color: lighten(theme.palette.common.black, 0.05),
  },
  "&.Mui-selected": {
    color: "black",
    fontWeight: 700,
  },
}));

const TabbedEvent: NextPage<INewEventProps> = ({ events }) => {
  const methods = useForm();
  const eventType = methods.watch("type");

  const theme = useTheme();

  const onSubmit = () => {
    methods.handleSubmit((data) => {
      console.log(data);
    })();
  };

  const [tab, setTab] = useState<number>(0);

  const onChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
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
          component={"h1"}
          variant="h1"
          sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
        >
          New Event
        </Typography>
      </Grid>
      <FormProvider {...methods}>
        <Grid item>
          <StyledTabs
            value={tab}
            onChange={onChangeTab}
            aria-label="new event tabs"
          >
            <StyledTab label="Details" />
            {eventType && eventType.value === EventType.WORKSHOP && (
              <StyledTab label="Workshop" />
            )}
          </StyledTabs>
        </Grid>
        <EventFormPanel value={tab} index={0}>
          <DetailForm />
        </EventFormPanel>
        <EventFormPanel value={tab} index={1}>
          <WorkshopForm />
        </EventFormPanel>
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

export default withDefaultLayout(TabbedEvent);
