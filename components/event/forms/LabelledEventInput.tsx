import { FC } from "react";
import { IInputProps, LabelledInputProps, WithControllerProps } from "types/components";
import { LabelledInput } from "components/base";

const LabelledEventInput: FC<LabelledInputProps> = ({ id, label, showError, error, ...props }) => {
  return (
    <LabelledInput
      id={id}
      label={label}
      showError={showError}
      error={error}
      sx={{ width: "80%", mt: 0.6 }}
      {...props}
    />
  );
};

export default LabelledEventInput;