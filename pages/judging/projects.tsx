import React, { FC, useCallback } from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { EvaIcon, GradientButton, SaveButton } from "components/base";
import { Table, useColumnDef, useTable } from "components/Table";
import { ModalProvider, useModalContext } from "components/context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateEntity,
  fetch,
  getAllProjects,
  QueryKeys,
  toggleFlag,
  ToggleFlagEntity,
} from "api";
import AddNewJudgingProjectModal from "components/modal/AddNewJudgingProjectModal";
import AssignJudgingProjectsModal from "components/modal/AssignJudgingProjectsModal";
import ConfirmModal from "components/modal/ConfirmModal";
import { useSnackbar } from "notistack";

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

const AssignJudgingProjectsButton: FC = () => {
  const { showModal } = useModalContext();

  return (
    <SaveButton onClick={() => showModal("assignJudgingProjects")}>
      Assign
    </SaveButton>
  );
};

const ManageProjectsPage: NextPage = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: allProjects, refetch } = useQuery(
    QueryKeys.judgingProject.findAll(),
    () => fetch(getAllProjects),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            id: d.id,
            name: d.name,
          }));
        }
      },
    }
  );

  const defs = useColumnDef<{ id: number; name: string }>({
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

  const onDelete = () => {
    return null;
  };

  const { mutateAsync: mutateAppFlags } = useMutation(
    ({ entity }: CreateEntity<ToggleFlagEntity, "">) => toggleFlag(entity),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.flag.all);
        enqueueSnackbar("Successfully updated app flags", {
          variant: "success",
        });
      },
    }
  );

  // const { mutateAsync: mutatePushJudging } = useMutation(
  //   ({ entity }: CreateEntity<IWSPushJudgingEntity, "">) =>
  //     pushJudgingFlag(entity),
  //   {
  //     onSuccess: () => {
  //       enqueueSnackbar("Successfully notified clients", {
  //         variant: "success",
  //       });
  //     },
  //   },
  // );

  const onConfirmEnableJudging = useCallback(async () => {
    await mutateAppFlags({
      entity: {
        name: "judging",
        isEnabled: true,
      },
    });

    // await mutatePushJudging({
    //   entity: {
    //     to: "ADMIN",
    //     data: {
    //       isEnabled: true,
    //     },
    //   },
    // });
  }, [mutateAppFlags]);

  return (
    <ModalProvider>
      <AddNewJudgingProjectModal />
      <AssignJudgingProjectsModal />
      <ConfirmModal
        header={"Toggle Judging"}
        message={"Would you like to enable judging?"}
        onConfirm={onConfirmEnableJudging}
      />
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
                All projects will be selected when assigning projects
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <AssignJudgingProjectsButton />
          </Grid>
        </Grid>
        <Grid item sx={{ width: "100%" }}>
          <Table {...table}>
            <Table.GlobalActions>
              <Table.GlobalRefresh onRefresh={refetch} />
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
