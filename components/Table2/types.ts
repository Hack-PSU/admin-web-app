export type ColumnType = "input" | "text" | "custom";

export type ColumnTypeMeta = {
  [key: string]:
    | {
        type: "text" | "custom";
        name: string;
      }
    | {
        type: "input";
        name: string;
        placeholder: string;
      };
};
