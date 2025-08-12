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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetch,
  getAllSponsors,
  PatchBatchSponsor,
  QueryEntity,
  QueryKeys,
  SponsorEntity,
  updateSponsorBatch,
  deleteSponsor,
} from "api";
import { useSnackbar } from "notistack";
import EditSponsorModal from "components/modal/EditSponsorModal";
import { AxiosError } from "axios";

type MutateSponsors = {
  sponsors: PatchBatchSponsor[];
};

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

const EditActionCell: FC<{ 
  onEdit(): void; 
  onDelete(): void;
}> = ({ onEdit, onDelete }) => {
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
            onEdit();
            showModal("editSponsor");
          },
        },
        {
          icon: "trash-outline",
          onClick: onDelete,
        },
      ]}
    />
  );
};

const SponsorshipPage: NextPage = () => {
  const queryClient = useQueryClient();
  const originalData = useRef<{ [key: number]: SponsorEntity } | null>(null);

  const [selectedSponsor, setSelectedSponsor] = useState<SponsorEntity | null>(
    null
  );

  const { enqueueSnackbar } = useSnackbar();

  const { data: allSponsors, refetch } = useQuery(
    QueryKeys.sponsorship.findAll(),
    () => fetch(getAllSponsors),
    {
      select: (data) => {
        if (data) {
          return _.chain(data)
            .map((d) => ({
              id: d.id,
              lightLogo: d.lightLogo ?? "",
              darkLogo: d.darkLogo ?? "",
              order: d.order,
              name: d.name,
              level: d.level,
              link: d.link ?? "",
            }))
            .sortBy("order")
            .value();
        }
      },
    }
  );

  const { mutateAsync } = useMutation(
    ({ entity }: QueryEntity<MutateSponsors>) =>
      fetch(() => updateSponsorBatch(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.sponsorship.all);
        enqueueSnackbar("Successfully updated sponsors", {
          variant: "success",
        });
      },
    }
  );

  const { mutateAsync: mutateDeleteSponsor } = useMutation(
    ({ id }: { id: number }) => fetch(() => deleteSponsor({}, { id })),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.sponsorship.all);
        enqueueSnackbar("Successfully deleted sponsor", {
          variant: "success",
        });
      },
      onError: (error: AxiosError) => {
        console.error("Delete Sponsor Error:", error.response?.data);
        enqueueSnackbar("Failed to delete sponsor", { variant: "error" });
      },
    }
  );

  const [data, setData] = useImmer<SponsorEntity[]>(allSponsors ?? []);

  const defs = useColumnDef<SponsorEntity>({
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
        accessorKey: "link",
      },
      {
        id: "actions",
        type: "custom",
        header: "",
        cell: ({ row }) => (
          <EditActionCell
            onEdit={() => {
              if (originalData.current) {
                setSelectedSponsor(originalData.current[row.original.id]);
              }
            }}
            onDelete={() => onDeleteSponsor(row.original.id, row.original.name)}
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
        (d) => d.order !== origData[d.id].order
      );
      await mutateAsync({
        entity: {
          sponsors: changedData,
        },
      });
    }
  }, [data, mutateAsync]);

  const onDeleteSponsor = useCallback(async (id: number, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete sponsor "${name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await mutateDeleteSponsor({ id });
    } catch (error) {
      console.error("Delete Sponsor Error:", error);
    }
  }, [mutateDeleteSponsor]);

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
          acc[curr.id] = curr;
          return acc;
        },
        {} as { [key: number]: SponsorEntity }
      );
    }
  }, [allSponsors, setData]);

  return (
    <ModalProvider>
      <AddNewSponsorModal totalSponsors={allSponsors?.length ?? 0} />
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
