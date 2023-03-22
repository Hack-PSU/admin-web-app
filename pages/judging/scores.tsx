import React from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { useQuery } from "@tanstack/react-query";
import { fetch, getScoreBreakdown, QueryKeys } from "api";
import {
  AllScoresSection,
  Top3Section,
  useScoreResults,
} from "components/judging";
import { Grid, Typography } from "@mui/material";
import { useHackathonStore } from "common/store";

const ScoresPage: NextPage = () => {
  const { activeHackathon: hackathon, updateActiveHackathon } =
    useHackathonStore();

  // const { data: allHackathons } = useQuery(
  //   QueryKeys.hackathon.findAll(),
  //   () => fetch(getAllHackathons),
  //   {
  //     enabled: !hackathon,
  //   }
  // );

  // const activeHackathon = useMemo(() => {
  //   if (hackathon === null && allHackathons) {
  //     const activeHackathons = _.filter(allHackathons, "active");
  //     if (activeHackathons.length > 0) {
  //       updateActiveHackathon(activeHackathons[0]);
  //       return activeHackathons[0];
  //     }
  //   }
  //   return hackathon;
  // }, [allHackathons, hackathon, updateActiveHackathon]);

  const { data, refetch } = useQuery(QueryKeys.judgingScore.findAll(), () =>
    fetch(getScoreBreakdown)
  );

  const top3 = useScoreResults({
    data: data ?? [],
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
      <AllScoresSection data={data ?? []} refetch={refetch} />
    </Grid>
  );
};

export default withDefaultLayout(ScoresPage);
