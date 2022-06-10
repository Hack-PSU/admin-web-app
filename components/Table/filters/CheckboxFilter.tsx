import React, { FC, useMemo } from "react";
import { ColumnFilter } from "components/Table/filters/types";
import { Checkbox } from "components/base";
import { CheckboxSelectionState } from "types/components";
import { FilterType, Row } from "react-table";

const CheckboxFilter: FC<ColumnFilter> = ({
  column: { preFilteredRows, setFilter, id },
}) => {
  const options = useMemo(() => {
    const options = new Set<string>();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return Array.from(options).map((option) => ({
      value: option,
      display: option,
    }));
  }, [preFilteredRows, id]);

  const onChangeSelection = (selection: CheckboxSelectionState) => {
    // propagates selected values to filter function
    setFilter(selection);
  };

  return <Checkbox items={options} onChange={onChangeSelection} />;
};

export const CheckboxFilterRows: FilterType<any> = (
  rows,
  columnIds,
  filterValue: CheckboxSelectionState
) => {
  const selected = new Set<string>();

  rows.forEach((row) => {
    columnIds.forEach((id) => {
      if (row.values[id] in filterValue) {
        selected.add(row.id);
      }
    });
  });

  return rows.filter((row) => selected.has(row.id));
};

export default CheckboxFilter;
