import { FC } from "react";
import { LabelledInput, LabelledInputProps } from "components/base";

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
        width: "100%",
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
