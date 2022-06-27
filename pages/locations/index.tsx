import { NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { fetch, getAllLocations, ILocationEntity, resolveError } from "api";
import { useColumnBuilder } from "common/hooks";
import { useQuery } from "react-query";
import { ActionRowCell, Table, TableCell } from "components/Table";
import { ControlledInput, GradientButton } from "components/base";
import { useRouter } from "next/router";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import InputCell from "components/Table/InputCell";

interface ILocationsPageProps {
  locations: ILocationEntity[];
}

const LocationsPage: NextPage<ILocationsPageProps> = ({ locations }) => {
  const router = useRouter();
  const theme = useTheme();

  const { data: locationsData } = useQuery(
    ["locations"],
    () => fetch(getAllLocations),
    {
      keepPreviousData: true,
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

  const defaultValues = useMemo(() => {
    if (locationsData) {
      return locationsData.reduce((obj, curr) => {
        obj[curr.uid] = curr.name;
        return obj;
      }, {} as { [p: string]: string });
    }
    return {};
  }, [locationsData]);

  const methods = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      methods.reset({ ...defaultValues });
    }
  }, [defaultValues, methods]);

  console.log(defaultValues);

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
              name={`${row.original.uid}`}
              placeholder={"Enter a location"}
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
                  resetField(`${row.original.uid}`);
                }}
              />
            );
          },
        })
  );

  const onRefresh = () => {
    return null;
  };

  const onDelete = () => {
    return null;
  };

  return (
    <Grid container gap={1.5} flexDirection="column">
      <Grid container item justifyContent="space-between" alignItems="center">
        <Grid item xs={9.7}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Locations
          </Typography>
        </Grid>
        <Grid item xs={2.3}>
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
          >
            Add a Location
          </GradientButton>
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
