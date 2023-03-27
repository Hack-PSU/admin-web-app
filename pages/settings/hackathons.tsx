import { NextPage } from "next";
import { withSettingsLayout } from "components/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetch,
  getAllHackathons,
  HackathonEntity,
  markActiveHackathon,
  QueryEntity,
  QueryKeys,
} from "api";
import { useSnackbar } from "notistack";
import { DefaultCell, Table, useColumnDef, useTable } from "components/Table";
import { DateTime } from "luxon";
import { Box, darken, Typography, useTheme } from "@mui/material";
import { useCallback } from "react";
import _ from "lodash";

const SettingsHackathons: NextPage = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const { data: allHackathons, refetch } = useQuery(
    QueryKeys.hackathon.findAll(),
    () => fetch(getAllHackathons),
    {
      select: (data) => {
        if (data) {
          return _.sortBy(data, "startTime").reverse();
        }
      },
    }
  );

  const { mutateAsync } = useMutation(
    QueryKeys.hackathon.updateOne(),
    ({ entity: { id } }: QueryEntity<{ id: string }>) =>
      fetch(() => markActiveHackathon({}, { id })),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.hackathon.all);
        enqueueSnackbar("Successfully updated active hackathon", {
          variant: "success",
        });
      },
    }
  );

  const setActiveHackathon = useCallback(
    (id: string) => {
      return async () => {
        await mutateAsync({ entity: { id } });
      };
    },
    [mutateAsync]
  );

  const defs = useColumnDef<HackathonEntity>({
    columns: [
      {
        id: "name",
        type: "text",
        accessorKey: "name",
        header: "Name",
      },
      {
        id: "startDate",
        type: "text",
        accessorKey: "startTime",
        header: "Start Date",
        format: (value) =>
          DateTime.fromMillis(Number(value)).toLocaleString(
            DateTime.DATE_SHORT
          ),
      },
      {
        id: "endDate",
        type: "text",
        accessorKey: "endTime",
        header: "End Date",
        format: (value) =>
          DateTime.fromMillis(Number(value)).toLocaleString(
            DateTime.DATE_SHORT
          ),
      },
      {
        id: "active",
        type: "custom",
        header: "",
        size: 50,
        cell: ({ column, row }) => (
          <DefaultCell key={row.original.id} column={column}>
            <Box
              sx={{
                width: "100%",
                px: 1,
                py: 0.8,
                ...(!row.original.active
                  ? {
                      transition: "background-color 200ms ease-in-out",
                      cursor: "pointer",
                      width: "fit-content",
                      borderRadius: "10px",
                      ":hover": {
                        backgroundColor: darken(
                          theme.palette.common.white,
                          0.02
                        ),
                      },
                    }
                  : {}),
              }}
              onClick={
                !row.original.active
                  ? setActiveHackathon(row.original.id)
                  : undefined
              }
            >
              <Typography
                variant={"body1"}
                sx={{
                  fontWeight: 500,
                  color: "sunset.dark",
                  fontSize: "0.95rem",
                }}
              >
                {!row.original.active ? "Set Active" : "Active"}
              </Typography>
            </Box>
          </DefaultCell>
        ),
      },
    ],
  });

  const table = useTable({
    ...defs,
    data: allHackathons ?? [],
    getRowId: (row) => row.id,
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Table {...table}>
      <Table.GlobalActions>
        <Table.GlobalRefresh onRefresh={onRefresh} />
        <Table.GlobalPageSize />
      </Table.GlobalActions>
      <Table.Container>
        <Table.Actions center={<Table.PaginationAction />} />
        <Table.Content>
          <Table.Header />
          <Table.Body />
        </Table.Content>
      </Table.Container>
    </Table>
  );
};

export default withSettingsLayout(SettingsHackathons);
