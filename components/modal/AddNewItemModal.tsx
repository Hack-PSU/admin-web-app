import React, { FC } from "react";
import { Modal } from "components/base";
import { useModal } from "components/context";

const AddNewItemModal: FC = () => {
  const { show, handleHide } = useModal("addNewItem");

  return <Modal open={show} onClose={handleHide}></Modal>;
};

export default AddNewItemModal;
