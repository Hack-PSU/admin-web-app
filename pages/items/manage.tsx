import React from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Grid, Typography } from "@mui/material";
import { GradientButton } from "components/base";
import { useRouter } from "next/router";
import { useColumnBuilder } from "common/hooks";
import {
  fetch,
  getAllAvailableItems,
  ICheckoutItemEntity,
  QueryKeys,
} from "api";
import { useQuery } from "react-query";
import { EditRowCell, Table } from "components/Table";

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
      })
      .addColumn("Quantity", {
        id: "quantity",
        // maxWidth: 100,
        // minWidth: 80,
        accessor: (row) => row.quantity,
        type: "text",
      })
      .addColumn("Actions", {
        id: "actions",
        type: "custom",
        width: 5,
        maxWidth: 15,
        disableSortBy: true,
        hideHeader: true,
        Cell: ({ cell, row }) => (
          <EditRowCell
            cell={cell}
            onClickEdit={() => router.push(`/items/manage/${row.original.uid}`)}
          />
        ),
      })
  );

  const onRefresh = () => {
    void refetch();
  };

  const onDelete = () => {
    return null;
  };

  return (
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
            <Table.Body />
          </Table.Container>
        </Table>
      </Grid>
    </Grid>
  );
};

export default withDefaultLayout(ManageItems);
