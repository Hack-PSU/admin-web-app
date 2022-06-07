import { NextPage } from "next";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { useColumnBuilder, usePaginatedQuery } from "common/hooks";
import { DefaultCell, SimpleTable, TableCell } from "components/Table";
import { getAllEvents } from "api/index";
import { EventType, IGetAllEventsResponse } from "types/api";
import { FC, useMemo } from "react";
import { DateTime } from "luxon";
import { Box, Grid, InputAdornment, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { Button, EvaIcon, Input } from "components/base";
import Link from "next/link";
import { useQuery } from "react-query";

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

const Events: NextPage<IEventsProps> = ({ events }) => {
  const theme = useTheme();
  const { register } = useForm();

  const columns = useColumnBuilder((builder) =>
    builder
      .addColumn("Name", {
        accessor: "event_title",
        maxWidth: 120,
      })
      .addColumn("Location", {
        accessor: "location_name",
        minWidth: 150,
      })
      .addColumn("Start Date", {
        accessor: "event_start_time",
        maxWidth: 100,
        width: 100,
        Cell: ({ cell }) => (
          <TableCell {...cell.getCellProps()}>
            {DateTime.fromMillis(cell.value).toLocaleString(
              DateTime.DATE_SHORT
            )}
          </TableCell>
        ),
      })
      .addColumn("End Date", {
        accessor: "event_end_time",
        width: 100,
        Cell: ({ cell }) => (
          <TableCell {...cell.getCellProps()}>
            {DateTime.fromMillis(cell.value).toLocaleString(
              DateTime.DATE_SHORT
            )}
          </TableCell>
        ),
      })
      .addColumn("Type", {
        accessor: "event_type",
        width: 100,
        Cell: ({ cell }) => {
          return (
            <TableCell {...cell.getCellProps()}>
              {cell.value === EventType.FOOD && "FOOD"}
              {cell.value === EventType.WORKSHOP && "WORKSHOP"}
              {cell.value === EventType.ACTIVITY && "EVENT"}
            </TableCell>
          );
        },
      })
  );

  const {
    page,
    handlePageChange,
    request: getEvents,
  } = usePaginatedQuery<IGetAllEventsResponse[]>(getAllEvents, {
    page: 1,
    limit: 10,
  });

  const { data: eventsData } = useQuery(["events", page], getEvents, {
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
  });

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
        <SimpleTable columns={columns} data={eventsData ?? []} />
      </Grid>
    </Grid>
  );
};

export const getServerSideProps = withServerSideProps(
  async (context, token) => {
    const resp = await getAllEvents(0, 10, token);
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
  }
);

export default withDefaultLayout(Events);
