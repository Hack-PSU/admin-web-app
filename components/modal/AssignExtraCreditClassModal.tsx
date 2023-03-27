import React, { FC, useMemo } from "react";
import { useModal } from "components/context";
import {
  ControlledSelect,
  EvaIcon,
  LabelledSelect,
  Modal,
  SaveButton,
} from "components/base";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Grid, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignExtraCreditClass,
  fetch,
  getAllExtraCreditAssignments,
  getAllUsers,
  QueryEntity,
  QueryKeys,
} from "api";
import { object } from "superstruct";
import { NonEmptySelectArray } from "common/form";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import _ from "lodash";
import { IOption } from "components/base/Select/types";

interface IAssignExtraCreditClassModalProps {
  selectedRows: Record<string, boolean>;
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
    () => fetch(getAllUsers),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            id: d.id,
            name: `${d.firstName} ${d.lastName}`,
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
    ({
      entity: { id, classId },
    }: QueryEntity<{ id: string; classId: string }>) =>
      fetch(() => assignExtraCreditClass({}, { id, classId })),
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
      const selectedClasses = Object.keys(selectedRows);
      const selectedClassAssignments = _.filter(allAssignments, (a) =>
        selectedClasses.includes(String(a.id))
      );
      const usersAssignedAllSelectedClasses = _.chain(allUsers)
        .pickBy((user) =>
          _.every(selectedClassAssignments, (ecClass) =>
            _.map(ecClass.users, "id").includes(user.id)
          )
        )
        .map("id")
        .value();

      return allUsers
        .filter((u) => !usersAssignedAllSelectedClasses.includes(u.id))
        .map((u) => ({
          label: u.name,
          value: u.id,
        }));
    }
    return [];
  }, [allAssignments, allUsers, selectedRows]);

  const onClickSubmit = () => {
    methods.handleSubmit(async (data) => {
      if (selectedRows && allAssignments) {
        const selectedHackers = data.hackers.map((h) => h.value);
        const classUsers = allAssignments.reduce((acc, curr) => {
          acc[String(curr.id)] = _.map(curr.users, "id");
          return acc;
        }, {} as { [key: string]: string[] });
        const selectedClasses = Object.keys(selectedRows);

        // returns an object where the key is the userUid and the value is an
        // array of classes not yet assigned to the hacker
        const mutateUsers = selectedHackers.reduce((acc, curr) => {
          // gather all classIds that have not been assigned to a user
          acc[curr] = _.chain(selectedClasses)
            .filter((classId) => !classUsers[classId].includes(curr))
            .value();
          return acc;
        }, {} as { [key: string]: string[] });

        await Promise.all(
          _.entries(mutateUsers).map(([hacker, classes]) =>
            Promise.all(
              classes.map((uid) =>
                mutateAsync({
                  entity: { classId: uid, id: hacker },
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
                <SaveButton loading={isLoading} onClick={onClickSubmit}>
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
