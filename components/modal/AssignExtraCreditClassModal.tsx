import { FC, useMemo, useState } from "react";
import { useModal } from "components/context";
import {
  ControlledSelect,
  LabelledSelect,
  Modal,
  SaveButton,
} from "components/base";
import { useForm, FormProvider } from "react-hook-form";
import { Box, Grid } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CreateEntity, fetch, getAllHackers, QueryKeys } from "api";
import { IOption } from "types/components";
import {
  assignExtraCreditClass,
  IAssignExtraCreditClassEntity,
} from "api/extra_credit";
import { object } from "superstruct";
import { NonEmptySelectArray } from "common/form";
import { superstructResolver } from "@hookform/resolvers/superstruct";

type DataRow = {
  uid: string;
  name: string;
  users: number;
};

type RowDataType = Omit<DataRow, "uid"> & {
  uid: number;
};

interface IAssignExtraCreditClassModalProps {
  selectedRows?: RowDataType[];
}

const schema = object({
  hackers: NonEmptySelectArray,
});

const AssignExtraCreditClassModal: FC<IAssignExtraCreditClassModalProps> = ({
  selectedRows,
}) => {
  const { show, handleHide } = useModal("assignExtraCreditClass");
  const queryClient = useQueryClient();
  const methods = useForm({
    defaultValues: {
      hackers: [] as IOption[],
    },
    resolver: superstructResolver(schema),
  });

  const { data: allUsers } = useQuery(
    QueryKeys.hacker.findAll(),
    () =>
      fetch(() =>
        getAllHackers({
          type: "registration_stats",
          hackathon: "81069f2a04cb465994ad84155af6e868",
        })
      ),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            uid: d.uid,
            name: `${d.firstname} ${d.lastname}`,
            pin: d.pin,
          }));
        }
      },
    }
  );

  const { mutateAsync, isLoading } = useMutation(
    QueryKeys.extraCreditAssignment.createOne(),
    ({ entity }: CreateEntity<IAssignExtraCreditClassEntity, "">) =>
      fetch(() =>
        assignExtraCreditClass(entity, {
          hackathon: "81069f2a04cb465994ad84155af6e868",
        })
      ),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          QueryKeys.extraCreditAssignment.all
        );
      },
    }
  );

  const selectItems: IOption[] = useMemo(() => {
    if (allUsers) {
      return allUsers.map((u) => ({
        label: `${u.name} [${u.pin}]`,
        value: u.uid,
      }));
    }
    return [];
  }, [allUsers]);

  const onClickSubmit = () => {
    methods.handleSubmit(async (data) => {
      if (selectedRows) {
        const selectedHackers = data.hackers.map((h) => h.value);
        await Promise.all(
          selectedRows.map((row) =>
            Promise.all(
              selectedHackers.map((hacker) =>
                mutateAsync({
                  entity: { classUid: String(row.uid), userUid: hacker },
                })
              )
            )
          )
        );
        handleHide();
      }
    })();
  };

  return (
    <Modal open={show} onClose={handleHide}>
      <FormProvider {...methods}>
        <Modal.Header>Assign Class</Modal.Header>
        <Modal.Body>
          <Grid container item xs={12}>
            <Grid item sx={{ width: "100%" }}>
              <ControlledSelect
                isMulti
                name={"hackers"}
                as={LabelledSelect}
                id={"hackers"}
                label={"Hackers"}
                placeholder={"Search Hackers"}
                options={selectItems}
              />
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={6}
            spacing={1}
            mx={"auto"}
            justifyContent={"center"}
          >
            <Grid item>
              <Box mt={2}>
                <SaveButton
                  isDirty={true}
                  loading={isLoading}
                  onClick={onClickSubmit}
                >
                  Submit
                </SaveButton>
              </Box>
            </Grid>
          </Grid>
        </Modal.Body>
      </FormProvider>
    </Modal>
  );
};

export default AssignExtraCreditClassModal;
