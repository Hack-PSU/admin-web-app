import React, { FC } from "react";
import {
  Button as BaseButton,
  ButtonProps,
  darken,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";

interface IButtonProps extends ButtonProps {
  textProps?: Omit<TypographyProps, "children" | "variant">;
}

const Button: FC<IButtonProps> = ({ children, sx, textProps, ...props }) => {
  const theme = useTheme();
  const { sx: textPropsSx, ...restTextProps } = textProps ?? { sx: {} };

  return (
    <BaseButton
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
};

export default Button;
