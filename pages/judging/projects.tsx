import React from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { EvaIcon, GradientButton } from "components/base";
import { Table, useColumnDef, useTable } from "components/Table";
import { ModalProvider, useModalContext } from "components/context";
import { useQuery } from "react-query";
import { fetch, getAllProjects, QueryKeys } from "api";
import AddNewJudgingProjectModal from "components/modal/AddNewJudgingProjectModal";

const CURRENT_HACKATHON = "81069f2a04cb465994ad84155af6e868";

const AddProjectButton = () => {
  const { showModal } = useModalContext();
  const theme = useTheme();

  return (
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
      onClick={() => showModal("addJudgingProject")}
    >
      Add a Project
    </GradientButton>
  );
};

const ManageProjectsPage: NextPage = () => {
  const { data: allProjects } = useQuery(
    QueryKeys.judgingProject.findAll(),
    () => fetch(getAllProjects),
    {
      select: (data) => {
        if (data) {
          return data
            .filter((d) => d.hackathon === CURRENT_HACKATHON)
            .map((d) => ({
              uid: d.uid,
              name: d.project,
            }));
        }
      },
    }
  );

  const defs = useColumnDef<{ uid: number; name: string }>({
    columns: [
      {
        id: "name",
        type: "text",
        header: "Name",
        accessorKey: "name",
      },
    ],
  });

  const table = useTable({
    data: allProjects ?? [],
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
      <AddNewJudgingProjectModal />
      <Grid container gap={1.5} flexDirection="column">
        <Grid container item justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Manage Projects
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <AddProjectButton />
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
                Assigning projects to be judged will default to all projects
                unless rows are selected
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            {/*<AssignClassButton hasSelections={hasSelections} />*/}
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

export default withDefaultLayout(ManageProjectsPage);
