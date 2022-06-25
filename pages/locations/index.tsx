import { NextPage } from "next";
import {
  resolveError,
  withDefaultLayout,
  withServerSideProps,
} from "common/HOCs";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { GradientButton } from "components/base/Button";
import { getAllLocations } from "api/index";
import { ILocationEntity } from "types/api";
import { useColumnBuilder, useQueryResolver } from "common/hooks";
import { useQuery } from "react-query";
import { Table, TableCell } from "components/Table";
import { ControlledInput, EvaIcon } from "components/base";
import React, { useState } from "react";
import { useRouter } from "next/router";

interface ILocationsPageProps {
  locations: ILocationEntity[];
}

const LocationsPage: NextPage<ILocationsPageProps> = ({ locations }) => {
  const theme = useTheme();
  const router = useRouter();

  const { request: getLocations } = useQueryResolver<ILocationEntity[]>(() =>
    getAllLocations()
  );
  const { data: locationsData } = useQuery(
    ["locations"],
    () => getLocations(),
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

  const { columns, names } = useColumnBuilder((builder) =>
    builder
      .addColumn("Name", {
        id: "name",
        type: "text",
        accessor: "name",
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
                // @ts-ignore
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
        Cell: ({ cell, row }) => (
          <TableCell empty {...cell.getCellProps()}>
            <IconButton
              sx={{
                borderRadius: "5px",
                width: "25px",
                height: "25px",
              }}
              // @ts-ignore
              onClick={() => router.push(`/events/${row?.original?.uid ?? ""}`)}
            >
              <EvaIcon
                name={"edit-outline"}
                fill={theme.palette.sunset.dark}
                size="medium"
              />
            </IconButton>
          </TableCell>
        ),
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
            sx={(theme) => ({
              // ml: "auto",
              width: "100%",
              padding: theme.spacing(1, 3.5),
            })}
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
      <Grid item>
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
            <Table.Body />
          </Table.Container>
        </Table>
      </Grid>
    </Grid>
  );
};

export const getServerSideProps = withServerSideProps(
  async (context, token) => {
    try {
      const resp = await getAllLocations();
      if (resp) {
        if (resp.data.body.data) {
          return {
            props: {
              locations: resp.data.body.data,
            },
          };
        }
      }
    } catch (e) {
      resolveError(context, e);
    }
    return {
      props: {
        locations: [],
      },
    };
  }
);

export default withDefaultLayout(LocationsPage);
