import React, { FC, useCallback, useEffect, useState } from "react";
import { OnChangeValue } from "react-select";
import {
  ControlledCreateOnlyInputProps,
  CreateOnlyInputProps,
  IOption,
  LabelledCreateOnlyInputProps,
} from "types/components";
import CreatableSelect from "./CreatableSelect";
import { InputLabel } from "components/base";
import { Box } from "@mui/material";
import { useController } from "react-hook-form";

const CreateOnlyInput: FC<CreateOnlyInputProps> = ({
  initialValue,
  error,
  onChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [value, setValue] = useState<IOption[]>(initialValue ?? []);

  const createOption: (value: string) => IOption = useCallback((value) => {
    return {
      label: value,
      value,
      isNew: true,
    };
  }, []);

  const handleChange = (value: OnChangeValue<IOption, true>) => {
    setValue([...value]);
  };

  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!inputValue) return;
    if (
      event.key === "Enter" ||
      event.key === "Tab" ||
      event.code === "Comma"
    ) {
      setValue((value) => [...value, createOption(inputValue)]);
      setInputValue("");
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  return (
    <CreatableSelect
      error={error}
      isClearable
      isMulti
      onChange={handleChange}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      inputValue={inputValue}
      menuIsOpen={false}
      value={value}
      components={{
        DropdownIndicator: null,
      }}
      {...props}
    />
  );
};

export const LabelledCreateOnlyInput: FC<LabelledCreateOnlyInputProps> = ({
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
        <CreateOnlyInput id={id} {...props} />
      </Box>
    </>
  );
};

export const ControlledCreateOnlyInput: FC<ControlledCreateOnlyInputProps> = ({
  name,
  rules,
  defaultValue,
  as: Component,
  ...props
}) => {
  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({ name, rules, defaultValue });

  if (Component) {
    return (
      <Component
        onChange={onChange}
        initialValue={value}
        onBlur={onBlur}
        error={error?.message}
        {...props}
      />
    );
  }

  return (
    <CreateOnlyInput
      onChange={onChange}
      initialValue={value}
      error={!!error?.message}
      onBlur={onBlur}
      {...props}
    />
  );
};

export default CreateOnlyInput;
