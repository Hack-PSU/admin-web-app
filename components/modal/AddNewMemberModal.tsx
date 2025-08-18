import React, { FC, useCallback } from "react";
import { useModal } from "components/context";
import {
  ControlledInput,
  ControlledSelect,
  LabelledInput,
  LabelledSelect,
  MenuButton,
  Modal,
} from "components/base";
import { Grid } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import {
  createOrganizer,
  fetch,
  OrganizerEntity,
  QueryEntity,
  QueryKeys,
  updateOrganizer,
} from "api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { object } from "superstruct";
import { Email, NonEmptySelect, NonEmptyString } from "common/form";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { IOption } from "components/base/Select/types";
import { TEAM_OPTIONS } from "common/constants";

const PermissionOptions: IOption<number>[] = [
  {
    value: 1,
    label: "Volunteer",
  },
  {
    value: 2,
    label: "Team Member",
  },
  {
    value: 3,
    label: "Exec Member",
  },
  {
    value: 4,
    label: "Tech-Exec",
  },
  {
    value: 5,
    label: "Finance Director",
  },
];


const schema = object({
  firstName: NonEmptyString,
  lastName: NonEmptyString,
  email: Email,
  privilege: NonEmptySelect,
  team: NonEmptySelect,
});

const AddNewMemberModal: FC = () => {
  const queryClient = useQueryClient();

  const { show, handleHide } = useModal("addNewMember");
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      privilege: { value: 2, label: "Team Member" },
      team: { value: "", label: "" },
    },
    resolver: superstructResolver(schema),
  });

  const { mutateAsync: mutateCreateOrganizer, isLoading } = useMutation(
    ({ entity }: QueryEntity<Omit<OrganizerEntity, "id">>) =>
      fetch(() => createOrganizer(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.organizer.all);
        enqueueSnackbar("Successfully created organizer", {
          variant: "success",
        });
      },
    }
  );

  const { handleSubmit, reset } = methods;

  const onClickSubmit = () => {
    handleSubmit(
      async (data) => {
        await mutateCreateOrganizer({
          entity: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            privilege: data.privilege.value,
            team: data.team.value,
            isActive: true,
          },
        });
        reset();
      },
      (error) => {
        console.error(error);
      }
    )();
  };

  const onClickSubmitAndCreate = useCallback(() => {
    handleSubmit(async (data) => {
      await mutateCreateOrganizer({
        entity: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          privilege: data.privilege.value,
          team: data.team.value,
          isActive: true,
        },
      });
      reset();
    })();
  }, [handleSubmit, mutateCreateOrganizer, reset]);

  return (
    <FormProvider {...methods}>
      <Modal open={show} onClose={handleHide}>
        <Modal.Header>Add Member</Modal.Header>
        <Modal.Body alignItems={"center"}>
          <Grid container item spacing={1.5}>
            <Grid item xs={6}>
              <ControlledInput
                name={"firstName"}
                placeholder={"Enter first name"}
                as={LabelledInput}
                id={"first-name"}
                label={"First Name"}
                showError
              />
            </Grid>
            <Grid item xs={6}>
              <ControlledInput
                name={"lastName"}
                placeholder={"Enter last name"}
                as={LabelledInput}
                id={"last-name"}
                label={"Last Name"}
                showError
              />
            </Grid>
            <Grid item xs={6}>
              <ControlledInput
                name={"email"}
                placeholder={"Enter email"}
                as={LabelledInput}
                id={"email"}
                label={"Email"}
                showError
              />
            </Grid>
            <Grid item xs={6}>
              <ControlledSelect
                name={"privilege"}
                placeholder={"Select a permission level"}
                as={LabelledSelect}
                id={"privilege"}
                label={"Privilege"}
                showError
                options={PermissionOptions}
              />
            </Grid>
            <Grid item xs={12}>
              <ControlledSelect
                name={"team"}
                placeholder={"Select a team"}
                as={LabelledSelect}
                id={"team"}
                label={"Team"}
                showError
                options={TEAM_OPTIONS}
              />
            </Grid>
          </Grid>
          <Grid item mt={2}>
            <MenuButton
              menuItems={[
                {
                  label: "Submit and Create",
                  onClick: onClickSubmitAndCreate,
                },
              ]}
              loading={isLoading}
              onClick={onClickSubmit}
            >
              Submit
            </MenuButton>
          </Grid>
        </Modal.Body>
      </Modal>
    </FormProvider>
  );
};

export default AddNewMemberModal;
