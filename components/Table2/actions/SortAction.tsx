import React, { FC, useMemo } from "react";
import ActionButton from "./ActionButton";
import { ITableActionProps } from "./types";
import { Grid, Typography, useTheme } from "@mui/material";
import { UseSortByColumnProps } from "react-table";
import { SwitchTab } from "components/base";
import { ISelectItem } from "types/components";

interface ISortItemProps {
  title: string;
  toggleSortBy: UseSortByColumnProps<object>["toggleSortBy"];
  clearSortBy: UseSortByColumnProps<object>["clearSortBy"];
}

const SortItem: FC<ISortItemProps> = ({ clearSortBy, title, toggleSortBy }) => {
  const radioItems: [ISelectItem<string>, ISelectItem<string>] = useMemo(
    () => [
      {
        value: "asc",
        display: "Asc",
      },
      {
        value: "desc",
        display: "Desc",
      },
    ],
    []
  );

  const theme = useTheme();

  const onChangeSort = (item: ISelectItem<string>) => {
    if (item.value === "off") {
      clearSortBy();
    } else {
      toggleSortBy(item.value === "desc");
    }
  };

  return (
    <Grid container alignItems="center">
      <Grid
        item
        sx={{
          width: "100%",
          backgroundColor: "common.white",
          padding: theme.spacing(1.5, 2),
        }}
        xs={4}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
            color: "common.black",
            fontSize: theme.typography.pxToRem(15),
          }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid
        item
        sx={{
          padding: theme.spacing(1.5, 2),
        }}
        xs={8}
      >
        <SwitchTab items={radioItems} onChange={onChangeSort} />
      </Grid>
    </Grid>
  );
};

const SortAction: FC<ITableActionProps> = ({ names, headers }) => {
  return (
    <ActionButton type={"filter"} title={"Sort By"} icon={"options-outline"}>
      {names.map((state) => {
        const id = state.columnId;
        const header = headers[id];

        // if (header.isSorted) {
        return (
          <SortItem
            key={`sort-${id}-${state.name}`}
            title={state.name}
            toggleSortBy={header.toggleSortBy}
            clearSortBy={header.clearSortBy}
          />
        );
        // }
      })}
    </ActionButton>
  );
};

export default SortAction;
