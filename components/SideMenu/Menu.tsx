import { FC, useEffect, useState } from "react";
import { Drawer, Grid, List, styled, Typography } from "@mui/material";
import MenuItem from "components/SideMenu/MenuItem";
import Image from "next/image";
import Logo from "assets/images/logo.svg";

const DrawerHeader = styled(Grid)(({ theme }) => ({
  alignItems: "center",
  justifyContent: "flex-start",
  padding: theme.spacing(3.5, 3, 1),
}));

interface IMenuProps {
  open: boolean;
  shouldClose: boolean;
  handleClose(): void;
}

const Menu: FC<IMenuProps> = ({ open, shouldClose, handleClose }) => {
  return (
    <Drawer
      variant="persistent"
      open={open}
      onClose={handleClose}
      ModalProps={{
        keepMounted: shouldClose,
      }}
      sx={{
        backgroundColor: "background.light",
        width: "20%",
      }}
      PaperProps={{
        sx: {
          width: "20%",
          borderRight: "none",
          backgroundColor: "background.light",
        },
      }}
    >
      <DrawerHeader container>
        <Grid item sx={{ mr: 1.5 }}>
          <Image src={Logo} alt="hackpsu-logo" width={55} height={55} />
        </Grid>
        <Grid item>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Fall 2021
          </Typography>
        </Grid>
      </DrawerHeader>
      <List>
        <MenuItem icon={"people-outline"} label={"Hackers"} to={"/hackers"} />
        <MenuItem icon={"calendar-outline"} label={"Events"} to={"/events"} />
        <MenuItem icon={"pin-outline"} label={"Locations"} to={"/locations"} />
        <MenuItem
          icon={"award-outline"}
          label={"Extra Credit"}
          to={"/extra-credit"}
        />
        <MenuItem
          icon={"shopping-cart-outline"}
          label={"Item Checkout"}
          to={"/checkout"}
        />
        <MenuItem
          icon={"bar-chart-2-outline"}
          label={"Analytics"}
          to={"/analytics"}
        />
        <MenuItem
          icon={"gift-outline"}
          label={"Sponsorship"}
          to={"/sponsorship"}
        />
        <MenuItem icon={"star-outline"} label={"Judging"} to={"/judging"} />
      </List>
    </Drawer>
  );
};

export default Menu;
