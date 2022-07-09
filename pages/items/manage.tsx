import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { EvaIcon, GradientButton, SaveButton } from "components/base";
import { useRouter } from "next/router";
import { useColumnBuilder } from "common/hooks";
import {
  fetch,
  getAllAvailableItems,
  ICheckoutItemEntity,
  MutateEntity,
  QueryKeys,
} from "api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ActionRowCell, Table, TableCell } from "components/Table";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import InputCell from "components/Table/InputCell";
import { ModalProvider, useModalContext } from "components/context";
import AddNewItemModal from "components/modal/AddNewItemModal";

interface IManageItemsProps {
  items: ICheckoutItemEntity[];
}

const AddNewItemButton: FC = () => {
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
      onClick={() => showModal("addNewItem")}
    >
      Add an Item
    </GradientButton>
  );
};

const ManageItems: NextPage<IManageItemsProps> = ({ items }) => {
  const queryClient = useQueryClient();
  const currentInputKey = useRef<{ key: string }>({ key: "" });

  const { data: itemsData, refetch } = useQuery(
    QueryKeys.manageItems.findAll(),
    () => fetch(getAllAvailableItems),
    {
      keepPreviousData: true,
      initialData: items,
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            uid: d.uid,
            name: d.name,
            quantity: d.quantity,
          }));
        }
      },
    }
  );

  const { mutateAsync, isLoading } = useMutation(
    QueryKeys.manageItems.updateBatch(),
    ({ entity }: MutateEntity<ICheckoutItemEntity>) => fetch(),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.manageItems.all);
      },
    }
  );

  const defaultValues = useMemo(() => {
    if (itemsData) {
      return itemsData.reduce((obj, curr) => {
        if (curr.uid) {
          obj[curr.uid] = {
            uid: curr.uid,
            name: curr.name,
            quantity: curr.quantity,
          };
          return obj;
        }
        return obj;
      }, {} as { [p: string]: { uid: number; name: string; quantity: number } });
    }
  }, [itemsData]);

  const methods = useForm({
    defaultValues,
  });

  const { formState, reset, handleSubmit } = methods;
  const { dirtyFields } = formState;

  useEffect(() => {
    reset({ ...defaultValues });
  }, [defaultValues, reset]);

  const onClickSave = () => {
    handleSubmit(async (data) => {
      const editedFields = Object.keys(dirtyFields).filter(
        (field) => dirtyFields[field].name || dirtyFields[field].quantity
      );

      await Promise.all(
        editedFields.map((uid) =>
          mutateAsync({
            entity: {
              uid: data[uid].uid,
              name: data[uid].name,
              quantity: data[uid].quantity,
            },
          })
        )
      );
    })();
  };

  const { columns, names } = useColumnBuilder<{
    uid: string;
    name: string;
    quantity: string;
  }>((builder) =>
    builder
      .addColumn("Name", {
        id: "name",
        accessor: (row) => row.name,
        type: "text",
        minWidth: 150,
        Header: () => <Box pl={1.8}>Name</Box>,
        Cell: ({ cell, row }) => (
          <InputCell
            key={row.original.uid}
            cell={cell}
            name={`${row.original.uid}.name`}
            placeholder={"Enter an item name"}
            onFocus={() => {
              currentInputKey.current.key = `${row.original.uid}.name`;
            }}
            autoFocus={
              `${row.original.uid}.name` === currentInputKey.current.key
            }
          />
        ),
      })
      .addColumn("Quantity", {
        id: "quantity",
        // maxWidth: 100,
        // minWidth: 80,
        Header: () => <Box pl={1.8}>Quantity</Box>,
        accessor: (row) => row.quantity,
        type: "text",
        Cell: ({ cell, row }) => (
          <InputCell
            type="number"
            key={row.original.uid}
            cell={cell}
            name={`${row.original.uid}.quantity`}
            placeholder={"Enter a quantity"}
            onFocus={() => {
              currentInputKey.current.key = `${row.original.uid}.quantity`;
            }}
            autoFocus={
              `${row.original.uid}.quantity` === currentInputKey.current.key
            }
          />
        ),
      })
      .addColumn("Actions", {
        id: "actions",
        type: "custom",
        width: 5,
        maxWidth: 15,
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
                resetField(`${row.original.uid}.quantity`);
              }}
            />
          );
        },
      })
  );

  const onRefresh = () => {
    void refetch();
  };

  const onDelete = () => {
    return null;
  };

  return (
    <ModalProvider>
      <AddNewItemModal />
      <Grid container gap={1.5}>
        <Grid container item justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Manage Items
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <AddNewItemButton />
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
                Manage items by editing the table
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <SaveButton
              isDirty={methods.formState.isDirty}
              onClick={onClickSave}
              loading={isLoading}
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
            data={itemsData ?? []}
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

export default withDefaultLayout(ManageItems);
