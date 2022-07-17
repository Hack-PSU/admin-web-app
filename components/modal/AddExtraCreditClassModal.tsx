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
import { CreateEntity, fetch, QueryKeys } from "api";
import {
  createExtraCreditClass,
  IExtraCreditClassCreateEntity,
  IExtraCreditClassEntity,
} from "api/extra_credit";

const schema = object({
  name: NonEmptyString,
});

const AddExtraCreditClassModal: FC = () => {
  const { show, handleHide } = useModal("addExtraCreditClass");

  const queryClient = useQueryClient();
  const methods = useForm({
    defaultValues: {
      name: "",
    },
    resolver: superstructResolver(schema),
  });

  const { mutateAsync, isLoading } = useMutation(
    QueryKeys.extraCreditClass.createOne(),
    ({ entity }: CreateEntity<IExtraCreditClassCreateEntity>) =>
      fetch(() => createExtraCreditClass(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.extraCreditClass.all);
      },
    }
  );

  const handleSubmit = () => {
    methods.handleSubmit(async (data) => {
      await mutateAsync({ entity: { className: data.name } });
      handleHide();
    })();
  };

  const handleSubmitAndCreate = () => {
    methods.handleSubmit(async (data) => {
      await mutateAsync({ entity: { className: data.name } });
      methods.reset();
    });
  };

  return (
    <Modal open={show} onClose={handleHide}>
      <FormProvider {...methods}>
        <Modal.Header>Add Class</Modal.Header>
        <Modal.Body>
          <Grid container item>
            <Grid item xs={12}>
              <ControlledInput
                name={"name"}
                placeholder={"Enter a class name"}
                as={LabelledInput}
                showError
                id={"name"}
                label={"Name"}
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

export default AddExtraCreditClassModal;
