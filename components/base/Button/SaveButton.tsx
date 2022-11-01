import React, { FC } from "react";
import {
  CircularProgress,
  lighten,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";

export interface ISaveButtonProps
  extends Omit<LoadingButtonProps, "ref" | "touchRippleRef"> {
  textProps?: Omit<TypographyProps, "children" | "variant" | "ref">;
}

const SaveButton: FC<ISaveButtonProps> = ({
  textProps,
  children,
  ...props
}) => {
  const theme = useTheme();

  return (
    <LoadingButton
      loadingPosition={"start"}
      disabled={props.loading}
      sx={{
        textTransform: "none",
        color: "common.black",
        fontWeight: "bold",
        backgroundColor: "button.light",
        borderRadius: "15px",
        padding: theme.spacing(1, 5),
        fontSize: theme.typography.pxToRem(16),
        width: "100%",
        borderRadius: "15px",
        backgroundColor: "common.black",
        border: `2px solid transparent`,
        ":hover": {
          backgroundColor: lighten(theme.palette.common.black, 0.05),
        },
        ...(props.sx ?? {}),
      }}
      loadingIndicator={
        <CircularProgress size="1.2rem" sx={{ ml: 1, color: "common.white" }} />
      }
      {...props}
    >
      <Typography
        variant={"button"}
        {...textProps}
        sx={{
          fontSize: theme.typography.pxToRem(16),
          lineHeight: "1.2rem",
          fontWeight: "bold",
          color: "common.black",
          textTransform: "none",
          color: "common.white",
          lineHeight: "1.3rem",
          ...(textProps ? textProps.sx : {}),
        }}
      >
        {children}
      </Typography>
    </LoadingButton>
  );
};

export default SaveButton;
