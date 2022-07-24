import { FC } from "react";
import { GridProps, styled, Typography } from "@mui/material";
import { WithChildren } from "types/common";
import DefaultCell from "./DefaultCell";

interface IDefaultTextCellProps {
  cellProps?: GridProps;
}

export const TextCell = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const DefaultTextCell: FC<WithChildren<IDefaultTextCellProps>> = ({
  cellProps,
  children,
}) => {
  return (
    <DefaultCell {...cellProps}>
      <TextCell
        variant="body1"
        sx={{
          fontWeight: 600,
          color: "common.black",
        }}
      >
        {children}
      </TextCell>
    </DefaultCell>
  );
};

export default DefaultTextCell;
