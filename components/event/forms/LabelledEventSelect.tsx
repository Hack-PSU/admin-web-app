import { FC } from "react";
import { LabelledSelectProps } from "types/components";
import { LabelledSelect } from "components/base";

const LabelledEventSelect: FC<LabelledSelectProps> = (props) => {
  return (
    <LabelledSelect
      menuWidth={"35%"}
      sx={{
        width: "100%",
        mt: 0.6,
        borderRadius: "15px",
      }}
      selectInputStyle={{
        fontSize: "0.9rem",
      }}
      {...props}
    />
  );
};

export default LabelledEventSelect;
