import React, { FC } from "react";
import { useModal } from "components/context";
import { Modal } from "components/base";

const AddNewSponsorModal: FC = () => {
  const { show, handleHide } = useModal("addNewSponsor");

  return (
    <Modal open={show} onClose={handleHide}>
      <Modal.Header>Add Sponsor</Modal.Header>
      <Modal.Body></Modal.Body>
    </Modal>
  );
};

export default AddNewSponsorModal;
