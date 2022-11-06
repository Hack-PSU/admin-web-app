import React, { FC, useCallback } from "react";
import {
  Button,
  ControlledInput,
  ControlledRadio,
  ControlledSelect,
  InputLabel,
  LabelledInput,
  LabelledRadio,
  LabelledSelect,
  Loading,
  Modal,
} from "components/base";
import { useModal, useModalContext } from "components/context";
import { useForm, FormProvider } from "react-hook-form";
import { Grid } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateEntity,
  fetch,
  generateJudging,
  getAllAppFlags,
  getAllOrganizers,
  IGenerateJudgingEntity,
  QueryKeys,
} from "api";
import { useSnackbar } from "notistack";
import _ from "lodash";
import { IOption } from "types/components";
import { AxiosError } from "axios";

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
      judges: [] as IOption[],
      filter: { value: FilterType.EXCLUDE },
      projectsPerOrganizer: "2",
    },
  });

  const { data: organizerOptions } = useQuery(
    QueryKeys.organizer.findAll(),
    () => fetch(getAllOrganizers),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            value: d.email,
            label: `${d.firstname} ${d.lastname}`.trim(),
          }));
        }
      },
    }
  );

  const { mutateAsync: mutateGenerateJudging } = useMutation(
    ({ entity }: CreateEntity<IGenerateJudgingEntity>) =>
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
      const selectedJudges = _.map(data.judges, "value");

      let judges = selectedJudges;

      if (data.filter.value === FilterType.EXCLUDE) {
        // if filter type is exclude, make selectedJudges the excluding filter
        const excludedJudges = new Set(selectedJudges);

        judges = _.chain(organizerOptions)
          .map((o) => o.value)
          .filter((value) => !excludedJudges.has(value))
          .value();
      }

      await mutateGenerateJudging({
        entity: {
          judges,
          projectsPerOrganizer: parseInt(data.projectsPerOrganizer),
        },
      });

      if (flagEnabledMap && !flagEnabledMap["judging"]) {
        showModal("confirmModal");
      }
    })();
  }, [
    handleSubmit,
    mutateGenerateJudging,
    flagEnabledMap,
    organizerOptions,
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
            <InputLabel id={"filter"} label={"Filter"} />
            <Grid container>
              <ControlledRadio
                name={"filter"}
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
              name={"judges"}
              options={organizerOptions}
              as={LabelledSelect}
              id={"judges"}
              showError
              label={"Judges"}
            />
          </Grid>
          <Grid item mt={2}>
            <ControlledInput
              name={"projectsPerOrganizer"}
              placeholder={"Enter the number of projects per organizer"}
              type={"number"}
              as={LabelledInput}
              showError
              id={"projects-per-organizer"}
              label={"Projects Per Organizer"}
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
