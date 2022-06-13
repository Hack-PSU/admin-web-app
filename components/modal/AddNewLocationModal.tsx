import { FC } from "react";
import { useModal } from "components/context/ModalProvider";
import { Grid, useTheme } from "@mui/material";
import { Button, LabelledInput, LabelledSelect, Modal } from "components/base";
import { useForm } from "react-hook-form";
import { ISelectItem } from "types/components";

const items: ISelectItem[] = [
  { value: "room", display: "Room" },
  { value: "zoom", display: "Zoom" },
  { value: "discord", display: "Discord" },
];

const AddNewLocationModal: FC = () => {
  const { show, handleHide } = useModal("addNewLocation");
  const { register } = useForm();
  const theme = useTheme();

  return (
    <Modal
      open={show}
      onClose={handleHide}
      position="center"
      alignment="center"
    >
      <Modal.Header>New Location</Modal.Header>
      <Modal.Body alignItems="center">
        <Grid container item>
          <Grid item xs={6}>
            <LabelledInput
              placeholder={"Enter location name"}
              id={"location-name"}
              label={"Name"}
              sx={{
                width: "90%",
                mt: 0.6,
              }}
              inputProps={{
                style: {
                  fontSize: theme.typography.pxToRem(14),
                },
              }}
              {...register("name")}
            />
          </Grid>
          <Grid item xs={6}>
            <LabelledSelect
              items={items}
              sx={{
                width: "90%",
                mt: 0.6,
              }}
              selectInputStyle={{
                fontSize: theme.typography.pxToRem(14),
              }}
              menuWidth={"300px"}
              placeholder={"Select a location type"}
              id={"location-type"}
              label={"Type"}
              {...register("type")}
            />
          </Grid>
        </Grid>
        <Grid item mt={4}>
          <Button variant="text">Submit</Button>
        </Grid>
      </Modal.Body>
    </Modal>
  );
};

export default AddNewLocationModal;
