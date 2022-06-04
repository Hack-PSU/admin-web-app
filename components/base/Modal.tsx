import { FC, useCallback } from "react";
import {
  Grid,
  Modal as BaseModal,
  styled,
  SxProps,
  Theme,
} from "@mui/material";
import { WithChildren } from "types/common";

interface IModalProps {
  open: boolean;
  onClose(): void;
  sx?: SxProps<Theme>;
  position: "top" | "center" | "bottom";
  alignment: "left" | "center" | "right";
}

const Container = styled(Grid)(({ theme }) => ({
  position: "absolute",
  backgroundColor: "white",
  width: "50%",
  boxShadow: theme.shadows[2],
  padding: theme.spacing(4),
}));

const Modal: FC<WithChildren<IModalProps>> = ({
  children,
  position,
  alignment,
  open,
  onClose,
  sx,
}) => {
  const getBoundary = useCallback(() => {
    let top = undefined,
      right = undefined,
      bottom = undefined,
      left = undefined;

    switch (position) {
      case "top":
        top = "1%";
        break;
      case "center":
        top = "50%";
        break;
      case "bottom":
        bottom = "1%";
        break;
    }

    switch (alignment) {
      case "left":
        left = "1%";
        break;
      case "center":
        left = "50%";
        break;
      case "right":
        right = "1%";
        break;
    }

    const transform = `translate(${alignment === "center" ? "-50%" : "0"}, ${
      position === "center" ? "-50%" : "0"
    })`;

    return {
      top,
      left,
      right,
      bottom,
      transform,
    };
  }, [position, alignment]);

  return (
    <BaseModal open={open} onClose={onClose}>
      <Container sx={{ ...getBoundary(), ...sx }} flexDirection="column">
        {children}
      </Container>
    </BaseModal>
  );
};

export default Modal;
