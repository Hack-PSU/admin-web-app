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
  top3Energy: RankedData[];
  top3Environmental: RankedData[];
  top3SupplyChain: RankedData[];
};

export enum ScoreType {
  AVG = "average",
  CREATIVITY = "creativity",
  TECHNICAL = "technical",
  IMPLEMENTATION = "implementation",
  CLARITY = "clarity",
  GROWTH = "growth",
  ENERGY = "energy",
  SUPPLY_CHAIN = "supplyChain",
  ENVIRONMENTAL = "environmental",
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
      top3Environmental: getTop3(ScoreType.ENVIRONMENTAL),
      top3Growth: getTop3(ScoreType.GROWTH),
      top3Energy: getTop3(ScoreType.ENERGY),
      top3Implementation: getTop3(ScoreType.IMPLEMENTATION),
      top3Technical: getTop3(ScoreType.TECHNICAL),
      top3SupplyChain: getTop3(ScoreType.SUPPLY_CHAIN),
    }),
    [getTop3]
  );
}
