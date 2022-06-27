import React, { FC, useState } from "react";
import {
  Box,
  Button as BaseButton,
  ButtonProps,
  darken,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";
import { EvaIcon } from "components/base";

interface IMenuButtonProps extends Omit<ButtonProps, "ref" | "touchRippleRef"> {
  textProps?: Omit<TypographyProps, "children" | "variant" | "ref">;
  menuItems: { label: string; icon?: React.ReactNode; onClick(): void }[];
}

const MenuButton: FC<IMenuButtonProps> = ({
  menuItems,
  children,
  textProps,
  ...props
}) => {
  const theme = useTheme();
  const { sx: textPropsSx, ...rest } = textProps ?? { sx: {} };

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container>
      <Grid item xs={9}>
        <BaseButton
          {...props}
          sx={{
            width: "100%",
            height: "100%",
            textTransform: "none",
            color: "common.black",
            fontWeight: "bold",
            backgroundColor: "button.light",
            borderRadius: "15px 0 0 15px",
            padding: theme.spacing(1, 5),
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
        </BaseButton>
      </Grid>
      <Grid
        item
        xs={3}
        sx={{ borderLeft: `2px solid ${theme.palette.border.light}` }}
      >
        <IconButton
          disableRipple
          sx={{
            height: "100%",
            width: "100%",
            backgroundColor: "button.light",
            borderRadius: "0 15px 15px 0",
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
        <Menu
          open={open}
          anchorEl={anchorEl}
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
                handleClose();
              }}
              disableRipple
            >
              {icon ? icon : null}
              {label}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
    </Grid>
  );
};

export default MenuButton;
