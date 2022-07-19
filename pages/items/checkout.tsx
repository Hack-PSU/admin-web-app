import React, { FC } from "react";
import { NextPage } from "next";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import {
  fetch,
  getAllCheckoutItems,
  IGetAllCheckoutItemsResponse,
  QueryKeys,
  resolveError,
} from "api";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { EvaIcon, GradientButton, SaveButton } from "components/base";
import { ActionRowCell, PaginatedTable } from "components/Table";
import { useRouter } from "next/router";
import { useColumnBuilder } from "common/hooks";
import { useQuery } from "react-query";
import { ModalProvider, useModalContext } from "components/context";
import AddCheckoutModal from "components/modal/AddCheckoutModal";

interface ICheckoutPageProps {
  items: IGetAllCheckoutItemsResponse[];
}

const AddCheckoutButton: FC = () => {
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
      onClick={() => showModal("addCheckout")}
    >
      Add Checkout
    </GradientButton>
  );
};

const CheckoutPage: NextPage<ICheckoutPageProps> = ({ items }) => {
  const router = useRouter();

  const { data: itemsData, refetch } = useQuery(
    QueryKeys.checkoutItem.findAll(),
    () => fetch(getAllCheckoutItems),
    {
      keepPreviousData: true,
      initialData: items,
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            uid: d.uid,
            userName: `${d.firstname} ${d.lastname}`,
            itemName: d.name,
          }));
        }
      },
    }
  );

  const { columns, names } = useColumnBuilder<{
    uid: string;
    userName: string;
    itemName: string;
    quantity: number;
  }>((builder) =>
    builder
      .addColumn("User Name", {
        id: "userName",
        accessor: (row) => row.userName,
        type: "text",
      })
      .addColumn("Item Name", {
        id: "itemName",
        accessor: (row) => row.itemName,
        type: "text",
      })
      .addColumn("Quantity", {
        id: "quantity",
        accessor: (row) => row.quantity,
        type: "text",
      })
      .addColumn("Actions", {
        id: "actions",
        type: "custom",
        hideHeader: true,
        disableSortBy: true,
        Cell: ({ cell, row }) => (
          <ActionRowCell
            cell={cell}
            icon={"edit-outline"}
            onClickAction={() =>
              router.push(`/items/checkout/${row.original.uid}`)
            }
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
    <ModalProvider>
      <AddCheckoutModal />
      <Grid container gap={1.5}>
        <Grid container item justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Checkout Items
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <AddCheckoutButton />
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
                Manage checkout requests by editing the table
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <SaveButton>Save</SaveButton>
          </Grid>
        </Grid>
        <Grid item sx={{ width: "100%" }}>
          <PaginatedTable
            limit={8}
            columns={columns}
            names={names}
            data={itemsData ?? []}
            onRefresh={onRefresh}
            onDelete={onDelete}
          />
        </Grid>
      </Grid>
    </ModalProvider>
  );
};

export const getServerSideProps = withServerSideProps(async (context) => {
  try {
    const items = await fetch(getAllCheckoutItems);
    if (items) {
      return {
        props: {
          items,
        },
      };
    }
  } catch (e: any) {
    resolveError(context, e);
  }
  return {
    props: {
      items: [],
    },
  };
});

export default withDefaultLayout(CheckoutPage);
