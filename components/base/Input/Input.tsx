import React, { FC, forwardRef } from "react";
import {
  ControlledInputProps,
  IInputProps,
  LabelledInputProps,
} from "types/components";
import { alpha, Box, InputBase, styled } from "@mui/material";
import InputLabel from "components/base/Input/InputLabel";
import { Controller } from "react-hook-form";

const StyledInput = styled(InputBase)(({ theme }) => ({
  padding: theme.spacing(0.8, 1.8),
  border: `2px solid ${theme.palette.border.light}`,
  borderRadius: "15px",
  color: theme.palette.common.black,
  width: "100%",
  "&::placeholder": {
    color: alpha(theme.palette.border.dark, 0.8),
  },
  "&.Mui-focused": {
    boxShadow: `0 0 0 0.125rem ${alpha(theme.palette.sunset.dark, 0.3)}`,
    borderColor: theme.palette.sunset.light,
  },
  boxShadow: undefined,
  ":hover": {
    borderColor: theme.palette.sunset.light,
  },
}));

const Input = forwardRef<any, IInputProps>(
  ({ placeholder, error, ...props }, ref) => {
    return (
      <StyledInput
        {...props}
        ref={ref}
        aria-label={props["aria-label"] ?? "Generic Input"}
        placeholder={placeholder}
        sx={{
          borderColor: error ? "error.main" : undefined,
          ...props.sx,
        }}
      />
    );
  }
);
Input.displayName = "Input";

export const LabelledInput: FC<LabelledInputProps> = ({
  id,
  label,
  showError,
  error,
  placeholder,
  ...props
}) => {
  return (
    <>
      <InputLabel id={id} label={label} showError={showError} error={error} />
      <Box mt={0.6}>
        <Input placeholder={placeholder} error={!!error} {...props} />
      </Box>
    </>
  );
};

export const ControlledInput: FC<ControlledInputProps> = ({
  as: Component,
  name,
  rules,
  defaultValue,
  placeholder,
  ...props
}) => {
  // const {
  //   field: { onChange, onBlur, value, ref },
  //   fieldState: { error },
  // } = useController({ name, rules, defaultValue: defaultValue ?? "" });

  if (Component) {
    return (
      <Controller
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <Component
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            error={error?.message ?? ""}
            {...props}
          />
        )}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
      />
    );
  }

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
      }) => (
        <Input
          placeholder={placeholder}
          error={!!error?.message ?? undefined}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
          {...props}
        />
      )}
    />
  );
};

export default Input;
