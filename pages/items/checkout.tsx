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
import { Table, useColumnDef, useTable } from "components/Table";
import { useRouter } from "next/router";
import { useColumnBuilder } from "common/hooks";
import { useQuery } from "@tanstack/react-query";
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

  const defs = useColumnDef<{
    uid: number;
    userName: string;
    itemName: string;
  }>({
    columns: [
      {
        id: "userName",
        type: "text",
        header: "Hacker",
        accessorKey: "userName",
      },
      {
        id: "itemName",
        type: "text",
        header: "Item",
        accessorKey: "itemName",
      },
    ],
  });

  const table = useTable({
    data: itemsData ?? [],
    ...defs,
  });

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
