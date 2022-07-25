import React, { FC } from "react";
import { WithChildren } from "types/common";
import { Grid, styled, TableCellProps, Typography } from "@mui/material";
import DefaultCell from "./DefaultCell";
import { BaseCellProps } from "./types";

interface IDefaultHeaderCellProps extends BaseCellProps<any> {
  after?: React.ReactNode;
}

export const TextCell = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const DefaultHeaderCell: FC<WithChildren<IDefaultHeaderCellProps>> = ({
  column,
  cellProps,
  after,
  children,
}) => {
  return (
    <DefaultCell column={column} component={"th"} {...cellProps}>
      <Grid container>
        <Grid item>
          <TextCell
            variant="body1"
            sx={{
              fontWeight: "bold",
              color: "header.light",
            }}
          >
            {children}
          </TextCell>
        </Grid>
        {after}
      </Grid>
    </DefaultCell>
  );
};

export default DefaultHeaderCell;
