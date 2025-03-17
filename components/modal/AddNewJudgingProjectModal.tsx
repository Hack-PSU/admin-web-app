import { FC } from "react";
import {
  ControlledCheckbox,
  ControlledInput,
  LabelledCheckbox,
  LabelledInput,
  MenuButton,
  Modal,
} from "components/base";
import { useModal } from "components/context";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Grid } from "@mui/material";
import { boolean, object } from "superstruct";
import { NonEmptyString } from "common/form";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  fetch,
  ProjectEntity,
  QueryEntity,
  QueryKeys,
} from "api";

const CHALLENGE_NAMES = [
  "Machine Learning",
  "Entrepreneurship",
  "Timeless Tech",
];

const schema = object({
  name: NonEmptyString,
  categories: object({
    challenge1: boolean(),
    challenge2: boolean(),
    challenge3: boolean(),
  }),
});

type CategorySchema = {
  challenge1: boolean;
  challenge2: boolean;
  challenge3: boolean;
};

const AddNewJudgingProjectModal: FC = () => {
  const queryClient = useQueryClient();

  const { show, handleHide } = useModal("addJudgingProject");
  const methods = useForm({
    defaultValues: {
      name: "",
      categories: {
        challenge1: false,
        challenge2: false,
        challenge3: false,
      },
    },
    resolver: superstructResolver(schema),
  });

  const { mutateAsync, isLoading } = useMutation(
    QueryKeys.judgingProject.createOne(),
    ({ entity }: QueryEntity<Omit<ProjectEntity, "id">>) =>
      fetch(() => createProject(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.judgingProject.all);
      },
    }
  );

  const handleSubmit = () => {
    methods.handleSubmit(async (data) => {
      const challengeString =
        Object.keys(data.categories)
          .filter((key: string) => {
            return data.categories[key as keyof CategorySchema] === true;
          })
          .join(",") || undefined;
      await mutateAsync({
        entity: { name: data.name, categories: challengeString },
      });
      handleHide();
    })();
  };

  const handleSubmitAndCreate = () => {
    methods.handleSubmit(async (data) => {
      const challengeString =
        Object.keys(data.categories)
          .filter((key: string) => {
            data.categories[key as keyof CategorySchema] === true;
          })
          .join(",") || undefined;
      await mutateAsync({
        entity: { name: data.name, categories: challengeString },
      });
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
              <br />
              <ControlledCheckbox
                id={"categories"}
                name={"categories"}
                items={[
                  {
                    value: "challenge1",
                    type: "option",
                    display: CHALLENGE_NAMES[0],
                  },
                  {
                    value: "challenge2",
                    type: "option",
                    display: CHALLENGE_NAMES[1],
                  },
                  {
                    value: "challenge3",
                    type: "option",
                    display: CHALLENGE_NAMES[2],
                  },
                ]}
                as={LabelledCheckbox}
                label={"Categories"}
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
                  loading={isLoading}
                  menuItems={[
                    {
                      label: "Submit and Create",
                      onClick: handleSubmitAndCreate,
                    },
                  ]}
                  onClick={handleSubmit}
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
