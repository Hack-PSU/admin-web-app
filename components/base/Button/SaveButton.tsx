import React, { FC } from "react";
import {
  ButtonProps,
  CircularProgress,
  darken,
  lighten,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";

export interface ISaveButtonProps
  extends Omit<LoadingButtonProps, "ref" | "touchRippleRef"> {
  textProps?: Omit<TypographyProps, "children" | "variant" | "ref">;
  isDirty?: boolean;
  progressColor?: string;
}

const SaveButton: FC<ISaveButtonProps> = ({
  isDirty,
  textProps,
  children,
  progressColor,
  ...props
}) => {
  const theme = useTheme();

  return (
    <LoadingButton
      loadingPosition={"start"}
      disabled={!isDirty}
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
        backgroundColor: isDirty ? "common.black" : "transparent",
        border: isDirty
          ? `2px solid transparent`
          : `2px solid ${theme.palette.common.black}`,
        ":hover": {
          backgroundColor: isDirty
            ? lighten(theme.palette.common.black, 0.05)
            : undefined,
        },
        ...(props.sx ?? {}),
      }}
      loadingIndicator={
        <CircularProgress
          size="1.2rem"
          sx={{ ml: 1, color: progressColor ?? "common.white" }}
        />
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
          color: isDirty ? "common.white" : "common.black",
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
