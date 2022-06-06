import { NextPage } from "next";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { useColumnBuilder } from "common/hooks";
import { DefaultCell, SimpleTable, TableCell } from "components/Table";
import { getAllEvents } from "api/index";
import { EventType, IGetAllEventsResponse } from "types/api";
import { useMemo } from "react";
import { DateTime } from "luxon";
import { Typography, useTheme } from "@mui/material";

interface IEventsProps {
  events: IGetAllEventsResponse[];
}

const Events: NextPage<IEventsProps> = ({ events }) => {
  const theme = useTheme();

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

  const eventsData = useMemo(
    () =>
      events.map(
        ({
          event_title,
          location_name,
          event_start_time,
          event_end_time,
          event_type,
        }) => ({
          event_title,
          location_name,
          event_start_time,
          event_end_time,
          event_type,
        })
      ),
    [events]
  );

  return <SimpleTable columns={columns} data={eventsData} />;
};

export const getServerSideProps = withServerSideProps(
  async (context, token) => {
    const resp = await getAllEvents(undefined, undefined, token);
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
