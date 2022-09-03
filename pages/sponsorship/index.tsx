import React, { useState } from "react";
import { NextPage } from "next";
import { Box, Grid, Typography } from "@mui/material";
import { EvaIcon, SaveButton } from "components/base";
import { Table, useColumnDef, useTable } from "components/Table";
import { ModalProvider } from "components/context";
import { withDefaultLayout } from "common/HOCs";
import { reorderItems } from "components/Table/utils";
import PageHeader from "components/Menu/PageHeader";

enum SponsorLevel {
  BRONZE = "Bronze",
  SILVER = "Silver",
  GOLD = "Gold",
}

type Sponsor = {
  name: string;
  order: number;
  level: SponsorLevel;
  link: string;
};

const sponsorsData: Sponsor[] = [
  {
    name: "Nittany AI Alliance",
    order: 1,
    level: SponsorLevel.GOLD,
    link: "https://nittanyai.psu.edu/",
  },
  {
    name: "M&T Tech",
    order: 2,
    level: SponsorLevel.GOLD,
    link: "https://www3.mtb.com/techhub/",
  },
  {
    name: "celonis",
    order: 3,
    level: SponsorLevel.GOLD,
    link: "https://www.celonis.com/",
  },
  {
    name: "Penn State Startup Week",
    order: 4,
    level: SponsorLevel.GOLD,
    link: "https://oec.psu.edu/",
  },
  {
    name: "Penn State EECS",
    order: 5,
    level: SponsorLevel.SILVER,
    link: "https://www.eecs.psu.edu/",
  },
  {
    name: "Penn State ICDS",
    order: 6,
    level: SponsorLevel.SILVER,
    link: "https://www.icds.psu.edu/",
  },
  {
    name: "PWC",
    order: 7,
    level: SponsorLevel.SILVER,
    link: "https://www.pwc.com/",
  },
  {
    name: "echo3D",
    order: 8,
    level: SponsorLevel.BRONZE,
    link: "https://www.echo3d.co/",
  },
  {
    name: "Saxbys",
    order: 9,
    level: SponsorLevel.BRONZE,
    link: "https://www.saxbyscoffee.com/",
  },
];

const SponsorshipPage: NextPage = () => {
  const [data, setData] = useState(sponsorsData);

  const defs = useColumnDef<Sponsor>({
    columns: [
      {
        id: "name",
        type: "text",
        header: "Name",
        accessorKey: "name",
      },
      {
        id: "level",
        type: "text",
        header: "Level",
        accessorKey: "level",
      },
      {
        id: "link",
        type: "text",
        header: "Link",
        accessorKey: "link",
      },
    ],
  });

  const table = useTable({
    ...defs,
    useDraggable: true,
    data,
    getRowId: (row) => `${row.order}`,
    onDragEnd: (result) => {
      if (!result.destination) {
        return;
      }

      setData(
        reorderItems(data, result.source.index, result.destination.index)
      );
    },
  });

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
        <PageHeader header={"Sponsorship"} />
        {/*<Grid container item justifyContent="space-between" alignItems="center">*/}
        {/*  <Grid item xs={10}>*/}
        {/*    <Typography variant="h4" sx={{ fontWeight: 700 }}>*/}
        {/*      Sponsorship*/}
        {/*    </Typography>*/}
        {/*  </Grid>*/}
        {/*  <Grid item xs={2}>*/}
        {/*    /!*<AddNewItemButton />*!/*/}
        {/*  </Grid>*/}
        {/*</Grid>*/}
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

export default withDefaultLayout(SponsorshipPage);
