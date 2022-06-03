import React, { FC } from "react";
import { MenuItem } from "@mui/material";
import { ISelectItem } from "types/components";

interface IBaseMenuItemProps {
  item: ISelectItem;
  onChangeItem(event: any, item: ISelectItem): void;
  index: number;
}

const BaseMenuItem: FC<IBaseMenuItemProps> = ({
  index,
  item,
  onChangeItem,
}) => {
  return (
    <MenuItem
      onClick={(event) => onChangeItem(event, item)}
      value={item.value}
      sx={{ fontSize: "0.95rem" }}
    >
      {item.display}
    </MenuItem>
  );
};

export default BaseMenuItem;
