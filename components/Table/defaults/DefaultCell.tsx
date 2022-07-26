import { FC } from "react";
import { WithChildren } from "types/common";
import { TableCell, useTheme } from "@mui/material";
import { BaseCellProps, DefaultCellProps } from "./types";

const DefaultCell: FC<
  WithChildren<DefaultCellProps & Omit<BaseCellProps<any>, "cellProps">>
> = ({ disableDefault, column, children, ...props }) => {
  const theme = useTheme();

  return (
    <TableCell
      {...props}
      sx={{
        border: "none",
        padding: theme.spacing(1.5, 2, 1.5, 0),
        ":first-of-type": {
          pl: theme.spacing(1.5),
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
