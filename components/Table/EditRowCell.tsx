import React, { FC } from "react";
import { IconButton, useTheme } from "@mui/material";
import { EvaIcon } from "components/base";
import { TableCell } from "components/Table/index";
import { Cell } from "react-table";

interface IEditRowCellProps {
  cell: Cell;
  onClickEdit(): void;
}

const EditRowCell: FC<IEditRowCellProps> = ({ cell, onClickEdit }) => {
  const theme = useTheme();

  return (
    <TableCell {...cell.getCellProps()}>
      <IconButton
        sx={{
          borderRadius: "5px",
          width: "25px",
          height: "25px",
        }}
        onClick={onClickEdit}
      >
        <EvaIcon
          name={"edit-outline"}
          fill={theme.palette.sunset.dark}
          size="medium"
        />
      </IconButton>
    </TableCell>
  );
};

export default EditRowCell;
