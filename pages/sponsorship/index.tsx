import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { EvaIcon, GradientButton, SaveButton } from "components/base";
import {
  DefaultActionCell,
  Table,
  useColumnDef,
  useTable,
} from "components/Table";
import { ModalProvider, useModalContext } from "components/context";
import { withDefaultLayout } from "common/HOCs";
import PageHeader from "components/Menu/PageHeader";
import { useImmer } from "use-immer";
import _ from "lodash";
import AddNewSponsorModal from "components/modal/AddNewSponsorModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetch,
  getAllSponsors,
  ISponsorshipCreateEntity,
  QueryKeys,
  updateSponsorBatch,
} from "api";
import { useSnackbar } from "notistack";
import EditSponsorModal from "components/modal/EditSponsorModal";

type Sponsor = ISponsorshipCreateEntity;

type MutateSponsors = {
  entity: {
    sponsors: Sponsor[];
  };
};

// const sponsorsData: Sponsor[] = [
//   {
//     name: "Nittany AI Alliance",
//     order: 0,
//     level: SponsorLevel.GOLD,
//     link: "https://nittanyai.psu.edu/",
//   },
//   {
//     name: "M&T Tech",
//     order: 1,
//     level: SponsorLevel.GOLD,
//     link: "https://www3.mtb.com/techhub/",
//   },
//   {
//     name: "celonis",
//     order: 2,
//     level: SponsorLevel.GOLD,
//     link: "https://www.celonis.com/",
//   },
//   {
//     name: "Penn State Startup Week",
//     order: 3,
//     level: SponsorLevel.GOLD,
//     link: "https://oec.psu.edu/",
//   },
//   {
//     name: "Penn State EECS",
//     order: 4,
//     level: SponsorLevel.SILVER,
//     link: "https://www.eecs.psu.edu/",
//   },
//   {
//     name: "Penn State ICDS",
//     order: 5,
//     level: SponsorLevel.SILVER,
//     link: "https://www.icds.psu.edu/",
//   },
//   {
//     name: "PWC",
//     order: 6,
//     level: SponsorLevel.SILVER,
//     link: "https://www.pwc.com/",
//   },
//   {
//     name: "echo3D",
//     order: 7,
//     level: SponsorLevel.BRONZE,
//     link: "https://www.echo3d.co/",
//   },
//   {
//     name: "Saxbys",
//     order: 8,
//     level: SponsorLevel.BRONZE,
//     link: "https://www.saxbyscoffee.com/",
//   },
// ];

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

const EditActionCell: FC<{ onClick(): void }> = ({ onClick }) => {
  const { showModal } = useModalContext();

  return (
    <DefaultActionCell
      cellProps={{
        sx: {
          width: "8%",
        },
      }}
      items={[
        {
          icon: "edit-outline",
          onClick: () => {
            onClick();
            showModal("editSponsor");
          },
        },
      ]}
    />
  );
};

const SponsorshipPage: NextPage = () => {
  const queryClient = useQueryClient();
  const originalData = useRef<{ [key: number]: Sponsor } | null>(null);

  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const { data: allSponsors, refetch } = useQuery(
    QueryKeys.sponsorship.findAll(),
    () => fetch(getAllSponsors),
    {
      select: (data) => {
        if (data) {
          return _.chain(data)
            .map((d) => ({
              uid: d.uid,
              logo: d.logo,
              order: d.order,
              name: d.name,
              level: d.level,
              websiteLink: d.website_link ?? "",
            }))
            .sortBy("order")
            .value();
        }
      },
    }
  );

  const { mutateAsync } = useMutation(
    ({ entity }: MutateSponsors) => fetch(() => updateSponsorBatch(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.sponsorship.all);
        enqueueSnackbar("Successfully updated sponsors", {
          variant: "success",
        });
      },
    }
  );

  const [data, setData] = useImmer<Sponsor[]>(allSponsors ?? []);

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
        format: (value) =>
          String(value).charAt(0).toUpperCase() + String(value).slice(1),
      },
      {
        id: "link",
        type: "text",
        header: "Link",
        accessorKey: "websiteLink",
      },
      {
        id: "actions",
        type: "custom",
        header: "",
        cell: ({ row }) => (
          <EditActionCell
            onClick={() => {
              if (originalData.current) {
                setSelectedSponsor(originalData.current[row.original.uid]);
              }
            }}
          />
        ),
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

          range.forEach((index) => {
            draft[index].order += offset;
          });
        }
      });
    },
    getDraggableOrder: (item) => item.order,
  });

  const onClickSave = useCallback(async () => {
    const origData = originalData.current;
    if (origData) {
      const changedData = _.filter(
        data,
        (d) => d.order !== origData[d.uid].order
      );
      await mutateAsync({
        entity: {
          sponsors: changedData,
        },
      });
    }
  }, [data, mutateAsync]);

  useEffect(() => {
    if (allSponsors) {
      const initialData = _.chain(allSponsors)
        .sortBy("order")
        .map((data, i) => ({
          ...data,
          order: i,
        }))
        .value();
      setData(initialData);
      originalData.current = _.reduce(
        initialData,
        (acc, curr) => {
          acc[curr.uid] = curr;
          return acc;
        },
        {} as { [key: number]: Sponsor }
      );
    }
  }, [allSponsors, setData]);

  return (
    <ModalProvider>
      <AddNewSponsorModal />
      <EditSponsorModal sponsor={selectedSponsor} />
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
            <SaveButton onClick={onClickSave}>Save</SaveButton>
          </Grid>
        </Grid>
        <Grid item sx={{ width: "100%" }}>
          <Table {...table}>
            <Table.GlobalActions>
              <Table.GlobalRefresh onRefresh={refetch} />
              <Table.GlobalPageSize />
            </Table.GlobalActions>
            <Table.Container>
              <Table.Actions center={<Table.PaginationAction />} />
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
