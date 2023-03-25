import { createQuery, CreateQueryReturn } from "api/utils";
import { AnalyticsSummaryResponse } from "api/analytics/entity";
import { QueryAction, QueryScope } from "api/types";

/**
 * Get all analytics summary
 */
export const getAnalyticsSummary: CreateQueryReturn<AnalyticsSummaryResponse> =
  createQuery("/analytics/summary");

export const AnalyticsQueryKeys = {
  all: [{ entity: "analytics" }],
  findAll: () =>
    [
      {
        ...AnalyticsQueryKeys.all[0],
        action: QueryAction.query,
        scope: QueryScope.ALL,
      },
    ] as const,
};
