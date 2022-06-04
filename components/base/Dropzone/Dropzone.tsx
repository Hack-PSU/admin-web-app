import { FC, useCallback } from "react";
import { Grid, styled, Typography, useTheme } from "@mui/material";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { blue } from "@mui/material/colors";
import EvaIcon from "components/base/EvaIcon";
import { InputLabel } from "components/base/Input";
import {
  ControlledDropzoneProps,
  IDropzoneProps,
  LabelledDropzoneProps,
} from "types/components";
import { useController } from "react-hook-form";

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
      <Grid item>
        <EvaIcon
          name={"cloud-upload-outline"}
          size="xlarge"
          fill="#1a1a1a"
          style={{ transform: "scale(1.6)" }}
        />
      </Grid>
      <Grid item>
        <Typography
          variant="h6"
          sx={{ color: "common.black", fontWeight: 700 }}
        >
          Drag &amp; Drop Images Here
        </Typography>
      </Grid>
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
  ...props
}) => {
  const {
    field: { onChange, value },
  } = useController({ name, rules, defaultValue });

  const onDropFile: DropzoneOptions["onDrop"] = (acceptedFiles) => {
    onChange([...(value ?? []), ...acceptedFiles]);
  };

  if (Component) {
    return <Component onDrop={onDropFile} {...props} />;
  }

  return <Dropzone onDrop={onDropFile} {...props} />;
};

export default Dropzone;
