import React, { FC } from "react";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import MenuItemIcon from "components/SideMenu/MenuItemIcon";
import Link from "next/link";
import { useRouter } from "next/router";

interface IMenuItemProps {
  icon: string;
  label: string;
  to: string;
}

const MenuItem: FC<IMenuItemProps> = ({ to, icon, label }) => {
  const router = useRouter();
  const active = router.pathname === to || router.pathname.startsWith(to);

  return (
    <Link href={to} passHref>
      <ListItem disablePadding sx={{ display: "block", mt: 1 }}>
        <ListItemButton
          disableRipple
          disableGutters
          sx={{
            minHeight: 48,
            justifyContent: "center",
            px: 2.3,
            py: 2,
            backgroundColor: active ? "common.white" : "transparent",
            boxShadow: active ? 2 : 0,
            width: "90%",
            mx: "auto",
            borderRadius: "15px",
            ":hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <MenuItemIcon icon={icon} />
          <ListItemText
            primary={label}
            primaryTypographyProps={{
              sx: {
                color: "common.black",
                fontSize: "1.05rem",
                fontFamily: "Inter",
                fontWeight: 700,
              },
            }}
          />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default MenuItem;
