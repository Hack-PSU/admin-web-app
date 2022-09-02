import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  styled,
  Tab,
  Tabs,
  TabProps,
  TabsProps,
  Grid,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import _ from "lodash";

enum SettingsRoute {
  MEMBERS = "members",
  DEVICES = "devices",
  HACKATHONS = "hackathons",
  PROFILE = "profile",
}

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.border.light}`,
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.sunset.dark,
  },
}));

const StyledTab = styled((props: TabProps) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    fontWeight: 600,
    marginRight: theme.spacing(1),
    color: theme.palette.common.black,
    transition: "color 200ms ease-in-out",
    ":hover": {
      color: theme.palette.sunset.dark,
    },
    "&.Mui-selected": {
      color: theme.palette.sunset.dark,
      opacity: 1,
    },
  })
);

const SettingsTabs: FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const [selected, setSelected] = useState<SettingsRoute>(
    SettingsRoute.MEMBERS
  );

  const currentTab = useMemo(() => {
    return _.last(router.asPath.split("/")) as SettingsRoute;
  }, [router]);

  useEffect(() => {
    if (selected !== currentTab) {
      setSelected(currentTab);
    }
  }, [currentTab, selected]);

  const onChangeTab: TabsProps["onChange"] = useCallback(
    (event: React.SyntheticEvent, newValue: SettingsRoute) => {
      setSelected(newValue);
      void router.push(`/settings/${newValue}`);
    },
    [router]
  );

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <StyledTabs
          value={selected}
          onChange={onChangeTab}
          aria-label={"settings-tabs"}
        >
          <StyledTab label={"Members"} value={SettingsRoute.MEMBERS} />
          <StyledTab label={"Devices"} value={SettingsRoute.DEVICES} />
          <StyledTab label={"Hackathons"} value={SettingsRoute.HACKATHONS} />
          <StyledTab label={"Profile"} value={SettingsRoute.PROFILE} />
        </StyledTabs>
      </Box>
      <Grid item pt={2}>
        {children}
      </Grid>
    </>
  );
};

export default SettingsTabs;
