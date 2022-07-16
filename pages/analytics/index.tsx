import React, { useMemo } from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Grid, Typography } from "@mui/material";
import { useQuery } from "react-query";
import { fetch, getAllHackers, QueryKeys } from "api";
import _ from "lodash";
import { Pie } from "components/Charts";
import { ChartContainer } from "components/analytics";

const CURRENT_HACKATHON = "81069f2a04cb465994ad84155af6e868";

const AnalyticsPage: NextPage = () => {
  const { data: allUsers } = useQuery(QueryKeys.hacker.findAll(), () =>
    fetch(() =>
      getAllHackers({
        type: "registration_stats",
        allHackathons: true,
      })
    )
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
        <Grid item xs={4.5}>
          <ChartContainer title={"Genders"}>
            <Pie
              width={320}
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
          </ChartContainer>
        </Grid>
        <Grid item xs={4.5}>
          <ChartContainer title={"Race/Ethnicity"}>
            <Pie
              width={320}
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
          </ChartContainer>
        </Grid>
        <Grid item xs={4.5}>
          <ChartContainer title={"Academic Years"}>
            <Pie
              width={320}
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
          </ChartContainer>
        </Grid>
        <Grid item xs={4.5}>
          <ChartContainer title={"Coding Experience"}>
            <Pie
              width={320}
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
          </ChartContainer>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withDefaultLayout(AnalyticsPage);
