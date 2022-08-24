import { NextPage } from "next";
import React from "react";
import {
  withProtectedRoute,
  withDefaultLayout,
  withServerSideProps,
} from "common/HOCs";
import { Table, useColumnDef, useTable } from "components/Table";
import { Grid, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AuthPermission } from "types/context";
import { GradientButton } from "components/base";
import { useRouter } from "next/router";
import {
  fetch,
  getAllHackers,
  IGetAllHackersResponse,
  QueryKeys,
  resolveError,
} from "api";

interface IHackersPageProps {
  hackers: IGetAllHackersResponse[];
}

type HackerEntity = {
  name: string;
  pin: number;
  email: string;
  university: string;
};

const Hackers: NextPage<IHackersPageProps> = ({ hackers }) => {
  const theme = useTheme();
  const router = useRouter();

  const defs = useColumnDef<HackerEntity>({
    columns: [
      {
        id: "name",
        type: "text",
        header: "Name",
        accessorKey: "name",
      },
      {
        id: "pin",
        type: "text",
        header: "Pin",
        accessorKey: "pin",
      },
      {
        id: "email",
        type: "text",
        header: "Email",
        accessorKey: "email",
      },
      {
        id: "university",
        type: "text",
        header: "University",
        accessorKey: "university",
      },
    ],
  });

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
      initialData: hackers,
    }
  );

  const table = useTable({
    data: hackersData ?? [],
    ...defs,
  });

  const onRefresh = () => {
    return undefined;
  };

  const onDelete = () => {
    return undefined;
  };

  return (
    <Grid container gap={1.5}>
      <Grid
        container
        item
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%" }}
      >
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
  );
};

export const getServerSideProps = withServerSideProps(async (context) => {
  try {
    const hackers = await fetch(getAllHackers);
    if (hackers) {
      return {
        props: {
          hackers,
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
