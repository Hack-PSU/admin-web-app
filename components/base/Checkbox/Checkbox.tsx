import React, { FC, useEffect, useMemo, useState } from "react";
import {
  Checkbox as MuiCheckbox,
  CheckboxProps,
  Grid,
  Typography,
  TypographyProps,
} from "@mui/material";
import InputLabel from "components/base/Input/InputLabel";
import { useController, UseControllerReturn } from "react-hook-form";
import { ISelectItem } from "components/base/Select/types";
import { WithControllerProps, WithLabelledProps } from "components/base";

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

export type CheckboxSelectionState = {
  [key: string]: boolean;
};

const Checkbox: FC<ICheckboxProps> = ({
  items,
  onChange,
  size,
  labelProps,
  ...props
}) => {
  const initialState = useMemo(
    () =>
      items.reduce((curr, item) => {
        curr[item.value] = false;
        return curr;
      }, {} as CheckboxSelectionState),
    []
  );

  const [selected, setSelected] =
    useState<CheckboxSelectionState>(initialState);

  const handleChange = (value: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelected((selected) => ({
        ...selected,
        [value]: e.target.checked,
      }));
    };
  };

  useEffect(() => {
    onChange(selected);
  }, [onChange, selected]);

  return (
    <>
      {items.map((item, index) => (
        <Grid container item key={`${item.value}-${index}`} alignItems="center">
          <Grid item>
            <MuiCheckbox
              checked={selected[item.value]}
              onChange={handleChange(item.value)}
              name={item.value}
              size={size}
              {...props}
            />
          </Grid>
          <Grid item>
            <Typography
              variant="body1"
              sx={{
                color: "common.black",
                fontWeight: 600,
              }}
              {...labelProps}
            >
              {item.display}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export const LabelledCheckbox: FC<LabelledCheckboxProps> = ({
  id,
  label,
  error,
  showError,
  items,
  onChange,
  ...props
}) => {
  return (
    <>
      <InputLabel id={id} label={label} showError={showError} error={error} />
      <Grid container sx={{ pl: 2 }}>
        <Checkbox items={items} onChange={onChange} {...props} />
      </Grid>
    </>
  );
};

export const ControlledCheckbox: FC<ControlledCheckboxProps> = ({
  name,
  rules,
  defaultValue,
  as: Component,
  ...props
}) => {
  const {
    field: { onChange, onBlur, value },
  } = useController({ name, rules, defaultValue });

  if (Component) {
    return (
      <Component onChange={onChange} onBlur={onBlur} value={value} {...props} />
    );
  }

  return (
    <Checkbox onChange={onChange} onBlur={onBlur} value={value} {...props} />
  );
};

export default Checkbox;
