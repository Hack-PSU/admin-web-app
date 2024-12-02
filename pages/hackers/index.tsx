import { NextPage } from "next";
import React from "react";
import {
  withDefaultLayout,
  withProtectedRoute,
  withServerSideProps,
} from "common/HOCs";
import { Table, useColumnDef, useTable } from "components/Table";
import { Grid, useTheme } from "@mui/material";
import { GradientButton } from "components/base";
import { useRouter } from "next/router";
import { fetch, getAllUsers, resolveError, UserEntity } from "api";
import PageHeader from "components/Menu/PageHeader";
import { AuthPermission } from "api/providers/FirebaseProvider";
import { useGetHackersData } from "api/hooks";

interface IHackersPageProps {
  hackers: UserEntity[];
}

type HackerEntity = {
  name: string;
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

  const { data: hackersData } = useGetHackersData(hackers);

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
      <PageHeader
        header={"Hackers"}
        right={
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
        }
      />
      {/*<Grid*/}
      {/*  container*/}
      {/*  item*/}
      {/*  justifyContent="space-between"*/}
      {/*  alignItems="center"*/}
      {/*  sx={{ width: "100%" }}*/}
      {/*>*/}
      {/*  <Grid item xs={10}>*/}
      {/*    <Typography variant="h4" sx={{ fontWeight: 700 }}>*/}
      {/*      Hackers*/}
      {/*    </Typography>*/}
      {/*  </Grid>*/}
      {/*  <Grid item xs={2}>*/}
      {/*    <GradientButton*/}
      {/*      variant="text"*/}
      {/*      sx={{*/}
      {/*        width: "100%",*/}
      {/*        padding: theme.spacing(1, 3.5),*/}
      {/*      }}*/}
      {/*      textProps={{*/}
      {/*        sx: {*/}
      {/*          lineHeight: "1.8rem",*/}
      {/*          color: "common.white",*/}
      {/*        },*/}
      {/*      }}*/}
      {/*      onClick={() => router.push("/hackers/new")}*/}
      {/*    >*/}
      {/*      Add a Hacker*/}
      {/*    </GradientButton>*/}
      {/*  </Grid>*/}
      {/*</Grid>*/}
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
    const hackers = await fetch(getAllUsers);
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
  withProtectedRoute(Hackers, AuthPermission.TEAM)
);
