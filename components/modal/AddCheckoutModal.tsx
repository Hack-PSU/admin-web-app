import React, { FC } from "react";
import { useModal } from "components/context";
import {
  Button,
  ControlledInput,
  ControlledSelect,
  LabelledInput,
  LabelledSelect,
  Modal,
} from "components/base";
import { useForm, FormProvider } from "react-hook-form";
import { Grid } from "@mui/material";
import { object, refine, string, union } from "superstruct";
import {
  Email,
  FormErrorCode,
  NonEmptyNumber,
  NonEmptySelect,
} from "common/form";
import { superstructResolver } from "@hookform/resolvers/superstruct";

// @ts-ignore
import isEmail from "is-email";

const schema = object({
  checkoutItem: NonEmptySelect,
  quantity: NonEmptyNumber,
  userInfo: refine(
    union([Email, string()]),
    "NonEmptyUnion",
    (value) => isEmail(value) || !!value || FormErrorCode.empty
  ),
});

const AddCheckoutModal: FC = () => {
  const { show, handleHide } = useModal("addCheckout");
  const methods = useForm({
    defaultValues: {
      checkoutItem: [],
      quantity: 0,
      userInfo: "",
    },
    resolver: superstructResolver(schema),
  });

  const onSubmit = () => {
    methods.handleSubmit((data) => {
      console.log(data);
    })();
  };

  return (
    <Modal open={show} onClose={handleHide}>
      <FormProvider {...methods}>
        <Modal.Header>Create Checkout Request</Modal.Header>
        <Modal.Body>
          <Grid container item spacing={1} justifyContent="center">
            <Grid item xs={6}>
              <ControlledSelect
                name={"checkoutItem"}
                as={LabelledSelect}
                id={"checkout-items"}
                label={"Item"}
                placeholder={"Select an item"}
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
            <Grid item xs={12}>
              <ControlledInput
                name={"userInfo"}
                placeholder={"Enter user pin or email"}
                as={LabelledInput}
                id={"user-info"}
                label={"User"}
                showError
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                onClick={onSubmit}
                sx={{
                  width: "100%",
                  mt: 2,
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Modal.Body>
      </FormProvider>
    </Modal>
  );
};

export default AddCheckoutModal;
