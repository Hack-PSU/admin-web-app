import { NextPage } from "next";
import React, { useCallback, useState } from "react";
import {
  withDefaultLayout,
  withProtectedRoute,
  withServerSideProps,
} from "common/HOCs";
import { Table, useColumnDef, useTable } from "components/Table";
import { Grid, useTheme } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GradientButton } from "components/base";
import { useRouter } from "next/router";
import {
  fetch,
  getAllUsers,
  getMlhData,
  deleteQuery,
  QueryKeys,
  resolveError,
  UserEntity,
  MLHDataEntity,
} from "api";
import PageHeader from "components/Menu/PageHeader";
import { AuthPermission } from "components/context/FirebaseProvider";
import { useSnackbar } from "notistack";
import { AxiosError } from "axios";

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
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

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

  const { data: hackersData, refetch } = useQuery(
    QueryKeys.hacker.findAll(),
    () => fetch(getAllUsers),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            name: `${d.firstName} ${d.lastName}`,
            email: d.email,
            university: d.university,
          }));
        }
      },
      initialData: hackers,
    }
  );

  const deleteHacker = deleteQuery(`users/:id`);

  const { mutateAsync: mutateDeleteUser } = useMutation(
    ({ id }: { id: string }) => deleteHacker({ id }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.hacker.all);
        enqueueSnackbar("Successfully deleted hacker", { variant: "success" });
      },
      onError: (error: AxiosError) => {
        console.error("Delete User Error:", error.response?.data);
        enqueueSnackbar("Failed to delete hacker", { variant: "error" });
      },
    }
  );

  const table = useTable({
    data: hackersData ?? [],
    ...defs,
    onRowSelectionChange: setSelectedRows,
    state: {
      rowSelection: selectedRows,
    },
  });

  const onRefresh = () => {
    refetch();
  };

  const onDelete = useCallback(async () => {
    const selectedIds = Object.keys(selectedRows).filter(
      (key) => selectedRows[key]
    );
    if (selectedIds.length === 0) {
      enqueueSnackbar("No hackers selected for deletion", {
        variant: "warning",
      });
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete the selected hackers?"
    );
    if (!confirmed) return;

    await Promise.all(selectedIds.map((id) => mutateDeleteUser({ id })));

    setSelectedRows({});
  }, [selectedRows, mutateDeleteUser, enqueueSnackbar]);

  const handleDownload = useCallback(async () => {
    try {
      const mlhData = await fetch(getMlhData);
      
      if (!mlhData || mlhData.length === 0) {
        enqueueSnackbar("No MLH data available to export", {
          variant: "warning",
        });
        return;
      }
      
      // Define CSV header in the specified order
      const header = [
        "first_name",
        "last_name", 
        "email",
        "phone",
        "age",
        "country",
        "university",
        "academic_year",
        "mlh_coc",
        "mlh_dcp",
        "share_address_mlh",
        "share_address_sponsors",
        "share_email_mlh",
        "driving",
        "travel_reimbursement",
        "first_hackathon"
      ];

      // Build CSV rows from MLH data
      const rows = mlhData.map((data: MLHDataEntity) => {
        // Extract values and escape quotes by doubling them
        const values = [
          String(data.first_name ?? "").replace(/"/g, '""'),
          String(data.last_name ?? "").replace(/"/g, '""'),
          String(data.email ?? "").replace(/"/g, '""'),
          String(data.phone ?? "").replace(/"/g, '""'),
          String(data.age ?? "").replace(/"/g, '""'),
          String(data.country ?? "").replace(/"/g, '""'),
          String(data.university ?? "").replace(/"/g, '""'),
          String(data.academic_year ?? "").replace(/"/g, '""'),
          String(data.mlh_coc ?? "").replace(/"/g, '""'),
          String(data.mlh_dcp ?? "").replace(/"/g, '""'),
          String(data.share_address_mlh ?? "").replace(/"/g, '""'),
          String(data.share_address_sponsors ?? "").replace(/"/g, '""'),
          String(data.share_email_mlh ?? "").replace(/"/g, '""'),
          String(data.driving ?? "").replace(/"/g, '""'),
          String(data.travel_reimbursement ?? "").replace(/"/g, '""'),
          String(data.first_hackathon ?? "").replace(/"/g, '""')
        ];
        
        return `"${values.join('","')}"`;
      });

      // Create CSV content with BOM for Excel compatibility
      const csvContent = `\uFEFF${header.map(h => `"${h}"`).join(",")}\n${rows.join("\n")}`;

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mlh_hackers_data.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      enqueueSnackbar("MLH data exported successfully", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Failed to download MLH data", {
        variant: "error",
      });
    }
  }, [enqueueSnackbar]);
  return (
    <Grid container gap={1.5}>
      <PageHeader
        header={"Hackers"}
      />
      <Grid item sx={{ width: "100%" }}>
        <Table {...table}>
          <Table.GlobalActions>
            <GradientButton
                  sx={{
                    padding: theme.spacing(1, 3.5),
                  }}
                  textProps={{
                    sx: {
                      lineHeight: "1.8rem",
                      color: "common.white",
                    },
                  }}
                  onClick={handleDownload}
                >
                  Export CSV
            </GradientButton>
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
