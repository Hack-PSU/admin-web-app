import { FC } from "react";
import { useModal } from "components/context/ModalProvider";
import { Grid, Box, capitalize } from "@mui/material";
import {
  ControlledInput,
  LabelledInput,
  MenuButton,
  Modal,
} from "components/base";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateEntity,
  createLocation,
  fetch,
  LocationEntity,
  QueryKeys,
} from "api";
import { object } from "superstruct";



import { optional, string } from "superstruct";



import { NonEmptyString } from "common/form";
import { superstructResolver } from "@hookform/resolvers/superstruct";

const schema = object({
  name: NonEmptyString,

  capacity: optional(string())


});

const AddNewLocationModal: FC = () => {
  const { show, handleHide } = useModal("addNewLocation");
  const methods = useForm({
    defaultValues: {
      name: "",
      capacity: ""
    },
    resolver: superstructResolver(schema),
  });

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ entity }: CreateEntity<Omit<LocationEntity, "id">>) =>
      fetch(() => createLocation(entity)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QueryKeys.location.all });
    },
  });

  const handleSubmitAndCreate = () => {
    methods.handleSubmit(async (data) => {

      const capacity = data.capacity && data.capacity.trim() !== '' ? parseInt(data.capacity, 10) : -1;

      await mutateAsync({ entity: { name: data.name, capacity } });
      methods.reset();

    })();
  };

  const handleSubmit = () => {
    methods.handleSubmit(async (data) => {


      const capacity = data.capacity && data.capacity.trim() !== '' ? parseInt(data.capacity, 10) : -1;

      await mutateAsync({ entity: { name: data.name, capacity } });
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

          <Grid item xs={12}>
            <ControlledInput
              name={"capacity"}
              placeholder={"Enter capacity"}
              as={LabelledInput}
              label={"Capacity (leave blank if room is not for hackers)"}
              id={"capacity"}
              showError
              type="number"
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
                  loading={isPending}
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

export default AddNewLocationModal;
