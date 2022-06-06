import { FC } from "react";
import { Cell, CellProps, HeaderGroup } from "react-table";
import { Grid, GridProps, Typography, TypographyProps } from "@mui/material";
import { WithChildren } from "types/common";

interface ITableHeaderProps {
  header?: HeaderGroup;
  containerProps?: Omit<GridProps, "children" | "style">;
  textProps?: Omit<TypographyProps, "children">;
  cell?: Cell;
}

const TableCell: FC<WithChildren<ITableHeaderProps>> = ({
  children,
  cell,
  header,
  containerProps,
  textProps,
}) => {
  const { sx, ...rest } = textProps ?? { sx: {} };

  return (
    <Grid
      item
      {...containerProps}
      {...(header ? header.getHeaderProps() : {})}
      {...(cell ? cell.getCellProps() : {})}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: header ? "bold" : 600,
          color: header ? "table.header" : "common.black",
          ...sx,
        }}
        {...rest}
      >
        {children}
      </Typography>
    </Grid>
  );
};

export default TableCell;
