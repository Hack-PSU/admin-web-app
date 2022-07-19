import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  Box,
  Grid,
  GridProps,
  IconButton,
  Modal as BaseModal,
  styled,
  SxProps,
  Theme,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";
import { WithChildren } from "types/common";
import EvaIcon from "components/base/EvaIcon";

interface IModalProps {
  open: boolean;
  onClose(): void;
  sx?: SxProps<Theme>;
  position?: "top" | "center" | "bottom";
  alignment?: "left" | "center" | "right";
}

type ModalBodyProps = Required<WithChildren> & GridProps;

type ModalHeaderProps = Required<WithChildren> &
  TypographyProps & {
    closeButtonStyle?: SxProps<Theme>;
  };

type ModalComponent = FC<WithChildren<IModalProps>>;

type ModalSubComponents = {
  Body: FC<ModalBodyProps>;
  Header: FC<ModalHeaderProps>;
};

type ModalFC = ModalComponent & ModalSubComponents;

const Container = styled(Grid)(({ theme }) => ({
  position: "absolute",
  backgroundColor: "white",
  width: "50%",
  boxShadow: theme.shadows[1],
  padding: theme.spacing(3, 3.5),
  borderRadius: "15px",
}));

type LocalModalProviderHooks = Pick<IModalProps, "open" | "onClose">;

const LocalModalContext = createContext<LocalModalProviderHooks>(
  {} as LocalModalProviderHooks
);

const Modal: ModalFC = ({ children, open, onClose, ...props }) => {
  const value = useMemo(
    () => ({
      open,
      onClose,
    }),
    [open, onClose]
  );

  return (
    <LocalModalContext.Provider value={value}>
      <_Modal open={open} onClose={onClose} {...props}>
        {children}
      </_Modal>
    </LocalModalContext.Provider>
  );
};

const _Modal: ModalComponent = ({
  children,
  position = "center",
  alignment = "center",
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
      <Container
        container
        sx={{ ...getBoundary(), ...sx }}
        flexDirection="column"
        gap={2}
      >
        {children}
      </Container>
    </BaseModal>
  );
};

const ModalBody: FC<ModalBodyProps> = ({ children, sx, ...props }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      item
      flexDirection="column"
      justifyContent="flex-start"
      sx={sx}
      {...props}
    >
      {children}
    </Grid>
  );
};

const ModalHeader: FC<ModalHeaderProps> = ({
  children,
  closeButtonStyle,
  variant,
  sx,
  style,
  ...props
}) => {
  const theme = useTheme();
  const { onClose } = useContext(LocalModalContext);

  return (
    <Grid container item justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography
          variant={variant ?? "h5"}
          sx={{
            fontWeight: "bold",
            ...sx,
          }}
          style={{
            fontSize: theme.typography.pxToRem(28),
            ...style,
          }}
          {...props}
        >
          {children}
        </Typography>
      </Grid>
      <Grid item>
        <IconButton
          sx={{
            padding: theme.spacing(0.5, 1),
            ...closeButtonStyle,
          }}
          onClick={onClose}
        >
          <Box mt={0.5}>
            <EvaIcon name={"close-outline"} size="large" fill="#1a1a1a" />
          </Box>
        </IconButton>
      </Grid>
    </Grid>
  );
};

Modal.Body = ModalBody;
Modal.Header = ModalHeader;

export default Modal;
