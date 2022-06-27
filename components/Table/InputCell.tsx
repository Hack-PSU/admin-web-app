import React, { useState } from "react";
import { ControlledInputProps } from "types/components";
import { ControlledInput } from "components/base";
import { TableCell } from "components/Table/index";
import { Cell } from "react-table";

interface IInputCellProps<T extends object> extends ControlledInputProps {
  cell: Cell<T>;
}

function InputCell<T extends object>({ cell, ...props }: IInputCellProps<T>) {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <TableCell
      empty
      {...cell.getCellProps()}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <ControlledInput
        {...props}
        sx={{
          border: isHovering ? undefined : "transparent",
          transition: "border 200ms ease-in-out",
          ...props.sx,
        }}
      />
    </TableCell>
  );
}

export default InputCell;
