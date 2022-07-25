import { FC } from "react";
import { Checkbox, CheckboxProps, TableCellProps } from "@mui/material";
import DefaultCell from "./DefaultCell";
import { BaseCellProps } from "./types";

type DefaultRowSelectionCellProps = CheckboxProps & BaseCellProps<any>;

const DefaultRowSelectionCell: FC<DefaultRowSelectionCellProps> = ({
  column,
  cellProps,
  ...props
}) => {
  return (
    <DefaultCell
      {...cellProps}
      column={column}
      sx={{
        width: "1%",
      }}
    >
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
