import { ProjectBreakdownEntity } from "api";
import { useCallback, useMemo } from "react";
import _ from "lodash";

type UseScoreResultsOptions = {
  data: ProjectBreakdownEntity[];
};

export type RankedData = {
  order: number;
  project: string;
  score: number;
};

export type UseScoreResultsReturn = {
  top3Avg: RankedData[];
  top3Creativity: RankedData[];
  top3Technical: RankedData[];
  top3Implementation: RankedData[];
  top3Clarity: RankedData[];
  top3Growth: RankedData[];
  top3Challenge1: RankedData[];
  top3Challenge3: RankedData[];
  top3Challenge2: RankedData[];
};

export enum ScoreType {
  AVG = "average",
  CREATIVITY = "creativity",
  TECHNICAL = "technical",
  IMPLEMENTATION = "implementation",
  CLARITY = "clarity",
  GROWTH = "growth",
  CHALLENGE1 = "challenge1",
  CHALLENGE2 = "challenge2",
  CHALLENGE3 = "challenge3",
}

export function useScoreResults(
  options: UseScoreResultsOptions
): UseScoreResultsReturn {
  const { data } = options;

  const getTop3 = useCallback(
    (type: ScoreType): RankedData[] => {
      const top3 = _.take(_.orderBy(data, [type], ["desc"]), 3);
      return top3.map((project, i) => ({
        order: i,
        project: project.name,
        score: project[type],
      }));
    },
    [data]
  );

  return useMemo(
    () => ({
      top3Avg: getTop3(ScoreType.AVG),
      top3Clarity: getTop3(ScoreType.CLARITY),
      top3Creativity: getTop3(ScoreType.CREATIVITY),
      top3Challenge3: getTop3(ScoreType.CHALLENGE3),
      top3Growth: getTop3(ScoreType.GROWTH),
      top3Challenge1: getTop3(ScoreType.CHALLENGE1),
      top3Implementation: getTop3(ScoreType.IMPLEMENTATION),
      top3Technical: getTop3(ScoreType.TECHNICAL),
      top3Challenge2: getTop3(ScoreType.CHALLENGE2),
    }),
    [getTop3]
  );
}
