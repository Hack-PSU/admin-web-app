import React, { FC, useState, forwardRef } from "react";
import {
  Box,
  Button as BaseButton,
  ButtonProps,
  darken,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";

interface IButtonProps extends Omit<ButtonProps, "ref" | "touchRippleRef"> {
  textProps?: Omit<TypographyProps, "children" | "variant" | "ref">;
}

const Button = forwardRef<any, IButtonProps>(
  ({ children, sx, textProps, ...props }, ref) => {
    const theme = useTheme();
    const { sx: textPropsSx, ...restTextProps } = textProps ?? { sx: {} };

    return (
      <BaseButton
        ref={ref}
        sx={{
          textTransform: "none",
          color: "common.black",
          fontWeight: "bold",
          backgroundColor: "button.light",
          borderRadius: "15px",
          padding: theme.spacing(1, 5),
          fontSize: theme.typography.pxToRem(16),
          ":hover": {
            backgroundColor: darken(theme.palette.button.light, 0.05),
          },
          ...sx,
        }}
        {...props}
      >
        <Typography
          variant={"button"}
          sx={{
            fontSize: theme.typography.pxToRem(16),
            lineHeight: "1.2rem",
            fontWeight: "bold",
            color: "common.black",
            textTransform: "none",
            ...textPropsSx,
          }}
          {...restTextProps}
        >
          {children}
        </Typography>
      </BaseButton>
    );
  }
);
Button.displayName = "Button";

export default Button;
