import React, { FC, useState } from "react";
import {
  ControlledRadioProps,
  IRadioProps,
  ISelectItem,
  LabelledRadioProps,
} from "types/components";
import { Grid, Radio as MuiRadio, Typography } from "@mui/material";
import { InputLabel } from "components/base";
import { useController } from "react-hook-form";

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
        <Grid container item alignItems="center" key={`${item.value}-${index}`}>
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
