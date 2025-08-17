import React, { useMemo } from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Grid, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  fetch,
  getAnalyticsSummary,
  getAllRegistrations,
  getAllHackathons,
  getAllUsers,
  QueryKeys,
} from "api";
import { Pie } from "components/Charts";
import {
  ChartContainer,
  RegistrationBarLine,
  RegistrationTimeline,
} from "components/analytics";
import { TimelineDataPoint } from "components/analytics/RegistrationTimeline";
import { ParentSizeModern } from "@visx/responsive";

const AnalyticsSummaryPage: NextPage = () => {
  const theme = useTheme();

  const { data } = useQuery(QueryKeys.analytics.findAll(), () =>
    fetch(getAnalyticsSummary)
  );

  const { data: allRegistrations } = useQuery(
    QueryKeys.registration.findAll(true),
    () => fetch(() => getAllRegistrations(undefined, { all: true }))
  );

  const { data: hackathons } = useQuery(QueryKeys.hackathon.findAll(), () =>
    fetch(getAllHackathons)
  );

  // Get users registered for the current hackathon by cross-referencing with registrations
  const { data: currentHackathonRegistrations } = useQuery(
    QueryKeys.registration.findAll(false),
    () => fetch(() => getAllRegistrations(undefined, { all: false }))
  );

  const { data: allUsers } = useQuery(QueryKeys.hacker.findAll(), () =>
    fetch(() => getAllUsers(undefined, { active: false }))
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

  const registrationTimeline = useMemo(() => {
    if (!allRegistrations || !hackathons) return [];

    const timeline: TimelineDataPoint[] = [];

    // Process each hackathon
    hackathons.forEach((hackathon) => {
      const hackathonRegistrations = allRegistrations.filter(
        (reg) => reg.hackathonId === hackathon.id
      );

      if (hackathonRegistrations.length === 0) return;

      const endTime = new Date(hackathon.endTime).getTime();

      // Sort registrations by time
      const sortedRegistrations = hackathonRegistrations.sort(
        (a, b) => a.time - b.time
      );

      // Find the earliest registration to determine the range
      const earliestRegistration = sortedRegistrations[0];
      const earliestTime = earliestRegistration.time;
      const maxDaysBeforeEvent = Math.ceil(
        (endTime - earliestTime) / (1000 * 60 * 60 * 24)
      );

      // Create daily counts leading up to the event
      const dailyCounts: { [day: number]: number } = {};
      let cumulativeCount = 0;

      sortedRegistrations.forEach((registration) => {
        const registrationTime = registration.time;
        const daysBeforeEvent = Math.floor(
          (endTime - registrationTime) / (1000 * 60 * 60 * 24)
        );

        cumulativeCount++;
        const dayKey = -daysBeforeEvent; // Negative because it's days before the event
        dailyCounts[dayKey] = cumulativeCount;
      });

      // Fill in timeline points from earliest registration to event day
      let previousCount = 0;
      for (let day = -maxDaysBeforeEvent; day <= 0; day++) {
        const count = dailyCounts[day] || previousCount;
        timeline.push({
          day,
          count,
          hackathonName: hackathon.name,
          hackathonId: hackathon.id,
        });
        previousCount = count;
      }
    });

    console.log("Registration Timeline Data:", timeline);

    return timeline;
  }, [allRegistrations, hackathons]);

  // Map current hackathon registrations to user data
  const currentHackathonUsers = useMemo(() => {
    if (!currentHackathonRegistrations || !allUsers) return [];

    const registeredUserIds = new Set(
      currentHackathonRegistrations.map((reg) => reg.userId)
    );
    return allUsers.filter((user) => registeredUserIds.has(user.id));
  }, [currentHackathonRegistrations, allUsers]);

  const shirtSizeDistribution = useMemo(() => {
    if (!currentHackathonUsers || currentHackathonUsers.length === 0) return [];

    const shirtSizeCounts: { [size: string]: number } = {};

    currentHackathonUsers.forEach((user) => {
      if (user.shirtSize) {
        shirtSizeCounts[user.shirtSize] =
          (shirtSizeCounts[user.shirtSize] || 0) + 1;
      }
    });

    return Object.entries(shirtSizeCounts).map(([size, count]) => ({
      shirtSize: size,
      count,
    }));
  }, [currentHackathonUsers]);

  const travelReimbursementDistribution = useMemo(() => {
    if (!currentHackathonRegistrations || currentHackathonRegistrations.length === 0) return [];

    const travelReimbursementCounts = {
      "Requesting Reimbursement": 0,
      "Not Requesting Reimbursement": 0,
    };

    currentHackathonRegistrations.forEach((registration) => {
      if (registration.travelReimbursement === true) {
        travelReimbursementCounts["Requesting Reimbursement"]++;
      } else {
        travelReimbursementCounts["Not Requesting Reimbursement"]++;
      }
    });

    return Object.entries(travelReimbursementCounts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [currentHackathonRegistrations]);

  return (
    <Grid container gap={1.5} flexDirection="column">
      <Grid container item justifyContent="space-between" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Summary
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
        <Grid item xs={12}>
          <ChartContainer title={"Registration Timeline (Days Before Event)"}>
            <ParentSizeModern>
              {({ width }) => (
                <RegistrationTimeline
                  data={registrationTimeline}
                  width={width}
                  height={400}
                />
              )}
            </ParentSizeModern>
          </ChartContainer>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
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
        <Grid item xs={12} sm={6} md={4}>
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
        <Grid item xs={12} sm={6} md={4}>
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
        <Grid item xs={12} sm={6} md={4}>
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
        <Grid item xs={12} sm={6} md={4}>
          <ChartContainer title={"Shirt Size Distribution"}>
            <ParentSizeModern>
              {({ width }) => (
                <Pie
                  width={width}
                  data={shirtSizeDistribution}
                  getKey={(item) => item.shirtSize}
                  getLabel={(item) => item.shirtSize}
                  getCount={(item) => item.count}
                  getTooltipData={(item) => {
                    if (shirtSizeDistribution) {
                      const total = shirtSizeDistribution.reduce(
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
        <Grid item xs={12} sm={6} md={4}>
          <ChartContainer title={"Travel Reimbursement Requests"}>
            <ParentSizeModern>
              {({ width }) => (
                <Pie
                  width={width}
                  data={travelReimbursementDistribution}
                  getKey={(item) => item.status}
                  getLabel={(item) => item.status}
                  getCount={(item) => item.count}
                  getTooltipData={(item) => {
                    if (travelReimbursementDistribution) {
                      const total = travelReimbursementDistribution.reduce(
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
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                mt: 1, 
                fontStyle: 'italic', 
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              Fall 2025: feature implemented after ~90 registrations
            </Typography>
          </ChartContainer>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withDefaultLayout(AnalyticsSummaryPage);
