import { NextPage } from "next";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import {
  useColumnBuilder,
  usePaginatedQuery,
  useQueryResolver,
} from "common/hooks";
import { DefaultCell, PaginatedTable, TableCell } from "components/Table";
import { getAllEvents } from "api/index";
import { EventType, IGetAllEventsResponse } from "types/api";
import { FC, useCallback } from "react";
import { DateTime } from "luxon";
import { Box, Grid, InputAdornment, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { Button, EvaIcon, Input } from "components/base";
import Link from "next/link";
import { useQuery } from "react-query";
import { Cell } from "react-table";

interface IEventsProps {
  events: IGetAllEventsResponse[];
}

const SearchAdornment: FC = () => (
  <InputAdornment position={"start"}>
    <Box mt={0.5}>
      <EvaIcon name={"search-outline"} size="medium" fill="#1a1a1a" />
    </Box>
  </InputAdornment>
);

const DateTimeCell: FC<{ cell: Cell }> = ({ cell }) => {
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
  const { register } = useForm();

  const { columns, names } = useColumnBuilder((builder) =>
    builder
      .addColumn("Name", {
        id: "name",
        type: "text",
        filterType: "input",
        accessor: "event_title",
        maxWidth: 120,
      })
      .addColumn("Location", {
        id: "location",
        type: "text",
        filterType: "input",
        accessor: "location_name",
        minWidth: 150,
      })
      .addColumn("Start Date", {
        type: "date",
        filterType: "date",
        accessor: "event_start_time",
        maxWidth: 100,
        width: 100,
        Cell: ({ cell }) => <DateTimeCell cell={cell} />,
      })
      .addColumn("End Date", {
        filterType: "date",
        type: "date",
        accessor: "event_end_time",
        width: 100,
        Cell: ({ cell }) => <DateTimeCell cell={cell} />,
      })
      .addColumn("Type", {
        id: "type",
        filterType: "checkbox",
        type: "text",
        accessor: "event_type",
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
  );

  const { request: getEvents } = useQueryResolver<IGetAllEventsResponse[]>(() =>
    getAllEvents()
  );

  const { data: eventsData } = useQuery(
    "events",
    ({ queryKey }) => getEvents(),
    {
      keepPreviousData: true,
      initialData: events,
      select: (data) => {
        if (data) {
          return data.map((d) => ({
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

  return (
    <Grid container gap={1.5}>
      <Grid container item justifyContent="space-between" alignItems="center">
        <Grid item xs={10}>
          <Input
            startAdornment={<SearchAdornment />}
            placeholder={"Search events"}
            inputProps={{
              style: {
                fontSize: theme.typography.pxToRem(16),
              },
            }}
            sx={{
              width: "95%",
              padding: theme.spacing(0.7, 2),
              borderRadius: "18px",
            }}
            {...register("query")}
          />
        </Grid>
        <Grid item xs={2}>
          <Link href={"/events/tabs"} passHref>
            <Button
              variant="text"
              sx={{
                width: "100%",
                padding: theme.spacing(1, 3.5),
              }}
              textProps={{
                sx: {
                  lineHeight: "1.8rem",
                },
              }}
            >
              Add an Event
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Grid item>
        <PaginatedTable
          limit={8}
          columns={columns}
          names={names}
          data={eventsData ?? []}
        />
      </Grid>
    </Grid>
  );
};

export const getServerSideProps = withServerSideProps(async () => {
  const resp = await getAllEvents();
  if (resp && resp.data) {
    return {
      props: {
        events: resp.data.body.data,
      },
    };
  }
  return {
    props: {
      events: [],
    },
  };
});

export default withDefaultLayout(Events);
