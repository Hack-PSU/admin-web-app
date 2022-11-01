import React, { FC, useCallback } from "react";
import { Modal, Button } from "components/base";
import { useModal } from "components/context";
import { Grid, lighten, Typography, useTheme } from "@mui/material";

type Props = {
  header: string;
  message: string;
  onCancel?(): void;
  onConfirm?(): void;
};

const ConfirmModal: FC<Props> = ({ header, message, onCancel, onConfirm }) => {
  const theme = useTheme();

  const { show, handleHide } = useModal("confirmModal");

  const onClickCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    handleHide();
  }, [onCancel, handleHide]);

  const onClickConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    handleHide();
  }, [onConfirm, handleHide]);

  return (
    <Modal
      open={show}
      onClose={handleHide}
      sx={{
        width: "30%",
      }}
    >
      <Modal.Header>{header}</Modal.Header>
      <Modal.Body>
        <Grid item xs={12} sx={{ width: "fit-content" }}>
          <Typography variant={"body1"}>{message}</Typography>
        </Grid>
        <Grid container item justifyContent={"center"} spacing={1.8} mt={1.2}>
          <Grid
            item
            sx={{
              ml: "auto",
            }}
          >
            <Button
              onClick={onClickCancel}
              sx={{
                width: "fit-content",
                borderRadius: "8px",
              }}
            >
              Cancel
            </Button>
          </Grid>
          <Grid
            item
            sx={{
              mr: "auto",
              width: "fit-content",
            }}
          >
            <Button
              onClick={onClickConfirm}
              sx={{
                width: "fit-content",
                borderRadius: "8px",
                backgroundColor: "sunset.dark",
                ":hover": {
                  backgroundColor: lighten(theme.palette.sunset.dark, 0.2),
                },
              }}
              textProps={{
                sx: {
                  color: "common.white",
                },
              }}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmModal;
