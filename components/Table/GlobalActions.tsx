import React, { FC, useMemo } from "react";
import { Grid } from "@mui/material";
import GlobalFilter from "components/Table/filters/GlobalFilter";
import {
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
} from "react-table";
import { NamesState } from "types/hooks";
import _ from "lodash";

interface IGlobalActionsProps {
  setGlobalFilter: UseGlobalFiltersInstanceProps<object>["setGlobalFilter"];
  globalFilter: UseGlobalFiltersState<object>["globalFilter"];
  names: NamesState[];
}

const GlobalActions: FC<IGlobalActionsProps> = ({
  setGlobalFilter,
  globalFilter,
  names,
}) => {
  const globalSearchPlaceholder = useMemo(() => {
    const texts = names
      .filter((state) => state.type === "text")
      .map((state) => _.toLower(state.name));
    if (texts.length === 1) {
      return `Search by ${texts[texts.length - 1]}`;
    } else if (texts.length === 2) {
      return `Search by ${texts[0]} or ${texts[1]}`;
    }

    const lastText = texts[texts.length - 1];
    texts.splice(texts.length - 1, 1, `or ${lastText}`);

    return `Search by ${texts.join(", ")}`;
  }, []);

  return (
    <Grid item xs={5}>
      <GlobalFilter
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
        placeholder={globalSearchPlaceholder}
      />
    </Grid>
  );
};

export default GlobalActions;
