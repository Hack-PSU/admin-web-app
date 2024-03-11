import { NextPage } from "next";
import React, { FC } from "react";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import {
  EventEntity,
  EventLocation,
  EventType,
  fetch,
  getAllEvents,
  QueryKeys,
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
import _ from "lodash";

interface IEventsProps {
  events: EventEntity[];
}

type EventRowValues = Pick<
  EventEntity,
  "name" | "startTime" | "endTime" | "type" | "id"
> & {
  location: EventLocation["name"];
};

const DateTimeCell: FC<{ date: number }> = ({ date }) => {
  return (
    <DefaultCell>
      <TextCell
        sx={{
          fontWeight: 600,
          color: "common.black",
        }}
      >
        {DateTime.fromMillis(date).toLocaleString(DateTime.TIME_SIMPLE)}
      </TextCell>
      <TextCell
        sx={{
          fontWeight: 500,
          color: "header.light",
        }}
      >
        {DateTime.fromMillis(date).toFormat("EEEE")}
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
        accessorKey: "name",
      },
      {
        id: "location",
        type: "text",
        header: "Location",
        accessorKey: "location",
      },
      {
        id: "startDate",
        type: "text",
        header: "Start Time",
        accessorKey: "startTime",
        cell: ({ cell }) => <DateTimeCell date={Number(cell.getValue())} />,
      },
      {
        id: "endDate",
        type: "text",
        header: "End Time",
        accessorKey: "endTime",
        cell: ({ cell }) => <DateTimeCell date={Number(cell.getValue())} />,
      },
      {
        id: "type",
        type: "text",
        header: "Type",
        accessorKey: "type",
        format: (value) => {
          switch (value as EventType) {
            case EventType.WORKSHOP:
              return "Workshop";
            case EventType.FOOD:
              return "Food";
            case EventType.ACTIVITY:
              return "Activity";
            case EventType.CHECKIN:
              return "Check In";
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
                onClick: () => router.push(`/events/${row.original.id}`),
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
      select: (data) => {
        if (data) {
          return (
            _.chain(data)
              .map((d) => {
                return {
                  id: d.id,
                  name: d.name,
                  location: d.location?.name ?? "",
                  startTime: d.startTime,
                  endTime: d.endTime,
                  type: d.type,
                };
              })
              .value()
              // Underlying sort by start time is generally useful, even when sorting by other fields.
              .sort((event1, event2) => {
                return event1.startTime - event2.startTime;
              })
          );
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
            onClick={() => router.push("/events/new")}
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
