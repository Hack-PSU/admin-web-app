import React, { FC } from "react";
import { Row, TableInstance, UseRowSelectInstanceProps } from "react-table";
import { TableCell } from "components/Table";
import { Checkbox as MuiCheckbox } from "@mui/material";

type RowSelectActionProps = TableInstance<object> & {
  header?: boolean;
  getToggleAllPageRowsSelectedProps?: UseRowSelectInstanceProps<object>["getToggleAllPageRowsSelectedProps"];
  row?: Row<object>;
};

const RowSelectAction: FC<RowSelectActionProps> = ({
  header,
  getToggleAllPageRowsSelectedProps,
  row,
}) => {
  return (
    <TableCell empty>
      {header ? (
        <MuiCheckbox {...getToggleAllPageRowsSelectedProps()} />
      ) : (
        <MuiCheckbox {...row?.getToggleRowSelectedProps()} />
      )}
    </TableCell>
  );
};

export default RowSelectAction;
