import React from "react";
import {
  InputProps,
  SxProps,
  Theme,
  // SelectProps,
  CheckboxProps,
  TypographyProps,
  RadioProps,
} from "@mui/material";
import { UseControllerProps, UseControllerReturn } from "react-hook-form";
import { ReactDatePickerProps } from "react-datepicker";
import { DropzoneOptions } from "react-dropzone";
import { UseTableOptions } from "react-table";
import { GroupBase, Props } from "react-select";
import { CreatableProps } from "react-select/creatable";

type RenderItemData<T> = {
  item: T;
  index: number;
  onChange(event: any, item: ISelectItem): void;
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

export interface IInputProps extends Omit<InputProps, "name" | "placeholder"> {
  placeholder: string;
}

export type LabelledInputProps = WithLabelledProps<IInputProps>;

export type ControlledInputProps = WithControllerProps<
  Omit<IInputProps, "defaultValue"> & Partial<InputLabelProps>
>;

export interface ISelectItem<T = any> {
  value: T;
  type?: "option" | "button";
  display: string;
}

export interface IOption {
  readonly label: string;
  readonly value: string;
  readonly isNew?: boolean;
}

// export interface ISelectProps
//   extends Omit<SelectProps, "placeholder" | "onChange"> {
//   placeholder: string;
//   items: ISelectItem[];
//   renderItem?: RenderItem;
//   placeholderStyles?: SxProps<Theme>;
//   menuStyle?: SxProps<Theme>;
//   menuWidth?: string;
//   onChange?: UseControllerReturn["field"]["onChange"];
//   selectInputStyle?: React.CSSProperties;
// }

export type SelectProps<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
> = Omit<Props<TOption, TIsMulti, TGroup>, "styles"> & {
  error?: boolean;
};

export type LabelledSelectProps<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
> = WithLabelledProps<SelectProps<TOption, TIsMulti, TGroup>>;

export type ControlledSelectProps<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
> = WithControllerProps<
  SelectProps<TOption, TIsMulti, TGroup> & Partial<InputLabelProps>
>;

export type CreatableSelectProps<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
> = Omit<CreatableProps<TOption, TIsMulti, TGroup>, "styles"> & {
  error?: boolean;
};

export type LabelledCreatableSelectProps<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
> = WithLabelledProps<CreatableSelectProps<TOption, TIsMulti, TGroup>>;

export type ControlledCreatableSelectProps<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
> = WithControllerProps<
  CreatableSelectProps<TOption, TIsMulti, TGroup> & Partial<InputLabelProps>
>;

export type CreateOnlyInputProps = Omit<
  CreatableSelectProps<IOption, true, GroupBase<IOption>>,
  "onChange" | "onInputChange" | "onKeyDown" | "value"
> & {
  onChange?: UseControllerReturn["field"]["onChange"];
  initialValue?: IOption[];
};

export type LabelledCreateOnlyInputProps =
  WithLabelledProps<CreateOnlyInputProps>;

export type ControlledCreateOnlyInputProps = WithControllerProps<
  Omit<CreateOnlyInputProps, "onChange"> & Partial<LabelledCreateOnlyInputProps>
>;

export type TableProps<T extends object = {}> = UseTableOptions<T>;

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

export interface IDatePickerProps extends Omit<ReactDatePickerProps, "value"> {
  value: Date;
  onChange(value: Date): void;
  placeholder?: string;
  inputProps?: Omit<IInputProps, "placeholder" | "value" | "onChange">;
}

export type LabelledDatePickerProps = WithLabelledProps<IDatePickerProps>;

export type ControlledDatePickerProps = WithControllerProps<
  Omit<IDatePickerProps, "value" | "onChange"> & Partial<InputLabelProps>
>;

export interface ITimePickerProps
  extends Omit<IInputProps, "value" | "onChange" | "placeholder"> {
  value: Date;
  onChange?: UseControllerReturn["field"]["onChange"];
  menuWidth?: string;
  pickerInputStyle?: React.CSSProperties;
}

export type LabelledTimePickerProps = WithLabelledProps<ITimePickerProps>;

export type ControlledTimePickerProps = WithControllerProps<
  Omit<ITimePickerProps, "value" | "onChange"> & Partial<InputLabelProps>
>;

export interface IDropzoneProps extends DropzoneOptions {
  containerStyle?: SxProps<Theme>;
  custom?: boolean;
  children?: React.ReactNode;
  replace?: boolean;
}

export type LabelledDropzoneProps = WithLabelledProps<IDropzoneProps>;

export type ControlledDropzoneProps = WithControllerProps<
  Omit<IDropzoneProps, "onDrop"> & Partial<InputLabelProps>
>;

export type CheckboxSelectionState = {
  [key: string]: boolean;
};

export interface ICheckboxProps
  extends Omit<
    CheckboxProps,
    "name" | "defaultValue" | "placeholder" | "onChange"
  > {
  items: ISelectItem<string>[];
  onChange: UseControllerReturn["field"]["onChange"];
  labelProps?: TypographyProps;
}

export type LabelledCheckboxProps = WithLabelledProps<ICheckboxProps>;

export type ControlledCheckboxProps = WithControllerProps<
  Omit<ICheckboxProps, "value" | "onChange"> & Partial<LabelledCheckboxProps>
>;

export interface IRadioProps
  extends Omit<
    RadioProps,
    "name" | "defaultValue" | "placeholder" | "onChange"
  > {
  items: ISelectItem<string>[];
  onChange: UseControllerReturn["field"]["onChange"];
  labelProps?: TypographyProps;
}

export type LabelledRadioProps = WithLabelledProps<IRadioProps>;

export type ControlledRadioProps = WithControllerProps<
  Omit<IRadioProps, "value" | "onChange"> & Partial<LabelledRadioProps>
>;
