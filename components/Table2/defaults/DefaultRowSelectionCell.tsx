import { FC } from "react";
import { Checkbox, CheckboxProps, GridProps } from "@mui/material";
import DefaultCell from "./DefaultCell";

interface IDefaultRowSelectionCellProps extends CheckboxProps {
  cellProps?: GridProps;
}

const DefaultRowSelectionCell: FC<IDefaultRowSelectionCellProps> = ({
  cellProps,
  ...props
}) => {
  return (
    <DefaultCell {...cellProps}>
      <Checkbox
        sx={{
          color: "border.dark",
        }}
        {...props}
      />
    </DefaultCell>
  );
};

export default DefaultRowSelectionCell;
