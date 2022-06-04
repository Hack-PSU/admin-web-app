import { FC } from "react";
import {
  IInputProps,
  LabelledInputProps,
  WithControllerProps,
} from "types/components";
import { LabelledInput } from "components/base";

const LabelledEventInput: FC<LabelledInputProps> = ({
  id,
  label,
  showError,
  error,
  sx,
  ...props
}) => {
  return (
    <LabelledInput
      id={id}
      label={label}
      showError={showError}
      error={error}
      sx={{
        width: "90%",
        mt: 0.6,
        borderRadius: "15px",
        ...sx,
      }}
      inputProps={{
        style: {
          fontSize: "0.9rem",
        },
      }}
      {...props}
    />
  );
};

export default LabelledEventInput;
