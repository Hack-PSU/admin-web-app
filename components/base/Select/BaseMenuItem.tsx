import React, { FC } from "react";
import { MenuItem } from "@mui/material";
import { ISelectItem } from "types/components";
import { WithChildren } from "types/common";

interface IBaseMenuItemProps {
  item: ISelectItem;
  onChangeItem(event: any, item: ISelectItem): void;
  onClickOverride?(event: any): void;
}

const BaseMenuItem: FC<WithChildren<IBaseMenuItemProps>> = ({
  item,
  onChangeItem,
  onClickOverride,
  children,
}) => {
  return (
    <MenuItem
      onClick={(event) =>
        onClickOverride ? onClickOverride(event) : onChangeItem(event, item)
      }
      value={item.value}
      sx={{ fontSize: "0.95rem" }}
    >
      {children}
    </MenuItem>
  );
};

export default BaseMenuItem;
