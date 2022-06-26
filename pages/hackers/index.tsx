import { NextPage } from "next";
import React from "react";
import {
  resolveError,
  withProtectedRoute,
  withDefaultLayout,
  withServerSideProps,
} from "common/HOCs";
import { useColumnBuilder } from "common/hooks";
import { Table } from "components/Table";
import { Grid, Typography, useTheme } from "@mui/material";
import { useQuery } from "react-query";
import { AuthPermission } from "types/context";
import { GradientButton } from "components/base/Button";
import { useRouter } from "next/router";
import { fetch, getAllHackers, IGetAllHackersResponse, QueryKeys } from "api";

interface IHackersPageProps {
  hackers: IGetAllHackersResponse[];
}

const Hackers: NextPage<IHackersPageProps> = ({ hackers }) => {
  const theme = useTheme();
  const router = useRouter();

  const { columns, names } = useColumnBuilder((builder) =>
    builder
      .addColumn("Name", {
        maxWidth: 120,
        type: "text",
        filterType: "input",
      })
      .addColumn("Pin", {
        maxWidth: 80,
        minWidth: 50,
        width: 50,
        type: "text",
        filterType: "hide",
      })
      .addColumn("Email", {
        minWidth: 150,
        maxWidth: 250,
        type: "text",
        filterType: "input",
      })
      .addColumn("University", {
        type: "text",
        filterType: "input",
      })
  );

  // const { request: getHackers } = useQueryResolver<IGetAllHackersResponse[]>(
  //   () => getAllHackers()
  // );

  const { data: hackersData } = useQuery(
    QueryKeys.hacker.findAll(),
    () => fetch(getAllHackers),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            name: `${d.firstname} ${d.lastname}`,
            pin: d.pin,
            email: d.email,
            university: d.university,
          }));
        }
      },
      keepPreviousData: true,
      initialData: hackers,
    }
  );

  const onRefresh = () => {
    return undefined;
  };

  const onDelete = () => {
    return undefined;
  };

  return (
    <Grid container gap={1.5}>
      <Grid container item justifyContent="space-between" alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Hackers
          </Typography>
        </Grid>
        <Grid item xs={2}>
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
            onClick={() => router.push("/hackers/new")}
          >
            Add a Hacker
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
          data={hackersData ?? []}
        >
          <Table.GlobalActions />
          <Table.Container>
            <Table.Actions>
              <Table.ActionsLeft>
                <Table.Filter />
              </Table.ActionsLeft>
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

export const getServerSideProps = withServerSideProps(async (context) => {
  try {
    const resp = await getAllHackers();
    if (resp && resp.data) {
      return {
        props: {
          hackers: resp.data.body.data,
        },
      };
    }
  } catch (e: any) {
    resolveError(context, e);
  }
  return {
    props: {
      hackers: [],
    },
  };
});

export default withDefaultLayout(
  withProtectedRoute(Hackers, AuthPermission.VOLUNTEER)
);
