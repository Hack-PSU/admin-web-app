import React, { FC, useState } from "react";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
  useTheme,
} from "@mui/material";
import MenuItemIcon from "components/SideMenu/MenuItemIcon";
import Link from "next/link";
import { useRouter } from "next/router";
import { EvaIcon } from "components/base";

interface IBaseMenuItemProps {
  active: boolean;
  collapsible?: boolean;
  label: string;
  icon: string;
  isOpen?: boolean;
  toggleNestedList?(): void;
  onClickLink?(): void;
}

interface IMenuItemProps
  extends Omit<
    IBaseMenuItemProps,
    "active" | "collapsible" | "isOpen" | "toggleNestedList"
  > {
  to: string;
}

interface ICollapsibleMenuItemProps extends IMenuItemProps {
  nestedItems: { label: string; to: string }[];
}

const BaseMenuItem: FC<IBaseMenuItemProps> = ({
  toggleNestedList,
  isOpen,
  label,
  icon,
  collapsible,
  active,
  onClickLink,
}) => {
  return (
    <ListItem disablePadding sx={{ display: "block", mt: 1 }}>
      <ListItemButton
        disableRipple
        disableGutters
        sx={{
          minHeight: 48,
          justifyContent: "center",
          px: 2.3,
          py: 2,
          width: "90%",
          mx: "auto",
          borderRadius: "15px",
          ":hover": {
            backgroundColor: "transparent",
          },
          backgroundColor: active ? "common.white" : "transparent",
          boxShadow: active ? 2 : 0,
        }}
        onClick={
          collapsible && toggleNestedList ? toggleNestedList : onClickLink
        }
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
        {collapsible ? (
          isOpen ? (
            <EvaIcon name={"chevron-up-outline"} />
          ) : (
            <EvaIcon name={"chevron-down-outline"} />
          )
        ) : null}
      </ListItemButton>
    </ListItem>
  );
};

const MenuItem: FC<IMenuItemProps> = ({ to, icon, label }) => {
  const router = useRouter();
  const active = router.pathname === to || router.pathname.startsWith(to);

  return (
    <BaseMenuItem
      icon={icon}
      label={label}
      active={active}
      onClickLink={() => router.push(to)}
    />
  );
};

export const CollapsibleMenuItem: FC<ICollapsibleMenuItemProps> = ({
  label,
  icon,
  to,
  nestedItems,
}) => {
  const router = useRouter();
  const active = router.pathname === to || router.pathname.startsWith(to);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleNestedList = () => {
    setIsOpen((open) => !open);
  };

  const theme = useTheme();

  return (
    <>
      <BaseMenuItem
        active={active}
        label={label}
        icon={icon}
        collapsible
        toggleNestedList={toggleNestedList}
        isOpen={isOpen}
      />
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ mt: active ? 1 : 0 }}>
          {nestedItems.map((item, index) => (
            <Link href={item.to} passHref key={`${item.to}-${index}`}>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  disableGutters
                  disableRipple
                  sx={{
                    px: 2.3,
                    py: 1,
                    width: "70%",
                    mx: "auto",
                    borderLeft: `2px solid ${
                      router.pathname === item.to
                        ? theme.palette.sunset.dark
                        : theme.palette.border.light
                    }`,
                    ":hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        color: "common.black",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default MenuItem;
