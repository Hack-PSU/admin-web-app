import { NextPage } from "next";
import React, { useState } from "react";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { fetch, getAllLocations, ILocationEntity, resolveError } from "api";
import { useColumnBuilder } from "common/hooks";
import { useQuery } from "react-query";
import { ActionRowCell, Table, TableCell } from "components/Table";
import { ControlledInput, GradientButton } from "components/base";
import { useRouter } from "next/router";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

interface ILocationsPageProps {
  locations: ILocationEntity[];
}

const LocationsPage: NextPage<ILocationsPageProps> = ({ locations }) => {
  const router = useRouter();
  const theme = useTheme();
  const methods = useForm();

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

  const { columns, names } = useColumnBuilder<{ uid: string; name: string }>(
    (builder) =>
      builder
        .addColumn("Name", {
          id: "name",
          type: "text",
          accessor: (row) => row.name,
          Header: () => <Box ml={1.8}>Name</Box>,
          Cell: ({ cell, row }) => {
            const [isHovering, setIsHovering] = useState<boolean>(false);
            return (
              <TableCell
                empty
                {...cell.getCellProps()}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <ControlledInput
                  name={`${row.original.uid}.name`}
                  placeholder={"Enter location name"}
                  sx={{
                    border: isHovering ? undefined : "transparent",
                    transition: "border 200ms ease-in-out",
                  }}
                />
              </TableCell>
            );
          },
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
