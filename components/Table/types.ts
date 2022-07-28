import React from "react";
import { RowData } from "@tanstack/react-table";

export type ColumnType = "input" | "text" | "custom";

export type ColumnFormatterMeta = {
  [key: string]: (value: unknown) => string;
};

export type ColumnTypeMeta = {
  [key: string]:
    | {
        type: "text" | "custom";
      }
    | {
        type: "input";
        inputName: string;
        placeholder: string;
      };
};

export type RenderSubRows<TData extends RowData> = (
  row: TData
) => React.ReactNode;
