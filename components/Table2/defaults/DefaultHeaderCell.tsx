import React, { FC } from "react";
import { WithChildren } from "types/common";
import { Grid, GridProps, styled, Typography } from "@mui/material";
import DefaultCell from "./DefaultCell";

interface IDefaultHeaderCellProps {
  after?: React.ReactNode;
  cellProps?: GridProps;
}

export const TextCell = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const DefaultHeaderCell: FC<WithChildren<IDefaultHeaderCellProps>> = ({
  cellProps,
  after,
  children,
}) => {
  return (
    <DefaultCell {...cellProps}>
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
    </DefaultCell>
  );
};

export default DefaultHeaderCell;
