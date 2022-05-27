import { FC } from "react";
import { LabelledSelectProps } from "types/components";
import { LabelledSelect } from "components/base";

const LabelledEventSelect: FC<LabelledSelectProps> = (props) => {
  return (
    <LabelledSelect
      sx={{ width: "80%", mt: 0.6 }}
      {...props}
    />
  );
};

export default LabelledEventSelect;