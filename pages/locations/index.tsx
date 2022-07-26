import { NextPage } from "next";
import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import {
  fetch,
  getAllLocations,
  ILocationEntity,
  ILocationUpdateEntity,
  MutateEntity,
  QueryKeys,
  resolveError,
  updateLocation,
} from "api";
import { useColumnBuilder } from "common/hooks";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DefaultActionCell,
  Table,
  useColumnDef,
  useTable,
} from "components/Table";
import { EvaIcon, GradientButton, SaveButton } from "components/base";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import InputCell from "components/Table2/InputCell";
import { ActionRowCell } from "components/Table2";
import { ModalProvider, useModalContext } from "components/context";
import AddNewLocationModal from "components/modal/AddNewLocationModal";

interface ILocationsPageProps {
  locations: ILocationEntity[];
}

const AddNewLocationButton = () => {
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
  const queryClient = useQueryClient();
  const currentInputKey = useRef<string | null>(null);

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

  const { mutateAsync, isLoading } = useMutation(
    QueryKeys.location.updateBatch(),
    ({ entity }: MutateEntity<ILocationUpdateEntity>) => updateLocation(entity),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.location.all);
      },
    }
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
          mutateAsync({
            entity: { uid: data[uid].uid, locationName: data[uid].name },
          })
        )
      );
    })();
  }, [formState, handleSubmit, mutateAsync]);

  const defs = useColumnDef<{ uid: number; name: string }>({
    columns: [
      {
        id: "name",
        type: "input",
        inputName: "name",
        placeholder: "Enter a location",
        accessorKey: "name",
        header: "Name",
      },
      {
        id: "actions",
        type: "custom",
        cell: ({ row }) => (
          <DefaultActionCell
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
    data: locationsData ?? [],
    getRowId: (row) => String(row.uid),
    ...defs,
  });

  const onRefresh = () => {
    return refetch();
  };

  const onDelete = () => {
    return null;
  };

  return (
    <FormProvider {...methods}>
      <ModalProvider>
        <AddNewLocationModal />
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
