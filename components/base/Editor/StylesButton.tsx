import { lighten, styled } from "@mui/material";
import { Button } from "components/base";

const StylesButton = styled(Button)<{ isActive: boolean }>(
  ({ theme, isActive }) => ({
    padding: theme.spacing(0.2),
    height: 28,
    width: 25,
    minWidth: 25,
    borderRadius: "5px",
    borderColor: theme.palette.common.black,
    ":hover": {
      backgroundColor: !isActive
        ? lighten(theme.palette.common.black, 0.95)
        : lighten(theme.palette.common.black, 0.9),
      borderColor: theme.palette.common.black,
    },
    userSelect: "none",
    backgroundColor: isActive
      ? lighten(theme.palette.common.black, 0.9)
      : "transparent",
  })
);

export default StylesButton;
