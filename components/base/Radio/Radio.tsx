import React, { FC, useState } from "react";
import {
  Grid,
  Radio as MuiRadio,
  RadioProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import {
  InputLabel,
  WithControllerProps,
  WithLabelledProps,
} from "components/base";
import { useController, UseControllerReturn } from "react-hook-form";
import { ISelectItem } from "components/base/Select/types";

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

const Radio: FC<IRadioProps> = ({ items, onChange, labelProps }) => {
  const [selected, setSelected] = useState<string>("");

  const onChangeSelected = (item: ISelectItem<string>) => {
    return () => {
      setSelected(item.value);
      onChange(item);
    };
  };

  return (
    <>
      {items.map((item, index) => (
        <Grid
          container
          item
          alignItems="center"
          key={`${item.value}-${index}`}
          sx={{ width: "fit-content" }}
        >
          <Grid item>
            <MuiRadio
              checked={selected === item.value}
              onChange={onChangeSelected(item)}
              value={item.value}
            />
          </Grid>
          <Grid item>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600 }}
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

export const LabelledRadio: FC<LabelledRadioProps> = ({
  id,
  label,
  showError,
  error,
  items,
  onChange,
  ...props
}) => {
  return (
    <>
      <InputLabel id={id} label={label} showError={showError} error={error} />
      <Radio items={items} onChange={onChange} {...props} />
    </>
  );
};

export const ControlledRadio: FC<ControlledRadioProps> = ({
  as: Component,
  name,
  rules,
  defaultValue,
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

  return <Radio onChange={onChange} onBlur={onBlur} value={value} {...props} />;
};

export default Radio;
