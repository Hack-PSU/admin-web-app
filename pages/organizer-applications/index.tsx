import { NextPage } from "next";
import React, { useCallback, useMemo, useState } from "react";
import {
  withDefaultLayout,
  withProtectedRoute,
  withServerSideProps,
} from "common/HOCs";
import { Table, useColumnDef, useTable } from "components/Table";
import { Box, Chip, Grid, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GradientButton } from "components/base";
import {
  fetch,
  getAllApplications,
  acceptApplication,
  rejectApplication,
  QueryKeys,
  resolveError,
  OrganizerApplicationEntity,
  ApplicationStatus,
  OrganizerTeam,
} from "api";
import PageHeader from "components/Menu/PageHeader";
import { AuthPermission } from "components/context/FirebaseProvider";
import { useSnackbar } from "notistack";
import { AxiosError } from "axios";
import { ModalProvider, useModalContext } from "components/context";
import { DefaultActionCell } from "components/Table";
import ViewApplicationModal from "components/modal/ViewApplicationModal";
import ConfirmModal from "components/modal/ConfirmModal";

interface IOrganizerApplicationsPageProps {
  applications: OrganizerApplicationEntity[];
}

type ApplicationTableRow = {
  id: number;
  name: string;
  email: string;
  yearStanding: string;
  major: string;
  firstChoiceTeam: string;
  secondChoiceTeam: string;
  firstChoiceStatus: ApplicationStatus;
  secondChoiceStatus: ApplicationStatus;
  assignedTeam: string | null;
  createdAt: string;
};

const getStatusColor = (
  status: ApplicationStatus
): "default" | "warning" | "success" | "error" => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return "warning";
    case ApplicationStatus.ACCEPTED:
      return "success";
    case ApplicationStatus.REJECTED:
      return "error";
    default:
      return "default";
  }
};

