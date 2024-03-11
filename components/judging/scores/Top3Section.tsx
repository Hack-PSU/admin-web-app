import React, { FC, useCallback, useEffect, useState } from "react";
import { Grid, styled, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { ControlledSelect } from "components/base";
import { Text } from "@visx/text";
import { LinearGradient } from "@visx/gradient";
import { ParentSizeModern } from "@visx/responsive";
import { IOption } from "components/base/Select/types";
import {
  RankedData,
  ScoreType,
  UseScoreResultsReturn,
} from "components/judging/scores/use-score-results";

const filterOptions: IOption[] = [
  {
    value: ScoreType.AVG,
    label: "Average Score",
  },
  {
    value: ScoreType.CLARITY,
    label: "Clarity",
  },
  {
    value: ScoreType.GROWTH,
    label: "Knowledge and Growth",
  },
  {
    value: ScoreType.CREATIVITY,
    label: "Creativity and Originality",
  },
  {
    value: ScoreType.IMPLEMENTATION,
    label: "Implementation",
  },
  {
    value: ScoreType.TECHNICAL,
    label: "Technical Skills",
  },
  {
    value: ScoreType.CHALLENGE1,
    label: "Sustainability",
  },
  {
    value: ScoreType.CHALLENGE2,
    label: "Entrepreneurship",
  },
  {
    value: ScoreType.CHALLENGE3,
    label: "Generative A.I.",
  },
];

type Top3SectionProps = UseScoreResultsReturn;
type Top3CardProps = RankedData;

const StyledTop3Card = styled(Grid)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.common.white,
  borderRadius: "15px",
  padding: theme.spacing(2, 3),
  height: "100%",
}));

const Top3Card: FC<Top3CardProps> = ({ score, project }) => {
  return (
    <StyledTop3Card
      container
      item
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection="column"
      gap={1}
    >
      <Grid item sx={{ width: "100%" }}>
        <ParentSizeModern>
          {({ width }) => (
            <svg width={width} height={"100"}>
              <LinearGradient
                id={"sunset-accent"}
                from={"#FC466B"}
                to={"#EF9771"}
              />
              <Text
                dy={"25%"}
                x={width / 2}
                fontWeight={800}
                fontFamily={"Inter"}
                fontSize={"60"}
                textAnchor={"middle"}
                verticalAnchor={"start"}
                fill={"url(#sunset-accent)"}
              >
                {score ? score.toFixed(2) : "0.00"}
              </Text>
            </svg>
          )}
        </ParentSizeModern>
      </Grid>
      <Grid item flexGrow={1}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
            fontSize: "1.8rem",
            textAlign: "center",
          }}
        >
          {project}
        </Typography>
      </Grid>
    </StyledTop3Card>
  );
};

const Top3Section: FC<Top3SectionProps> = ({
  top3Avg,
  top3Creativity,
  top3Challenge3,
  top3Growth,
  top3Implementation,
  top3Challenge1,
  top3Technical,
  top3Clarity,
  top3Challenge2,
}) => {
  const methods = useForm({
    defaultValues: {
      filter: {
        value: ScoreType.AVG,
        label: "Average Score",
      },
    },
  });
  const [selectedData, setSelectedData] = useState<RankedData[]>(top3Avg);
  const filterType = methods.watch("filter");

  const applyFilter = useCallback(
    (type: ScoreType) => {
      switch (type) {
        case ScoreType.AVG:
          setSelectedData(top3Avg);
          break;
        case ScoreType.CREATIVITY:
          setSelectedData(top3Creativity);
          break;
        case ScoreType.TECHNICAL:
          setSelectedData(top3Technical);
          break;
        case ScoreType.IMPLEMENTATION:
          setSelectedData(top3Implementation);
          break;
        case ScoreType.CLARITY:
          setSelectedData(top3Clarity);
          break;
        case ScoreType.GROWTH:
          setSelectedData(top3Growth);
          break;
        case ScoreType.CHALLENGE1:
          setSelectedData(top3Challenge1);
          break;
        case ScoreType.CHALLENGE2:
          setSelectedData(top3Challenge2);
          break;
        case ScoreType.CHALLENGE3:
          setSelectedData(top3Challenge3);
          break;
      }
    },
    [
      top3Challenge2,
      top3Avg,
      top3Creativity,
      top3Challenge3,
      top3Growth,
      top3Implementation,
      top3Challenge1,
      top3Technical,
      top3Clarity,
    ]
  );

  useEffect(() => {
    applyFilter(filterType.value);
  }, [applyFilter, filterType.value]);

  return (
    <FormProvider {...methods}>
      <Grid container item alignItems="center" spacing={1.5}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Top 3
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledSelect name={"filter"} options={filterOptions} />
        </Grid>
      </Grid>
      <Grid container item spacing={1.5} alignItems="stretch">
        {selectedData.map((d) => (
          <Grid item xs={4} key={`top3-${filterType.value}-${d.project}`}>
            <Top3Card {...d} />
          </Grid>
        ))}
      </Grid>
    </FormProvider>
  );
};

export default Top3Section;
