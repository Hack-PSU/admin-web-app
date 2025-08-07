import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Grid, useMediaQuery, useTheme, IconButton, AppBar, Toolbar } from "@mui/material";
import { EvaIcon } from "components/base";
import { Menu } from "components/Menu";
import { WithChildren } from "common/types";

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
        {shouldHide && (
          <AppBar
            position="fixed"
            sx={{
              zIndex: theme.zIndex.drawer + 1,
              backgroundColor: "background.light",
              boxShadow: 1,
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                onClick={() => toggleDrawer()}
                sx={{
                  color: "common.black",
                }}
              >
                <EvaIcon name="menu-outline" />
              </IconButton>
            </Toolbar>
          </AppBar>
        )}
        <Grid
          item
          sx={{ 
            overflow: "auto", 
            width: shouldHide ? (open ? "80%" : 0) : (open ? "20%" : 0), 
            height: "100vh" 
          }}
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
            width: shouldHide 
              ? (open ? "20%" : "100%") 
              : (open ? "80%" : "100%"),
            flexGrow: 1,
            overflow: "auto",
            height: "100vh",
            padding: shouldHide 
              ? theme.spacing(10, 2, 3, 2)
              : theme.spacing(3, 4),
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
