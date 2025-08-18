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
import { 
  Grid, 
  useTheme, 
  Typography, 
  Box, 
  Paper,
  Chip,
  Stack 
} from "@mui/material";
import AddNewMemberModal from "components/modal/AddNewMemberModal";
import { IOption } from "components/base/Select/types";
import { TEAM_ORDER, TEAM_NAMES, TeamName } from "common/constants";
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

const TeamSection: FC<{
  teamName: string;
  members: OrganizerEntity[];
  selectedRows: Record<string, boolean>;
  onRowSelectionChange: (updater: any) => void;
  methods: any;
}> = ({ teamName, members, selectedRows, onRowSelectionChange, methods }) => {
  const theme = useTheme();

  const defs = useColumnDef<OrganizerEntity>({
    columns: [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        type: "text",
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        type: "text",
      },
      {
        id: "permission",
        header: "Permission",
        type: "custom",
        accessorKey: "permission",
        enableSorting: false,
        cell: ({ row, column }) => (
          <DefaultCell column={column}>
            <ControlledSelect
              name={`${row.original.id}.permission`}
              key={row.original.id}
              options={PERMISSION_OPTIONS}
            />
          </DefaultCell>
        ),
      },
    ],
  });

  const table = useTable({
    ...defs,
    getRowId: (row) => row.id,
    data: members,
    onRowSelectionChange,
    state: {
      rowSelection: selectedRows,
    },
  });

  const memberCount = members.length;

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        mb: 3, 
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Team Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: theme.palette.action.hover,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {teamName}
        </Typography>
        <Chip 
          label={`${memberCount} member${memberCount !== 1 ? 's' : ''}`}
          size="small"
          variant="outlined"
          sx={{
            backgroundColor: theme.palette.background.paper,
            fontWeight: 500
          }}
        />
      </Box>
      
      {/* Team Members Table */}
      {memberCount > 0 ? (
        <Table {...table}>
          <Table.Container>
            <Table.Content overflowVisible>
              <Table.Header />
              <FormProvider {...methods}>
                <Table.Body />
              </FormProvider>
            </Table.Content>
          </Table.Container>
        </Table>
      ) : (
        <Box 
          sx={{ 
            p: 3, 
            textAlign: 'center',
            color: theme.palette.text.secondary 
          }}
        >
          <Typography variant="body2">
            No members assigned to this team
          </Typography>
        </Box>
      )}
    </Paper>
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

  const groupedData = useMemo(() => {
    if (!data) return {};
    
    const grouped = _.groupBy(data, 'team');
    
    // Sort teams according to TEAM_ORDER, putting unassigned teams at the end
    const sortedGroups: Record<string, OrganizerEntity[]> = {};
    
    // Add teams in the specified order
    TEAM_ORDER.forEach(team => {
      if (grouped[team]) {
        sortedGroups[team] = grouped[team];
      }
    });
    
    // Add any remaining teams (including "Unassigned")
    Object.keys(grouped).forEach(team => {
      if (!TEAM_ORDER.includes(team)) {
        sortedGroups[team] = grouped[team];
      }
    });
    
    return sortedGroups;
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

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const totalMembers = data.length;
  const totalTeams = Object.keys(groupedData).length;

  return (
    <ModalProvider>
      <AddNewMemberModal />
      <Grid container flexDirection={"column"} gap={2}>
        {/* Header Section */}
        <Grid container item justifyContent={"space-between"} alignItems={"center"}>
          <Grid item>
            <Stack spacing={1}>
              <Typography variant="h5" fontWeight={600}>
                Team Members
              </Typography>
              <Stack direction="row" spacing={2}>
                <Chip 
                  label={`${totalMembers} Total Members`} 
                  size="small" 
                  variant="outlined"
                />
                <Chip 
                  label={`${totalTeams} Teams`} 
                  size="small" 
                  variant="outlined"
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={2}>
              <GradientButton
                variant="outlined"
                sx={{ padding: (theme) => theme.spacing(1, 2) }}
                onClick={onRefresh}
              >
                Refresh
              </GradientButton>
              <AddNewMemberButton />
            </Stack>
          </Grid>
        </Grid>

        {/* Team Sections */}
        <Grid item>
          {Object.entries(groupedData).map(([teamName, members]) => (
            <TeamSection
              key={teamName}
              teamName={teamName}
              members={members}
              selectedRows={selectedRows}
              onRowSelectionChange={setSelectedRows}
              methods={methods}
            />
          ))}
          
          {totalMembers === 0 && (
            <Paper 
              elevation={1} 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                bgcolor: 'background.default' 
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No team members found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add your first team member to get started
              </Typography>
            </Paper>
          )}
        </Grid>

        {/* Global Actions */}
        {Object.keys(selectedRows).filter(key => selectedRows[key]).length > 0 && (
          <Grid item>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {Object.keys(selectedRows).filter(key => selectedRows[key]).length} members selected
                </Typography>
                <GradientButton
                  variant="outlined"
                  color="error"
                  onClick={onDelete}
                  sx={{ 
                    borderColor: 'error.main',
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.main',
                      color: 'white',
                    }
                  }}
                >
                  Delete Selected
                </GradientButton>
              </Stack>
            </Paper>
          </Grid>
        )}
      </Grid>
    </ModalProvider>
  );
};

export default withSettingsLayout(SettingsMembers);