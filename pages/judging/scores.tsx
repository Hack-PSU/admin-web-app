import React, { useMemo } from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { useQuery } from "@tanstack/react-query";
import {
  fetch,
  getAllHackathons,
  getAllHackers,
  getAllProjects,
  getAllScores,
  QueryKeys,
} from "api";
import {
  useScoreResults,
  Top3Section,
  AllScoresSection,
} from "components/judging";
import { Grid, Typography } from "@mui/material";
import { useHackathonStore } from "common/store";
import _ from "lodash";

const CURRENT_HACKATHON = "81069f2a04cb465994ad84155af6e868";

const ScoresPage: NextPage = () => {
  const { activeHackathon: hackathon, updateActiveHackathon } =
    useHackathonStore();

  // TODO: MUST fetch from organizers to ensure judges don't come out null
  const { data: allUsers } = useQuery(QueryKeys.hacker.findAll(), () =>
    fetch(getAllHackers)
  );

  const { data: allProjects } = useQuery(
    QueryKeys.judgingProject.findAll(),
    () => fetch(getAllProjects)
  );

  const { data: allScores } = useQuery(QueryKeys.judgingScore.findAll(), () =>
    fetch(getAllScores)
  );

  const { data: allHackathons } = useQuery(
    QueryKeys.hackathon.findAll(),
    () => fetch(getAllHackathons),
    {
      enabled: !hackathon,
    }
  );

  const activeHackathon = useMemo(() => {
    if (hackathon === null && allHackathons) {
      const activeHackathons = _.filter(allHackathons, "active");
      if (activeHackathons.length > 0) {
        updateActiveHackathon(activeHackathons[0]);
        return activeHackathons[0];
      }
    }
    return hackathon;
  }, [allHackathons, hackathon, updateActiveHackathon]);

  const { allData, ...top3 } = useScoreResults({
    scores: allScores,
    projects: allProjects,
    users: allUsers,
    filterProject: (d) =>
      d.hackathon === activeHackathon?.uid &&
      d.project !== "No Show" &&
      d.project !== "PSU indoor navigation ",
  });

  return (
    <Grid container gap={1.5} flexDirection="column">
      <Grid
        container
        item
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Grid item xs={10}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Judging Scores
          </Typography>
        </Grid>
      </Grid>
      <Top3Section {...top3} />
      <AllScoresSection allData={allData} />
    </Grid>
  );
};

export default withDefaultLayout(ScoresPage);
