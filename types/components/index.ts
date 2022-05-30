import React from "react";
import {
  InputProps,
  SxProps,
  Theme,
  SelectProps,
  TextFieldProps,
  InputBaseComponentProps,
} from "@mui/material";
import {
  UseControllerProps,
  UseControllerReturn,
  UseFormRegister,
} from "react-hook-form";

type RenderItemData<T> = {
  item: T;
  index: number;
};

export type RenderItem<T = any> = (data: RenderItemData<T>) => React.ReactNode;

export type InputLabelProps = {
  id: string;
  label: string;
  error?: string;
  showError?: boolean;
};

export type WithLabelledProps<TProps> = Omit<TProps, "id" | "error"> &
  InputLabelProps;

export type WithControllerProps<TProps> = UseControllerProps &
  TProps & {
    as?: React.FC<any>;
  };

export interface IInputProps
  extends Omit<InputProps, "name" | "defaultValue" | "placeholder"> {
  placeholder: string;
}

export type LabelledInputProps = WithLabelledProps<IInputProps>;

export type ControlledInputProps = WithControllerProps<
  IInputProps & Partial<InputLabelProps>
>;

export interface ISelectItem<T = any> {
  value: T;
  display: string;
}

export interface ISelectProps
  extends Omit<SelectProps, "placeholder" | "onChange"> {
  placeholder: string;
  items: ISelectItem[];
  renderItem?: RenderItem;
  placeholderStyles?: SxProps<Theme>;
  menuStyle?: SxProps<Theme>;
  selectStyle?: SxProps<Theme>;
  menuWidth?: string;
  onChange?: UseControllerReturn["field"]["onChange"];
  selectInputStyle?: React.CSSProperties;
}

export type LabelledSelectProps = WithLabelledProps<ISelectProps>;

export type ControlledSelectProps = WithControllerProps<
  ISelectProps & Partial<InputLabelProps>
>;

export interface ITableProps<T = any> {
  items: T[];
  // renderItems renders a single row given some data
  renderItems?: RenderItem<T>;
}

export interface IBaseErrorProps {
  error: string;
}

export interface IErrorBoundaryProps {
  component?: React.FC<IBaseErrorProps>;
}

export interface IErrorBoundaryStates {
  hasError: boolean;
  error: string;
}
