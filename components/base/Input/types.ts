import { UseControllerProps } from "react-hook-form";
import React from "react";
import { InputLabelProps } from "./InputLabel";

export type WithLabelledProps<TProps> = Omit<TProps, "id" | "error"> &
  InputLabelProps;

export type WithControllerProps<TProps> = UseControllerProps &
  TProps & {
    as?: React.FC<any>;
  };
