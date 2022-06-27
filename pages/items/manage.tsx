import React, { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Box, Grid, Typography } from "@mui/material";
import { ControlledInput, GradientButton, Input } from "components/base";
import { useRouter } from "next/router";
import { useColumnBuilder } from "common/hooks";
import {
  fetch,
  getAllAvailableItems,
  ICheckoutItemEntity,
  QueryKeys,
} from "api";
import { useQuery } from "react-query";
import { ActionRowCell, Table, TableCell } from "components/Table";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import InputCell from "components/Table/InputCell";
import ModalProvider from "components/context/ModalProvider";

interface IManageItemsProps {
  items: ICheckoutItemEntity[];
}

const ManageItems: NextPage<IManageItemsProps> = ({ items }) => {
  const router = useRouter();

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

  const defaultValues = useMemo(() => {
    if (itemsData) {
      return itemsData.reduce((obj, curr) => {
        if (curr.uid) {
          obj[curr.uid] = { name: curr.name, quantity: curr.quantity };
          return obj;
        }
        return obj;
      }, {} as { [p: string]: { name: string; quantity: number } });
    }
  }, [itemsData]);

  const methods = useForm({
    defaultValues,
  });

  useEffect(() => {
    methods.reset({ ...defaultValues });
  }, [defaultValues, methods]);

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
          const {
            formState: { dirtyFields },
            resetField,
          } = useFormContext();

          if (!dirtyFields[row.original.uid]) {
            return (
              <TableCell {...cell.getCellProps()} empty>
                <Box />
              </TableCell>
            );
          }

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
      <Grid container gap={1.5}>
        <Grid container item justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Manage Items
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <GradientButton
              variant="text"
              sx={(theme) => ({
                width: "100%",
                padding: theme.spacing(1, 3.5),
              })}
              textProps={{
                sx: {
                  lineHeight: "1.8rem",
                  color: "common.white",
                },
              }}
              onClick={() => router.push("/items/manage/new")}
            >
              Add an Item
            </GradientButton>
          </Grid>
        </Grid>
        <Grid item>
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
