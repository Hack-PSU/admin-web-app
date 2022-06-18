import { FC } from "react";
import { LabelledSelectProps } from "types/components";
import { LabelledSelect } from "components/base";
import { GroupBase } from "react-select";

// function LabelledEventSelect<
//   TOption,
//   TIsMulti extends boolean = false,
//   TGroup extends GroupBase<TOption> = GroupBase<TOption>
// >(props: LabelledSelectProps<TOption, TIsMulti, TGroup>) {
//   return (
//     <LabelledSelect
//       {...props}
//     />
//   );
// }

const LabelledEventSelect: FC<LabelledSelectProps<any>> = (props) => {
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
