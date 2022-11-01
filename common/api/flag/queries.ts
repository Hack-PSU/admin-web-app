import {
  createMutation,
  CreateMutationReturn,
  createQuery,
  CreateQueryReturn,
} from "api/utils";
import { IFlagsEntity, IWSPushJudgingEntity } from "./entity";
import { notificationApi, wsApi } from "api/axios";
import { QueryAction, QueryScope } from "api/types";

/**
 * Get application flags for admin mobile app
 * @param params (optional)
 * @param token (optional)
 */
export const getAllAppFlags: CreateQueryReturn<IFlagsEntity[]> = createQuery(
  "/flags",
  notificationApi
);

/**
 * Patch application flags
 * @param entity ({ flags: IFlagsEntity[] })
 * @param params (optional)
 * @param token (optional)
 */
export const patchAppFlags: CreateMutationReturn<
  { flags: IFlagsEntity[] },
  IFlagsEntity[]
> = createMutation("/flags", "PATCH", notificationApi);

/**
 * Push WS Message to toggle judging flag in admin mobile app
 */
export const pushJudgingFlag: CreateMutationReturn<IWSPushJudgingEntity, {}> =
  createMutation("/update/judging/flag", "POST", wsApi);

export const FlagQueryKeys = {
  all: [{ entity: "flag" }] as const,
  findAll: () =>
    [
      {
        ...FlagQueryKeys.all[0],
        action: QueryAction.query,
        scope: QueryScope.ALL,
      },
    ] as const,
};
