import { NextPage } from "next";
import {
  resolveError,
  withDefaultLayout,
  withServerSideProps,
} from "common/HOCs";
import { useColumnBuilder, usePaginatedQuery } from "common/hooks";
import { getAllHackers } from "query";
import { IGetAllHackersResponse } from "types/api";
import { SimpleTable } from "components/Table";
import { FC, useMemo } from "react";
import { Box, Grid, InputAdornment, useTheme } from "@mui/material";
import { Button, EvaIcon, Input } from "components/base";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";

interface IHackersPageProps {
  hackers: IGetAllHackersResponse[];
}

const SearchAdornment: FC = () => (
  <InputAdornment position={"start"}>
    <Box mt={0.5}>
      <EvaIcon name={"search-outline"} size="medium" fill="#1a1a1a" />
    </Box>
  </InputAdornment>
);

const Hackers: NextPage<IHackersPageProps> = ({ hackers }) => {
  const theme = useTheme();
  const { register } = useForm();

  const columns = useColumnBuilder((builder) =>
    builder
      .addColumn("Name", {
        maxWidth: 120,
      })
      .addColumn("Pin", {
        maxWidth: 80,
        minWidth: 50,
        width: 50,
      })
      .addColumn("Email", {
        minWidth: 150,
        maxWidth: 250,
      })
      .addColumn("University")
  );

  const {
    page,
    handlePageChange,
    request: getHackers,
  } = usePaginatedQuery<IGetAllHackersResponse[]>(getAllHackers, {
    page: 1,
    limit: 10,
  });

  const { data: hackersData } = useQuery(["hackers", page], getHackers, {
    select: (data) => {
      if (data) {
        return data.map((d) => ({
          name: d.name,
          pin: d.pin,
          email: d.email,
          university: d.university,
        }));
      }
      return [];
    },
    keepPreviousData: true,
    initialData: hackers,
  });

  // const hackersData = useMemo(
  //   () =>
  //     hackers
  //       ? hackers.map(({ firstname, lastname, pin, email, university }) => ({
  //           name: `${firstname} ${lastname}`,
  //           pin,
  //           email,
  //           university,
  //         }))
  //       : [],
  //   [hackers]
  // );

  return (
    <Grid container gap={1.5}>
      <Grid container item justifyContent="space-between" alignItems="center">
        <Grid item xs={10}>
          <Input
            startAdornment={<SearchAdornment />}
            placeholder={"Search hackers"}
            inputProps={{
              style: {
                fontSize: theme.typography.pxToRem(16),
              },
            }}
            sx={{
              width: "95%",
              padding: theme.spacing(0.7, 2),
              borderRadius: "18px",
            }}
            {...register("query")}
          />
        </Grid>
        <Grid item xs={2}>
          <Link href={"/hackers/new"} passHref>
            <Button
              variant="text"
              sx={{
                width: "100%",
                padding: theme.spacing(1, 3.5),
              }}
              textProps={{
                sx: {
                  lineHeight: "1.8rem",
                },
              }}
            >
              Add an Event
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Grid item>
        <SimpleTable columns={columns} data={hackersData ?? []} />
      </Grid>
    </Grid>
  );
};

export const getServerSideProps = withServerSideProps(
  async (context, token) => {
    try {
      const resp = await getAllHackers(0, 10, token);
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
  }
);

export default withDefaultLayout(Hackers);
