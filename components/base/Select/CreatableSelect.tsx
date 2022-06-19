import React, { useMemo } from "react";
import Creatable from "react-select/creatable";
import { GroupBase, StylesConfig } from "react-select";
import {
  ControlledCreatableSelectProps,
  CreatableSelectProps,
  LabelledCreatableSelectProps,
} from "types/components";
import { selectStyles } from "components/base/Select/styles";
import { Box, useTheme } from "@mui/material";
import { InputLabel } from "components/base";
import { useController } from "react-hook-form";

function CreatableSelect<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
>(props: CreatableSelectProps<TOption, TIsMulti, TGroup>) {
  const theme = useTheme();
  const customStyles: StylesConfig<TOption, TIsMulti, TGroup> = useMemo(
    () => selectStyles(theme),
    [theme]
  );

  return (
    <Creatable
      styles={customStyles}
      components={{
        IndicatorSeparator: () => null,
      }}
      {...props}
    />
  );
}

export function LabelledCreatableSelect<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
>({
  id,
  label,
  showError,
  error,
  ...props
}: LabelledCreatableSelectProps<TOption, TIsMulti, TGroup>) {
  return (
    <>
      <InputLabel id={id} label={label} showError={showError} error={error} />
      <Box mt={0.6}>
        <CreatableSelect {...props} />
      </Box>
    </>
  );
}

export function ControlledCreatableSelect<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
>({
  name,
  rules,
  defaultValue,
  as: Component,
  ...props
}: ControlledCreatableSelectProps<TOption, TIsMulti, TGroup>) {
  const {
    field: { onChange, onBlur, value },
  } = useController({ name, rules, defaultValue });

  if (Component) {
    return (
      <Component onChange={onChange} onBlur={onBlur} value={value} {...props} />
    );
  }

  return (
    <CreatableSelect
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      {...props}
    />
  );
}

export default CreatableSelect;
