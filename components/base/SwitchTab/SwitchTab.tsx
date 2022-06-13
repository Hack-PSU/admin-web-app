import React, { FC, useState } from "react";
import { ISelectItem } from "types/components";
import { Box, Grid, SxProps, Theme, Typography, useTheme } from "@mui/material";
import { WithChildren } from "types/common";

interface ISwitchTabProps {
  items: [ISelectItem<string>, ISelectItem<string>];
  onChange(item: ISelectItem<string> | "off"): void;
  selectedStyle?: SxProps<Theme>;
  itemStyle?: SxProps<Theme>;
  component?: FC<Omit<ITabItemProps, "selectedStyle" | "itemStyle">>;
}

interface ITabItemProps {
  item: ISelectItem<string>;
  selected: string;
  onClickItem(): void;
  selectedStyle?: SxProps<Theme>;
  itemStyle?: SxProps<Theme>;
}

const TabItem: FC<WithChildren<ITabItemProps>> = ({
  children,
  itemStyle,
  onClickItem,
}) => {
  return (
    <Grid
      item
      container
      xs={4}
      sx={{
        color: "common.black",
        cursor: "pointer",
        width: "50%",
        textAlign: "center",
        zIndex: 2,
        ...itemStyle,
      }}
      onClick={onClickItem}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item>{children}</Grid>
    </Grid>
  );
};

const SwitchTab: FC<ISwitchTabProps> = ({
  items,
  onChange,
  itemStyle,
  selectedStyle,
  component: Component,
}) => {
  const left = items[0];
  const [selected, setSelected] = useState<string | "off">("off");

  const theme = useTheme();

  const onClickItem = (item: ISelectItem<string>) => {
    return () => {
      onChange(item);
      setSelected(item.value);
    };
  };

  return (
    <Grid
      container
      item
      alignItems="center"
      sx={{
        width: "100%",
        backgroundColor: "button.grey",
        position: "relative",
        border: `2px solid ${theme.palette.menu.line}`,
        borderRadius: "5px",
        padding: theme.spacing(0.5, 0),
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left:
            selected === "off" ? 0 : selected === left.value ? "33%" : "66%",
          top: 0,
          transition: "left 200ms ease-in-out",
          width: "33.3%",
          height: "100%",
          borderRadius: `${
            selected === "off"
              ? "5px 0 0 5px"
              : selected === left.value
              ? "0"
              : "0 5px 5px 0"
          }`,
          backgroundColor: "common.white",
          ...selectedStyle,
        }}
      />
      <TabItem
        item={{ value: "off", display: "Off" }}
        selected={selected}
        onClickItem={onClickItem({ value: "off", display: "Off" })}
      >
        <Typography variant="body1">Off</Typography>
      </TabItem>
      {items.map((item, index) => {
        if (Component) {
          return (
            <Component
              key={`${item.value}-${index}`}
              item={item}
              selected={selected}
              onClickItem={onClickItem(item)}
            />
          );
        }
        return (
          <TabItem
            key={`${item.value}-${index}`}
            item={item}
            selected={selected}
            itemStyle={itemStyle}
            selectedStyle={selectedStyle}
            onClickItem={onClickItem(item)}
          >
            <Typography variant="body1">{item.display}</Typography>
          </TabItem>
        );
      })}
    </Grid>
  );
};

export default SwitchTab;
