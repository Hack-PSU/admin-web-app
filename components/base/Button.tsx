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
          backgroundColor: "button.grey",
          borderRadius: "15px",
          padding: theme.spacing(1, 5),
          fontSize: theme.typography.pxToRem(16),
          ":hover": {
            backgroundColor: darken(theme.palette.button.grey, 0.05),
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

export const GradientButton: FC<IButtonProps> = ({
  children,
  sx,
  textProps,
  ...props
}) => {
  const theme = useTheme();
  const [hover, setHover] = useState<boolean>(false);

  const { sx: textPropsSx, ...restTextProps } = textProps ?? { sx: {} };

  return (
    <BaseButton
      sx={{
        textTransform: "none",
        color: "common.white",
        fontWeight: "bold",
        borderRadius: "15px",
        padding: theme.spacing(1, 5),
        background: theme.palette.gradient.angled.accent,
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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
          zIndex: 2,
          ...textPropsSx,
        }}
        {...restTextProps}
      >
        {children}
      </Typography>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "sunset.dark",
          width: hover ? "100%" : 0,
          height: "100%",
          transition: "width 100ms ease-in-out",
          zIndex: 1,
        }}
      />
    </BaseButton>
  );
};

export default Button;
