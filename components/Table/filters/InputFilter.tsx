import { FC } from "react";
import { ColumnFilter } from "components/Table/filters/types";
import { EvaIcon, Input } from "components/base";
import { FilterType } from "react-table";
import { matchSorter } from "match-sorter";
import { Box, InputAdornment, useTheme } from "@mui/material";

const InputFilter: FC<ColumnFilter> = ({
  column: { filterValue, setFilter },
}) => {
  const theme = useTheme();

  return (
    <Input
      placeholder={`Search column`}
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)}
      inputProps={{
        style: {
          fontSize: "0.85rem",
        },
      }}
      sx={{
        border: `2px solid #DFDFDF`,
        padding: theme.spacing(0.5, 2),
        borderRadius: "10px",
        width: "100%",
        backgroundColor: "common.white",
      }}
      endAdornment={
        <InputAdornment position={"end"}>
          <Box mt={0.5}>
            <EvaIcon
              name={"search-outline"}
              size="medium"
              fill={theme.palette.common.black}
            />
          </Box>
        </InputAdornment>
      }
    />
  );
};

export const InputFilterRows: FilterType<any> = (
  rows,
  columnIds,
  filterValue
) => {
  const selected = new Set<string>();

  columnIds.forEach((id) => {
    const matchedRows = matchSorter(rows, filterValue, {
      keys: [(row) => row.values[id]],
    });
    matchedRows.forEach((row) => selected.add(row.id));
  });

  return rows.filter((row) => selected.has(row.id));
};

export default InputFilter;
