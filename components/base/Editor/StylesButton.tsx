import { lighten, styled } from "@mui/material";
import { Button } from "components/base";

const StylesButton = styled(Button)<{ isActive: boolean }>(
  ({ theme, isActive }) => ({
    padding: theme.spacing(2),
    height: 28,
    width: 25,
    minWidth: 25,
    borderRadius: "5px",
    border: "none",
    ":hover": {
      backgroundColor: !isActive
        ? lighten(theme.palette.common.black, 0.95)
        : lighten(theme.palette.common.black, 0.9),
      border: "none",
    },
    userSelect: "none",
    backgroundColor: isActive
      ? lighten(theme.palette.common.black, 0.9)
      : "transparent",
    ":disabled": {
      borderColor: theme.palette.common.black,
    },
  })
);

export default StylesButton;
