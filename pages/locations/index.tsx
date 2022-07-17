import { NextPage } from "next";
import React, { useEffect, useMemo, useRef } from "react";
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
import { ActionRowCell, Table } from "components/Table";
import { EvaIcon, GradientButton, SaveButton } from "components/base";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import InputCell from "components/Table/InputCell";
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

  const { formState, reset, handleSubmit } = methods;
  const { dirtyFields } = formState;

  useEffect(() => {
    if (defaultValues) {
      reset({ ...defaultValues });
    }
  }, [defaultValues, reset]);

  const onClickSave = () => {
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
  };

  const { columns, names } = useColumnBuilder<{ uid: string; name: string }>(
    (builder) =>
      builder
        .addColumn("Name", {
          id: "name",
          type: "text",
          accessor: (row) => row.name,
          Header: () => <Box ml={1.8}>Name</Box>,
          Cell: ({ cell, row }) => (
            <InputCell
              cell={cell}
              name={`${row.original.uid}.name`}
              placeholder={"Enter a location"}
              onFocus={() => {
                currentInputKey.current = row.original.uid;
              }}
              autoFocus={row.original.uid === currentInputKey.current}
            />
          ),
        })
        .addColumn("Actions", {
          id: "actions",
          type: "custom",
          hideHeader: true,
          disableSortBy: true,
          maxWidth: 5,
          Cell: ({ cell, row }) => {
            const { resetField } = useFormContext();

            return (
              <ActionRowCell
                cell={cell}
                icon="refresh-outline"
                onClickAction={() => {
                  resetField(`${row.original.uid}.name`);
                }}
              />
            );
          },
        })
  );

  const onRefresh = () => {
    return refetch();
  };

  const onDelete = () => {
    return null;
  };

  return (
    <ModalProvider>
      <AddNewLocationModal />
      <Grid container gap={1.5} flexDirection="column">
        <Grid container item justifyContent="space-between" alignItems="center">
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
              isDirty={methods.formState.isDirty}
              onClick={onClickSave}
              loading={isLoading}
              progressColor={
                methods.formState.isDirty ? "common.white" : "common.black"
              }
            >
              Save
            </SaveButton>
          </Grid>
        </Grid>
        <Grid item sx={{ width: "100%" }}>
          <Table
            limit={8}
            names={names}
            onRefresh={onRefresh}
            onDelete={onDelete}
            columns={columns}
            data={locationsData ?? []}
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
              <FormProvider {...methods}>
                <Table.Body />
              </FormProvider>
            </Table.Container>
          </Table>
        </Grid>
      </Grid>
    </ModalProvider>
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
