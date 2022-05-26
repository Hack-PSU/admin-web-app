import React, { FC, forwardRef } from "react";
import { ControlledInputProps, IInputProps, LabelledInputProps } from "types/components";
import { alpha, InputBase, styled } from "@mui/material";
import InputLabel from "components/base/Input/InputLabel";
import { useController } from "react-hook-form";

const StyledInput = styled(InputBase)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  border: "2px solid black",
  color: theme.palette.common.black,
  fontSize: "0.8rem",
  "&::placeholder": {
    color: alpha(theme.palette.common.black, 0.8),
  },
}));

const Input = forwardRef<any, IInputProps>(({ placeholder, ...props }, ref) => {
  return (
    <StyledInput
      ref={ref}
      aria-label={props["aria-label"] ?? "Generic Input"}
      placeholder={placeholder}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const LabelledInput: FC<LabelledInputProps> =
  ({ id, label, showError,
     error, placeholder, ...props
  }) => {
  return (
    <>
      <InputLabel id={id} label={label} showError={showError} error={error} />
      <Input
        placeholder={placeholder}
        {...props}
      />
    </>
  );
};

export const ControlledInput: FC<ControlledInputProps> =
  ({ as: Component, name, rules,
     defaultValue, placeholder, ...props
  }) => {
  const { field: { onChange, onBlur, value } } = useController({ name, rules, defaultValue: defaultValue ?? "" });

  if (Component) {
    return (
      <Component
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        {...props}
      />
    );
  }

  return (
    <Input
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      {...props}
    />
  );
};

export default Input;