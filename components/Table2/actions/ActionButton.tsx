import React, { FC, useState } from "react";
import { Button, EvaIcon } from "components/base";
import { Box, PaperProps, Popover, useTheme } from "@mui/material";
import { WithChildren } from "types/common";

interface IActionButtonProps {
  type: "filter" | "sort";
  title: string;
  menuProps?: PaperProps;
  icon: string;
}

const ActionButton: FC<WithChildren<IActionButtonProps>> = ({
  icon,
  menuProps,
  children,
  type,
  title,
}) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const id = open ? `action-${type}-popover` : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-describedby={id}
        startIcon={
          <Box pt={0.5}>
            <EvaIcon name={icon} size="medium" fill="#1a1a1a" />
          </Box>
        }
        sx={{
          lineHeight: "1.5rem",
          alignItems: "center",
          borderRadius: "10px",
          padding: theme.spacing(0.5, 2),
          width: "90%",
        }}
        textProps={{
          sx: {
            fontSize: theme.typography.pxToRem(14),
          },
        }}
        onClick={handleClick}
      >
        {title}
      </Button>
      <Popover
        id={id}
        open={open}
        keepMounted
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          ...menuProps,
          sx: {
            boxShadow: 1,
            borderRadius: "10px",
            width: 350,
            ...(menuProps ? menuProps.sx : {}),
          },
        }}
      >
        {children}
      </Popover>
    </>
  );
};

export default ActionButton;
