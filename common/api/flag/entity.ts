export interface IFlagsEntity {
  name: string;
  isEnabled: boolean;
}

export interface IWSPushJudgingEntity {
  to: "ADMIN" | "MOBILE" | undefined;
  data: {
    isEnabled: boolean;
  };
}
