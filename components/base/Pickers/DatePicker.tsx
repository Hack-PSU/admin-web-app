import { FC } from "react";
import BaseDatePicker, {
  ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import moment from "moment";
import { Box, Grid, InputAdornment, Typography, useTheme } from "@mui/material";
import { EvaIcon, Input, InputLabel, Select } from "components/base";
import {
  ControlledDatePickerProps,
  IDatePickerProps,
  IInputProps,
  LabelledDatePickerProps,
} from "types/components";
import { useController, useForm } from "react-hook-form";

const DatePickerAdornment: FC = () => (
  <InputAdornment
    position={"end"}
    sx={{ display: "flex", flexDirection: "row" }}
    disableTypography
  >
    <Box mt={0.5}>
      <EvaIcon name="calendar-outline" size="large" fill="#1a1a1a" />
    </Box>
  </InputAdornment>
);

const DatePickerInput: FC<Omit<IInputProps, "placeholder">> = ({
  ...props
}) => {
  return (
    <Input
      placeholder={""}
      sx={{ width: "100%", borderRadius: "15px" }}
      endAdornment={<DatePickerAdornment />}
      {...props}
    />
  );
};

const DatePickerHeader: FC<ReactDatePickerCustomHeaderProps> = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  const theme = useTheme();

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        padding: theme.spacing(0.5, 1.8),
        backgroundColor: "white",
      }}
    >
      <Grid item onClick={decreaseMonth} sx={{ cursor: "pointer" }}>
        <EvaIcon name={"chevron-left-outline"} size="large" fill="#1a1a1a" />
      </Grid>
      <Grid item flexGrow={1}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {moment(date).format("MMMM")}
        </Typography>
      </Grid>
      <Grid item onClick={increaseMonth} sx={{ cursor: "pointer" }}>
        <EvaIcon name={"chevron-right-outline"} size="large" fill="#1a1a1a" />
      </Grid>
    </Grid>
  );
};

const DatePickerDay: FC<{ dayOfMonth: number; date?: Date }> = ({
  dayOfMonth,
}) => {
  return (
    <Typography
      variant="subtitle1"
      sx={{ fontSize: "0.8rem", fontFamily: "Poppins", lineHeight: 2 }}
    >
      {dayOfMonth}
    </Typography>
  );
};

const DatePicker: FC<IDatePickerProps> = ({
  onChange,
  value,
  inputProps,
  placeholder,
}) => {
  return (
    <BaseDatePicker
      onChange={onChange}
      value={value}
      placeholderText={placeholder ?? "MM/DD/YYYY"}
      renderCustomHeader={(props) => <DatePickerHeader {...props} />}
      formatWeekDay={(day) => day.substring(0, 3).toUpperCase()}
      customInput={<DatePickerInput {...inputProps} />}
      shouldCloseOnSelect={false}
      renderDayContents={(dayOfMonth, date) => (
        <DatePickerDay dayOfMonth={dayOfMonth} date={date} />
      )}
    />
  );
};

export const LabelledDatePicker: FC<LabelledDatePickerProps> = ({
  label,
  id,
  error,
  showError,
  value,
  onChange,
  ...props
}) => {
  return (
    <>
      <InputLabel id={id} label={label} error={error} showError={showError} />
      <DatePicker value={value} onChange={onChange} {...props} />
    </>
  );
};

export const ControlledDatePicker: FC<ControlledDatePickerProps> = ({
  name,
  rules,
  defaultValue,
  as: Component,
  ...props
}) => {
  const {
    field: { onChange, value, onBlur },
  } = useController({ name, rules, defaultValue });

  if (Component) {
    return (
      <Component value={value} onChange={onChange} onBlur={onBlur} {...props} />
    );
  }

  return (
    <DatePicker value={value} onChange={onChange} onBlur={onBlur} {...props} />
  );
};

export default DatePicker;
