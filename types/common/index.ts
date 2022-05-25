import React from "react";

export type WithChildren<T extends any = {}> = T & {
  children?: React.ReactNode
}