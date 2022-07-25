import { FC } from "react";
import { styled, TableCellProps, Typography } from "@mui/material";
import { WithChildren } from "types/common";
import DefaultCell from "./DefaultCell";
import { BaseCellProps } from "./types";

type DefaultTextCellProps = BaseCellProps<any>;

export const TextCell = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const DefaultTextCell: FC<WithChildren<DefaultTextCellProps>> = ({
  column,
  cellProps,
  children,
}) => {
  return (
    <DefaultCell column={column} {...cellProps}>
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
