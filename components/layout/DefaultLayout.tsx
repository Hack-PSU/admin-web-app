import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { WithChildren } from "types/common";
import { Menu } from "components/Menu";

type MenuProviderHooks = {
  open: boolean;
  toggleDrawer(open?: boolean): void;
  shouldHide: boolean;
};

const MenuContext = createContext<MenuProviderHooks>({} as MenuProviderHooks);

const DefaultLayout: FC<WithChildren> = ({ children }) => {
  const theme = useTheme();
  const shouldHide = useMediaQuery(theme.breakpoints.down("lg"));

  const [open, setOpen] = useState<boolean>(true);

  const toggleDrawer = useCallback((open?: boolean) => {
    if (open !== undefined) {
      setOpen(open);
    } else {
      setOpen((open) => !open);
    }
  }, []);

  useEffect(() => {
    if (shouldHide) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [shouldHide]);

  const value = useMemo(
    () => ({
      open,
      toggleDrawer,
      shouldHide,
    }),
    [open, toggleDrawer, shouldHide]
  );

  return (
    <MenuContext.Provider value={value}>
      <Grid
        container
        sx={{
          overflow: "hidden",
          height: "100vh",
        }}
      >
        <Grid
          item
          sx={{ overflow: "auto", width: open ? "20%" : 0, height: "100vh" }}
        >
          <Menu
            open={open}
            shouldClose={shouldHide}
            handleClose={toggleDrawer}
          />
        </Grid>
        <Grid
          item
          sx={{
            width: open ? "80%" : "100%",
            flexGrow: 1,
            overflow: "auto",
            height: "100vh",
            padding: theme.spacing(3, 4),
          }}
        >
          {children}
        </Grid>
      </Grid>
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
export default DefaultLayout;
