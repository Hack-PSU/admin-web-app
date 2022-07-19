import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import AddExtraCreditClassModal from "components/modal/AddExtraCreditClassModal";
import AssignExtraCreditClassModal from "components/modal/AssignExtraCreditClassModal";
import { Box, Grid, Typography } from "@mui/material";
import { EvaIcon } from "components/base";
import { Table } from "components/Table";
import { FormProvider } from "react-hook-form";
import { ModalProvider } from "components/context";
import React from "react";
import { useQuery } from "react-query";
import { fetch, getAllHackers, QueryKeys } from "api";
import {
  getAllExtraCreditAssignments,
  getAllExtraCreditClasses,
} from "api/extra_credit";
import { useColumnBuilder, useTableState } from "common/hooks";

type DataRow = {
  uid: number;
  userName: string;
  className: string;
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

  const { columns, names } = useColumnBuilder<DataRow>((builder) =>
    builder
      .addColumn("Hacker", {
        id: "hacker",
        type: "text",
        accessor: (row) => row.userName,
      })
      .addColumn("Class", {
        id: "class",
        type: "text",
        accessor: (row) => row.className,
      })
  );

  const onRefresh = () => {
    return null;
  };

  const onDelete = () => {
    return null;
  };

  const { states, onRowSelected } = useTableState({
    data: allAssignments,
    getKey: (item) => String(item.uid),
  });

  return (
    <ModalProvider>
      <AddExtraCreditClassModal />
      <Grid container gap={1.5} flexDirection="column">
        <Grid container item justifyContent="space-between" alignItems="center">
          <Grid item xs={9.7}>
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
          <Grid item xs={2}>
            {/*<AssignClassButton hasSelections={hasSelections} />*/}
          </Grid>
        </Grid>
        <Grid item sx={{ width: "100%" }}>
          <Table
            limit={8}
            names={names}
            onRefresh={onRefresh}
            onDelete={onDelete}
            columns={columns}
            data={allAssignments ?? []}
            onSelectRows={onRowSelected}
            {...states}
          >
            <Table.GlobalActions />
            <Table.Container>
              <Table.Actions>
                <Table.ActionsLeft />
                <Table.ActionsCenter>
                  <Table.Pagination />
                </Table.ActionsCenter>
                <Table.ActionsRight>
                  <Table.Delete />
                </Table.ActionsRight>
              </Table.Actions>
              <Table.Header />
              <Table.Body />
            </Table.Container>
          </Table>
        </Grid>
      </Grid>
    </ModalProvider>
  );
};

export default withDefaultLayout(ExtraCreditAssignments);
