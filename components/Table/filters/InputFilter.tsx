import { FC } from "react";
import { ColumnFilter } from "components/Table/filters/types";
import { Input } from "components/base";
import { FilterType } from "react-table";
import { matchSorter } from "match-sorter";

const InputFilter: FC<ColumnFilter> = ({
  column: { filterValue, setFilter },
}) => {
  return (
    <Input
      placeholder={`Search column`}
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)}
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
