import React, { useMemo } from "react";
import SingleSelect, { GroupBase, StylesConfig } from "react-select";
import { alpha, useTheme } from "@mui/material";
import {
  ControlledSelectProps,
  LabelledSelectProps,
  SelectProps,
} from "types/components";
import { InputLabel } from "components/base/Input";
import { useController } from "react-hook-form";

function Select<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
>(props: SelectProps<TOption, TIsMulti, TGroup>) {
  const theme = useTheme();

  const customStyles: StylesConfig<TOption, TIsMulti, TGroup> = useMemo(
    () => ({
      placeholder: (provided, state) => ({
        ...provided,
        color: alpha(theme.palette.border.dark, 0.8),
        fontSize: "0.85rem",
        fontFamily: "Poppins",
        fontWeight: "normal",
      }),
      control: (provided, state) => ({
        ...provided,
        cursor: "pointer",
        borderColor: state.isFocused
          ? theme.palette.sunset.light
          : theme.palette.border.light,
        borderWidth: 2,
        boxShadow: state.isFocused
          ? `0 0 0 0.125rem ${alpha(theme.palette.sunset.dark, 0.3)}`
          : undefined,
        ":hover": {
          borderColor: theme.palette.sunset.light,
        },
        borderRadius: "15px",
        padding: theme.spacing(0.3, 1),
      }),
      option: (provided, state) => ({
        ...provided,
        borderBottom: 0,
        background: state.isSelected
          ? theme.palette.border.light
          : "transparent",
        color: state.isSelected
          ? theme.palette.common.black
          : alpha(theme.palette.common.black, 0.7),
        transition: "all 200ms ease-in-out",
        cursor: "pointer",
        ":hover": {
          backgroundColor: state.isSelected
            ? theme.palette.border.light
            : alpha(theme.palette.border.light, 0.8),
          color: theme.palette.common.black,
        },
        padding: theme.spacing(1.3, 2),
        borderRadius: "5px",
        ":not(:first-child)": {
          marginTop: theme.spacing(0.8),
        },
        fontWeight: 500,
      }),
      menuList: (provided) => ({
        ...provided,
        padding: theme.spacing(2),
      }),
      menu: (provided) => ({
        ...provided,
        boxShadow: theme.shadows[1],
        borderRadius: "15px",
        overflow: "hidden",
      }),
    }),
    [theme]
  );

  return (
    <SingleSelect
      styles={customStyles}
      components={{
        IndicatorSeparator: () => null,
      }}
      {...props}
    />
  );
}

export function LabelledSelect<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
>({
  id,
  label,
  showError,
  error,
  ...props
}: LabelledSelectProps<TOption, TIsMulti, TGroup>) {
  return (
    <>
      <InputLabel id={id} label={label} showError={showError} error={error} />
      <Select {...props} />
    </>
  );
}

export function ControlledSelect<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
>({
  name,
  rules,
  defaultValue,
  as: Component,
  ...props
}: ControlledSelectProps<TOption, TIsMulti, TGroup>) {
  const {
    field: { onChange, onBlur, value },
  } = useController({ name, rules, defaultValue });

  if (Component) {
    return (
      <Component onChange={onChange} onBlur={onBlur} value={value} {...props} />
    );
  }

  return (
    <Select onChange={onChange} onBlur={onBlur} value={value} {...props} />
  );
}

export default Select;
