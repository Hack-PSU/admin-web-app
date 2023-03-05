import React, { FC, useCallback, useMemo, useRef } from "react";
import { InputBase, styled } from "@mui/material";

type Props = {
  onChange?(value: string): void;
  value: string;
  name: string;
  active: string;
  onClick(name: string): void;
  variant: "number" | "ampm";
};

const ComponentInput = styled(InputBase)<{ isActive: boolean }>(
  ({ theme, isActive }) => ({
    padding: theme.spacing(1, 0.5, 0.8),
    borderRadius: "5px",
    height: "100%",
    aspectRatio: "1.21",
    backgroundColor: isActive ? theme.palette.sunset.light : "transparent",
    color: isActive ? theme.palette.common.white : theme.palette.common.black,
    cursor: "pointer",
    caretColor: "transparent",
    fontSize: theme.typography.pxToRem(16),
    "& input": {
      cursor: "pointer",
      textAlign: "center",
      verticalAlign: "middle",
    },
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  })
);

const TimeComponent: FC<Props> = ({
  value,
  name,
  active,
  onClick,
  onChange,
  variant,
}) => {
  const resetRef = useRef<NodeJS.Timeout | null>(null);
  const initialRef = useRef<boolean | null>(true);

  const onChangeValue = useCallback(
    (newValue: string) => {
      onChange?.(newValue);
    },
    [onChange]
  );

  const handleNewKey = useCallback(
    (key: string) => {
      // assume key is numeric and state is not initial
      const currentValue = parseInt(value);

      if (currentValue < 10) {
        onChangeValue(`${currentValue}${key}`.padStart(2, "0"));
      } else {
        onChangeValue(key.padStart(2, "0"));
      }
    },
    [onChangeValue, value]
  );

  const handleBackspace = useCallback(() => {
    const currentValue = parseInt(value);

    if (currentValue % 10 === 0) {
      onChangeValue("00");
    } else {
      const firstDigit = value.charAt(0);
      onChangeValue(`${firstDigit}0`);
    }
  }, [onChangeValue, value]);

  const isNumeric = useCallback((key: string) => {
    return !isNaN(Number(key)) && !isNaN(parseFloat(key));
  }, []);

  const onKeyDownNumber = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
      }

      if (initialRef.current) {
        if (e.key === "Backspace") {
          handleBackspace();
          return;
        }

        if (!isNumeric(e.key)) {
          return;
        }
        onChangeValue(e.key.padStart(2, "0"));
        initialRef.current = false;

        if (resetRef.current !== null) {
          clearTimeout(resetRef.current);
        }

        resetRef.current = setTimeout(() => {
          initialRef.current = true;
        }, 500);
      } else {
        if (isNumeric(e.key)) {
          handleNewKey(e.key);
        } else {
          handleBackspace();
        }
      }
    },
    [handleBackspace, handleNewKey, isNumeric, onChangeValue]
  );

  const isValidAMPM = useCallback((key: string) => {
    return (
      key === "A" ||
      key === "a" ||
      key === "P" ||
      key === "p" ||
      key === "M" ||
      key === "m"
    );
  }, []);

  const onKeyDownAMPM = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Backspace" ||
        !isValidAMPM(e.key)
      ) {
        e.preventDefault();
        return;
      }

      if (e.key.toLowerCase() === "a") {
        onChangeValue("AM");
      } else if (e.key.toLowerCase() === "p") {
        onChangeValue("PM");
      }
    },
    [isValidAMPM, onChangeValue]
  );

  const onKeyDown = useMemo(
    () => (variant === "number" ? onKeyDownNumber : onKeyDownAMPM),
    [variant, onKeyDownAMPM, onKeyDownNumber]
  );

  return (
    <ComponentInput
      type={variant === "number" ? "number" : "text"}
      isActive={active === name}
      value={value}
      onClick={() => onClick(name)}
      onKeyDown={onKeyDown}
    />
  );
};

export default TimeComponent;
