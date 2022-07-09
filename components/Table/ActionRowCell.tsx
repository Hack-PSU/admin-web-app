import React, { FC } from "react";
import { IconButton, useTheme } from "@mui/material";
import { EvaIcon } from "components/base";
import { TableCell } from "components/Table/index";
import { Cell } from "react-table";

interface IActionRowCellProps<T extends object> {
  cell: Cell<T>;
  icon: string;
  onClickAction(): void;
}

function ActionRowCell<T extends object>({
  cell,
  onClickAction,
  icon,
}: IActionRowCellProps<T>) {
  const theme = useTheme();

  return (
    <TableCell {...cell.getCellProps()}>
      <IconButton
        sx={{
          borderRadius: "5px",
          width: "25px",
          height: "25px",
        }}
        onClick={onClickAction}
      >
        <EvaIcon name={icon} fill={theme.palette.sunset.dark} size="medium" />
      </IconButton>
    </TableCell>
  );
}

export default ActionRowCell;
