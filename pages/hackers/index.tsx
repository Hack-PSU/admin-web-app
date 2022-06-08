import { NextPage } from "next";
import React, { FC } from "react";
import {
  resolveError,
  withDefaultLayout,
  withServerSideProps,
} from "common/HOCs";
import { useColumnBuilder, useQueryResolver } from "common/hooks";
import { getAllHackers } from "query";
import { IGetAllHackersResponse } from "types/api";
import { PaginatedTable } from "components/Table";
import { Box, Grid, InputAdornment, useTheme } from "@mui/material";
import { Button, EvaIcon, Input } from "components/base";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";

interface IHackersPageProps {
  hackers: IGetAllHackersResponse[];
  page: number;
  limit: number;
}

const SearchAdornment: FC = () => (
  <InputAdornment position={"start"}>
    <Box mt={0.5}>
      <EvaIcon name={"search-outline"} size="medium" fill="#1a1a1a" />
    </Box>
  </InputAdornment>
);

const Hackers: NextPage<IHackersPageProps> = ({
  hackers,
  page: initialPage,
  limit: initialLimit,
}) => {
  const theme = useTheme();
  const { register } = useForm();

  const { columns, names } = useColumnBuilder((builder) =>
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

  // const {
  //   page,
  //   limit,
  //   handlePageChange,
  //   request: getHackers,
  // } = usePaginatedQuery<IGetAllHackersResponse[]>(getAllHackers, {
  //   page: initialPage,
  //   limit: initialLimit,
  // });

  const { request: getHackers } = useQueryResolver<IGetAllHackersResponse[]>(
    () => getAllHackers()
  );

  const { data: hackersData } = useQuery("hackers", () => getHackers(), {
    select: (data) => {
      if (data) {
        return data.map((d) => ({
          name: d.name,
          pin: d.pin,
          email: d.email,
          university: d.university,
        }));
      }
    },
    keepPreviousData: true,
    initialData: hackers,
  });

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
        <PaginatedTable
          limit={initialLimit}
          columns={columns}
          names={names}
          data={hackersData ?? []}
        />
      </Grid>
    </Grid>
  );
};

export const getServerSideProps = withServerSideProps(
  async (context, token) => {
    const offset = 0;
    const limit = 10;
    try {
      const resp = await getAllHackers(offset, limit, token);
      if (resp && resp.data) {
        return {
          props: {
            hackers: resp.data.body.data,
            page: 1,
            limit,
          },
        };
      }
    } catch (e: any) {
      resolveError(context, e);
    }
    return {
      props: {
        hackers: [],
        page: 1,
        limit,
      },
    };
  }
);

export default withDefaultLayout(Hackers);
