import { FC, forwardRef } from "react";
import { WithChildren } from "types/common";
import { TableRow, TableRowProps, useTheme } from "@mui/material";

const DefaultRow = forwardRef<HTMLTableRowElement, WithChildren<TableRowProps>>(
  ({ children, ...props }, ref) => {
    const theme = useTheme();

    return (
      <TableRow
        {...props}
        sx={{
          backgroundColor: "common.white",
          borderBottom: `2px solid ${theme.palette.border.light}`,
          ...props.sx,
        }}
        ref={ref}
      >
        {children}
      </TableRow>
    );
  }
);
DefaultRow.displayName = "DefaultRow";

export default DefaultRow;
