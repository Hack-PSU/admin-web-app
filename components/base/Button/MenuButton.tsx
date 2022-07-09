import React, { FC, useRef, useState } from "react";
import {
  Box,
  ButtonGroup,
  ButtonProps,
  darken,
  IconButton,
  lighten,
  Menu,
  MenuItem,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";
import { EvaIcon } from "components/base";
import SaveButton, {
  ISaveButtonProps,
} from "components/base/Button/SaveButton";

type MenuButtonProps = Omit<ButtonProps, "ref" | "touchRippleRef"> &
  Omit<ISaveButtonProps, "children"> & {
    textProps?: Omit<TypographyProps, "children" | "variant" | "ref">;
    menuItems: { label: string; icon?: React.ReactNode; onClick(): void }[];
  };

const MenuButton: FC<MenuButtonProps> = ({
  menuItems,
  children,
  textProps,
  ...props
}) => {
  const theme = useTheme();
  const { sx: textPropsSx, ...rest } = textProps ?? { sx: {} };

  const anchorRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    setIsOpen((open) => !open);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setIsOpen(false);
  };

  return (
    <>
      <ButtonGroup
        sx={{
          borderRadius: "10px",
          "& .MuiButtonGroup-grouped:not(:last-of-type)": {
            border: "none",
            borderRight: `1.8px solid ${lighten(
              theme.palette.common.black,
              0.8
            )}`,
            ":hover": {
              borderRight: `1.8px solid ${lighten(
                theme.palette.common.black,
                0.8
              )}`,
            },
          },
        }}
        ref={anchorRef}
      >
        <SaveButton
          {...props}
          sx={{
            textTransform: "none",
            color: "common.black",
            fontWeight: "bold",
            backgroundColor: "button.light",
            borderRadius: "10px 0 0 10px",
            padding: theme.spacing(1.3, 5),
            fontSize: theme.typography.pxToRem(16),
            ":hover": {
              backgroundColor: darken(theme.palette.button.light, 0.05),
            },
            ...props.sx,
          }}
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
            {...rest}
          >
            {children}
          </Typography>
        </SaveButton>
        <IconButton
          size={"small"}
          disableRipple
          sx={{
            backgroundColor: "button.light",
            borderRadius: "0 10px 10px 0",
            ":hover": {
              backgroundColor: darken(theme.palette.button.light, 0.05),
            },
            ...props.sx,
          }}
          onClick={handleClick}
        >
          <Box mt={0.5}>
            <EvaIcon name={"chevron-down-outline"} />
          </Box>
        </IconButton>
      </ButtonGroup>
      <Menu
        open={isOpen}
        anchorEl={anchorRef.current}
        elevation={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={handleClose}
        sx={{
          borderRadius: "15px",
          mt: theme.spacing(1),
        }}
        PaperProps={{
          sx: {
            boxShadow: 2,
          },
        }}
      >
        {menuItems.map(({ label, icon, onClick }, index) => (
          <MenuItem
            key={`${label}-${index}`}
            onClick={() => {
              onClick();
              setIsOpen(false);
            }}
            disableRipple
          >
            {icon ? icon : null}
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MenuButton;
