import { NextPage } from "next";
import { withDefaultLayout, withServerSideProps } from "common/HOCs";
import {
  fetch,
  getAllCheckoutItems,
  IGetAllCheckoutItemsResponse,
  QueryKeys,
  resolveError,
} from "api";
import { Grid, Typography, useTheme } from "@mui/material";
import { GradientButton } from "components/base";
import { EditRowCell, PaginatedTable } from "components/Table";
import React from "react";
import { useRouter } from "next/router";
import { useColumnBuilder } from "common/hooks";
import { useQuery } from "react-query";

interface ICheckoutPageProps {
  items: IGetAllCheckoutItemsResponse[];
}

const CheckoutPage: NextPage<ICheckoutPageProps> = ({ items }) => {
  const theme = useTheme();
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

  const { columns, names } = useColumnBuilder((builder) =>
    builder
      .addColumn("User Name", {
        id: "userName",
        accessor: "userName",
        type: "text",
      })
      .addColumn("Item Name", {
        id: "itemName",
        accessor: "itemName",
        type: "text",
      })
      .addColumn("Quantity", {
        id: "quantity",
        accessor: "quantity",
        type: "text",
      })
      .addColumn("Actions", {
        id: "actions",
        type: "custom",
        hideHeader: true,
        disableSortBy: true,
        Cell: ({ cell, row }) => (
          <EditRowCell
            cell={cell}
            // @ts-ignore
            onClickEdit={() =>
              router.push(`/items/checkout/${row?.original?.uid}`)
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
    <Grid container gap={1.5}>
      <Grid container item justifyContent="space-between" alignItems="center">
        <Grid item xs={10}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Events
          </Typography>
        </Grid>
        <Grid item xs={2}>
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
            onClick={() => router.push("/events/steps")}
          >
            Add an Event
          </GradientButton>
        </Grid>
      </Grid>
      <Grid item>
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
