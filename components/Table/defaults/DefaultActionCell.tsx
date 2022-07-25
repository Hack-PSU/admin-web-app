import { FC } from "react";
import { GridProps, IconButton, useTheme } from "@mui/material";
import DefaultCell from "./DefaultCell";
import { EvaIcon } from "components/base";
import { BaseCellProps } from "./types";

type ActionItem = {
  icon: string;
  onClick: () => void;
};

interface IDefaultActionCellProps extends BaseCellProps<any> {
  items: ActionItem[];
}

const DefaultActionCell: FC<IDefaultActionCellProps> = ({
  column,
  cellProps,
  items,
}) => {
  const theme = useTheme();

  return (
    <DefaultCell column={column} {...cellProps}>
      {items.map((item, index) => (
        <IconButton
          key={`action-${item.icon}-${index}`}
          sx={{
            borderRadius: "5px",
            width: "25px",
            height: "25px",
          }}
          onClick={item.onClick}
        >
          <EvaIcon name={item.icon} fill={theme.palette.sunset.dark} />
        </IconButton>
      ))}
    </DefaultCell>
  );
};

export default DefaultActionCell;
