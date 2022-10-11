import React, { FC, useRef, useState } from "react";
import { NextPage } from "next";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { EvaIcon, GradientButton, SaveButton } from "components/base";
import { Table, useColumnDef, useTable } from "components/Table";
import { ModalProvider, useModal, useModalContext } from "components/context";
import { withDefaultLayout } from "common/HOCs";
import { reorderItems } from "components/Table/utils";
import PageHeader from "components/Menu/PageHeader";
import { useImmer } from "use-immer";
import { Draft } from "immer";
import _ from "lodash";
import AddNewSponsorModal from "components/modal/AddNewSponsorModal";
import { useQuery } from "@tanstack/react-query";
import { fetch, getAllSponsors, QueryKeys } from "api";

enum SponsorLevel {
  BRONZE = "Bronze",
  SILVER = "Silver",
  GOLD = "Gold",
}

type Sponsor = {
  name: string;
  order: number;
  level: string;
  link: string;
};

const sponsorsData: Sponsor[] = [
  {
    name: "Nittany AI Alliance",
    order: 0,
    level: SponsorLevel.GOLD,
    link: "https://nittanyai.psu.edu/",
  },
  {
    name: "M&T Tech",
    order: 1,
    level: SponsorLevel.GOLD,
    link: "https://www3.mtb.com/techhub/",
  },
  {
    name: "celonis",
    order: 2,
    level: SponsorLevel.GOLD,
    link: "https://www.celonis.com/",
  },
  {
    name: "Penn State Startup Week",
    order: 3,
    level: SponsorLevel.GOLD,
    link: "https://oec.psu.edu/",
  },
  {
    name: "Penn State EECS",
    order: 4,
    level: SponsorLevel.SILVER,
    link: "https://www.eecs.psu.edu/",
  },
  {
    name: "Penn State ICDS",
    order: 5,
    level: SponsorLevel.SILVER,
    link: "https://www.icds.psu.edu/",
  },
  {
    name: "PWC",
    order: 6,
    level: SponsorLevel.SILVER,
    link: "https://www.pwc.com/",
  },
  {
    name: "echo3D",
    order: 7,
    level: SponsorLevel.BRONZE,
    link: "https://www.echo3d.co/",
  },
  {
    name: "Saxbys",
    order: 8,
    level: SponsorLevel.BRONZE,
    link: "https://www.saxbyscoffee.com/",
  },
];

const AddNewSponsorButton: FC = () => {
  const theme = useTheme();

  const { showModal } = useModalContext();

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
      onClick={() => showModal("addNewSponsor")}
    >
      Add a Sponsor
    </GradientButton>
  );
};

const SponsorshipPage: NextPage = () => {
  const changedData = useRef<Sponsor[] | null>(null);

  const { data: allSponsors } = useQuery(
    QueryKeys.sponsorship.findAll(),
    () => fetch(getAllSponsors),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            uid: d.uid,
            order: parseInt(d.level),
            name: d.name,
            level: d.level,
            link: "",
          }));
        }
      },
    }
  );

  const [data, setData] = useImmer(allSponsors ?? []);

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

      setData((draft) => {
        if (result.destination && draft) {
          // perform swap
          const [removed] = draft.splice(result.source.index, 1);
          draft.splice(result.destination.index, 0, removed);

          draft[result.destination.index].order = result.destination.index;

          // range includes indices of moved items in the process excluding
          // item that was dragged
          let range: number[];

          // indicates the shift in order depending on direction
          let offset: number;

          if (result.source.index < result.destination.index) {
            // move downwards
            offset = -1; // items move upwards
            range = _.range(result.source.index, result.destination.index);
          } else {
            // move upwards
            offset = 1; // items move downwards

            // select values 1 after dropped item including item
            // replacing source
            range = _.range(
              result.destination.index + 1,
              result.source.index + 1
            );
          }

          const entriesChanged: Sponsor[] = [];

          range.forEach((index) => {
            draft[index].order += offset;
            entriesChanged.push({ ...draft[index] });
          });

          entriesChanged.push({ ...draft[result.destination.index] });
          changedData.current = [...entriesChanged];
        }
      });
    },
    getDraggableOrder: (item) => item.order,
  });

  const onRefresh = () => {
    return null;
  };

  const onDelete = () => {
    return null;
  };

  return (
    <ModalProvider>
      <AddNewSponsorModal />
      <Grid container gap={1.5}>
        <PageHeader header={"Sponsorship"} right={<AddNewSponsorButton />} />
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
