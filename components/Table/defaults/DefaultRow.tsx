import { FC } from "react";
import { WithChildren } from "types/common";
import { TableRow, TableRowProps, useTheme } from "@mui/material";

const DefaultRow: FC<WithChildren<TableRowProps>> = ({
  children,
  ...props
}) => {
  const theme = useTheme();

  return (
    <TableRow
      {...props}
      sx={{
        borderBottom: `2px solid ${theme.palette.border.light}`,
        ...props.sx,
      }}
    >
      {children}
    </TableRow>
  );
};

export default DefaultRow;
