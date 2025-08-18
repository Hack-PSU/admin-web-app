import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { withSettingsLayout } from "components/settings";
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
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Box,
  Button
} from "@mui/material";
import AddNewMemberModal from "components/modal/AddNewMemberModal";
import { IOption } from "components/base/Select/types";
import { TEAM_ORDER, TEAM_NAMES } from "common/constants";
import { AxiosError } from "axios";
import { EvaIcon, Input } from "components/base";
import { InputAdornment } from "@mui/material";

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

const SettingsMembers: NextPage = () => {
  const theme = useTheme();
  const { user } = useFirebase();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [searchFilter, setSearchFilter] = useState("");

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

  // Group and sort data by teams, then by name within teams
  const groupedData = useMemo(() => {
    if (!data) return {};
    
    let filteredData = data;
    
    // Apply search filter
    if (searchFilter) {
      filteredData = data.filter(member => 
        member.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        member.email.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    
    const grouped = _.groupBy(filteredData, 'team');
    const sortedGroups: Record<string, OrganizerEntity[]> = {};
    
    // Add teams in the specified order
    const teamOrder = [...TEAM_ORDER, TEAM_NAMES.UNASSIGNED];
    
    teamOrder.forEach(team => {
      if (grouped[team] && grouped[team].length > 0) {
        // Sort members within each team by name
        sortedGroups[team] = _.sortBy(grouped[team], 'name');
      }
    });
    
    // Add any remaining teams not in the order
    Object.keys(grouped).forEach(team => {
      if (!teamOrder.includes(team) && grouped[team].length > 0) {
        sortedGroups[team] = _.sortBy(grouped[team], 'name');
      }
    });
    
    return sortedGroups;
  }, [data, searchFilter]);

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

  // Calculate selection states
  const allMemberIds = useMemo(() => {
    return Object.values(groupedData).flat().map(member => member.id);
  }, [groupedData]);

  const selectedCount = Object.keys(selectedRows).filter(key => selectedRows[key]).length;
  const isAllSelected = allMemberIds.length > 0 && allMemberIds.every(id => selectedRows[id]);
  const isIndeterminate = selectedCount > 0 && !isAllSelected;

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedRows({});
    } else {
      const newSelection: Record<string, boolean> = {};
      allMemberIds.forEach(id => {
        newSelection[id] = true;
      });
      setSelectedRows(newSelection);
    }
  }, [isAllSelected, allMemberIds]);

  const handleRowSelect = useCallback((id: string, checked: boolean) => {
    setSelectedRows(prev => ({
      ...prev,
      [id]: checked
    }));
  }, []);

  return (
    <ModalProvider>
      <AddNewMemberModal />
      <Grid container flexDirection={"column"} gap={1.5}>
        
        {/* Header Actions */}
        <Grid container item justifyContent={"space-between"}>
          <Grid item xs={5}>
            <Input
              startAdornment={
                <InputAdornment position={"start"}>
                  <Box mt={0.5}>
                    <EvaIcon name={"search-outline"} />
                  </Box>
                </InputAdornment>
              }
              value={searchFilter}
              onChange={(event) => setSearchFilter(event.target.value)}
              sx={{
                width: "100%",
                py: theme.spacing(0.8),
                backgroundColor: "common.white",
              }}
              placeholder="Search by name or email"
            />
          </Grid>
          <Grid container item xs={7} justifyContent={"flex-end"} columnSpacing={1} alignItems={"center"}>
            <Grid item xs={3}>
              <Button
                startIcon={
                  <Box mt={0.5}>
                    <EvaIcon name={"refresh-outline"} />
                  </Box>
                }
                sx={{
                  lineHeight: "1.5rem",
                  padding: theme.spacing(0.5, 2),
                  borderRadius: "10px",
                  alignItems: "center",
                  width: "100%",
                  backgroundColor: "common.white",
                  boxShadow: 1,
                  height: "100%",
                }}
                onClick={onRefresh}
              >
                Refresh
              </Button>
            </Grid>
            <Grid item>
              <AddNewMemberButton />
            </Grid>
          </Grid>
        </Grid>

        {/* Table */}
        <Grid
          container
          sx={{
            border: `1px solid ${theme.palette.border.light}`,
            borderRadius: "10px",
            boxShadow: 1,
          }}
        >
          {/* Table Actions */}
          <Grid
            container
            sx={{
              padding: theme.spacing(2),
              borderBottom: `2px solid ${theme.palette.border.light}`,
            }}
          >
            <Grid container item xs={3}>
              {/* Left actions placeholder */}
            </Grid>
            <Grid container item justifyContent="center" xs={6}>
              {/* Center actions placeholder */}
            </Grid>
            <Grid container item xs={3} justifyContent="flex-end">
              {selectedCount > 0 && (
                <Button
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
                  Delete ({selectedCount})
                </Button>
              )}
            </Grid>
          </Grid>

          {/* Table Content */}
          <TableContainer
            sx={{
              width: "100%",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            <MuiTable sx={{ width: "100%" }}>
              <TableHead>
                <TableRow sx={{
                  backgroundColor: theme.palette.action.hover,
                  borderBottom: `2px solid ${theme.palette.border.light}`,
                }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Permission</TableCell>
                </TableRow>
              </TableHead>
              <FormProvider {...methods}>
                <TableBody>
                  {Object.entries(groupedData).map(([teamName, members]) => (
                    <React.Fragment key={teamName}>
                      {/* Team Header Row */}
                      <TableRow>
                        <TableCell 
                          colSpan={4} 
                          sx={{ 
                            backgroundColor: '#f8f9fa',
                            fontWeight: 600,
                            fontSize: '1rem',
                            py: 1.5,
                            borderBottom: `1px solid ${theme.palette.border.light}`,
                            color: theme.palette.text.primary
                          }}
                        >
                          {teamName} ({members.length} member{members.length !== 1 ? 's' : ''})
                        </TableCell>
                      </TableRow>
                      
                      {/* Team Members */}
                      {members.map((member) => (
                        <TableRow 
                          key={member.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                            }
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={!!selectedRows[member.id]}
                              onChange={(e) => handleRowSelect(member.id, e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <ControlledSelect
                              name={`${member.id}.permission`}
                              options={PERMISSION_OPTIONS}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                  
                  {Object.keys(groupedData).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                        {searchFilter ? 'No members found matching your search.' : 'No team members found.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </FormProvider>
            </MuiTable>
          </TableContainer>
        </Grid>
      </Grid>
    </ModalProvider>
  );
};

export default withSettingsLayout(SettingsMembers);