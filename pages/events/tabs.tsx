import React, { useState } from "react";
import { NextPage } from "next";
import {
  alpha,
  darken,
  Grid,
  lighten,
  styled,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { Button } from "components/base";
import {
  DetailsForm,
  EventFormPanel,
  EventFormSection,
  WorkshopForm,
} from "components/event";
import { FormProvider, useForm } from "react-hook-form";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { getAllEvents } from "api/index";
import { EventType, IGetAllEventsResponse } from "types/api";
import ModalProvider from "components/context/ModalProvider";
import AddNewLocationModal from "components/modal/AddNewLocationModal";

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
            <DetailsForm />
          </EventFormPanel>
          <EventFormPanel value={tab} index={1}>
            <WorkshopForm />
          </EventFormPanel>
          <Grid item mt={2}>
            <Button
              sx={{
                borderRadius: "15px",
                lineHeight: "1.2rem",
                color: "black",
                fontWeight: "bold",
                fontSize: "1rem",
                padding: theme.spacing(1, 5),
                ":hover": {
                  backgroundColor: darken(theme.palette.button.grey, 0.05),
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

// export const getServerSideProps = withServerSideProps(async (token) => {
//   const resp = await getAllEvents(undefined, undefined, token);
//   let events: IGetAllEventsResponse[] = [];
//
//   if (resp && resp.data) {
//     events = resp.data.body.data;
//   }
//   return {
//     props: {
//       events,
//     },
//   };
// });

export default withDefaultLayout(TabbedEvent);
