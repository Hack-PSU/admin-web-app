import { FC, useCallback } from "react";
import { Grid, styled, useTheme } from "@mui/material";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { blue } from "@mui/material/colors";
import { InputLabel } from "components/base/Input";
import {
  ControlledDropzoneProps,
  IDropzoneProps,
  LabelledDropzoneProps,
} from "types/components";
import { useController } from "react-hook-form";
import DropzonePlaceholder from "./DropzonePlaceholder";

const Container = styled(Grid)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(6, 2),
  borderRadius: "10px",
  backgroundColor: "white",
  transition: "border 200ms ease-in-out",
  color: theme.palette.menu.accent,
  outline: "none",
}));

const extractColorHex = (color: string) => color.split("#")[1];

const Dropzone: FC<IDropzoneProps> = ({
  containerStyle,
  accept,
  custom,
  children,
  ...dropzoneOptions
}) => {
  const { getRootProps, getInputProps, isFocused, isDragReject, isDragAccept } =
    useDropzone({
      accept: accept ?? {
        "image/*": [],
      },
      ...dropzoneOptions,
    });

  const theme = useTheme();

  const borderColor = isFocused
    ? blue.A700
    : isDragAccept
    ? theme.palette.success.main
    : isDragReject
    ? theme.palette.error.main
    : theme.palette.input.border;

  const getStrokeStyle = useCallback(() => {
    return `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' \
    xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' \
    fill='none' rx='10' ry='10' stroke='%23${extractColorHex(
      borderColor
    ).toUpperCase()}FF' \
    stroke-width='4' stroke-dasharray='10%2c 10%2c 10' stroke-dashoffset='30' \
    stroke-linecap='square'/%3e%3c/svg%3e")`;
  }, [borderColor]);

  return (
    <Container
      {...getRootProps()}
      sx={{
        borderColor,
        cursor: "pointer",
        backgroundImage: getStrokeStyle(),
        ...containerStyle,
      }}
      container
      gap={1.5}
    >
      <input {...getInputProps()} />
      {!custom ? <DropzonePlaceholder /> : children}
    </Container>
  );
};

export const LabelledDropzone: FC<LabelledDropzoneProps> = ({
  id,
  label,
  showError,
  error,
  ...props
}) => {
  return (
    <>
      <InputLabel id={id} label={label} showError={showError} error={error} />
      <Dropzone {...props} />
    </>
  );
};

export const ControlledDropzone: FC<ControlledDropzoneProps> = ({
  as: Component,
  name,
  rules,
  defaultValue,
  replace,
  ...props
}) => {
  const {
    field: { onChange, value },
  } = useController({ name, rules, defaultValue });

  const onDropFile: DropzoneOptions["onDrop"] = (acceptedFiles) => {
    if (replace) {
      onChange([...acceptedFiles]);
    } else {
      onChange([...(value ?? []), ...acceptedFiles]);
    }
  };

  if (Component) {
    return <Component onDrop={onDropFile} {...props} />;
  }

  return <Dropzone onDrop={onDropFile} {...props} />;
};

export default Dropzone;
