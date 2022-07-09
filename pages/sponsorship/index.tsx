import { NextPage } from "next";
import AddNewItemModal from "components/modal/AddNewItemModal";
import { Box, Grid, Typography } from "@mui/material";
import { EvaIcon, SaveButton } from "components/base";
import { Table } from "components/Table";
import { ModalProvider } from "components/context";
import React from "react";
import { useColumnBuilder } from "common/hooks";
import { withDefaultLayout } from "common/HOCs";

const SponsorshipPage: NextPage = () => {
  const sponsorsData: any[] = [];

  const { columns, names } = useColumnBuilder<{ name: string }>((builder) =>
    builder.addColumn("Name", {
      id: "name",
      type: "text",
      accessor: (row) => row.name,
    })
  );

  const onRefresh = () => {
    return null;
  };

  const onDelete = () => {
    return null;
  };

  return (
    <ModalProvider>
      {/*<AddNewItemModal />*/}
      <Grid container gap={1.5}>
        <Grid container item justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Sponsorship
            </Typography>
          </Grid>
          <Grid item xs={2}>
            {/*<AddNewItemButton />*/}
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
                Drag the rows to re-order sponsors
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <SaveButton
            // isDirty={methods.formState.isDirty}
            // onClick={onClickSave}
            // loading={isLoading}
            // progressColor={
            //   methods.formState.isDirty ? "common.white" : "common.black"
            // }
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
            data={sponsorsData ?? []}
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
    </ModalProvider>
  );
};

export default withDefaultLayout(SponsorshipPage);
