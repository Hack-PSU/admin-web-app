import { DefaultLayout } from "components/layout";
import { NextPageLayout } from "types/common";
import React from "react";
import SettingsTabs from "./SettingsTabs";
import { Grid, Typography } from "@mui/material";

export function withSettingsLayout<TProps>(page: NextPageLayout<TProps>) {
  page.getLayout = (page) => (
    <DefaultLayout>
      <Grid container flexDirection={"column"} gap={1.5}>
        <Grid item>
          <Typography variant={"h4"} sx={{ fontWeight: 700 }}>
            Settings
          </Typography>
        </Grid>
        <Grid item>
          <SettingsTabs>{page}</SettingsTabs>
        </Grid>
      </Grid>
    </DefaultLayout>
  );

  return page;
}