const OrganizerApplicationsContent: React.FC<{
  applications: OrganizerApplicationEntity[];
}> = ({ applications }) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [selectedApplication, setSelectedApplication] =
    useState<OrganizerApplicationEntity | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "accept" | "reject";
    id: number;
    team: OrganizerTeam;
  } | null>(null);
  const { showModal } = useModalContext();

  // Get full application data
  const { data: fullApplicationsData, refetch } = useQuery(
    QueryKeys.organizerApplication.findAll(),
    () => fetch(getAllApplications),
    {
      initialData: applications,
    }
  );

  // Transform data for table display
  const applicationsData = useMemo(() => {
    if (fullApplicationsData) {
      return fullApplicationsData.map((d) => ({
        id: d.id,
        name: d.name,
        email: d.email,
        yearStanding: d.yearStanding,
        major: d.major,
        firstChoiceTeam: d.firstChoiceTeam,
        secondChoiceTeam: d.secondChoiceTeam,
        firstChoiceStatus: d.firstChoiceStatus,
        secondChoiceStatus: d.secondChoiceStatus,
        assignedTeam: d.assignedTeam,
        createdAt: new Date(d.createdAt).toLocaleDateString(),
      }));
    }
    return [];
  }, [fullApplicationsData]);

  const { mutateAsync: mutateAcceptApplication } = useMutation(
    ({ id, team }: { id: number; team: OrganizerTeam }) =>
      fetch(() => acceptApplication({ team }, { id })),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          QueryKeys.organizerApplication.all
        );
        enqueueSnackbar("Application accepted successfully", {
          variant: "success",
        });
      },
      onError: (error: AxiosError<{ message: string }>) => {
        enqueueSnackbar(
          error.response?.data?.message || "Failed to accept application",
          { variant: "error" }
        );
      },
    }
  );

  const { mutateAsync: mutateRejectApplication } = useMutation(
    ({ id, team }: { id: number; team: OrganizerTeam }) =>
      fetch(() => rejectApplication({ team }, { id })),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          QueryKeys.organizerApplication.all
        );
        enqueueSnackbar("Application rejected successfully", {
          variant: "success",
        });
      },
      onError: (error: AxiosError<{ message: string }>) => {
        enqueueSnackbar(
          error.response?.data?.message || "Failed to reject application",
          { variant: "error" }
        );
      },
    }
  );

  const handleViewApplication = useCallback(
    (application: OrganizerApplicationEntity) => {
      setSelectedApplication(application);
      showModal("viewApplication");
    },
    [showModal]
  );

  const handleAccept = useCallback(
    (id: number, team: OrganizerTeam) => {
      setConfirmAction({ type: "accept", id, team });
      showModal("confirmModal");
    },
    [showModal]
  );

  const handleReject = useCallback(
    (id: number, team: OrganizerTeam) => {
      setConfirmAction({ type: "reject", id, team });
      showModal("confirmModal");
    },
    [showModal]
  );

  const handleConfirmAction = useCallback(async () => {
    if (!confirmAction) return;

    if (confirmAction.type === "accept") {
      await mutateAcceptApplication({
        id: confirmAction.id,
        team: confirmAction.team,
      });
    } else {
      await mutateRejectApplication({
        id: confirmAction.id,
        team: confirmAction.team,
      });
    }

    setConfirmAction(null);
  }, [confirmAction, mutateAcceptApplication, mutateRejectApplication]);

  const handleCancelAction = useCallback(() => {
    setConfirmAction(null);
  }, []);

  const columns = useMemo(() => [
    {
      id: "name",
      type: "text" as const,
      header: "Name",
      accessorKey: "name" as const,
      size: 200,
    },
    {
      id: "email",
      type: "text" as const,
      header: "Email",
      accessorKey: "email" as const,
      size: 250,
    },
    {
      id: "yearStanding",
      type: "text" as const,
      header: "Year Standing",
      accessorKey: "yearStanding" as const,
      size: 150,
    },
    {
      id: "major",
      type: "text" as const,
      header: "Major",
      accessorKey: "major" as const,
      size: 200,
    },
    {
      id: "firstChoiceTeam",
      type: "text" as const,
      header: "1st Choice Team",
      accessorKey: "firstChoiceTeam" as const,
      size: 180,
    },
    {
      id: "firstChoiceStatus",
      type: "text" as const,
      header: "1st Choice Status",
      accessorKey: "firstChoiceStatus" as const,
      size: 150,
    },
    {
      id: "secondChoiceTeam",
      type: "text" as const,
      header: "2nd Choice Team",
      accessorKey: "secondChoiceTeam" as const,
      size: 180,
    },
    {
      id: "secondChoiceStatus",
      type: "text" as const,
      header: "2nd Choice Status",
      accessorKey: "secondChoiceStatus" as const,
      size: 150,
    },
    {
      id: "assignedTeam",
      type: "text" as const,
      header: "Assigned Team",
      accessorKey: "assignedTeam" as const,
      size: 150,
    },
    {
      id: "createdAt",
      type: "text" as const,
      header: "Applied On",
      accessorKey: "createdAt" as const,
      size: 130,
    },
    {
      id: "actions",
      type: "custom" as const,
      header: "Actions",
      size: 140,
      cell: ({ row }: any) => {
        const application = fullApplicationsData?.find((a) => a.id === row.original.id);
        if (!application) return null;

        const items = [
          {
            icon: "eye-outline" as const,
            onClick: () => handleViewApplication(application),
          },
        ];

        // Add accept/reject actions based on status
        if (
          application.firstChoiceStatus === ApplicationStatus.PENDING &&
          !application.assignedTeam
        ) {
          items.push({
            icon: "checkmark-circle-outline" as const,
            onClick: () =>
              handleAccept(
                application.id,
                application.firstChoiceTeam as OrganizerTeam
              ),
          });
          items.push({
            icon: "close-circle-outline" as const,
            onClick: () =>
              handleReject(
                application.id,
                application.firstChoiceTeam as OrganizerTeam
              ),
          });
        } else if (
          application.firstChoiceStatus === ApplicationStatus.REJECTED &&
          application.secondChoiceStatus === ApplicationStatus.PENDING &&
          !application.assignedTeam
        ) {
          items.push({
            icon: "checkmark-circle-outline" as const,
            onClick: () =>
              handleAccept(
                application.id,
                application.secondChoiceTeam as OrganizerTeam
              ),
          });
          items.push({
            icon: "close-circle-outline" as const,
            onClick: () =>
              handleReject(
                application.id,
                application.secondChoiceTeam as OrganizerTeam
              ),
          });
        }

        return <DefaultActionCell items={items} />;
      },
    },
  ], [fullApplicationsData, handleViewApplication, handleAccept, handleReject]);

  const defs = useColumnDef<ApplicationTableRow>({
    columns,
  });

  const table = useTable({
    data: applicationsData ?? [],
    ...defs,
    getRowId: (row) => String(row.id),
    onRowSelectionChange: setSelectedRows,
    state: {
      rowSelection: selectedRows,
    },
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const pendingCount = useMemo(() => {
    return (
      applicationsData?.filter(
        (app) =>
          app.firstChoiceStatus === ApplicationStatus.PENDING ||
          (app.firstChoiceStatus === ApplicationStatus.REJECTED &&
            app.secondChoiceStatus === ApplicationStatus.PENDING)
      ).length || 0
    );
  }, [applicationsData]);

  return (
    <>
      <ViewApplicationModal
        application={selectedApplication}
        onAccept={handleAccept}
        onReject={handleReject}
      />
      <ConfirmModal
        header={
          confirmAction?.type === "accept"
            ? "Accept Application"
            : "Reject Application"
        }
        message={
          confirmAction
            ? `Are you sure you want to ${confirmAction.type} this application for ${confirmAction.team}?`
            : ""
        }
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
      <Grid container gap={1.5}>
        <PageHeader header={"Organizer Applications"} />
        <Grid
          container
          item
          justifyContent="space-between"
          alignItems="center"
          xs={12}
        >
          <Grid item>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="subtitle1">
                Total Applications: {applicationsData?.length || 0}
              </Typography>
              <Chip
                label={`${pendingCount} Pending`}
                color="warning"
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
        <Grid item sx={{ width: "100%" }}>
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
        </Grid>
      </Grid>
    </>
  );
};

const OrganizerApplicationsPage: NextPage<IOrganizerApplicationsPageProps> = ({
  applications,
}) => {
  return (
    <ModalProvider>
      <OrganizerApplicationsContent applications={applications} />
    </ModalProvider>
  );
};

export const getServerSideProps = withServerSideProps(async (context) => {
  try {
    const applications = await fetch(getAllApplications);
    if (applications) {
      return {
        props: {
          applications,
        },
      };
    }
  } catch (e) {
    resolveError(context, e);
  }
  return {
    props: {
      applications: [],
    },
  };
});

export default withDefaultLayout(
  withProtectedRoute(OrganizerApplicationsPage, AuthPermission.TEAM)
);
