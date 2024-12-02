import { NextPage } from "next";
import { withDefaultLayout, withProtectedRoute } from "common/HOCs";
import { AuthPermission } from "api/providers/FirebaseProvider";
import { Grid, Typography } from "@mui/material";
import { Table, useColumnDef, useTable } from "components/Table";
import { useQuery } from "@tanstack/react-query";
import { fetch, getAnalyticsScans, QueryKeys } from "api";
import _ from "lodash";

type AnalyticsScanColumns = {
  name: string;
  count: number;
};

const AnalyticsOrganizersPage: NextPage = () => {
  const { data, refetch } = useQuery(
    QueryKeys.analytics.findOne("organizers"),
    () => fetch(getAnalyticsScans),
    {
      select: (data) => {
        if (data) {
          return _.chain(data)
            .map((d) => ({
              name: `${d.firstName} ${d.lastName}`,
              count: d.count,
            }))
            .orderBy("count", "desc")
            .value();
        }
      },
    }
  );

  const defs = useColumnDef<AnalyticsScanColumns>({
    columns: [
      {
        id: "name",
        header: "Name",
        type: "text",
        accessorKey: "name",
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
    <Grid container gap={1.5}>
      <Grid
        container
        item
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Grid item xs={10}>
          <Typography variant={"h4"} sx={{ fontWeight: 700 }}>
            Organizers
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

export default withDefaultLayout(
  withProtectedRoute(AnalyticsOrganizersPage, AuthPermission.DIRECTOR)
);
