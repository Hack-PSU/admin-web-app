import React, { useMemo } from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Grid, Typography, useTheme } from "@mui/material";
import { useQuery } from "react-query";
import { fetch, getAllHackathons, getAllHackers, QueryKeys } from "api";
import _ from "lodash";
import { Pie } from "components/Charts";
import { ChartContainer, RegistrationBarLine } from "components/analytics";
import { ParentSizeModern } from "@visx/responsive";
import { DateTime } from "luxon";

const CURRENT_HACKATHON = "81069f2a04cb465994ad84155af6e868";

const AnalyticsPage: NextPage = () => {
  const theme = useTheme();

  const { data: allUsers } = useQuery(QueryKeys.hacker.findAll(), () =>
    fetch(() =>
      getAllHackers({
        type: "registration_stats",
        allHackathons: true,
      })
    )
  );

  const { data: allHackathons } = useQuery(QueryKeys.hackathon.findAll(), () =>
    fetch(getAllHackathons)
  );

  const currentHackathon = useMemo(() => {
    if (allUsers) {
      return _.chain(allUsers)
        .pickBy((user) => user.hackathon === CURRENT_HACKATHON)
        .value();
    }
  }, [allUsers]);

  const allGenders = useMemo(() => {
    if (currentHackathon) {
      return _.chain(currentHackathon)
        .groupBy("gender")
        .map((users, gender) => ({ gender, count: users.length }))
        .value();
    }
  }, [currentHackathon]);

  const raceEthnicity = useMemo(() => {
    if (currentHackathon) {
      return _.chain(currentHackathon)
        .groupBy("race")
        .map((users, race) => ({ race, count: users.length }))
        .value();
    }
  }, [currentHackathon]);

  const allYears = useMemo(() => {
    if (currentHackathon) {
      return _.chain(currentHackathon)
        .groupBy("academic_year")
        .map((users, year) => ({ year, count: users.length }))
        .value();
    }
  }, [currentHackathon]);

  const codingExp = useMemo(() => {
    if (currentHackathon) {
      return _.chain(currentHackathon)
        .groupBy("coding_experience")
        .map((users, exp) => ({ experience: exp, count: users.length }))
        .value();
    }
  }, [currentHackathon]);

  const registrationsByHackathon = useMemo(() => {
    if (allUsers && allHackathons) {
      return _.chain(allUsers)
        .groupBy("hackathon")
        .map((users, hackathon) => {
          const entity = allHackathons.find((h) => h.uid === hackathon);

          return {
            hackathon: entity?.name ?? hackathon,
            count: users.length,
            date: entity?.start_time,
          };
        })
        .sortBy((item) => DateTime.fromMillis(parseInt(item.date ?? "")))
        .map(({ date, ...rest }) => ({ ...rest }))
        .value();
    }
  }, [allUsers, allHackathons]);

  const growthByHackathon = useMemo(() => {
    if (registrationsByHackathon) {
      const growth: { [name: string]: number } = {};

      registrationsByHackathon.reduce((prev, curr, index) => {
        if (index === 0) {
          growth[curr.hackathon] = 0;
        } else {
          growth[curr.hackathon] = ((curr.count - prev) / (prev ?? 1)) * 100;
        }

        return curr.count;
      }, 0);

      return growth;
    }
  }, [registrationsByHackathon]);

  console.log(growthByHackathon);

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
                  getXScale={(item) => item.hackathon}
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
                  getKey={(item) => item.year}
                  getLabel={(item) => item.year}
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
                  getKey={(item) => item.experience}
                  getLabel={(item) => {
                    if (item.experience === "none") {
                      return "Not-Filled";
                    }
                    return item.experience;
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
