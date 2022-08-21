import { NextPage } from "next";
import React, { FC } from "react";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import {
  EventType,
  IGetAllEventsResponse,
  getAllEvents,
  QueryKeys,
  fetch,
  resolveError,
} from "api";
import { DateTime } from "luxon";
import { Grid, Typography, useTheme } from "@mui/material";
import { GradientButton } from "components/base";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  DefaultActionCell,
  DefaultCell,
  Table,
  TextCell,
  useColumnDef,
  useTable,
} from "components/Table";

interface IEventsProps {
  events: IGetAllEventsResponse[];
}

type EventRowValues = Pick<
  IGetAllEventsResponse,
  | "event_title"
  | "location_name"
  | "event_start_time"
  | "event_end_time"
  | "event_type"
  | "uid"
>;

const DateTimeCell: FC<{ date: number }> = ({ date }) => {
  return (
    <DefaultCell>
      <TextCell
        sx={{
          fontWeight: 600,
          color: "common.black",
        }}
      >
        {DateTime.fromMillis(date).toLocaleString(DateTime.DATE_SHORT)}
      </TextCell>
      <TextCell
        sx={{
          fontWeight: 500,
          color: "header.light",
        }}
      >
        {DateTime.fromMillis(date).toLocaleString(DateTime.TIME_SIMPLE)}
      </TextCell>
    </DefaultCell>
  );
};

const Events: NextPage<IEventsProps> = ({ events }) => {
  const theme = useTheme();
  const router = useRouter();

  const defs = useColumnDef<EventRowValues>({
    columns: [
      {
        id: "name",
        type: "text",
        header: "Name",
        accessorKey: "event_title",
      },
      {
        id: "location",
        type: "text",
        header: "Location",
        accessorKey: "location_name",
      },
      {
        id: "startDate",
        type: "text",
        header: "Start Date",
        accessorKey: "event_start_time",
        cell: ({ cell }) => <DateTimeCell date={Number(cell.getValue())} />,
      },
      {
        id: "endDate",
        type: "text",
        header: "End Date",
        accessorKey: "event_end_time",
        cell: ({ cell }) => <DateTimeCell date={Number(cell.getValue())} />,
      },
      {
        id: "type",
        type: "text",
        header: "Type",
        accessorKey: "event_type",
        format: (value) => {
          switch (value as EventType) {
            case EventType.WORKSHOP:
              return "Workshop";
            case EventType.FOOD:
              return "Food";
            case EventType.ACTIVITY:
              return "Activity";
          }
        },
      },
      {
        id: "actions",
        type: "custom",
        header: "",
        cell: ({ row }) => (
          <DefaultActionCell
            cellProps={{
              sx: {
                width: "8%",
              },
            }}
            items={[
              {
                icon: "edit-outline",
                onClick: () => router.push(`/events/${row.original.uid}`),
              },
            ]}
          />
        ),
      },
    ],
  });

  const { data: eventsData } = useQuery(
    QueryKeys.event.findAll(),
    () => fetch(getAllEvents),
    {
      keepPreviousData: true,
      initialData: events,
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            uid: d.uid,
            event_title: d.event_title,
            location_name: d.location_name,
            event_start_time: d.event_start_time,
            event_end_time: d.event_end_time,
            event_type: d.event_type,
          }));
        }
        return [];
      },
    }
  );

  const table = useTable({
    data: eventsData ?? [],
    ...defs,
  });

  const onRefresh = () => {
    return undefined;
  };

  const onDelete = () => {
    return undefined;
  };

  return (
    <Grid container gap={1.5}>
      <Grid container item justifyContent="space-between" alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Events
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <GradientButton
            variant="text"
            sx={{
              width: "100%",
              padding: theme.spacing(1, 3.5),
            }}
            textProps={{
              sx: {
                lineHeight: "1.8rem",
                color: "common.white",
              },
            }}
            onClick={() => router.push("/events/steps")}
          >
            Add an Event
          </GradientButton>
        </Grid>
      </Grid>
      <Grid item sx={{ width: "100%" }}>
        <Table {...table}>
          <Table.GlobalActions>
            <Table.GlobalRefresh onRefresh={onRefresh} />
            <Table.GlobalPageSize />
          </Table.GlobalActions>
          <Table.Container>
            <Table.Actions
              center={<Table.PaginationAction />}
              right={<Table.DeleteAction onDelete={onDelete} />}
            />
            <Table.Content>
              <Table.Header />
              <Table.Body />
            </Table.Content>
          </Table.Container>
        </Table>
      </Grid>
    </Grid>
  );
};

export const getServerSideProps = withServerSideProps(async (context) => {
  try {
    const events = await fetch(getAllEvents);
    if (events) {
      return {
        props: {
          events,
        },
      };
    }
  } catch (e: any) {
    resolveError(context, e);
  }
  return {
    props: {
      events: [],
    },
  };
});

export default withDefaultLayout(Events);
