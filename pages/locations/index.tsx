import { NextPage } from "next";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import {
  CreateEntity,
  deleteLocation,
  fetch,
  getAllLocations,
  ILocationEntity,
  ILocationUpdateEntity,
  MutateEntity,
  QueryKeys,
  resolveError,
  updateLocation,
} from "api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DefaultActionCell,
  Table,
  useColumnDef,
  useTable,
} from "components/Table";
import { EvaIcon, GradientButton, SaveButton } from "components/base";
import { useForm, FormProvider } from "react-hook-form";
import { ModalProvider, useModalContext } from "components/context";
import AddNewLocationModal from "components/modal/AddNewLocationModal";
import ConfirmModal from "components/modal/ConfirmModal";
import _ from "lodash";
import { useSnackbar } from "notistack";

interface ILocationsPageProps {
  locations: ILocationEntity[];
}

const AddNewLocationButton: FC = () => {
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
      onClick={() => showModal("addNewLocation")}
    >
      Add a Location
    </GradientButton>
  );
};

const LocationsPage: NextPage<ILocationsPageProps> = ({ locations }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const { data: locationsData, refetch } = useQuery(
    QueryKeys.location.findAll(),
    () => fetch(getAllLocations),
    {
      initialData: locations,
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            uid: d.uid,
            name: d.location_name,
          }));
        }
      },
    }
  );

  const { mutateAsync: mutateUpdateLocation, isLoading } = useMutation(
    QueryKeys.location.updateBatch(),
    ({ entity }: MutateEntity<ILocationUpdateEntity>) => updateLocation(entity),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.location.all);
      },
    }
  );

  const { mutateAsync: mutateDeleteLocation } = useMutation(
    ({ entity }: CreateEntity<Pick<ILocationEntity, "uid">, "">) =>
      fetch(() => deleteLocation(entity))
  );

  const defaultValues = useMemo(() => {
    if (locationsData) {
      return locationsData.reduce((obj, curr) => {
        obj[String(curr.uid)] = curr;
        return obj;
      }, {} as { [p: string]: { uid: number; name: string } });
    }
    return {};
  }, [locationsData]);

  const methods = useForm({
    defaultValues,
  });

  const { formState, reset, handleSubmit, resetField } = methods;

  useEffect(() => {
    if (defaultValues) {
      reset({ ...defaultValues });
    }
  }, [defaultValues, reset]);

  const onClickSave = useCallback(() => {
    const { dirtyFields } = formState;

    handleSubmit(async (data) => {
      const editedFields = Object.keys(dirtyFields).filter(
        (field) => dirtyFields[field].name
      );

      await Promise.all(
        editedFields.map((uid) =>
          mutateUpdateLocation({
            entity: { uid: data[uid].uid, locationName: data[uid].name },
          })
        )
      );
    })();
  }, [formState, handleSubmit, mutateUpdateLocation]);

  const defs = useColumnDef<{ uid: number; name: string }>({
    columns: [
      {
        id: "name",
        type: "input",
        inputName: "name",
        placeholder: "Enter a location",
        accessorKey: "name",
        header: "Name",
        size: 300,
      },
      {
        id: "actions",
        type: "custom",
        header: "",
        cell: ({ row }) => (
          <DefaultActionCell
            cellProps={{
              sx: {
                width: "8%",
              },
            }}
            items={[
              {
                icon: "refresh-outline",
                onClick: () => {
                  resetField(`${row.original.uid}.name`);
                },
              },
            ]}
          />
        ),
      },
    ],
  });

  const table = useTable({
    ...defs,
    data: locationsData ?? [],
    getRowId: (row) => String(row.uid),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const onRefresh = useCallback(() => {
    return refetch();
  }, [refetch]);

  const onDeleteConfirm = useCallback(async () => {
    if (Object.keys(rowSelection).length > 0) {
      const selectedUids = _.chain(rowSelection)
        .pickBy((selected) => selected)
        .keys()
        .map((k) => parseInt(k))
        .value();

      await Promise.all(
        selectedUids.map((uid) =>
          mutateDeleteLocation(
            { entity: { uid } },
            {
              onSuccess: async () => {
                await queryClient.invalidateQueries(QueryKeys.location.all);
                enqueueSnackbar("Successfully removed location", {
                  variant: "success",
                });
              },
            }
          )
        )
      );
    }
  }, [rowSelection, mutateDeleteLocation, queryClient, enqueueSnackbar]);

  return (
    <FormProvider {...methods}>
      <ModalProvider>
        <AddNewLocationModal />
        <ConfirmModal
          header={"Are you sure?"}
          message={
            "All selected rows will be deleted. You can't undo this action."
          }
          onConfirm={onDeleteConfirm}
        />
        <Grid container gap={1.5} flexDirection="column">
          <Grid
            container
            item
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={9.7}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Locations
              </Typography>
            </Grid>
            <Grid item xs={2.3}>
              <AddNewLocationButton />
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
                  Manage locations by editing the table
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <SaveButton
                key={"save-button"}
                onClick={onClickSave}
                loading={isLoading}
              >
                Save
              </SaveButton>
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
                  right={<Table.DeleteAction showConfirmModal />}
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
    </FormProvider>
  );
};

export const getServerSideProps = withServerSideProps(async (context) => {
  try {
    const locations = await fetch(getAllLocations);
    if (locations) {
      return {
        props: {
          locations,
        },
      };
    }
  } catch (e) {
    resolveError(context, e);
  }
  return {
    props: {
      locations: [],
    },
  };
});

export default withDefaultLayout(LocationsPage);
