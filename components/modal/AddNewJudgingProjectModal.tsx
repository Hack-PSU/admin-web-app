import { FC } from "react";
import {
  ControlledInput,
  LabelledInput,
  MenuButton,
  Modal,
} from "components/base";
import { useModal } from "components/context";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Grid } from "@mui/material";
import { object } from "superstruct";
import { NonEmptyString } from "common/form";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { useMutation, useQueryClient } from "react-query";
import {
  CreateEntity,
  createProject,
  fetch,
  IProjectEntity,
  QueryKeys,
} from "api";

const schema = object({
  name: NonEmptyString,
});

const AddNewJudgingProjectModal: FC = () => {
  const queryClient = useQueryClient();

  const { show, handleHide } = useModal("addJudgingProject");
  const methods = useForm({
    defaultValues: {
      name: "",
    },
    resolver: superstructResolver(schema),
  });

  const { mutateAsync, isLoading } = useMutation(
    QueryKeys.judgingProject.createOne(),
    ({ entity }: CreateEntity<IProjectEntity, "uid" | "hackathon">) =>
      fetch(() => createProject(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.judgingProject.all);
      },
    }
  );

  const handleSubmit = () => {
    methods.handleSubmit(async (data) => {
      await mutateAsync({ entity: { project: data.name } });
      handleHide();
    })();
  };

  const handleSubmitAndCreate = () => {
    methods.handleSubmit(async (data) => {
      await mutateAsync({ entity: { project: data.name } });
      methods.reset();
    })();
  };

  return (
    <Modal open={show} onClose={handleHide}>
      <FormProvider {...methods}>
        <Modal.Header>Add Project</Modal.Header>
        <Modal.Body alignItems="center">
          <Grid container item>
            <Grid item xs={12}>
              <ControlledInput
                name={"name"}
                placeholder={"Enter a project name"}
                as={LabelledInput}
                label={"Name"}
                id={"name"}
                showError
              />
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={6}
            spacing={1}
            mx={"auto"}
            justifyContent="center"
          >
            <Grid item xs={6}>
              <Box mt={2}>
                <MenuButton
                  isDirty={methods.formState.isDirty}
                  loading={isLoading}
                  menuItems={[
                    {
                      label: "Submit and Create",
                      onClick: handleSubmitAndCreate,
                    },
                  ]}
                  onClick={handleSubmit}
                  progressColor={
                    methods.formState.isDirty ? "common.black" : "common.white"
                  }
                >
                  Submit
                </MenuButton>
              </Box>
            </Grid>
          </Grid>
        </Modal.Body>
      </FormProvider>
    </Modal>
  );
};

export default AddNewJudgingProjectModal;
