import { FC, useState } from "react";
import DefaultCell from "./DefaultCell";
import { ControlledInput } from "components/base";
import { ControlledInputProps } from "types/components";
import { GridProps } from "@mui/material";

interface IDefaultInputCellProps extends ControlledInputProps {
  cellProps?: GridProps;
}

const DefaultInputCell: FC<IDefaultInputCellProps> = ({
  cellProps,
  ...props
}) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <DefaultCell
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...cellProps}
    >
      <ControlledInput
        {...props}
        sx={{
          border: isHovering ? undefined : "transparent",
          transition: "border 200ms ease-in-out",
          ...props.sx,
        }}
        inputProps={{
          style: {
            fontWeight: 500,
            fontSize: "0.9rem",
          },
        }}
      />
    </DefaultCell>
  );
};

export default DefaultInputCell;
