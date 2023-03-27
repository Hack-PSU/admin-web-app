// import { useCallback, useMemo } from "react";
// import { IOrganizerEntity, IProjectEntity, IScoreEntity } from "api";
// import _ from "lodash";
//
// type UseScoreResultsOptions = {
//   projects?: IProjectEntity[];
//   users?: IOrganizerEntity[];
//   filterProject?: (project: IProjectEntity) => boolean;
//   scores?: IScoreEntity[];
// };
//
// export type ResolvedData = Omit<IScoreEntity, "project_id" | "judge"> & {
//   average: number;
//   projectName: string;
// };
//
// type AllResolvedData = ResolvedData & {
//   breakdown: (Omit<IScoreEntity, "project_id" | "judge"> & {
//     judgeName: string;
//   })[];
// };
//
// export type UseScoreResultsReturn = {
//   top3Avg: ResolvedData[];
//   top3Creativity: ResolvedData[];
//   top3Technical: ResolvedData[];
//   top3Implementation: ResolvedData[];
//   top3Clarity: ResolvedData[];
//   top3Growth: ResolvedData[];
//   top3Energy: ResolvedData[];
//   top3Environmental: ResolvedData[];
//   top3SupplyChain: ResolvedData[];
//   allData: AllResolvedData[];
// };
//
// export enum ScoreType {
//   AVG = "average",
//   CREATIVITY = "creativity",
//   TECHNICAL = "technical",
//   IMPLEMENTATION = "implementation",
//   CLARITY = "clarity",
//   GROWTH = "growth",
//   ENERGY = "energy",
//   SUPPLY_CHAIN = "supply_chain",
//   ENVIRONMENTAL = "environmental",
// }
//
// export function useScoreResults(
//   options: UseScoreResultsOptions,
// ): UseScoreResultsReturn {
//   const { scores, users, filterProject, projects } = options;
//
//   const resolveScoreData = useCallback(() => {
//     if (projects && scores) {
//       const projectsById = projects
//         .filter(filterProject ?? ((d) => !!d.project))
//         .reduce((acc, curr) => {
//           acc[curr.uid] = curr.project;
//           return acc;
//         }, {} as { [key: number]: string });
//
//       return scores
//         .map(({ project_id, ...d }) => ({
//           projectName: projectsById[project_id],
//           ...d,
//         }))
//         .filter((d) => !!d.projectName);
//     }
//   }, [filterProject, projects, scores]);
//
//   const getScoresByProject = useCallback(() => {
//     const resolvedScoreData = resolveScoreData();
//
//     if (resolvedScoreData && resolvedScoreData.length > 0) {
//       return _.groupBy(resolvedScoreData, "projectName");
//     }
//
//     return {};
//   }, [resolveScoreData]);
//
//   const aggregateScores: () => ResolvedData[] = useCallback(() => {
//     const scoresByProject = getScoresByProject();
//
//     if (scoresByProject) {
//       return _.chain(scoresByProject)
//         .map((scores, project) => {
//           const creativity = _.meanBy(scores, "creativity");
//           const technical = _.meanBy(scores, "technical");
//           const implementation = _.meanBy(scores, "implementation");
//           const clarity = _.meanBy(scores, "clarity");
//           const growth = _.meanBy(scores, "growth");
//
//           const energy = _.meanBy(scores, "energy");
//           const supply_chain = _.meanBy(scores, "supply_chain");
//           const environmental = _.meanBy(scores, "environmental");
//
//           const avg =
//             creativity + technical + implementation + clarity + growth;
//
//           return {
//             average: avg,
//             growth,
//             creativity,
//             clarity,
//             technical,
//             projectName: project,
//             environmental,
//             energy,
//             implementation,
//             supply_chain,
//           } as ResolvedData;
//         })
//         .value();
//     }
//     return [];
//   }, [getScoresByProject]);
//
//   const getScoreBreakdown: () => AllResolvedData[] = useCallback(() => {
//     const scores = aggregateScores();
//     const scoresByProject = getScoresByProject();
//
//     if (users && scoresByProject && scores && scores.length > 0) {
//       // get a dictionary of key: project, value: list of score breakdowns
//       const usersByProject = _.chain(scoresByProject)
//         .map((scores, project) => {
//           // get a breakdown of judges and corresponding scores
//           const judges: AllResolvedData["breakdown"] = _.chain(scores)
//             .map(({ judge, projectName, ...score }) => {
//               const user = users.find((u) => u.email === judge);
//
//               if (!user) {
//                 return;
//               }
//               return {
//                 judgeName: `${user.firstname} ${user.lastname}`,
//                 ...score,
//               } as AllResolvedData["breakdown"][number];
//             })
//             .filter(Boolean)
//             .value() as AllResolvedData["breakdown"];
//
//           return {
//             judges,
//             project,
//           };
//         })
//         .reduce((acc, curr) => {
//           acc[curr.project] = curr.judges;
//           return acc;
//         }, {} as { [key: string]: AllResolvedData["breakdown"] })
//         .value();
//
//       return _.chain(scores)
//         .map((project) => ({
//           ...project,
//           breakdown: usersByProject[project.projectName],
//         }))
//         .value();
//     }
//     return [];
//   }, [aggregateScores, getScoresByProject, users]);
//
//   const aggregatedScores = useMemo(() => aggregateScores(), [aggregateScores]);
//   const allData = useMemo(() => getScoreBreakdown(), [getScoreBreakdown]);
//
//   const getTop3 = useCallback(
//     (type: ScoreType) => {
//       return _.take(_.orderBy(aggregatedScores, [type], ["desc"]), 3);
//     },
//     [aggregatedScores],
//   );
//
//   return useMemo(
//     () => ({
//       allData: _.orderBy(allData, ["average"], ["desc"]),
//       top3Avg: getTop3(ScoreType.AVG),
//       top3Clarity: getTop3(ScoreType.CLARITY),
//       top3Creativity: getTop3(ScoreType.CREATIVITY),
//       top3Environmental: getTop3(ScoreType.ENVIRONMENTAL),
//       top3Growth: getTop3(ScoreType.GROWTH),
//       top3Energy: getTop3(ScoreType.ENERGY),
//       top3Implementation: getTop3(ScoreType.IMPLEMENTATION),
//       top3Technical: getTop3(ScoreType.TECHNICAL),
//       top3SupplyChain: getTop3(ScoreType.SUPPLY_CHAIN),
//     }),
//     [getTop3, allData],
//   );
// }
