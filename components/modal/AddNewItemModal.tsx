import React, { FC } from "react";
import {
  Button,
  ControlledInput,
  EvaIcon,
  LabelledInput,
  MenuButton,
  Modal,
} from "components/base";
import { useModal } from "components/context";
import { Box, Grid } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { object } from "superstruct";
import { NonEmptyNumber, NonEmptyString } from "common/form";
import { superstructResolver } from "@hookform/resolvers/superstruct";

const schema = object({
  name: NonEmptyString,
  quantity: NonEmptyNumber,
});

const AddNewItemModal: FC = () => {
  const { show, handleHide } = useModal("addNewItem");
  const methods = useForm({
    defaultValues: {
      name: "",
      quantity: 0,
    },
    resolver: superstructResolver(schema),
  });

  const onSubmit = () => {
    methods.handleSubmit((data) => {
      console.log(data);
    })();
  };

  const handleSubmitAndCreate = () => {
    methods.handleSubmit((data) => {
      // perform API submission
      methods.reset();
    })();
  };

  return (
    <Modal open={show} onClose={handleHide}>
      <FormProvider {...methods}>
        <Modal.Header>Add New Item</Modal.Header>
        <Modal.Body>
          <Grid container item spacing={1.5}>
            <Grid item xs={6}>
              <ControlledInput
                name={"name"}
                placeholder={"Enter an item name"}
                as={LabelledInput}
                id="name"
                label={"Name"}
                showError
              />
            </Grid>
            <Grid item xs={6}>
              <ControlledInput
                name={"quantity"}
                placeholder={"Enter a quantity"}
                type="number"
                as={LabelledInput}
                id={"quantity"}
                label={"Quantity"}
                showError
              />
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
                    menuItems={[
                      {
                        label: "Submit and Create",
                        onClick: handleSubmitAndCreate,
                      },
                    ]}
                    onClick={onSubmit}
                  >
                    Submit
                  </MenuButton>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Modal.Body>
      </FormProvider>
    </Modal>
  );
};

export default AddNewItemModal;
