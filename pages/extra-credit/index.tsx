import React, { useEffect, useMemo, useRef } from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { EvaIcon, GradientButton, SaveButton } from "components/base";
import { ActionRowCell, Table, InputCell } from "components/Table";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useColumnBuilder } from "common/hooks";
import { useQuery } from "react-query";
import { fetch, QueryKeys } from "api";
import {
  getAllExtraCreditAssignments,
  getAllExtraCreditClasses,
} from "api/extra_credit";
import { ModalProvider, useModalContext } from "components/context";
import AddExtraCreditClassModal from "components/modal/AddExtraCreditClassModal";

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

const ExtraCreditPage: NextPage = () => {
  const currentInputKey = useRef<string | null>(null);

  const { columns, names } = useColumnBuilder<{
    uid: string;
    name: string;
    users: number;
  }>((builder) =>
    builder
      .addColumn("Name", {
        id: "name",
        type: "text",
        width: 120,
        accessor: (row) => row.name,
        Header: () => <Box ml={1.8}>Name</Box>,
        Cell: ({ cell, row }) => {
          return (
            <InputCell
              cell={cell}
              name={`${row.original.uid}.name`}
              placeholder={"Enter class name"}
              onFocus={() => {
                currentInputKey.current = row.original.uid;
              }}
              autoFocus={row.original.uid === currentInputKey.current}
            />
          );
        },
      })
      .addColumn("Hackers", {
        id: "hackers",
        type: "text",
        width: 60,
        accessor: (row) => row.users,
      })
      .addColumn("Actions", {
        id: "action",
        type: "custom",
        width: 20,
        disableSortBy: true,
        hideHeader: true,
        Cell: ({ cell, row }) => {
          const { resetField } = useFormContext();

          return (
            <ActionRowCell
              cell={cell}
              icon={"refresh-outline"}
              onClickAction={() => {
                resetField(`${row.original.uid}.name`);
              }}
            />
          );
        },
      })
  );

  const { data: allAssignments } = useQuery(
    QueryKeys.extraCreditAssignment.findAll(),
    () =>
      fetch(() =>
        getAllExtraCreditAssignments({
          hackathon: "81069f2a04cb465994ad84155af6e868",
        })
      )
  );

  const { data: allClasses } = useQuery(
    QueryKeys.extraCreditClass.findAll(),
    () =>
      fetch(() =>
        getAllExtraCreditClasses({
          hackathon: "81069f2a04cb465994ad84155af6e868",
        })
      ),
    {
      select: (data) => {
        if (data && allAssignments) {
          return data.map((d) => {
            const assignments = allAssignments.filter(
              (assignment) => assignment.class_uid === d.uid
            );
            return {
              uid: d.uid,
              name: d.class_name,
              users: assignments.length,
            };
          });
        }
      },
      enabled: !!allAssignments,
    }
  );

  const defaultValues = useMemo(() => {
    if (allClasses) {
      return allClasses.reduce((acc, curr) => {
        acc[String(curr.uid)] = curr;
        return acc;
      }, {} as { [key: string]: { uid: number; name: string; users: number } });
    }
  }, [allClasses]);

  const methods = useForm({
    defaultValues,
  });
  const { reset } = methods;

  useEffect(() => {
    if (defaultValues) {
      reset({ ...defaultValues });
    }
  }, [defaultValues, reset]);

  const onClickSave = () => {
    return null;
  };

  const onRefresh = () => {
    return null;
  };

  const onDelete = () => {
    return null;
  };

  return (
    <ModalProvider>
      <AddExtraCreditClassModal />
      <Grid container gap={1.5} flexDirection="column">
        <Grid container item justifyContent="space-between" alignItems="center">
          <Grid item xs={9.7}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Extra Credit
            </Typography>
          </Grid>
          <Grid item xs={2.3}>
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
                Manage class names by editing the table
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <SaveButton
              isDirty={methods.formState.isDirty}
              onClick={onClickSave}
              loading={false}
              progressColor={
                methods.formState.isDirty ? "common.white" : "common.black"
              }
            >
              Save
            </SaveButton>
          </Grid>
        </Grid>
        <Grid item sx={{ width: "100%" }}>
          <Table
            limit={8}
            names={names}
            onRefresh={onRefresh}
            onDelete={onDelete}
            columns={columns}
            data={allClasses ?? []}
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
              <FormProvider {...methods}>
                <Table.Body />
              </FormProvider>
            </Table.Container>
          </Table>
        </Grid>
      </Grid>
    </ModalProvider>
  );
};

export default withDefaultLayout(ExtraCreditPage);
