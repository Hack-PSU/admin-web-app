import React, { FC, useMemo } from "react";
import { useModal } from "components/context";
import {
  ControlledSelect,
  EvaIcon,
  LabelledSelect,
  Modal,
  SaveButton,
} from "components/base";
import { useForm, FormProvider } from "react-hook-form";
import { Box, Grid, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  CreateEntity,
  fetch,
  getAllHackers,
  QueryKeys,
  assignExtraCreditClass,
  getAllExtraCreditAssignments,
  IAssignExtraCreditClassEntity,
} from "api";
import { IOption } from "types/components";
import { object } from "superstruct";
import { NonEmptySelectArray } from "common/form";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import _ from "lodash";

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
    () => fetch(getAllHackers),
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

  const { data: allAssignments } = useQuery(
    QueryKeys.extraCreditAssignment.findAll(),
    () => fetch(getAllExtraCreditAssignments)
  );

  const { mutateAsync, isLoading } = useMutation(
    QueryKeys.extraCreditAssignment.createOne(),
    ({ entity }: CreateEntity<IAssignExtraCreditClassEntity, "">) =>
      fetch(() => assignExtraCreditClass(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          QueryKeys.extraCreditAssignment.all
        );
      },
    }
  );

  const selectItems: IOption[] = useMemo(() => {
    if (allUsers && selectedRows) {
      const selectedClasses = selectedRows.map((s) => s.uid);
      const assignedHackers = _.chain(allAssignments)
        .groupBy("user_uid")
        .pickBy((assignment) => {
          const userAssignments = _.map(assignment, "class_uid");
          // check if all selectedClasses are already assigned
          // return true if user has all selectedClasses
          return _.every(selectedClasses, (classUid) =>
            userAssignments.includes(classUid)
          );
        })
        .map((_, user) => user)
        .value();

      return allUsers
        .filter((u) => !assignedHackers.includes(u.uid))
        .map((u) => ({
          label: `${u.name} [${u.pin}]`,
          value: u.uid,
        }));
    }
    return [];
  }, [allAssignments, allUsers, selectedRows]);

  const onClickSubmit = () => {
    methods.handleSubmit(async (data) => {
      if (selectedRows) {
        const selectedHackers = data.hackers.map((h) => h.value);
        const assignedHackers = _.groupBy(allAssignments, "user_uid");
        const selectedClasses = _.map(selectedRows, "uid");

        // returns an object where they key is the userUid and the value is an
        // array of classes not yet assigned to the hacker
        const mutateHackers = selectedHackers.reduce((acc, curr) => {
          const userAssignments = _.map(assignedHackers[curr], "class_uid");
          // gather assignments not yet assigned to hacker
          const remainingAssignments = _.filter(
            selectedClasses,
            (uid) => !userAssignments.includes(uid)
          );
          acc[curr] = _.map(remainingAssignments, String);
          return acc;
        }, {} as { [key: string]: string[] });

        await Promise.all(
          _.entries(mutateHackers).map(([hacker, classes]) =>
            Promise.all(
              classes.map((uid) =>
                mutateAsync({
                  entity: { classUid: uid, userUid: hacker },
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
          <Grid container item xs={10} alignItems="center" spacing={1}>
            <Grid item>
              <Box mt={0.3}>
                <EvaIcon name={"alert-circle-outline"} />
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="body1">
                Only assignments not assigned to hackers will be saved
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} mt={1}>
            <Grid item sx={{ width: "100%" }}>
              <ControlledSelect
                isMulti
                name={"hackers"}
                as={LabelledSelect}
                id={"hackers"}
                label={"Hackers"}
                placeholder={"Search hackers by name or pin"}
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
