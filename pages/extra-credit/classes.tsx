import React, { FC, useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Box, Grid, lighten, Typography, useTheme } from "@mui/material";
import { Button, EvaIcon, GradientButton } from "components/base";
import { Table, useColumnDef, useTable } from "components/Table";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { fetch, getAllExtraCreditAssignments, QueryKeys } from "api";
import { ModalProvider, useModalContext } from "components/context";
import AddExtraCreditClassModal from "components/modal/AddExtraCreditClassModal";
import AssignExtraCreditClassModal from "components/modal/AssignExtraCreditClassModal";

type DataRow = {
  id: number;
  name: string;
  users: number;
};

const AddNewClassButton = () => {
  const { showModal } = useModalContext();
  const theme = useTheme();

  return (
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
      onClick={() => showModal("addExtraCreditClass")}
    >
      Add a Class
    </GradientButton>
  );
};

const AssignClassButton: FC<{ hasSelections: boolean }> = ({
  hasSelections,
}) => {
  const { showModal } = useModalContext();
  const theme = useTheme();

  return (
    <Button
      onClick={() => showModal("assignExtraCreditClass")}
      disabled={!hasSelections}
      sx={{
        border: hasSelections
          ? `2px solid transparent`
          : `2px solid ${theme.palette.common.black}`,
        backgroundColor: hasSelections ? "common.black" : "transparent",
        width: "100%",
        ":hover": {
          backgroundColor: lighten(theme.palette.common.black, 0.05),
        },
      }}
      textProps={{
        sx: {
          color: hasSelections ? "common.white" : "common.black",
        },
      }}
    >
      Assign
    </Button>
  );
};

const ExtraCreditClassesPage: NextPage = () => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const defs = useColumnDef<DataRow>({
    columns: [
      {
        id: "name",
        type: "text",
        accessorKey: "name",
        header: "Name",
      },
      {
        id: "hackers",
        type: "text",
        accessorKey: "users",
        header: "Hackers",
      },
    ],
  });

  const { data: allAssignments } = useQuery(
    QueryKeys.extraCreditClass.findAll(),
    () => fetch(getAllExtraCreditAssignments),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            id: d.id,
            name: d.name,
            users: d.users.length,
          }));
        }
      },
    }
  );

  const defaultValues = useMemo(() => {
    if (allAssignments) {
      return allAssignments.reduce((acc, curr) => {
        acc[String(curr.id)] = curr;
        return acc;
      }, {} as { [key: string]: { id: number; name: string; users: number } });
    }
  }, [allAssignments]);

  const table = useTable<DataRow>({
    data: allAssignments ?? [],
    state: {
      rowSelection,
    },
    getRowId: (row) => String(row.id),
    onRowSelectionChange: setRowSelection,
    ...defs,
  });

  const methods = useForm({
    defaultValues,
  });
  const { reset } = methods;

  useEffect(() => {
    if (defaultValues) {
      reset({ ...defaultValues });
    }
  }, [defaultValues, reset]);

  const onRefresh = () => {
    return null;
  };

  const onDelete = () => {
    return null;
  };

  return (
    <ModalProvider>
      <AddExtraCreditClassModal />
      <AssignExtraCreditClassModal selectedRows={rowSelection} />
      <Grid container gap={1.5} flexDirection="column">
        <Grid container item justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Manage Classes
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <AddNewClassButton />
          </Grid>
        </Grid>
        <Grid
          container
          item
          justifyContent="space-between"
          xs={12}
          alignItems="center"
          mt={1}
        >
          <Grid container item xs={10} alignItems="center" spacing={1}>
            <Grid item>
              <Box mt={0.3}>
                <EvaIcon name={"alert-circle-outline"} />
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">
                Select classes to assign to hackers
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <AssignClassButton hasSelections={table.getIsSomeRowsSelected()} />
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
    </ModalProvider>
  );
};

export default withDefaultLayout(ExtraCreditClassesPage);
