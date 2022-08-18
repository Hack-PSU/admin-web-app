import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import AddExtraCreditClassModal from "components/modal/AddExtraCreditClassModal";
import { Box, Grid, Typography } from "@mui/material";
import { EvaIcon } from "components/base";
import { Table, useColumnDef, useTable } from "components/Table";
import { ModalProvider } from "components/context";
import React from "react";
import { useQuery } from "react-query";
import {
  fetch,
  getAllHackers,
  QueryKeys,
  getAllExtraCreditAssignments,
  getAllExtraCreditClasses,
} from "api";

type DataRow = {
  uid: number;
  userName: string;
  className?: string;
};

const ExtraCreditAssignments: NextPage = () => {
  const { data: allUsers } = useQuery(QueryKeys.hacker.findAll(), () =>
    fetch(getAllHackers)
  );

  const { data: allClasses } = useQuery(
    QueryKeys.extraCreditClass.findAll(),
    () => fetch(getAllExtraCreditClasses)
  );

  const { data: allAssignments } = useQuery(
    QueryKeys.extraCreditAssignment.findAll(),
    () => fetch(getAllExtraCreditAssignments),
    {
      select: (data) => {
        if (data && allClasses && allUsers) {
          return data.map((d) => {
            const user = allUsers.find((u) => u.uid === d.user_uid);
            const ecClass = allClasses.find((c) => c.uid === d.class_uid);

            return {
              uid: d.uid,
              userName: `${user?.firstname} ${user?.lastname}`,
              className: ecClass?.class_name,
            };
          });
        }
      },
      enabled: !!allClasses && !!allUsers,
    }
  );

  const defs = useColumnDef<DataRow>({
    columns: [
      {
        id: "hacker",
        type: "text",
        header: "Hacker",
        accessorKey: "userName",
      },
      {
        id: "class",
        type: "text",
        header: "Class",
        accessorKey: "className",
      },
    ],
  });

  const table = useTable({
    data: allAssignments ?? [],
    ...defs,
  });

  const onRefresh = () => {
    return null;
  };

  const onDelete = () => {
    return null;
  };

  return (
    <ModalProvider>
      <AddExtraCreditClassModal />
      <Grid container gap={1.5} flexDirection="column">
        <Grid container item justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Manage Assignments
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          item
          justifyContent="space-between"
          xs={12}
          alignItems="center"
          mt={1}
        >
          <Grid container item xs={10} alignItems="center" spacing={1}>
            <Grid item>
              <Box mt={0.3}>
                <EvaIcon name={"alert-circle-outline"} />
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">
                Make assignments in the Manage Classes page
              </Typography>
            </Grid>
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
    </ModalProvider>
  );
};

export default withDefaultLayout(ExtraCreditAssignments);
