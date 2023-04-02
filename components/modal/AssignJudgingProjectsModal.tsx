import React, { FC, useCallback } from "react";
import {
  Button,
  ControlledInput,
  ControlledRadio,
  ControlledSelect,
  InputLabel,
  LabelledInput,
  LabelledSelect,
  Loading,
  Modal,
} from "components/base";
import { useModal, useModalContext } from "components/context";
import { FormProvider, useForm } from "react-hook-form";
import { Grid } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetch,
  generateJudging,
  GenerateJudgingEntity,
  getAllAppFlags,
  getAllOrganizers,
  getAllProjects,
  QueryEntity,
  QueryKeys,
} from "api";
import { useSnackbar } from "notistack";
import _ from "lodash";
import { AxiosError } from "axios";
import { IOption } from "components/base/Select/types";

enum FilterType {
  INCLUDE = "include",
  EXCLUDE = "exclude",
}

const AssignJudgingProjectsModal: FC = () => {
  const queryClient = useQueryClient();
  const { showModal } = useModalContext();

  const { show, handleHide } = useModal("assignJudgingProjects");
  const { enqueueSnackbar } = useSnackbar();

  const { data: flagEnabledMap, isLoading } = useQuery(
    QueryKeys.flag.findAll(),
    () => fetch(getAllAppFlags),
    {
      select: (data) => {
        if (data) {
          return data.reduce((acc, curr) => {
            acc[curr.name] = curr.isEnabled;
            return acc;
          }, {} as { [key: string]: boolean });
        }
      },
    }
  );

  const methods = useForm({
    defaultValues: {
      users: [] as IOption[],
      projects: [] as IOption<number>[],
      filterUsers: { value: FilterType.EXCLUDE },
      filterProjects: { value: FilterType.EXCLUDE },
      projectsPerUser: "2",
    },
  });

  const { data: organizerOptions } = useQuery(
    QueryKeys.organizer.findAll(),
    () => fetch(getAllOrganizers),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            value: d.id,
            label: `${d.firstName} ${d.lastName}`.trim(),
          }));
        }
      },
    }
  );

  const { data: projectOptions } = useQuery(
    QueryKeys.judgingProject.findAll(),
    () => fetch(getAllProjects),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            value: d.id,
            label: d.name,
          }));
        }
      },
    }
  );

  const { mutateAsync: mutateGenerateJudging } = useMutation(
    ({ entity }: QueryEntity<GenerateJudgingEntity>) =>
      fetch(() => generateJudging(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.judgingScore.all);
        enqueueSnackbar("Successfully generated judging assignments", {
          variant: "success",
        });
      },
      onError: (error: AxiosError) => {
        if (error && error.response && error.response.status === 409) {
          enqueueSnackbar("[Status 409]: A duplicate is found", {
            variant: "error",
          });
        } else {
          enqueueSnackbar("An error occurred", {
            variant: "error",
          });
        }
      },
    }
  );

  const { handleSubmit } = methods;

  const onClickSubmit = useCallback(() => {
    handleSubmit(async (data) => {
      // starts as including all
      const selectedJudges = _.map(data.users, "value");
      const selectedProjects = _.map(data.projects, "value");

      let users = selectedJudges;
      let projects = selectedProjects;

      if (data.filterUsers.value === FilterType.EXCLUDE) {
        // if filter type is exclude, make selectedJudges the excluding filter
        const excludedJudges = new Set(selectedJudges);

        users = _.chain(organizerOptions)
          .map((o) => o.value)
          .filter((value) => !excludedJudges.has(value))
          .value();
      }

      if (data.filterProjects.value === FilterType.EXCLUDE) {
        const excludeProjects = new Set(selectedProjects);

        projects = _.chain(projectOptions)
          .map((p) => p.value)
          .filter((value) => !excludeProjects.has(value))
          .value();
      }

      await mutateGenerateJudging({
        entity: {
          users,
          projects,
          projectsPerUser: parseInt(data.projectsPerUser),
        },
      });

      handleHide();

      if (flagEnabledMap && !flagEnabledMap["judging"]) {
        showModal("confirmModal");
      }
    })();
  }, [
    handleSubmit,
    mutateGenerateJudging,
    handleHide,
    flagEnabledMap,
    organizerOptions,
    projectOptions,
    showModal,
  ]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FormProvider {...methods}>
      <Modal open={show} onClose={handleHide}>
        <Modal.Header>Assign Projects</Modal.Header>
        <Modal.Body>
          <Grid item>
            <InputLabel id={"filterUsers"} label={"Filter Users"} />
            <Grid container>
              <ControlledRadio
                name={"filterUsers"}
                items={[
                  {
                    type: "option",
                    value: FilterType.INCLUDE,
                    display: "Include",
                  },
                  {
                    type: "option",
                    value: FilterType.EXCLUDE,
                    display: "Exclude",
                  },
                ]}
              />
            </Grid>
          </Grid>
          <Grid item>
            <ControlledSelect
              isMulti
              name={"users"}
              options={organizerOptions}
              as={LabelledSelect}
              id={"users"}
              showError
              label={"Users"}
            />
          </Grid>
          <Grid item mt={1}>
            <InputLabel id={"filterProjects"} label={"Filter Projects"} />
            <Grid container>
              <ControlledRadio
                name={"filterProjects"}
                items={[
                  {
                    type: "option",
                    value: FilterType.INCLUDE,
                    display: "Include",
                  },
                  {
                    type: "option",
                    value: FilterType.EXCLUDE,
                    display: "Exclude",
                  },
                ]}
              />
            </Grid>
          </Grid>
          <Grid item>
            <ControlledSelect
              isMulti
              name={"projects"}
              options={projectOptions}
              as={LabelledSelect}
              id={"projects"}
              showError
              label={"Projects"}
            />
          </Grid>
          <Grid item mt={2}>
            <ControlledInput
              name={"projectsPerUser"}
              placeholder={"Enter the number of projects per organizer"}
              type={"number"}
              as={LabelledInput}
              showError
              id={"projects-per-user"}
              label={"Projects Per User"}
            />
          </Grid>
          <Grid container item mt={2} xs={12} justifyContent={"center"}>
            <Grid item>
              <Button
                onClick={onClickSubmit}
                sx={{
                  borderRadius: "10px",
                }}
              >
                Generate
              </Button>
            </Grid>
          </Grid>
        </Modal.Body>
      </Modal>
    </FormProvider>
  );
};

export default AssignJudgingProjectsModal;
