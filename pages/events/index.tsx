import { NextPage } from "next";
import React, { FC } from "react";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { useColumnBuilder } from "common/hooks";
import {
  DefaultCell,
  TableCell,
  PaginatedTable,
  EditRowCell,
} from "components/Table";
import {
  EventType,
  IGetAllEventsResponse,
  getAllEvents,
  QueryKeys,
  fetch,
  resolveError,
} from "api";
import { DateTime } from "luxon";
import { Grid, IconButton, Typography, useTheme } from "@mui/material";
import { EvaIcon, GradientButton } from "components/base";
import { useQuery } from "react-query";
import { Cell } from "react-table";
import { useRouter } from "next/router";

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

const DateTimeCell: FC<{ cell: Cell<EventRowValues> }> = ({ cell }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      item
      sx={{
        padding: theme.spacing(0, 2, 0, 0),
        flexDirection: "column",
      }}
      {...cell.getCellProps()}
    >
      <Grid item>
        <DefaultCell
          sx={{
            fontWeight: 600,
            color: "common.black",
          }}
        >
          {DateTime.fromMillis(cell.value).toLocaleString(DateTime.DATE_SHORT)}
        </DefaultCell>
      </Grid>
      <Grid item>
        <DefaultCell
          sx={{
            fontWeight: 500,
            color: "table.header",
          }}
        >
          {DateTime.fromMillis(cell.value).toLocaleString(DateTime.TIME_SIMPLE)}
        </DefaultCell>
      </Grid>
    </Grid>
  );
};

const Events: NextPage<IEventsProps> = ({ events }) => {
  const theme = useTheme();
  const router = useRouter();

  const { columns, names } = useColumnBuilder<EventRowValues>((builder) =>
    builder
      .addColumn("Name", {
        id: "name",
        type: "text",
        filterType: "input",
        accessor: (row) => row.event_title,
        maxWidth: 120,
      })
      .addColumn("Location", {
        id: "location",
        type: "text",
        filterType: "input",
        accessor: (row) => row.location_name,
        minWidth: 150,
      })
      .addColumn("Start Date", {
        type: "date",
        filterType: "date",
        accessor: (row) => row.event_start_time,
        maxWidth: 100,
        width: 100,
        Cell: ({ cell }) => <DateTimeCell cell={cell} />,
      })
      .addColumn("End Date", {
        filterType: "date",
        type: "date",
        accessor: (row) => row.event_end_time,
        width: 100,
        Cell: ({ cell }) => <DateTimeCell cell={cell} />,
      })
      .addColumn("Type", {
        id: "type",
        filterType: "checkbox",
        type: "text",
        accessor: (row) => row.event_type,
        width: 100,
        Cell: ({ cell }) => {
          return (
            <TableCell {...cell.getCellProps()}>
              {cell.value === EventType.FOOD && "FOOD"}
              {cell.value === EventType.WORKSHOP && "WORKSHOP"}
              {cell.value === EventType.ACTIVITY && "ACTIVITY"}
            </TableCell>
          );
        },
      })
      .addColumn("Actions", {
        id: "actions",
        filterType: "hide",
        type: "custom",
        hideHeader: true,
        disableSortBy: true,
        width: 20,
        accessor: (row) => row.uid,
        Cell: ({ cell, row }) => (
          <EditRowCell
            cell={cell}
            onClickEdit={() => router.push(`/events/${row.original.uid}`)}
          />
        ),
      })
  );

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
      <Grid item>
        <PaginatedTable
          limit={8}
          columns={columns}
          names={names}
          data={eventsData ?? []}
          onRefresh={onRefresh}
          onDelete={onDelete}
        />
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
