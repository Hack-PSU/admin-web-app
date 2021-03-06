import React, { useMemo } from "react";
import SingleSelect, { GroupBase, StylesConfig } from "react-select";
import { Box, useTheme } from "@mui/material";
import {
  ControlledSelectProps,
  LabelledSelectProps,
  SelectProps,
} from "types/components";
import { InputLabel } from "components/base/Input";
import { useController } from "react-hook-form";
import { selectStyles } from "components/base/Select/styles";

function Select<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
>({ error, ...props }: SelectProps<TOption, TIsMulti, TGroup>) {
  const theme = useTheme();

  const customStyles: StylesConfig<TOption, TIsMulti, TGroup> = useMemo(
    () => selectStyles(theme, !!error),
    [theme, error]
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
      <Box mt={0.6}>
        <Select {...props} error={!!error} />
      </Box>
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
    fieldState: { error },
  } = useController({ name, rules, defaultValue });

  if (Component) {
    return (
      <Component
        error={error?.message ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        {...props}
      />
    );
  }

  return (
    <Select
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      error={!!error}
      {...props}
    />
  );
}

export default Select;
