import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { EvaIcon, GradientButton, SaveButton } from "components/base";
import { useColumnBuilder } from "common/hooks";
import {
  fetch,
  getAllAvailableItems,
  ICheckoutItemEntity,
  MutateEntity,
  QueryKeys,
} from "api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DefaultActionCell,
  DefaultInputCell,
  Table,
  useColumnDef,
  useTable,
} from "components/Table";
import {
  useForm,
  FormProvider,
  useFormContext,
  useFormState,
  FormState,
} from "react-hook-form";
import { ModalProvider, useModalContext } from "components/context";
import AddNewItemModal from "components/modal/AddNewItemModal";

interface IManageItemsProps {
  items: ICheckoutItemEntity[];
}

const AddNewItemButton: FC = () => {
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
      onClick={() => showModal("addNewItem")}
    >
      Add an Item
    </GradientButton>
  );
};

const ManageItems: NextPage<IManageItemsProps> = ({ items }) => {
  const queryClient = useQueryClient();
  // const [isDirty, setIsDirty] = useState(false);
  const currentInputKey = useRef<{ key: string }>({ key: "" });

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

  const { mutateAsync, isLoading } = useMutation(
    QueryKeys.manageItems.updateBatch(),
    ({ entity }: MutateEntity<ICheckoutItemEntity>) => fetch(),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.manageItems.all);
      },
    }
  );

  const defaultValues = useMemo(() => {
    if (itemsData) {
      return itemsData.reduce((obj, curr) => {
        if (curr.uid) {
          obj[curr.uid] = {
            uid: curr.uid,
            name: curr.name,
            quantity: curr.quantity,
          };
          return obj;
        }
        return obj;
      }, {} as { [p: string]: { uid: number; name: string; quantity: number } });
    }
  }, [itemsData]);

  const methods = useForm({
    defaultValues,
  });

  const { formState, reset, handleSubmit, resetField } = methods;

  useEffect(() => {
    reset({ ...defaultValues });
  }, [defaultValues, reset]);

  // useEffect(() => {
  //   const subscription = watch((data, { name }) => {
  //     console.log(name, getFieldState(name, formState));
  //   });
  //
  //   return subscription.unsubscribe;
  // }, [watch, getFieldState]);

  const onClickSave = useCallback(() => {
    const { dirtyFields } = formState;
    handleSubmit(async (data) => {
      const editedFields = Object.keys(dirtyFields).filter(
        (field) => dirtyFields[field].name || dirtyFields[field].quantity
      );

      await Promise.all(
        editedFields.map((uid) =>
          mutateAsync({
            entity: {
              uid: data[uid].uid,
              name: data[uid].name,
              quantity: data[uid].quantity,
            },
          })
        )
      );
    })();
  }, [formState, handleSubmit, mutateAsync]);

  const defs = useColumnDef<{
    uid: number;
    name: string;
    quantity: number;
  }>({
    columns: [
      {
        id: "name",
        type: "input",
        inputName: "name",
        placeholder: "Enter an item name",
        header: "Name",
        accessorKey: "name",
      },
      {
        id: "quantity",
        type: "input",
        inputName: "quantity",
        placeholder: "Enter a quantity",
        header: "Quantity",
        accessorKey: "quantity",
        cell: ({ row }) => (
          <DefaultInputCell
            key={row.original.uid}
            type={"number"}
            name={`${row.original.uid}.quantity`}
            placeholder={"Enter a quantity"}
          />
        ),
      },
      {
        id: "actions",
        type: "custom",
        header: "",
        cell: ({ row }) => (
          <DefaultActionCell
            cellProps={{
              sx: {
                width: "8%",
              },
            }}
            items={[
              {
                icon: "refresh-outline",
                onClick: () => {
                  resetField(`${row.original.uid}.name`);
                  resetField(`${row.original.uid}.quantity`);
                },
              },
            ]}
          />
        ),
      },
    ],
  });

  const table = useTable({
    data: itemsData ?? [],
    getRowId: (row) => String(row.uid),
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
      <AddNewItemModal />
      <Grid container gap={1.5}>
        <Grid container item justifyContent="space-between" alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Manage Items
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <AddNewItemButton />
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
                Manage items by editing the table
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <SaveButton onClick={onClickSave} loading={isLoading}>
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
                <FormProvider {...methods}>
                  <Table.Body />
                </FormProvider>
              </Table.Content>
            </Table.Container>
          </Table>
        </Grid>
      </Grid>
    </ModalProvider>
  );
};

export default withDefaultLayout(ManageItems);
