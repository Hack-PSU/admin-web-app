import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  AnalyticsEventsResponse,
  EventType,
  fetch,
  getAnalyticsEvents,
  QueryKeys,
} from "api";
import { Table, useColumnDef, useTable } from "components/Table";
import _ from "lodash";

const AnalyticsEventsPage: NextPage = () => {
  const { data, refetch } = useQuery(
    QueryKeys.analytics.findOne("events"),
    () => fetch(getAnalyticsEvents),
    {
      select: (data) => {
        if (data) {
          return _.orderBy(data, "count", "desc");
        }
      },
    }
  );

  const defs = useColumnDef<AnalyticsEventsResponse>({
    columns: [
      {
        id: "name",
        header: "Name",
        type: "text",
        accessorKey: "name",
      },
      {
        id: "type",
        header: "Type",
        type: "text",
        accessorKey: "type",
        format: (value) => {
          switch (value as EventType) {
            case EventType.CHECKIN:
              return "Check-In";
            case EventType.ACTIVITY:
              return "Activity";
            case EventType.WORKSHOP:
              return "Workshop";
            case EventType.FOOD:
              return "Food";
          }
        },
      },
      {
        id: "count",
        header: "Scans",
        type: "text",
        accessorKey: "count",
      },
    ],
  });

  const table = useTable({
    data: data ?? [],
    ...defs,
  });

  return (
    <Grid container gap={1.5} flexDirection={"column"}>
      <Grid
        container
        item
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Grid item xs={9.7}>
          <Typography variant={"h4"} sx={{ fontWeight: 700 }}>
            Events
          </Typography>
        </Grid>
      </Grid>
      <Grid item sx={{ width: "100%" }}>
        <Table {...table}>
          <Table.GlobalActions>
            <Table.GlobalRefresh onRefresh={refetch} />
            <Table.GlobalPageSize />
          </Table.GlobalActions>
          <Table.Container>
            <Table.Actions center={<Table.PaginationAction />} />
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

export default withDefaultLayout(AnalyticsEventsPage);
