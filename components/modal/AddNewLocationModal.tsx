import { FC } from "react";
import { useModal } from "components/context/ModalProvider";
import { Typography } from "@mui/material";
import { Modal } from "components/base";

const AddNewLocationModal: FC = () => {
  const { show, handleHide } = useModal("addNewLocation");

  return (
    <Modal open={show} onClose={handleHide} position="top" alignment="left">
      <Typography>Modal Here</Typography>
    </Modal>
  );
};

export default AddNewLocationModal;
