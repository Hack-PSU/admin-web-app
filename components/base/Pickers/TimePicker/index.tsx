import React, { FC, useEffect, useState } from "react";
import { Box, Grid, InputAdornment, Popover, useTheme } from "@mui/material";
import { EvaIcon, Input, InputLabel } from "components/base";
import { TimePickerHours, TimePickerMinutes } from "./TimePickerColumns";
import TimePickerAMPM from "./TimePickerAMPM";
import {
  ControlledTimePickerProps,
  ITimePickerProps,
  LabelledTimePickerProps,
} from "types/components";
import { useController } from "react-hook-form";
import { DateTime } from "luxon";

const TimePickerAdornment: FC = () => (
  <InputAdornment position={"end"} sx={{ cursor: "pointer" }}>
    <Box mt={0.5}>
      <EvaIcon name={"clock-outline"} size="large" fill="#1a1a1a" />
    </Box>
  </InputAdornment>
);

const TimePicker: FC<ITimePickerProps> = ({
  value,
  onChange,
  menuWidth,
  pickerInputStyle,
  sx,
  ...props
}) => {
  const [hour, setHour] = useState<string>("01");
  const [minute, setMinute] = useState<string>("00");
  const [ampm, setAMPM] = useState<"AM" | "PM">("AM");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [time, setTime] = useState<string>(`${hour}:${minute} ${ampm}`);

  const toggleMenu = () => {
    setIsOpen((open) => !open);
  };

  const onClickInput = (event: any) => {
    setAnchorEl(event.currentTarget);
    toggleMenu();
  };

  const theme = useTheme();

  const selectColor = value
    ? theme.palette.select.main
    : theme.palette.select.placeholder;

  useEffect(() => {
    setTime(`${hour}:${minute} ${ampm}`);
    if (onChange) {
      onChange(
        DateTime.fromFormat(`${hour}:${minute} ${ampm}`, "hh:mm a").toJSDate()
      );
    }
  }, [onChange, hour, minute, ampm]);

  return (
    <>
      <Input
        placeholder={""}
        disabled
        endAdornment={<TimePickerAdornment />}
        onClick={onClickInput}
        value={time}
        type={"text"}
        sx={{
          ".MuiInputBase-input": {
            cursor: "pointer",
          },
          width: "100%",
          borderRadius: "15px",
          ...sx,
        }}
        inputProps={{
          style: {
            color: selectColor,
            WebkitTextFillColor: selectColor,
            ...pickerInputStyle,
          },
        }}
        {...props}
      />
      <Popover
        id="time-picker-popover"
        open={isOpen}
        anchorEl={anchorEl}
        onClose={toggleMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{
          style: {
            width: menuWidth ?? "15%",
          },
          sx: {
            boxShadow: 1,
            padding: theme.spacing(2, 1.5),
            borderRadius: "15px",
          },
        }}
      >
        <Grid container sx={{ width: "100%" }}>
          <TimePickerHours
            selectedHour={hour}
            activeColor={"#2878DA"}
            setHour={setHour}
          />
          <TimePickerMinutes
            selectedMinute={minute}
            activeColor={"#2878DA"}
            setMinute={setMinute}
          />
          <TimePickerAMPM
            selectedAMPM={ampm}
            activeColor={"#2878DA"}
            setAMPM={setAMPM}
          />
        </Grid>
      </Popover>
    </>
  );
};

export const LabelledTimePicker: FC<LabelledTimePickerProps> = ({
  id,
  label,
  showError,
  error,
  ...props
}) => {
  return (
    <>
      <InputLabel id={id} label={label} showError={showError} error={error} />
      <Box mt={0.6}>
        <TimePicker {...props} />
      </Box>
    </>
  );
};

export const ControlledTimePicker: FC<ControlledTimePickerProps> = ({
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
      <Component value={value} onChange={onChange} onBlur={onBlur} {...props} />
    );
  }

  return (
    <TimePicker value={value} onChange={onChange} onBlur={onBlur} {...props} />
  );
};

export default TimePicker;
