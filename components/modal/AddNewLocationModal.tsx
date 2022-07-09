import { FC } from "react";
import { useModal } from "components/context/ModalProvider";
import { Grid, Box } from "@mui/material";
import {
  ControlledInput,
  LabelledInput,
  MenuButton,
  Modal,
} from "components/base";
import { useForm, FormProvider } from "react-hook-form";
import { ISelectItem } from "types/components";
import { useMutation, useQueryClient } from "react-query";
import {
  CreateEntity,
  createLocation,
  fetch,
  ILocationEntity,
  ILocationUpdateEntity,
  QueryKeys,
} from "api";
import { object } from "superstruct";
import { NonEmptyString } from "common/form";
import { superstructResolver } from "@hookform/resolvers/superstruct";

const schema = object({
  name: NonEmptyString,
});

const AddNewLocationModal: FC = () => {
  const { show, handleHide } = useModal("addNewLocation");
  const methods = useForm({
    defaultValues: {
      name: "",
    },
    resolver: superstructResolver(schema),
  });

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    QueryKeys.location.createOne(),
    ({ entity }: CreateEntity<ILocationUpdateEntity>) =>
      fetch(() => createLocation(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.location.all);
      },
    }
  );

  const handleSubmitAndCreate = () => {
    methods.handleSubmit(async (data) => {
      await mutateAsync({ entity: { locationName: data.name } });
      methods.reset();
    })();
  };

  const handleSubmit = () => {
    methods.handleSubmit(async (data) => {
      await mutateAsync({ entity: { locationName: data.name } });
      handleHide();
    })();
  };

  return (
    <Modal open={show} onClose={handleHide}>
      <FormProvider {...methods}>
        <Modal.Header>New Location</Modal.Header>
        <Modal.Body alignItems="center">
          <Grid container item>
            <Grid item xs={12}>
              <ControlledInput
                name={"name"}
                placeholder={"Enter location name"}
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

export default AddNewLocationModal;
