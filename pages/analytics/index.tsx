import React, { useMemo } from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Grid, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetch, getAnalyticsSummary, QueryKeys } from "api";
import { Pie } from "components/Charts";
import { ChartContainer, RegistrationBarLine } from "components/analytics";
import { ParentSizeModern } from "@visx/responsive";

const AnalyticsPage: NextPage = () => {
  const theme = useTheme();

  const { data } = useQuery(QueryKeys.analytics.findAll(), () =>
    fetch(getAnalyticsSummary)
  );

  const registrationsByHackathon = useMemo(() => {
    if (data) {
      return data.registrations;
    }
    return [];
  }, [data]);

  const allGenders = useMemo(() => {
    if (data) {
      return data.gender;
    }
    return [];
  }, [data]);

  const raceEthnicity = useMemo(() => {
    if (data) {
      return data.race;
    }
    return [];
  }, [data]);

  const allYears = useMemo(() => {
    if (data) {
      return data.academicYear;
    }
    return [];
  }, [data]);

  const codingExp = useMemo(() => {
    if (data) {
      return data.codingExp;
    }
  }, [data]);

  const growthByHackathon = useMemo(() => {
    if (registrationsByHackathon) {
      const growth: { [name: string]: number } = {};

      registrationsByHackathon.reduce((prev, curr, index) => {
        if (index === 0) {
          growth[curr.name] = 0;
        } else {
          growth[curr.name] = ((curr.count - prev) / (prev ?? 1)) * 100;
        }

        return curr.count;
      }, 0);

      return growth;
    }
  }, [registrationsByHackathon]);

  return (
    <Grid container gap={1.5} flexDirection="column">
      <Grid container item justifyContent="space-between" alignItems="center">
        <Grid item xs={9.7}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Analytics
          </Typography>
        </Grid>
      </Grid>
      <Grid container item spacing={2}>
        <Grid item xs={12}>
          <ChartContainer title={"Registrations"}>
            <ParentSizeModern>
              {({ width }) => (
                <RegistrationBarLine
                  barKey={"registrations-bar"}
                  lineKey={"registrations-line"}
                  data={registrationsByHackathon ?? []}
                  growth={growthByHackathon ?? {}}
                  width={width}
                  height={350}
                  getXScale={(item) => item.name}
                  getYScale={(item) => item.count}
                  barColor={theme.palette.sunset.light}
                  lineColor={theme.palette.sunset.dark}
                  gridColor={theme.palette.border.light}
                />
              )}
            </ParentSizeModern>
          </ChartContainer>
        </Grid>
        <Grid item xs={4}>
          <ChartContainer title={"Genders"}>
            <ParentSizeModern>
              {({ width }) => (
                <Pie
                  width={width}
                  data={allGenders}
                  getKey={(item) => item.gender}
                  getLabel={(item) => item.gender}
                  getCount={(item) => item.count}
                  getTooltipData={(item) => {
                    if (allGenders) {
                      const total = allGenders.reduce(
                        (acc, curr) => acc + curr.count,
                        0
                      );
                      return `${((item.count / total) * 100).toPrecision(2)}%`;
                    }
                    return "";
                  }}
                />
              )}
            </ParentSizeModern>
          </ChartContainer>
        </Grid>
        <Grid item xs={4}>
          <ChartContainer title={"Race/Ethnicity"}>
            <ParentSizeModern>
              {({ width }) => (
                <Pie
                  width={width}
                  data={raceEthnicity}
                  getKey={(item) => item.race}
                  getLabel={(item) => {
                    if (item.race === "null") {
                      return "Not-Filled";
                    }
                    return item.race;
                  }}
                  getCount={(item) => item.count}
                  getTooltipData={(item) => {
                    if (raceEthnicity) {
                      const total = raceEthnicity.reduce(
                        (acc, curr) => acc + curr.count,
                        0
                      );
                      return `${((item.count / total) * 100).toPrecision(2)}%`;
                    }
                    return "";
                  }}
                />
              )}
            </ParentSizeModern>
          </ChartContainer>
        </Grid>
        <Grid item xs={4}>
          <ChartContainer title={"Academic Years"}>
            <ParentSizeModern>
              {({ width }) => (
                <Pie
                  width={width}
                  data={allYears}
                  getKey={(item) => item.academicYear}
                  getLabel={(item) => item.academicYear}
                  getCount={(item) => item.count}
                  getTooltipData={(item) => {
                    if (allYears) {
                      const total = allYears.reduce(
                        (acc, curr) => acc + curr.count,
                        0
                      );
                      return `${((item.count / total) * 100).toPrecision(2)}%`;
                    }
                    return "";
                  }}
                />
              )}
            </ParentSizeModern>
          </ChartContainer>
        </Grid>
        <Grid item xs={4}>
          <ChartContainer title={"Coding Experience"}>
            <ParentSizeModern>
              {({ width }) => (
                <Pie
                  width={width}
                  data={codingExp}
                  getKey={(item) => item.codingExperience}
                  getLabel={(item) => {
                    if (item.codingExperience === "none") {
                      return "Not-Filled";
                    }
                    return item.codingExperience;
                  }}
                  getCount={(item) => item.count}
                  getTooltipData={(item) => {
                    if (codingExp) {
                      const total = codingExp.reduce(
                        (acc, curr) => acc + curr.count,
                        0
                      );
                      return `${((item.count / total) * 100).toPrecision(2)}%`;
                    }
                    return "";
                  }}
                />
              )}
            </ParentSizeModern>
          </ChartContainer>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withDefaultLayout(AnalyticsPage);
