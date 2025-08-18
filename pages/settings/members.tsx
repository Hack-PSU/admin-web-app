import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { withSettingsLayout } from "components/settings";
import { DefaultCell, Table, useColumnDef, useTable } from "components/Table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateEntity,
  fetch,
  getAllOrganizers,
  deleteQuery,
  QueryKeys,
  updateOrganizer,
} from "api";
import { ControlledSelect, GradientButton } from "components/base";
import { FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import _ from "lodash";
import {
  ModalProvider,
  useFirebase,
  useModalContext,
} from "components/context";
import { Grid, useTheme, TableRow, TableCell, Typography } from "@mui/material";
import AddNewMemberModal from "components/modal/AddNewMemberModal";
import { IOption } from "components/base/Select/types";
import { TEAM_ORDER, TEAM_NAMES } from "common/constants";
import { AxiosError } from "axios";

type OrganizerEntity = {
  id: string;
  name: string;
  permission: IOption<number>;
  email: string;
  team: string;
  isActive: boolean;
};

type UpdateOrganizerEntity = {
  id: string;
  privilege: number;
};

type GroupedOrganizerEntity = OrganizerEntity & {
  isTeamHeader?: boolean;
  teamName?: string;
};

const PERMISSION_OPTIONS: IOption<number>[] = [
  {
    value: 1,
    label: "Volunteer",
  },
  {
    value: 2,
    label: "Team Member",
  },
  {
    value: 3,
    label: "Exec Member",
  },
  {
    value: 4,
    label: "Tech Developer",
  },
  {
    value: 5,
    label: "Finance Director",
  },
];

const AddNewMemberButton: FC = () => {
  const theme = useTheme();
  const { showModal } = useModalContext();

  return (
    <GradientButton
      sx={{
        padding: theme.spacing(1, 3.5),
        width: "100%",
      }}
      textProps={{
        sx: {
          lineHeight: "1.8rem",
          color: "common.white",
        },
      }}
      onClick={() => showModal("addNewMember")}
    >
      Add Member
    </GradientButton>
  );
};

const SettingsMembers: NextPage = () => {
  const { user } = useFirebase();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const { data: allOrganizers, refetch } = useQuery(
    QueryKeys.organizer.findAll(),
    () => fetch(getAllOrganizers),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => {
            const permission = PERMISSION_OPTIONS.find(
              (p) => p.value === d.privilege
            );
            return {
              id: d.id,
              name: `${d.firstName} ${d.lastName}`,
              email: d.email,
              permission: permission ?? { value: 2, label: "Team Member" },
              team: d.team || TEAM_NAMES.UNASSIGNED,
              isActive: d.isActive,
            };
          });
        }
      },
    }
  );

  const data = useMemo(() => {
    if (user && allOrganizers) {
      return _.filter(allOrganizers, (o) => o.id !== user.uid && o.isActive);
    }
    return [];
  }, [allOrganizers, user]);

  // Create flattened data with team headers
  const tableData = useMemo(() => {
    if (!data) return [];
    
    const grouped = _.groupBy(data, 'team');
    const flatData: GroupedOrganizerEntity[] = [];
    
    // Add teams in the specified order
    const teamOrder = [...TEAM_ORDER];
    
    // Add any remaining teams (including "Unassigned") that aren't in the order
    Object.keys(grouped).forEach(team => {
      if (!teamOrder.includes(team)) {
        teamOrder.push(team);
      }
    });
    
    teamOrder.forEach(team => {
      if (grouped[team] && grouped[team].length > 0) {
        // Add team header
        flatData.push({
          id: `team-header-${team}`,
          name: '',
          email: '',
          permission: { value: 0, label: '' },
          team: team,
          isActive: true,
          isTeamHeader: true,
          teamName: team,
        });
        
        // Add team members
        flatData.push(...grouped[team]);
      }
    });
    
    return flatData;
  }, [data]);

  const defaultValues = useMemo(() => {
    if (data) {
      return data.reduce((acc, curr) => {
        const permission = PERMISSION_OPTIONS.find(
          (p) => p.value === curr.permission.value
        );

        acc[curr.id] = {
          ...curr,
          permission: { value: 2, label: "Team Member" },
        };

        if (permission) {
          acc[curr.id].permission = permission;
        }

        return acc;
      }, {} as { [key: string]: OrganizerEntity });
    }
    return {};
  }, [data]);

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch } = methods;

  const { mutateAsync: updateMutateAsync } = useMutation(
    QueryKeys.organizer.updateOne(),
    ({ entity: { id, privilege } }: CreateEntity<UpdateOrganizerEntity, "">) =>
      fetch(() => updateOrganizer({ privilege }, { id })),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.organizer.all);
        enqueueSnackbar("Successfully updated organizer", {
          variant: "success",
        });
      },
      onError: () => {
        enqueueSnackbar("Error occurred updating organizer", {
          variant: "error",
        });
        reset();
      },
    }
  );

  const submitOrganizerUpdate = useCallback(
    async (entities: UpdateOrganizerEntity[]) => {
      await Promise.all(
        _.map(entities, (entity) => updateMutateAsync({ entity }))
      );
    },
    [updateMutateAsync]
  );

  useEffect(() => {
    const subscription = watch((data, info) => {
      if (info.type === "change") {
        const entities: UpdateOrganizerEntity[] = _.chain(data)
          .pickBy((value, id) => {
            if (value && value.permission) {
              return (
                defaultValues[id].permission?.value !== value.permission?.value
              );
            }
            return false;
          })
          .map((value, id) => ({
            id: id,
            privilege: value?.permission?.value ?? 2,
          }))
          .value();

        if (entities.length > 0) {
          void submitOrganizerUpdate(entities);
        }
      }
    });

    return subscription.unsubscribe;
  }, [defaultValues, submitOrganizerUpdate, watch]);

  useEffect(() => {
    reset({ ...defaultValues });
  }, [reset, defaultValues]);

  const { mutateAsync: deleteMutateAsync } = useMutation(
    ({ id }: { id: string }) => deleteQuery(`organizers/:id`)({ id }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.organizer.all);
        enqueueSnackbar("Successfully deleted organizer", {
          variant: "success",
        });
      },
      onError: (error: AxiosError) => {
        console.error("Delete Organizer Error:", error.response?.data);
        enqueueSnackbar("Failed to delete organizer", { variant: "error" });
      },
    }
  );

  const onDelete = useCallback(async () => {
    const selectedIds = Object.keys(selectedRows).filter(
      (key) => selectedRows[key]
    );
    if (selectedIds.length === 0) {
      enqueueSnackbar("No organizers selected for deletion", {
        variant: "warning",
      });
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete the selected organizers?"
    );
    if (!confirmed) return;

    await Promise.all(selectedIds.map((id) => deleteMutateAsync({ id })));

    setSelectedRows({});
  }, [selectedRows, deleteMutateAsync, enqueueSnackbar]);

  const defs = useColumnDef<GroupedOrganizerEntity>({
    columns: [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        type: "text",
        cell: ({ row }) => {
          if (row.original.isTeamHeader) {
            return (
              <TableCell 
                colSpan={3} 
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  py: 1.5,
                  borderBottom: '2px solid #e0e0e0'
                }}
              >
                {row.original.teamName} ({data.filter(d => d.team === row.original.team).length} members)
              </TableCell>
            );
          }
          return <DefaultCell column={row.getVisibleCells()[0].column}>{row.original.name}</DefaultCell>;
        },
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        type: "text",
        cell: ({ row }) => {
          if (row.original.isTeamHeader) return null;
          return <DefaultCell column={row.getVisibleCells()[1].column}>{row.original.email}</DefaultCell>;
        },
      },
      {
        id: "permission",
        header: "",
        type: "custom",
        accessorKey: "permission",
        enableSorting: false,
        cell: ({ row }) => {
          if (row.original.isTeamHeader) return null;
          return (
            <DefaultCell column={row.getVisibleCells()[2].column}>
              <ControlledSelect
                name={`${row.original.id}.permission`}
                key={row.original.id}
                options={PERMISSION_OPTIONS}
              />
            </DefaultCell>
          );
        },
      },
    ],
  });

  const table = useTable({
    ...defs,
    getRowId: (row) => row.id,
    data: tableData,
    onRowSelectionChange: setSelectedRows,
    enableRowSelection: (row) => !row.original.isTeamHeader,
    state: {
      rowSelection: selectedRows,
    },
    initialState: {
      pagination: {
        pageSize: 1000, // Show all members without pagination
      },
    },
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <ModalProvider>
      <AddNewMemberModal />
      <Grid container flexDirection={"column"} gap={1.5}>
        <Grid container item justifyContent={"flex-end"}>
          <Grid item>
            <AddNewMemberButton />
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
              <Table.Content overflowVisible>
                <Table.Header />
                <FormProvider {...methods}>
                  <Table.Body />
                </FormProvider>
              </Table.Content>
            </Table.Container>
          </Table>
        </Grid>
      </Grid>
    </ModalProvider>
  );
};

export default withSettingsLayout(SettingsMembers);