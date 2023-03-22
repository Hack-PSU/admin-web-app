import { FC } from "react";
import { LabelledSelect, LabelledSelectProps } from "components/base";

const LabelledEventSelect: FC<LabelledSelectProps<any>> = (props) => {
  return (
    <LabelledSelect
      // @ts-ignore
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
