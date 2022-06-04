import React, { FC, useCallback } from "react";
import { ISelectItem, LabelledSelectProps } from "types/components";
import LabelledEventSelect from "./LabelledEventSelect";
import { BaseMenuItem } from "components/base";
import { alpha, lighten, Typography } from "@mui/material";
import { theme } from "styles";
import { useModalContext } from "components/context/ModalProvider";
import AddNewLocationModal from "components/modal/AddNewLocationModal";

const EventLocationSelect: FC<LabelledSelectProps> = ({ ...props }) => {
  const { showModal } = useModalContext();

  const getMenuItem = useCallback((item: ISelectItem) => {
    if (item.type && item.type === "button") {
      return (
        <Typography
          sx={{
            color: lighten(theme.palette.common.black, 0.5),
            transition: "color 100ms ease-in-out",
            ":hover": {
              opacity: 1,
            },
          }}
        >
          {item.display}
        </Typography>
      );
    } else {
      return item.display;
    }
  }, []);

  const onClickAddNewLocation = (event: any) => {
    showModal("addNewLocation");
  };

  return (
    <>
      <LabelledEventSelect
        renderItem={({ item, index, onChange }) => {
          const isButton = item.type && item.type === "button";
          return (
            <BaseMenuItem
              key={`${item.value}-${index}`}
              item={item}
              // onChangeItem ignored if isButton
              onChangeItem={onChange}
              onClickOverride={isButton ? onClickAddNewLocation : undefined}
            >
              {getMenuItem(item)}
            </BaseMenuItem>
          );
        }}
        {...props}
      />
    </>
  );
};

export default EventLocationSelect;
