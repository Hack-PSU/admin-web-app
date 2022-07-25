import { FC } from "react";
import { WithChildren } from "types/common";
import { TableCell, TableCellProps, useTheme } from "@mui/material";
import { BaseCellProps } from "./types";

type DefaultCellProps = TableCellProps &
  BaseCellProps<any> & {
    disableDefault?: boolean;
  };

const DefaultCell: FC<WithChildren<DefaultCellProps>> = ({
  disableDefault,
  column,
  children,
  ...props
}) => {
  const theme = useTheme();

  return (
    <TableCell
      {...props}
      sx={{
        border: "none",
        padding: theme.spacing(1.5, 2, 1.5, 0),
        ":first-child": {
          padding: theme.spacing(1.5, 2, 1.5, 1.5),
        },
        my: "auto",
        ...(!disableDefault
          ? {
              width: `${column?.getSize() ?? 0}px`,
            }
          : {}),
        ...props.sx,
      }}
    >
      {children}
    </TableCell>
  );
};

export default DefaultCell;
