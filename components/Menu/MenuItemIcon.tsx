import { FC } from "react";
import { Box, ListItemIcon, useTheme } from "@mui/material";
import { EvaIcon } from "components/base";

interface IMenuItemIcon {
  icon: string;
}

const MenuItemIcon: FC<IMenuItemIcon> = ({ icon }) => {
  const theme = useTheme();

  return (
    <ListItemIcon
      sx={{
        minWidth: 0,
        width: 35,
        height: 35,
        mr: 2,
        justifyContent: "center",
        alignItems: "center",
        background: theme.palette.gradient.angled.accent,
        borderRadius: "10px",
        p: 1.2,
      }}
    >
      <Box mt={0.4}>
        <EvaIcon
          name={icon}
          size="medium"
          style={{ transform: "scale(1.4)" }}
          fill={theme.palette.common.white}
        />
      </Box>
    </ListItemIcon>
  );
};

export default MenuItemIcon;
